import { CAMERA_SETTINGS } from '../constants';
import { CameraSettings } from '../types';

export class CameraService {
  private static instance: CameraService;
  private currentStream: MediaStream | null = null;
  
  private constructor() {}
  
  static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }
  
  async requestCameraPermission(): Promise<boolean> {
    try {
      // Try to access camera briefly to trigger permission request
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Immediately stop the stream since this is just for permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      return false;
    }
  }

  async startCamera(settings: CameraSettings): Promise<MediaStream> {
    try {
      // Stop any existing stream
      if (this.currentStream) {
        this.stopCamera();
      }
      
      // Map resolution string to resolution object
      const resolutionKey = settings.resolution.toUpperCase() as keyof typeof CAMERA_SETTINGS.RESOLUTIONS;
      const resolution = CAMERA_SETTINGS.RESOLUTIONS[resolutionKey];
      
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: settings.facingMode,
          width: { ideal: resolution.width },
          height: { ideal: resolution.height },
          // Better lighting and exposure controls
          focusMode: 'continuous',
          exposureMode: 'continuous',
          whiteBalanceMode: 'continuous',
          // Try to enable flash/torch if available
          torch: true
        },
        audio: false
      };
      
      this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Apply additional lighting optimizations to video track
      const videoTrack = this.currentStream.getVideoTracks()[0];
      if (videoTrack.getCapabilities) {
        const capabilities = videoTrack.getCapabilities();
        const constraints: any = {};
        
        // Set optimal exposure if supported
        if (capabilities.exposureCompensation) {
          constraints.exposureCompensation = 0; // Auto exposure
        }
        
        // Set white balance if supported
        if (capabilities.colorTemperature) {
          constraints.whiteBalanceMode = 'continuous';
        }
        
        // Apply constraints if any were set
        if (Object.keys(constraints).length > 0) {
          try {
            await videoTrack.applyConstraints(constraints);
          } catch (constraintError) {
            console.warn('Failed to apply advanced camera constraints:', constraintError);
          }
        }
      }
      
      return this.currentStream;
    } catch (error) {
      console.error('Camera access failed:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Camera access denied. Please allow camera permissions.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No camera found on this device.');
        } else if (error.name === 'NotReadableError') {
          throw new Error('Camera is already in use by another application.');
        } else {
          throw new Error(`Camera error: ${error.message}`);
        }
      }
      throw new Error('Camera access failed');
    }
  }
  
  stopCamera(): void {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop());
      this.currentStream = null;
    }
  }
  
  async switchCamera(): Promise<MediaStream> {
    if (!this.currentStream) {
      throw new Error('No active camera stream');
    }
    
    // Get current facing mode
    const videoTrack = this.currentStream.getVideoTracks()[0];
    const currentSettings = videoTrack.getSettings();
    const newFacingMode = currentSettings.facingMode === 'user' ? 'environment' : 'user';
    
    // Stop current stream
    this.stopCamera();
    
    // Start new stream with switched camera
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: newFacingMode,
        width: { ideal: currentSettings.width },
        height: { ideal: currentSettings.height }
      },
      audio: false
    });
    
    this.currentStream = newStream;
    return newStream;
  }
  
  captureImage(videoElement: HTMLVideoElement): string {
    if (!videoElement) {
      throw new Error('Video element is required for image capture');
    }
    
    if (videoElement.readyState < 2) {
      throw new Error('Video element is not ready (metadata not loaded)');
    }
    
    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      throw new Error('Video element has invalid dimensions');
    }
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Canvas context not available');
    }
    
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    try {
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      if (!dataUrl || dataUrl === 'data:,') {
        throw new Error('Failed to generate image data');
      }
      
      console.log(`📸 Image captured: ${canvas.width}x${canvas.height}`);
      return dataUrl;
    } catch (error) {
      throw new Error(`Failed to capture image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async checkCameraPermission(): Promise<boolean> {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return permission.state === 'granted';
    } catch (error) {
      console.warn('Permission API not supported');
      return false;
    }
  }
  
  async getCameraDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Failed to get camera devices:', error);
      return [];
    }
  }
}