/**
 * Performance Utilities for Dynamic Data Loading
 * 
 * This module loads real performance data from performance.json
 * and provides utilities for displaying metrics in the UI.
 */

export interface PerformanceData {
  version: string;
  lastUpdated: string;
  baseline: {
    timestamp: string;
    mainApp: {
      bundleSize: BundleMetrics;
      loadTime: LoadTimeMetrics;
      memory: MemoryMetrics;
      lighthouse: LighthouseMetrics;
    };
    prototypesApp: {
      bundleSize: BundleMetrics;
      loadTime: LoadTimeMetrics;
    };
  };
  migrations: Migration[];
  summary: {
    totalMigrations: number;
    totalImprovements: {
      bundleSize: ImprovementMetric;
      loadTime: {
        firstContentfulPaint: ImprovementMetric;
        largestContentfulPaint: ImprovementMetric;
        timeToInteractive: ImprovementMetric;
      };
      memory: {
        heapUsed: ImprovementMetric;
      };
    };
    estimatedSavings: {
      monthlyBandwidth: number | null;  
      serverCost: number | null;
      userExperience: string;
    };
  };
}

export interface BundleMetrics {
  total: number | null;
  js: number | null;
  css: number | null;
  assets: number | null;
  unit: string;
}

export interface LoadTimeMetrics {
  firstContentfulPaint: number | null;
  largestContentfulPaint: number | null;
  timeToInteractive: number | null;
  unit: string;
}

export interface MemoryMetrics {
  heapUsed: number | null;
  heapTotal: number | null;
  external?: number | null;
  unit: string;
}

export interface LighthouseMetrics {
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
}

export interface ImprovementMetric {
  absolute: number | null;
  percentage: number | null;
  unit: string;
}

export interface Migration {
  id: string;
  name: string;
  timestamp: string;
  status: 'migrated' | 'completed' | 'pending';
  component: {
    path: string;
    size: number | null;
    dependencies: string[];
    complexity: 'low' | 'medium' | 'high';
    category: string;
  };
  before: {
    mainApp: {
      bundleSize: BundleMetrics;
      loadTime: LoadTimeMetrics;
      memory: MemoryMetrics;
    };
  };
  after: {
    mainApp: {
      bundleSize: BundleMetrics;
      loadTime: LoadTimeMetrics;
      memory: MemoryMetrics;
    };
    prototypesApp: {
      bundleSize: BundleMetrics;
      loadTime: LoadTimeMetrics;
    };
  };
  improvements: {
    bundleSize: ImprovementMetric;
    loadTime: {
      firstContentfulPaint: ImprovementMetric;
      largestContentfulPaint: ImprovementMetric;
      timeToInteractive: ImprovementMetric;
    };
    memory: {
      heapUsed: ImprovementMetric;
    };
  };
}

/**
 * Load performance data from performance.json
 */
