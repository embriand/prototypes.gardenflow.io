/**
 * Memory monitoring utility for Garden Vision processing
 * Helps prevent crashes by monitoring memory usage and enforcing limits
 */

export interface MemoryStats {
  used: number;
  total: number;
  percentage: number;
  timestamp: number;
}

export interface MemoryLimits {
  maxMemoryUsage: number; // in bytes
  warningThreshold: number; // percentage (0-100)
  criticalThreshold: number; // percentage (0-100)
}

export class MemoryMonitor {
  private static instance: MemoryMonitor;
  private memoryHistory: MemoryStats[] = [];
  private limits: MemoryLimits;
  private warningCallbacks: ((stats: MemoryStats) => void)[] = [];
  private criticalCallbacks: ((stats: MemoryStats) => void)[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  private constructor() {
    this.limits = {
      maxMemoryUsage: 200 * 1024 * 1024, // 200MB default (increased from 100MB)
      warningThreshold: 80, // 80% (increased from 70%)
      criticalThreshold: 90 // 90% (increased from 85%)
    };
  }

  public static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }

  /**
   * Start monitoring memory usage
   */
  public startMonitoring(intervalMs: number = 2000): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, intervalMs);

    console.log('📊 Memory monitoring started');
  }

  /**
   * Stop monitoring memory usage
   */
  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('📊 Memory monitoring stopped');
  }

  /**
   * Get current memory usage
   */
  public getCurrentMemoryUsage(): MemoryStats | null {
    try {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const memory = (performance as any).memory;
        if (memory) {
          const stats: MemoryStats = {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
            timestamp: Date.now()
          };
          return stats;
        }
      }
      return null;
    } catch (error) {
      console.warn('Failed to get memory usage:', error);
      return null;
    }
  }

  /**
   * Check if memory usage is within safe limits
   */
  public isMemoryUsageSafe(): boolean {
    const stats = this.getCurrentMemoryUsage();
    if (!stats) return true; // Assume safe if can't measure

    // More lenient for image processing - allow up to 300MB or 95% usage
    const dynamicMaxMemory = Math.max(this.limits.maxMemoryUsage, 300 * 1024 * 1024);
    const dynamicThreshold = Math.min(95, this.limits.criticalThreshold + 5);

    return stats.used < dynamicMaxMemory && 
           stats.percentage < dynamicThreshold;
  }

  /**
   * Check if memory usage is safe specifically for image processing
   */
  public isMemoryUsageSafeForImageProcessing(): boolean {
    const stats = this.getCurrentMemoryUsage();
    if (!stats) return true; // Assume safe if can't measure

    // Even more lenient for image processing - allow up to 400MB or 97% usage
    const maxMemoryForImages = 400 * 1024 * 1024; // 400MB
    const maxPercentageForImages = 97; // 97%

    return stats.used < maxMemoryForImages && 
           stats.percentage < maxPercentageForImages;
  }

  /**
   * Check if memory usage is at warning level
   */
  public isMemoryUsageWarning(): boolean {
    const stats = this.getCurrentMemoryUsage();
    if (!stats) return false;

    return stats.percentage >= this.limits.warningThreshold && 
           stats.percentage < this.limits.criticalThreshold;
  }

  /**
   * Check if memory usage is at critical level
   */
  public isMemoryUsageCritical(): boolean {
    const stats = this.getCurrentMemoryUsage();
    if (!stats) return false;

    return stats.percentage >= this.limits.criticalThreshold;
  }

  /**
   * Force garbage collection if available
   */
  public forceGarbageCollection(): void {
    try {
      if (typeof window !== 'undefined' && (window as any).gc) {
        (window as any).gc();
        console.log('🗑️ Forced garbage collection');
      } else {
        // Alternative memory cleanup strategies
        this.alternativeMemoryCleanup();
      }
    } catch (error) {
      console.warn('Failed to force garbage collection:', error);
    }
  }

  /**
   * Alternative memory cleanup when gc() is not available
   */
  private alternativeMemoryCleanup(): void {
    try {
      // Clear memory history to free up space
      if (this.memoryHistory.length > 10) {
        this.memoryHistory = this.memoryHistory.slice(-10);
      }

      // Trigger cleanup callbacks
      if (typeof window !== 'undefined') {
        // Use setTimeout to defer cleanup and allow other operations to complete
        setTimeout(() => {
          // Create and destroy a temporary array to encourage garbage collection
          const temp = new Array(1000).fill(null);
          temp.length = 0;
        }, 0);
      }

      console.log('🧹 Alternative memory cleanup performed');
    } catch (error) {
      console.warn('Alternative memory cleanup failed:', error);
    }
  }

  /**
   * Get memory usage history
   */
  public getMemoryHistory(): MemoryStats[] {
    return [...this.memoryHistory];
  }

  /**
   * Clear memory history
   */
  public clearHistory(): void {
    this.memoryHistory = [];
  }

  /**
   * Set memory limits
   */
  public setLimits(limits: Partial<MemoryLimits>): void {
    this.limits = { ...this.limits, ...limits };
  }

  /**
   * Get current memory limits
   */
  public getLimits(): MemoryLimits {
    return { ...this.limits };
  }

  /**
   * Add warning callback
   */
  public onWarning(callback: (stats: MemoryStats) => void): void {
    this.warningCallbacks.push(callback);
  }

  /**
   * Add critical callback
   */
  public onCritical(callback: (stats: MemoryStats) => void): void {
    this.criticalCallbacks.push(callback);
  }

  /**
   * Remove all callbacks
   */
  public removeAllCallbacks(): void {
    this.warningCallbacks = [];
    this.criticalCallbacks = [];
  }

  /**
   * Get memory usage summary
   */
  public getMemorySummary(): {
    current: MemoryStats | null;
    peak: MemoryStats | null;
    average: number;
    status: 'safe' | 'warning' | 'critical';
  } {
    const current = this.getCurrentMemoryUsage();
    const peak = this.memoryHistory.length > 0 
      ? this.memoryHistory.reduce((max, stat) => stat.used > max.used ? stat : max)
      : null;
    
    const average = this.memoryHistory.length > 0
      ? this.memoryHistory.reduce((sum, stat) => sum + stat.percentage, 0) / this.memoryHistory.length
      : 0;

    let status: 'safe' | 'warning' | 'critical' = 'safe';
    if (this.isMemoryUsageCritical()) status = 'critical';
    else if (this.isMemoryUsageWarning()) status = 'warning';

    return {
      current,
      peak,
      average,
      status
    };
  }

  /**
   * Check memory usage and trigger callbacks
   */
  private checkMemoryUsage(): void {
    const stats = this.getCurrentMemoryUsage();
    if (!stats) return;

    // Add to history (keep last 50 entries)
    this.memoryHistory.push(stats);
    if (this.memoryHistory.length > 50) {
      this.memoryHistory.shift();
    }

    // Check thresholds and trigger callbacks
    if (stats.percentage >= this.limits.criticalThreshold) {
      this.criticalCallbacks.forEach(callback => {
        try {
          callback(stats);
        } catch (error) {
          console.error('Critical callback failed:', error);
        }
      });
    } else if (stats.percentage >= this.limits.warningThreshold) {
      this.warningCallbacks.forEach(callback => {
        try {
          callback(stats);
        } catch (error) {
          console.error('Warning callback failed:', error);
        }
      });
    }
  }
}

