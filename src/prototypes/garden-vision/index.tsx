import React, { useState } from 'react';
import { Camera, AlertCircle, Eye, Zap, Brain, Sparkles, X } from 'lucide-react';
import { CameraModal } from './CameraModal';
import { ResultsModal } from './ResultsModal';
import { useImageRecognition } from './hooks/useImageRecognition';
import { CameraSettings, RecognitionResult } from './types';
import { CAMERA_DEFAULTS } from './constants';
import { CameraService } from './services/cameraService';
import { debugCamera } from './utils/cameraDebug';

// Load test utilities in development mode
if (process.env.NODE_ENV === 'development') {
  import('./utils/testUtils');
}

const GardenVision: React.FC = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [cameraSettings] = useState<CameraSettings>(CAMERA_DEFAULTS);
  const [currentResult, setCurrentResult] = useState<RecognitionResult | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  
  const { processImage, isProcessing, error: recognitionError } = useImageRecognition();
  const cameraService = CameraService.getInstance();

  const handleCameraOpen = async () => {
    setIsRequestingPermission(true);
    setPermissionError(null);
    
    try {
      // Log camera debug info in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📷 Opening camera - running debug checks...');
        await debugCamera();
      }
      
      // First check if we already have permission
      const hasPermission = await cameraService.checkCameraPermission();
      
      if (!hasPermission) {
        console.log('📷 Camera permission not granted, requesting...');
        // Request permission
        const permissionGranted = await cameraService.requestCameraPermission();
        
        if (!permissionGranted) {
          const errorMsg = 'Camera access denied. Please allow camera permissions in your browser settings.';
          console.error('❌', errorMsg);
          setPermissionError(errorMsg);
          setIsRequestingPermission(false);
          return;
        }
        console.log('✅ Camera permission granted');
      } else {
        console.log('✅ Camera permission already granted');
      }
      
      console.log('📷 Opening camera modal...');
      setIsCameraOpen(true);
    } catch (error: any) {
      const errorMsg = `Failed to access camera: ${error.message || 'Unknown error'}`;
      console.error('❌ Permission request failed:', error);
      setPermissionError(errorMsg);
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleCameraClose = () => {
    setIsCameraOpen(false);
  };

  const handleImageCapture = async (imageDataUrl: string) => {
    try {
      console.log('🔍 Starting image processing...');
      
      // Validate image data
      if (!imageDataUrl || !imageDataUrl.startsWith('data:image/')) {
        throw new Error('Invalid image data received');
      }
      
      // Close camera modal first
      setIsCameraOpen(false);
      
      // Process the image with retry logic for memory issues
      let result;
      try {
        result = await processImage(imageDataUrl);
      } catch (error: any) {
        if (error.message.includes('memory') || error.message.includes('Memory')) {
          console.warn('⚠️ Memory issue detected, retrying with more aggressive optimization...');
          
          // Force garbage collection and wait
          if (typeof window !== 'undefined' && (window as any).gc) {
            (window as any).gc();
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          // Retry once
          result = await processImage(imageDataUrl);
        } else {
          throw error;
        }
      }
      
      if (!result || !result.success) {
        throw new Error(result?.error || 'Image processing failed');
      }
      
      setCurrentResult(result);
      
      // Open results modal
      setIsResultsOpen(true);
      console.log('✅ Image processing completed successfully');
      
    } catch (error: any) {
      console.error('❌ Error processing image:', error);
      
      // Provide specific guidance for memory errors
      let errorMessage = error.message || 'Unknown error';
      if (errorMessage.includes('memory') || errorMessage.includes('Memory')) {
        errorMessage += '\n\nTips to resolve this:\n• Close other browser tabs\n• Try a smaller image\n• Restart your browser';
      }
      
      // Show error to user
      alert(`Image processing failed: ${errorMessage}`);
      
      // Keep camera open so user can try again
      setIsCameraOpen(true);
    }
  };

  const handleResultsClose = () => {
    setIsResultsOpen(false);
    setCurrentResult(null);
  };

  const features = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Plant Recognition",
      description: "Identify plants, diseases, and pests using advanced AI vision technology"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Analysis",
      description: "Get detailed insights about plant health, growth stage, and care recommendations"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Results",
      description: "Receive immediate feedback with confidence scores and actionable advice"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-900 via-green-700 to-emerald-600 bg-clip-text text-transparent">
                Garden Vision
              </h1>
              <p className="text-green-600 text-lg font-medium">AI-Powered Plant Analysis</p>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your gardening experience with cutting-edge computer vision technology. 
            Instantly identify plants, diagnose issues, and get expert recommendations.
          </p>

          {/* Main CTA Button */}
          <div className="mb-8">
            <button
              onClick={handleCameraOpen}
              disabled={isRequestingPermission}
              className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isRequestingPermission ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  <span className="text-lg font-semibold">Requesting Camera Access...</span>
                </>
              ) : (
                <>
                  <Camera size={24} />
                  <span className="text-lg font-semibold">Start Garden Analysis</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300" />
                </>
              )}
            </button>
          </div>

          {/* Permission Error */}
          {permissionError && (
            <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
              <div className="flex items-start space-x-3">
                <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  {permissionError}
                </div>
                <button
                  onClick={() => setPermissionError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm border border-green-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
            </div>
            <p className="text-gray-600">Simple steps to analyze your garden</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Capture</h3>
              <p className="text-gray-600">Take a photo of your plant or garden area using your device camera</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyze</h3>
              <p className="text-gray-600">Our AI processes the image to identify plants and detect any issues</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Learn</h3>
              <p className="text-gray-600">Get detailed results with care recommendations and expert advice</p>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={handleCameraClose}
        onCapture={handleImageCapture}
        settings={cameraSettings}
      />

      {/* Results Modal */}
      {currentResult && (
        <ResultsModal
          isOpen={isResultsOpen}
          onClose={handleResultsClose}
          result={currentResult}
          isProcessing={isProcessing}
          error={recognitionError}
        />
      )}
    </div>
  );
};

export default GardenVision;