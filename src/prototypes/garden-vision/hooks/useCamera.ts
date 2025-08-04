import { useState, useRef, useCallback } from 'react';
import { CameraSettings } from '../types';
import { CameraService } from '../services/cameraService';

export const useCamera = (settings: CameraSettings) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraService = CameraService.getInstance();

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      const mediaStream = await cameraService.startCamera(settings);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setIsOpen(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(err instanceof Error ? err.message : 'Camera access denied or not available');
    }
  }, [settings, cameraService]);

  const stopCamera = useCallback(() => {
    cameraService.stopCamera();
    setStream(null);
    setIsOpen(false);
    setCapturedImage(null);
    setError(null);
  }, [cameraService]);

  const captureImage = useCallback(() => {
    if (!videoRef.current) {
      const errorMsg = 'Camera not ready. Please ensure camera permissions are granted.';
      setError(errorMsg);
      console.error('❌ Camera capture failed:', errorMsg);
      return null;
    }

    if (!stream) {
      const errorMsg = 'Camera stream not available. Please restart the camera.';
      setError(errorMsg);
      console.error('❌ Camera capture failed:', errorMsg);
      return null;
    }

    setIsCapturing(true);
    console.log('📸 Starting image capture...');
    
    try {
      const imageDataUrl = cameraService.captureImage(videoRef.current);
      if (!imageDataUrl) {
        throw new Error('Failed to generate image data');
      }
      
      setCapturedImage(imageDataUrl);
      setIsCapturing(false);
      console.log('✅ Image captured successfully');
      return imageDataUrl;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to capture image';
      setError(errorMsg);
      setIsCapturing(false);
      console.error('❌ Image capture failed:', errorMsg);
      return null;
    }
  }, [cameraService, stream]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setError(null);
  }, []);

  const switchCamera = useCallback(async () => {
    try {
      setError(null);
      const newStream = await cameraService.switchCamera();
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch camera');
    }
  }, [cameraService]);

  return {
    isOpen,
    isCapturing,
    capturedImage,
    stream,
    error,
    videoRef,
    startCamera,
    stopCamera,
    captureImage,
    retakePhoto,
    switchCamera,
    setIsOpen
  };
};