// Export singleton instance
export const memoryMonitor = MemoryMonitor.getInstance();

/**
 * Memory monitoring hook for React components
 */
export const useMemoryMonitor = () => {
  const monitor = MemoryMonitor.getInstance();
  
  return {
    startMonitoring: (intervalMs?: number) => monitor.startMonitoring(intervalMs),
    stopMonitoring: () => monitor.stopMonitoring(),
    getCurrentUsage: () => monitor.getCurrentMemoryUsage(),
    isMemorySafe: () => monitor.isMemoryUsageSafe(),
    isMemoryWarning: () => monitor.isMemoryUsageWarning(),
    isMemoryCritical: () => monitor.isMemoryUsageCritical(),
    forceGC: () => monitor.forceGarbageCollection(),
    getSummary: () => monitor.getMemorySummary(),
    setLimits: (limits: Partial<MemoryLimits>) => monitor.setLimits(limits),
    onWarning: (callback: (stats: MemoryStats) => void) => monitor.onWarning(callback),
    onCritical: (callback: (stats: MemoryStats) => void) => monitor.onCritical(callback)
  };
};

/**
 * Memory-safe processing decorator
 */
export const withMemoryCheck = <T extends (...args: any[]) => any>(
  fn: T,
  options: {
    maxMemoryUsage?: number;
    forceGCAfter?: boolean;
    onMemoryExceeded?: () => void;
  } = {}
): T => {
  return ((...args: any[]) => {
    const monitor = MemoryMonitor.getInstance();
    
    // Check memory before execution
    if (!monitor.isMemoryUsageSafe()) {
      if (options.onMemoryExceeded) {
        options.onMemoryExceeded();
      }
      throw new Error('Memory usage too high to execute function');
    }
    
    try {
      const result = fn(...args);
      
      // Force GC after execution if requested
      if (options.forceGCAfter) {
        monitor.forceGarbageCollection();
      }
      
      return result;
    } catch (error) {
      // Force GC on error
      monitor.forceGarbageCollection();
      throw error;
    }
  }) as T;
};