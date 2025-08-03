#!/usr/bin/env node

/**
 * Performance Measurement Script for GardenFlow Prototypes Migration
 * 
 * This script measures and records performance metrics before and after
 * migrating prototypes from the main app to the prototypes app.
 * 
 * Usage:
 *   node scripts/measure-performance.js --phase=before --migration=enhanced-parcel-zone-crops
 *   node scripts/measure-performance.js --phase=after --migration=enhanced-parcel-zone-crops
 *   node scripts/measure-performance.js --baseline
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PerformanceMeasurer {
  constructor() {
    this.performanceFile = path.join(__dirname, '../performance.json');
    this.mainAppPath = path.join(__dirname, '../../app.gardenflow.io');
    this.prototypesAppPath = path.join(__dirname, '..');
  }

  loadPerformanceData() {
    try {
      const data = fs.readFileSync(this.performanceFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading performance.json:', error);
      process.exit(1);
    }
  }

  savePerformanceData(data) {
    try {
      fs.writeFileSync(this.performanceFile, JSON.stringify(data, null, 2));
      console.log('✅ Performance data saved to performance.json');
    } catch (error) {
      console.error('Error saving performance.json:', error);
      process.exit(1);
    }
  }

  measureBundleSize(appPath) {
    try {
      console.log(`📦 Measuring bundle size for ${appPath}...`);
      
      // Build the app
      process.chdir(appPath);
      execSync('npm run build', { stdio: 'inherit' });
      
      // Get dist folder size
      const distPath = path.join(appPath, 'dist');
      const sizeOutput = execSync(`du -sh ${distPath}`, { encoding: 'utf8' });
      const totalSize = parseFloat(sizeOutput.split('\t')[0]);
      
      // Get detailed breakdown
      const jsFiles = execSync(`find ${distPath} -name "*.js" -exec du -ch {} + | tail -1`, { encoding: 'utf8' });
      const cssFiles = execSync(`find ${distPath} -name "*.css" -exec du -ch {} + | tail -1`, { encoding: 'utf8' });
      const assetFiles = execSync(`find ${distPath} -type f ! -name "*.js" ! -name "*.css" -exec du -ch {} + | tail -1`, { encoding: 'utf8' });
      
      return {
        total: totalSize,
        js: parseFloat(jsFiles.split('\t')[0]) || 0,
        css: parseFloat(cssFiles.split('\t')[0]) || 0,
        assets: parseFloat(assetFiles.split('\t')[0]) || 0,
        unit: 'MB'
      };
    } catch (error) {
      console.warn(`⚠️  Could not measure bundle size: ${error.message}`);
      return { total: null, js: null, css: null, assets: null, unit: 'MB' };
    }
  }

  measureLighthouseMetrics(url) {
    try {
      console.log(`🔍 Running Lighthouse analysis for ${url}...`);
      
      // Install lighthouse if not available
      try {
        execSync('lighthouse --version', { stdio: 'ignore' });
      } catch {
        console.log('Installing Lighthouse...');
        execSync('npm install -g lighthouse', { stdio: 'inherit' });
      }
      
      // Run lighthouse
      const output = execSync(`lighthouse ${url} --output=json --quiet --chrome-flags="--headless"`, { encoding: 'utf8' });
      const report = JSON.parse(output);
      
      return {
        performance: Math.round(report.lhr.categories.performance.score * 100),
        accessibility: Math.round(report.lhr.categories.accessibility.score * 100),
        bestPractices: Math.round(report.lhr.categories['best-practices'].score * 100),
        seo: Math.round(report.lhr.categories.seo.score * 100),
        loadTime: {
          firstContentfulPaint: report.lhr.audits['first-contentful-paint'].numericValue,
          largestContentfulPaint: report.lhr.audits['largest-contentful-paint'].numericValue,
          timeToInteractive: report.lhr.audits.interactive.numericValue,
          unit: 'ms'
        }
      };
    } catch (error) {
      console.warn(`⚠️  Could not run Lighthouse: ${error.message}`);
      return {
        performance: null,
        accessibility: null,
        bestPractices: null,
        seo: null,
        loadTime: {
          firstContentfulPaint: null,
          largestContentfulPaint: null,
          timeToInteractive: null,
          unit: 'ms'
        }
      };
    }
  }

  calculateImprovements(before, after) {
    const improvements = {};
    
    // Bundle size improvements
    if (before.bundleSize.total && after.bundleSize.total) {
      const sizeDiff = before.bundleSize.total - after.bundleSize.total;
      improvements.bundleSize = {
        absolute: sizeDiff,
        percentage: Math.round((sizeDiff / before.bundleSize.total) * 100),
        unit: 'MB'
      };
    }
    
    // Load time improvements
    if (before.loadTime && after.loadTime) {
      improvements.loadTime = {};
      
      ['firstContentfulPaint', 'largestContentfulPaint', 'timeToInteractive'].forEach(metric => {
        if (before.loadTime[metric] && after.loadTime[metric]) {
          const timeDiff = before.loadTime[metric] - after.loadTime[metric];
          improvements.loadTime[metric] = {
            absolute: timeDiff,
            percentage: Math.round((timeDiff / before.loadTime[metric]) * 100),
            unit: 'ms'
          };
        }
      });
    }
    
    // Memory improvements
    if (before.memory && after.memory) {
      improvements.memory = {};
      
      ['heapUsed', 'heapTotal'].forEach(metric => {
        if (before.memory[metric] && after.memory[metric]) {
          const memDiff = before.memory[metric] - after.memory[metric];
          improvements.memory[metric] = {
            absolute: memDiff,
            percentage: Math.round((memDiff / before.memory[metric]) * 100),
            unit: 'MB'
          };
        }
      });
    }
    
    return improvements;
  }

  async measureBaseline() {
    console.log('🔄 Measuring baseline performance...');
    
    const performanceData = this.loadPerformanceData();
    
    // Measure main app
    const mainAppBundle = this.measureBundleSize(this.mainAppPath);
    const mainAppMetrics = this.measureLighthouseMetrics('http://localhost:5173');
    
    // Measure prototypes app
    const prototypesAppBundle = this.measureBundleSize(this.prototypesAppPath);
    const prototypesAppMetrics = this.measureLighthouseMetrics('http://localhost:5174');
    
    // Update baseline
    performanceData.baseline = {
      timestamp: new Date().toISOString(),
      mainApp: {
        bundleSize: mainAppBundle,
        loadTime: mainAppMetrics.loadTime,
        memory: { heapUsed: null, heapTotal: null, external: null, unit: 'MB' },
        lighthouse: {
          performance: mainAppMetrics.performance,
          accessibility: mainAppMetrics.accessibility,
          bestPractices: mainAppMetrics.bestPractices,
          seo: mainAppMetrics.seo
        }
      },
      prototypesApp: {
        bundleSize: prototypesAppBundle,
        loadTime: prototypesAppMetrics.loadTime
      }
    };
    
    this.savePerformanceData(performanceData);
    console.log('✅ Baseline measurements completed');
  }

  async measureMigration(migrationId, phase) {
    console.log(`🔄 Measuring ${phase} migration performance for ${migrationId}...`);
    
    const performanceData = this.loadPerformanceData();
    const migration = performanceData.migrations.find(m => m.id === migrationId);
    
    if (!migration) {
      console.error(`❌ Migration '${migrationId}' not found in performance.json`);
      process.exit(1);
    }
    
    // Measure main app
    const mainAppBundle = this.measureBundleSize(this.mainAppPath);
    const mainAppMetrics = this.measureLighthouseMetrics('http://localhost:5173');
    
    const measurements = {
      bundleSize: mainAppBundle,
      loadTime: mainAppMetrics.loadTime,
      memory: { heapUsed: null, heapTotal: null, unit: 'MB' }
    };
    
    if (phase === 'before') {
      migration.before.mainApp = measurements;
    } else if (phase === 'after') {
      migration.after.mainApp = measurements;
      
      // Also measure prototypes app
      const prototypesAppBundle = this.measureBundleSize(this.prototypesAppPath);
      const prototypesAppMetrics = this.measureLighthouseMetrics('http://localhost:5174');
      
      migration.after.prototypesApp = {
        bundleSize: prototypesAppBundle,
        loadTime: prototypesAppMetrics.loadTime
      };
      
      // Calculate improvements
      migration.improvements = this.calculateImprovements(migration.before.mainApp, migration.after.mainApp);
      migration.status = 'completed';
      
      // Update summary
      this.updateSummary(performanceData);
    }
    
    migration.timestamp = new Date().toISOString();
    this.savePerformanceData(performanceData);
    console.log(`✅ ${phase} measurements completed for ${migrationId}`);
  }

  updateSummary(performanceData) {
    const completedMigrations = performanceData.migrations.filter(m => m.status === 'completed');
    
    performanceData.summary.totalMigrations = completedMigrations.length;
    
    // Calculate total improvements
    const totalImprovements = {
      bundleSize: { absolute: 0, percentage: 0, unit: 'MB' },
      loadTime: {
        firstContentfulPaint: { absolute: 0, percentage: 0, unit: 'ms' },
        largestContentfulPaint: { absolute: 0, percentage: 0, unit: 'ms' },
        timeToInteractive: { absolute: 0, percentage: 0, unit: 'ms' }
      },
      memory: {
        heapUsed: { absolute: 0, percentage: 0, unit: 'MB' }
      }
    };
    
    completedMigrations.forEach(migration => {
      if (migration.improvements.bundleSize) {
        totalImprovements.bundleSize.absolute += migration.improvements.bundleSize.absolute || 0;
      }
      
      if (migration.improvements.loadTime) {
        Object.keys(migration.improvements.loadTime).forEach(metric => {
          if (migration.improvements.loadTime[metric]) {
            totalImprovements.loadTime[metric].absolute += migration.improvements.loadTime[metric].absolute || 0;
          }
        });
      }
      
      if (migration.improvements.memory) {
        Object.keys(migration.improvements.memory).forEach(metric => {
          if (migration.improvements.memory[metric]) {
            totalImprovements.memory[metric].absolute += migration.improvements.memory[metric].absolute || 0;
          }
        });
      }
    });
    
    performanceData.summary.totalImprovements = totalImprovements;
  }

  displayResults(migrationId) {
    const performanceData = this.loadPerformanceData();
    const migration = performanceData.migrations.find(m => m.id === migrationId);
    
    if (!migration || migration.status !== 'completed') {
      console.log('No completed measurements found for this migration.');
      return;
    }
    
    console.log('\n📊 Performance Improvement Results:');
    console.log('=====================================');
    
    if (migration.improvements.bundleSize) {
      console.log(`📦 Bundle Size: ${migration.improvements.bundleSize.absolute} MB (${migration.improvements.bundleSize.percentage}%)`);
    }
    
    if (migration.improvements.loadTime) {
      console.log('⚡ Load Time Improvements:');
      Object.entries(migration.improvements.loadTime).forEach(([metric, improvement]) => {
        if (improvement && improvement.absolute) {
          console.log(`  ${metric}: ${improvement.absolute} ms (${improvement.percentage}%)`);
        }
      });
    }
    
    if (migration.improvements.memory) {
      console.log('🧠 Memory Improvements:');
      Object.entries(migration.improvements.memory).forEach(([metric, improvement]) => {
        if (improvement && improvement.absolute) {
          console.log(`  ${metric}: ${improvement.absolute} MB (${improvement.percentage}%)`);
        }
      });
    }
  }
}

// CLI handling
async function main() {
  const measurer = new PerformanceMeasurer();
  const args = process.argv.slice(2);
  
  const getArg = (name) => {
    const arg = args.find(a => a.startsWith(`--${name}=`));
    return arg ? arg.split('=')[1] : null;
  };
  
  const hasFlag = (name) => args.includes(`--${name}`);
  
  try {
    if (hasFlag('baseline')) {
      await measurer.measureBaseline();
    } else if (hasFlag('results')) {
      const migrationId = getArg('migration');
      if (!migrationId) {
        console.error('❌ --migration parameter required for results');
        process.exit(1);
      }
      measurer.displayResults(migrationId);
    } else {
      const phase = getArg('phase');
      const migrationId = getArg('migration');
      
      if (!phase || !migrationId) {
        console.error('❌ Required parameters: --phase=before|after --migration=<id>');
        process.exit(1);
      }
      
      if (!['before', 'after'].includes(phase)) {
        console.error('❌ Phase must be "before" or "after"');
        process.exit(1);
      }
      
      await measurer.measureMigration(migrationId, phase);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();