export async function loadPerformanceData(): Promise<PerformanceData | null> {
  try {
    const response = await fetch('/performance.json');
    if (!response.ok) {
      console.warn('Performance data not available');
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn('Failed to load performance data:', error);
    return null;
  }
}

/**
 * Format performance metrics for display
 */
export function formatMetric(value: number | null, unit: string): string {
  if (value === null) return 'N/A';
  
  switch (unit) {
    case 'MB':
      return `${value.toFixed(1)} MB`;
    case 'ms':
      return value < 1000 ? `${Math.round(value)} ms` : `${(value / 1000).toFixed(1)}s`;
    case '%':
      return `${value}%`;
    default:
      return `${value} ${unit}`;
  }
}

/**
 * Format improvement metrics with positive/negative indication
 */
export function formatImprovement(improvement: ImprovementMetric | null): {
  text: string;
  isPositive: boolean;
  percentage: string;
} {
  if (!improvement || improvement.absolute === null || improvement.percentage === null) {
    return { text: 'N/A', isPositive: false, percentage: 'N/A' };
  }
  
  const isPositive = improvement.absolute > 0;
  const prefix = isPositive ? '-' : '+';
  const absValue = Math.abs(improvement.absolute);
  const absPercentage = Math.abs(improvement.percentage);
  
  return {
    text: `${prefix}${formatMetric(absValue, improvement.unit)}`,
    isPositive,
    percentage: `${prefix}${absPercentage}%`
  };
}

/**
 * Calculate overall performance score
 */
export function calculatePerformanceScore(data: PerformanceData): number {
  const completedMigrations = data.migrations.filter(m => m.status === 'completed');
  if (completedMigrations.length === 0) return 0;
  
  let totalScore = 0;
  let scoreCount = 0;
  
  completedMigrations.forEach(migration => {
    // Bundle size improvements (weight: 3)
    if (migration.improvements.bundleSize?.percentage) {
      totalScore += Math.abs(migration.improvements.bundleSize.percentage) * 3;
      scoreCount += 3;
    }
    
    // Load time improvements (weight: 2 each)
    Object.values(migration.improvements.loadTime || {}).forEach(improvement => {
      if (improvement?.percentage) {
        totalScore += Math.abs(improvement.percentage) * 2;
        scoreCount += 2;
      }
    });
    
    // Memory improvements (weight: 1)
    Object.values(migration.improvements.memory || {}).forEach(improvement => {
      if (improvement?.percentage) {
        totalScore += Math.abs(improvement.percentage) * 1;
        scoreCount += 1;
      }
    });
  });
  
  return scoreCount > 0 ? Math.min(Math.round(totalScore / scoreCount), 100) : 0;
}

/**
 * Get performance statistics for the home page
 */
export function getPerformanceStats(data: PerformanceData | null) {
  if (!data) {
    return {
      totalMigrations: 0,
      activeMigrations: 0,
      performanceGain: 'N/A',
      bundleSizeReduction: 'N/A',
      loadTimeImprovement: 'N/A',
      memoryImprovement: 'N/A'
    };
  }
  
  const bundleImprovement = formatImprovement(data.summary.totalImprovements.bundleSize);
  const loadTimeImprovement = formatImprovement(data.summary.totalImprovements.loadTime.firstContentfulPaint);
  const memoryImprovement = formatImprovement(data.summary.totalImprovements.memory.heapUsed);
  
  return {
    totalMigrations: data.summary.totalMigrations,
    activeMigrations: data.migrations.filter(m => m.status === 'completed').length,
    performanceGain: bundleImprovement.percentage,
    bundleSizeReduction: bundleImprovement.percentage,
    loadTimeImprovement: loadTimeImprovement.percentage,
    memoryImprovement: memoryImprovement.percentage
  };
}

/**
 * Get the latest migration data
 */
export function getLatestMigration(data: PerformanceData | null): Migration | null {
  if (!data || data.migrations.length === 0) return null;
  
  return data.migrations
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
}

/**
 * Check if performance data is available and recent
 */
export function isPerformanceDataCurrent(data: PerformanceData | null): boolean {
  if (!data) return false;
  
  const lastUpdate = new Date(data.lastUpdated);
  const now = new Date();
  const hoursDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
  
  // Consider data current if updated within last 24 hours
  return hoursDiff < 24;
}

/**
 * Generate performance insights based on data
 */
export function generateInsights(data: PerformanceData | null): string[] {
  if (!data) {
    return [
      'No performance data available yet',
      'Run measurements to see improvements',
      'Migration benefits will appear here'
    ];
  }
  
  const insights: string[] = [];
  const completedMigrations = data.migrations.filter(m => m.status === 'completed');
  
  if (completedMigrations.length === 0) {
    insights.push('No completed migrations yet');
    insights.push('Complete a migration to see performance benefits');
    return insights;
  }
  
  // Bundle size insights
  const bundleImprovement = data.summary.totalImprovements.bundleSize;
  if (bundleImprovement.percentage && bundleImprovement.percentage > 0) {
    insights.push(`Bundle size reduced by ${bundleImprovement.percentage}%`);
  }
  
  // Load time insights
  const fcpImprovement = data.summary.totalImprovements.loadTime.firstContentfulPaint;
  if (fcpImprovement.percentage && fcpImprovement.percentage > 0) {
    insights.push(`First Contentful Paint improved by ${fcpImprovement.percentage}%`);
  }
  
  // Migration count insights
  if (completedMigrations.length === 1) {
    insights.push('First prototype successfully migrated');
  } else {
    insights.push(`${completedMigrations.length} prototypes migrated successfully`);
  }
  
  // Performance score
  const score = calculatePerformanceScore(data);
  if (score > 80) {
    insights.push('Excellent performance improvements achieved');
  } else if (score > 60) {
    insights.push('Good performance gains from migrations');
  }
  
  return insights.length > 0 ? insights : ['Performance data collected, analyzing benefits...'];
}