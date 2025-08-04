/**
 * Camera debugging utility for Garden Vision
 * Helps diagnose camera issues and provides troubleshooting information
 */

export interface CameraDebugInfo {
  hasMediaDevices: boolean;
  hasGetUserMedia: boolean;
  availableCameras: MediaDeviceInfo[];
  permissions: PermissionStatus | null;
  constraints: MediaStreamConstraints;
  error?: string;
}

export class CameraDebugger {
  /**
   * Get comprehensive camera debug information
   */
  public static async getDebugInfo(): Promise<CameraDebugInfo> {
    const debugInfo: CameraDebugInfo = {
      hasMediaDevices: false,
      hasGetUserMedia: false,
      availableCameras: [],
      permissions: null,
      constraints: {
        video: {
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          facingMode: 'environment'
        },
        audio: false
      }
    };

    try {
      // Check MediaDevices API support
      debugInfo.hasMediaDevices = !!(navigator.mediaDevices);
      debugInfo.hasGetUserMedia = !!(navigator.mediaDevices?.getUserMedia);

      if (!debugInfo.hasMediaDevices) {
        debugInfo.error = 'MediaDevices API not supported';
        return debugInfo;
      }

      if (!debugInfo.hasGetUserMedia) {
        debugInfo.error = 'getUserMedia not supported';
        return debugInfo;
      }

      // Get available cameras
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        debugInfo.availableCameras = devices.filter(device => device.kind === 'videoinput');
      } catch (error) {
        console.warn('Failed to enumerate devices:', error);
      }

      // Check camera permissions
      try {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        debugInfo.permissions = permission;
      } catch (error) {
        console.warn('Failed to check camera permissions:', error);
      }

    } catch (error: any) {
      debugInfo.error = error.message || 'Unknown error during debug info collection';
    }

    return debugInfo;
  }

  /**
   * Test camera access with different constraints
   */
  public static async testCameraAccess(): Promise<{
    success: boolean;
    stream?: MediaStream;
    error?: string;
    videoTracks?: MediaStreamTrack[];
  }> {
    try {
      console.log('🔍 Testing camera access...');
      
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'environment'
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoTracks = stream.getVideoTracks();

      console.log('✅ Camera access successful:', {
        streamId: stream.id,
        videoTracks: videoTracks.length,
        trackSettings: videoTracks[0]?.getSettings()
      });

      return {
        success: true,
        stream,
        videoTracks
      };

    } catch (error: any) {
      console.error('❌ Camera access failed:', error);
      
      return {
        success: false,
        error: error.message || 'Camera access failed'
      };
    }
  }

  /**
   * Test video element readiness
   */
  public static testVideoElement(videoElement: HTMLVideoElement): {
    isReady: boolean;
    readyState: number;
    dimensions: { width: number; height: number };
    issues: string[];
  } {
    const issues: string[] = [];
    
    if (!videoElement) {
      issues.push('Video element is null or undefined');
      return {
        isReady: false,
        readyState: -1,
        dimensions: { width: 0, height: 0 },
        issues
      };
    }

    if (videoElement.readyState < 2) {
      issues.push(`Video element not ready (readyState: ${videoElement.readyState})`);
    }

    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      issues.push(`Invalid video dimensions: ${videoElement.videoWidth}x${videoElement.videoHeight}`);
    }

    if (videoElement.paused) {
      issues.push('Video element is paused');
    }

    if (videoElement.ended) {
      issues.push('Video element has ended');
    }

    if (!videoElement.srcObject) {
      issues.push('Video element has no source stream');
    }

    return {
      isReady: issues.length === 0,
      readyState: videoElement.readyState,
      dimensions: { 
        width: videoElement.videoWidth, 
        height: videoElement.videoHeight 
      },
      issues
    };
  }

  /**
   * Generate a debug report
   */
  public static async generateDebugReport(): Promise<string> {
    try {
      const debugInfo = await this.getDebugInfo();
      const cameraTest = await this.testCameraAccess();

      const report = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        debugInfo,
        cameraTest: {
          success: cameraTest.success,
          error: cameraTest.error,
          videoTracksCount: cameraTest.videoTracks?.length || 0
        }
      };

      // Clean up test stream
      if (cameraTest.stream) {
        cameraTest.stream.getTracks().forEach(track => track.stop());
      }

      return JSON.stringify(report, null, 2);
    } catch (error: any) {
      return `Debug report generation failed: ${error.message}`;
    }
  }

  /**
   * Log troubleshooting information
   */
  public static async logTroubleshootingInfo(): Promise<void> {
    console.group('📷 Camera Troubleshooting Information');
    
    try {
      const debugInfo = await this.getDebugInfo();
      
      console.log('Browser Support:', {
        hasMediaDevices: debugInfo.hasMediaDevices,
        hasGetUserMedia: debugInfo.hasGetUserMedia
      });
      
      console.log('Available Cameras:', debugInfo.availableCameras.map(camera => ({
        deviceId: camera.deviceId,
        label: camera.label || 'Unknown Camera',
        groupId: camera.groupId
      })));
      
      console.log('Permissions:', debugInfo.permissions?.state || 'Unknown');
      
      if (debugInfo.error) {
        console.error('Debug Error:', debugInfo.error);
      }

      // Test camera access
      const cameraTest = await this.testCameraAccess();
      console.log('Camera Access Test:', cameraTest.success ? '✅ Success' : '❌ Failed');
      
      if (cameraTest.error) {
        console.error('Camera Access Error:', cameraTest.error);
      }

      // Clean up test stream
      if (cameraTest.stream) {
        cameraTest.stream.getTracks().forEach(track => track.stop());
      }

    } catch (error) {
      console.error('Troubleshooting failed:', error);
    }
    
    console.groupEnd();
  }

  /**
   * Common camera error messages and solutions
   */
  public static getErrorSolutions(error: string): string[] {
    const solutions: Record<string, string[]> = {
      'Permission denied': [
        'Grant camera permissions in browser settings',
        'Reload the page after granting permissions',
        'Check if another app is using the camera'
      ],
      'NotFoundError': [
        'Make sure a camera is connected to your device',
        'Try a different camera if multiple are available',
        'Check device manager for camera issues'
      ],
      'NotAllowedError': [
        'Camera access was blocked by user or browser',
        'Check browser permissions settings',
        'Ensure site is served over HTTPS'
      ],
      'AbortError': [
        'Camera operation was interrupted',
        'Try restarting the camera',
        'Check if another tab is using the camera'
      ],
      'NotReadableError': [
        'Camera is already in use by another application',
        'Close other apps that might be using the camera',
        'Restart your browser'
      ],
      'OverconstrainedError': [
        'Camera doesn\'t support the requested settings',
        'Try lowering the video quality settings',
        'Use a different camera if available'
      ]
    };

    // Find matching error
    for (const [errorType, solutionList] of Object.entries(solutions)) {
      if (error.includes(errorType)) {
        return solutionList;
      }
    }

    return [
      'Try refreshing the page',
      'Check camera permissions in browser settings',
      'Ensure no other apps are using the camera',
      'Try using a different browser'
    ];
  }
}

// Export convenience functions
export const debugCamera = () => CameraDebugger.logTroubleshootingInfo();
export const testCamera = () => CameraDebugger.testCameraAccess();
export const getCameraDebugInfo = () => CameraDebugger.getDebugInfo();