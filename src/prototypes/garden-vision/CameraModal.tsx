import React from 'react';
import { X, Camera, RotateCcw, SwitchCamera, Loader2 } from 'lucide-react';
import { useCamera } from './hooks/useCamera';
import { CameraSettings } from './types';
import MemoryStatusIndicator from './components/MemoryStatusIndicator';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  settings: CameraSettings;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  settings
}) => {
  const {
    isCapturing,
    capturedImage,
    stream,
    error,
    videoRef,
    startCamera,
    stopCamera,
    captureImage,
    retakePhoto,
    switchCamera
  } = useCamera(settings);

  React.useEffect(() => {
    if (isOpen && !stream) {
      startCamera();
    }
    
    return () => {
      if (stream) {
        stopCamera();
      }
    };
  }, [isOpen, startCamera, stopCamera, stream]);

  const handleCapture = () => {
    const imageDataUrl = captureImage();
    if (imageDataUrl) {
      // Image captured successfully, but don't call onCapture yet
      // Let user review the image first
      console.log('📸 Image captured, showing preview');
    }
  };
  
  const handleAnalyzeGarden = () => {
    if (capturedImage) {
      console.log('🔍 Starting garden analysis with captured image');
      onCapture(capturedImage);
    } else {
      console.error('❌ No captured image available for analysis');
    }
  };

  const handleRetake = () => {
    retakePhoto();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative w-full h-full max-w-4xl max-h-4xl bg-gray-900 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-white text-lg font-semibold">Garden Vision</h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Memory Status Indicator */}
        <div className="absolute top-16 left-4 right-4 z-20">
          <MemoryStatusIndicator />
        </div>

        {/* Camera Content */}
        <div className="w-full h-full flex items-center justify-center">
          {error ? (
            <div className="text-center">
              <div className="text-red-400 mb-4">
                <Camera size={48} className="mx-auto mb-2" />
                {error}
              </div>
              <button
                onClick={startCamera}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : capturedImage ? (
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Camera overlay grid */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-30">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-white border-opacity-50"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex items-center justify-center p-6 space-x-4">
            {capturedImage ? (
              <>
                <button
                  onClick={handleRetake}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full transition-colors flex items-center space-x-2"
                >
                  <RotateCcw size={20} />
                  <span>Retake</span>
                </button>
                <button
                  onClick={handleAnalyzeGarden}
                  disabled={!capturedImage}
                  className={`${!capturedImage ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white px-8 py-3 rounded-full transition-colors flex items-center space-x-2`}
                >
                  <Camera size={20} />
                  <span>Analyze Garden</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={switchCamera}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors"
                  title="Switch Camera"
                >
                  <SwitchCamera size={20} />
                </button>
                
                <button
                  onClick={handleCapture}
                  disabled={isCapturing || !stream}
                  className="bg-white hover:bg-gray-100 text-gray-900 p-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  title="Capture"
                >
                  {isCapturing ? (
                    <Loader2 size={32} className="animate-spin" />
                  ) : (
                    <Camera size={32} />
                  )}
                </button>
                
                <div className="w-12 h-12" /> {/* Spacer for symmetry */}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};