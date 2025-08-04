/**
 * Error handling test utility for Garden Vision services
 * Tests various failure scenarios to ensure proper error handling
 * TEMPORARILY DISABLED - ImageRecognitionService commented out for memory optimization
 */

// import { gardenVisionAnalysisService } from '../../../../../../../../api.gardenflow.io/src/services/gardenVisionAnalysisService';
// import { advancedImageRecognitionService, imageRecognitionUtils } from '../services/advancedImageRecognitionService';
// import { ImageRecognitionService } from '../services/imageRecognitionService';
// import { memoryMonitor } from './memoryMonitor';

export interface ErrorTestResult {
  testName: string;
  success: boolean;
  error?: string;
  duration: number;
  memoryUsage?: {
    before: number;
    after: number;
    peak: number;
  };
}

export class ErrorHandlingTestSuite {
  private static instance: ErrorHandlingTestSuite;
  private testResults: ErrorTestResult[] = [];

  private constructor() {}

  public static getInstance(): ErrorHandlingTestSuite {
    if (!ErrorHandlingTestSuite.instance) {
      ErrorHandlingTestSuite.instance = new ErrorHandlingTestSuite();
    }
    return ErrorHandlingTestSuite.instance;
  }

  /**
   * Run all error handling tests
   */
  public async runAllTests(): Promise<ErrorTestResult[]> {
    console.log('🧪 Starting error handling test suite...');
    
    this.testResults = [];
    
    // Start memory monitoring
    memoryMonitor.startMonitoring(1000);
    
    try {
      // Test invalid inputs
      await this.testInvalidImageData();
      await this.testEmptyImageData();
      await this.testCorruptedImageData();
      await this.testOversizedImage();
      
      // Test service limits
      await this.testConcurrentProcessing();
      await this.testMemoryExhaustion();
      await this.testTimeoutHandling();
      
      // Test backend service errors
      await this.testBackendServiceErrors();
      
      // Test cleanup and recovery
      await this.testServiceRecovery();
      
      console.log('✅ Error handling test suite completed');
      return this.testResults;
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      return this.testResults;
    } finally {
      memoryMonitor.stopMonitoring();
    }
  }

  /**
   * Test invalid image data handling
   */
  private async testInvalidImageData(): Promise<void> {
    const testCases = [
      { name: 'null data', data: null },
      { name: 'undefined data', data: undefined },
      { name: 'empty string', data: '' },
      { name: 'invalid format', data: 'not-an-image' },
      { name: 'malformed base64', data: 'data:image/jpeg;base64,invalid-base64!' },
    ];

    for (const testCase of testCases) {
      await this.runTest(`Invalid image data: ${testCase.name}`, async () => {
        const service = ImageRecognitionService.getInstance();
        await service.processImage(testCase.data as any);
      }, true); // Expect error
    }
  }

  /**
   * Test empty image data
   */
  private async testEmptyImageData(): Promise<void> {
    await this.runTest('Empty image data', async () => {
      const service = ImageRecognitionService.getInstance();
      const emptyImageData = 'data:image/jpeg;base64,';
      await service.processImage(emptyImageData);
    }, true); // Expect error
  }

  /**
   * Test corrupted image data
   */
  private async testCorruptedImageData(): Promise<void> {
    await this.runTest('Corrupted image data', async () => {
      const service = ImageRecognitionService.getInstance();
      // Create corrupted base64 that looks valid but isn't
      const corruptedData = 'data:image/jpeg;base64,' + 'SGVsbG8gV29ybGQ='.repeat(100); // "Hello World" repeated
      await service.processImage(corruptedData);
    }, true); // Expect error
  }

  /**
   * Test oversized image handling
   */
  private async testOversizedImage(): Promise<void> {
    await this.runTest('Oversized image', async () => {
      const service = ImageRecognitionService.getInstance();
      // Create a large base64 string (simulating large image)
      const largeBase64 = 'A'.repeat(5 * 1024 * 1024); // 5MB of 'A' characters
      const oversizedData = `data:image/jpeg;base64,${largeBase64}`;
      await service.processImage(oversizedData);
    }, true); // Expect error
  }

  /**
   * Test concurrent processing limits
   */
  private async testConcurrentProcessing(): Promise<void> {
    await this.runTest('Concurrent processing limits', async () => {
      const service = ImageRecognitionService.getInstance();
      const validImageData = this.createValidTestImage();
      
      // Try to process multiple images simultaneously
      const promises = Array(5).fill(null).map(() => 
        service.processImage(validImageData)
      );
      
      await Promise.allSettled(promises);
    }, false); // Some should succeed, some should fail
  }

  /**
   * Test memory exhaustion handling
   */
  private async testMemoryExhaustion(): Promise<void> {
    await this.runTest('Memory exhaustion handling', async () => {
      // Create multiple large objects to simulate memory pressure
      const largeArrays: number[][] = [];
      
      try {
        for (let i = 0; i < 100; i++) {
          largeArrays.push(new Array(100000).fill(Math.random()));
        }
        
        // Try to process image under memory pressure
        const service = ImageRecognitionService.getInstance();
        const imageData = this.createValidTestImage();
        await service.processImage(imageData);
        
      } finally {
        // Clear arrays to free memory
        largeArrays.length = 0;
        memoryMonitor.forceGarbageCollection();
      }
    }, false); // May succeed or fail depending on memory
  }

  /**
   * Test timeout handling
   */
  private async testTimeoutHandling(): Promise<void> {
    await this.runTest('Timeout handling', async () => {
      // This test verifies that processing doesn't hang indefinitely
      const service = ImageRecognitionService.getInstance();
      const imageData = this.createValidTestImage();
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Test timeout')), 15000); // 15 seconds
      });
      
      // Race the processing against timeout
      await Promise.race([
        service.processImage(imageData),
        timeoutPromise
      ]);
    }, false); // Should complete within timeout
  }

  /**
   * Test backend service errors
   */
  private async testBackendServiceErrors(): Promise<void> {
    await this.runTest('Backend service errors', async () => {
      // Test various backend error scenarios
      const invalidBase64 = 'data:image/jpeg;base64,invalid-base64-data';
      
      // Test backend service directly
      await gardenVisionAnalysisService.analyzeImage(invalidBase64);
    }, true); // Expect error
  }

  /**
   * Test service recovery after errors
   */
  private async testServiceRecovery(): Promise<void> {
    await this.runTest('Service recovery', async () => {
      const service = ImageRecognitionService.getInstance();
      
      // First, cause an error
      try {
        await service.processImage('invalid-data');
      } catch (error) {
        // Expected to fail
      }
      
      // Then, verify service can recover and process valid image
      const validImageData = this.createValidTestImage();
      await service.processImage(validImageData);
    }, false); // Should succeed after recovery
  }

  /**
   * Run a single test with error handling
   */
  private async runTest(
    testName: string, 
    testFunction: () => Promise<void>, 
    expectError: boolean = false
  ): Promise<void> {
    const startTime = Date.now();
    const memoryBefore = memoryMonitor.getCurrentMemoryUsage();
    let memoryPeak = memoryBefore?.used || 0;
    
    // Monitor peak memory during test
    const memoryInterval = setInterval(() => {
      const current = memoryMonitor.getCurrentMemoryUsage();
      if (current) {
        memoryPeak = Math.max(memoryPeak, current.used);
      }
    }, 100);

    try {
      await testFunction();
      
      const memoryAfter = memoryMonitor.getCurrentMemoryUsage();
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        testName,
        success: !expectError, // Success if we didn't expect an error
        duration,
        memoryUsage: {
          before: memoryBefore?.used || 0,
          after: memoryAfter?.used || 0,
          peak: memoryPeak
        }
      });
      
      if (expectError) {
        console.warn(`⚠️ Test "${testName}" succeeded but error was expected`);
      } else {
        console.log(`✅ Test "${testName}" passed in ${duration}ms`);
      }
      
    } catch (error: any) {
      const memoryAfter = memoryMonitor.getCurrentMemoryUsage();
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        testName,
        success: expectError, // Success if we expected an error
        error: error.message,
        duration,
        memoryUsage: {
          before: memoryBefore?.used || 0,
          after: memoryAfter?.used || 0,
          peak: memoryPeak
        }
      });
      
      if (expectError) {
        console.log(`✅ Test "${testName}" failed as expected: ${error.message}`);
      } else {
        console.error(`❌ Test "${testName}" failed unexpectedly: ${error.message}`);
      }
    } finally {
      clearInterval(memoryInterval);
    }
  }

  /**
   * Create a valid test image (small 1x1 pixel PNG)
   */
  private createValidTestImage(): string {
    // Base64 of a 1x1 pixel transparent PNG
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }

  /**
   * Get test results summary
   */
  public getTestSummary(): {
    totalTests: number;
    passed: number;
    failed: number;
    averageDuration: number;
    memoryStats: {
      averageMemoryUsage: number;
      peakMemoryUsage: number;
      memoryLeaks: number;
    };
  } {
    const totalTests = this.testResults.length;
    const passed = this.testResults.filter(r => r.success).length;
    const failed = totalTests - passed;
    
    const averageDuration = totalTests > 0 
      ? this.testResults.reduce((sum, r) => sum + r.duration, 0) / totalTests 
      : 0;
    
    const memoryUsages = this.testResults
      .filter(r => r.memoryUsage)
      .map(r => r.memoryUsage!);
    
    const averageMemoryUsage = memoryUsages.length > 0
      ? memoryUsages.reduce((sum, m) => sum + (m.after - m.before), 0) / memoryUsages.length
      : 0;
    
    const peakMemoryUsage = memoryUsages.length > 0
      ? Math.max(...memoryUsages.map(m => m.peak))
      : 0;
    
    const memoryLeaks = memoryUsages.filter(m => m.after > m.before + 1024 * 1024).length; // 1MB threshold
    
    return {
      totalTests,
      passed,
      failed,
      averageDuration,
      memoryStats: {
        averageMemoryUsage,
        peakMemoryUsage,
        memoryLeaks
      }
    };
  }

  /**
   * Clear test results
   */
  public clearResults(): void {
    this.testResults = [];
  }

  /**
   * Export test results to JSON
   */
  public exportResults(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: this.getTestSummary(),
      results: this.testResults
    }, null, 2);
  }
}

// Export singleton instance
export const errorHandlingTestSuite = ErrorHandlingTestSuite.getInstance();

/**
 * Quick test runner for development
 */
export const runQuickErrorTests = async (): Promise<void> => {
  console.log('🚀 Running quick error handling tests...');
  
  const results = await errorHandlingTestSuite.runAllTests();
  const summary = errorHandlingTestSuite.getTestSummary();
  
  console.log('📊 Test Summary:', summary);
  
  if (summary.failed > 0) {
    console.warn(`⚠️ ${summary.failed} tests failed. Check results for details.`);
  } else {
    console.log('✅ All tests passed!');
  }
  
  // Save results to localStorage for review
  try {
    localStorage.setItem('garden-vision-error-tests', errorHandlingTestSuite.exportResults());
    console.log('💾 Test results saved to localStorage');
  } catch (error) {
    console.warn('Failed to save test results:', error);
  }
};