# Garden Vision - Procedures and Workflows

## Overview
This document provides detailed procedures for developing, testing, maintaining, and troubleshooting the Garden Vision component. It serves as a comprehensive guide for developers, testers, and support teams.

---

## 🛠️ Development Procedures

### DEV001: Setting Up Development Environment

#### Prerequisites
```bash
# Ensure Node.js and npm are installed
node --version  # >= 16.0.0
npm --version   # >= 8.0.0

# Verify camera access in development
# Requires HTTPS or localhost for getUserMedia API
```

#### Environment Setup
```bash
# 1. Navigate to frontend project
cd /Users/emmanuelbriand/Documents/workspace/gardenflow/app.gardenflow.io

# 2. Install dependencies
npm install

# 3. Start development server (enables camera access)
npm run dev

# 4. Verify HTTPS/localhost access
# Garden Vision requires secure context for camera API
# Development server should run on https://localhost:5173 or http://localhost:5173
```

#### Component Development Setup
```bash
# 1. Navigate to Garden Vision component
cd src/components/prototypes/garden-vision

# 2. Verify component structure
ls -la
# Should show: index.tsx, CameraModal.tsx, ResultsModal.tsx, docs/, services/, etc.

# 3. Run component tests (if available)
npm run test -- --testPathPattern=garden-vision

# 4. Enable debug mode
# In browser console:
localStorage.setItem('garden-vision-debug', 'true')
```

---

### DEV002: Adding New Detection Features

#### Step 1: Define New Detection Type
```typescript
// 1. Update types.ts
export interface DetectedItem {
  id: string;
  type: 'parcel' | 'zone' | 'plant' | 'structure' | 'NEW_TYPE';
  // ... existing properties
}

// 2. Add to detection constants
export const ITEM_TYPES = {
  // ... existing types
  NEW_TYPE: 'new_type'
} as const;
```

#### Step 2: Update Color Constants
```typescript
// constants/index.ts
export const COLORS = {
  // ... existing colors
  NEW_TYPE: '#HEX_COLOR'
};

export const TYPE_COLORS = {
  // ... existing mappings
  NEW_TYPE: COLORS.NEW_TYPE
};
```

#### Step 3: Implement Detection Logic
```typescript
// services/imageRecognitionService.ts
private generateRealisticDetections(analysis: ImageAnalysis): DetectedItem[] {
  const items: DetectedItem[] = [];
  
  // ... existing detection logic
  
  // Add new detection logic
  const newTypeItems = this.detectNewType(analysis);
  items.push(...newTypeItems);
  
  return items;
}

private detectNewType(analysis: ImageAnalysis): DetectedItem[] {
  // Implement specific detection algorithm
  // Return array of DetectedItem objects
}
```

#### Step 4: Update UI Components
```typescript
// ResultsModal.tsx - Add new type display
const getItemIcon = (type: string) => {
  switch (type) {
    // ... existing cases
    case 'NEW_TYPE':
      return <NewTypeIcon className="w-4 h-4" />;
  }
};

const getItemLabel = (type: string) => {
  switch (type) {
    // ... existing cases
    case 'NEW_TYPE':
      return 'New Type Label';
  }
};
```

#### Step 5: Testing
```bash
# 1. Unit tests for detection logic
npm run test -- --testPathPattern=imageRecognitionService

# 2. Integration tests
npm run test -- --testPathPattern=garden-vision

# 3. Manual testing with sample images
# Place test images in: src/assets/test-images/
# Test various scenarios: good lighting, poor lighting, edge cases
```

---

### DEV003: Performance Optimization

#### Image Processing Optimization
```typescript
// 1. Optimize canvas operations
private optimizeImageProcessing(imageData: ImageData): void {
  // Use Web Workers for heavy processing
  const worker = new Worker('/workers/image-processing.js');
  
  // Implement progressive processing
  // Process image in chunks to maintain UI responsiveness
}

// 2. Memory management
private cleanupResources(): void {
  // Stop camera streams
  if (this.stream) {
    this.stream.getTracks().forEach(track => track.stop());
  }
  
  // Clear canvas data
  if (this.canvas) {
    const ctx = this.canvas.getContext('2d');
    ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
```

#### Performance Monitoring
```typescript
// Add performance markers
performance.mark('garden-vision-start');
// ... processing logic
performance.mark('garden-vision-end');
performance.measure('garden-vision-total', 'garden-vision-start', 'garden-vision-end');

// Log performance metrics
console.log('Processing time:', performance.getEntriesByName('garden-vision-total')[0].duration);
```

---

## 🧪 Testing Procedures

### TEST001: Manual Testing Workflow

#### Pre-Testing Setup
```bash
# 1. Ensure clean environment
npm run dev
# Clear browser cache and localStorage

# 2. Prepare test scenarios
# Have sample garden images ready
# Test on different devices/browsers
# Prepare various lighting conditions
```

#### Core Functionality Tests
```bash
# Test Case 1: Camera Permission Flow
1. Open application
2. Click Garden Vision icon
3. Verify permission request appears
4. Grant permission
5. Verify camera opens successfully

# Expected: Camera modal opens with live feed

# Test Case 2: Image Capture and Analysis
1. Open camera modal
2. Point at garden area
3. Tap capture button
4. Wait for processing
5. Verify results modal appears

# Expected: Processing < 3 seconds, results display correctly

# Test Case 3: Results Interaction
1. View analysis results
2. Toggle between grid and list views
3. Interact with detected items
4. Check confidence scores
5. Close results modal

# Expected: All interactions work smoothly, data is accurate
```

#### Error Handling Tests
```bash
# Test Case 4: Permission Denied
1. Open Garden Vision
2. Deny camera permission
3. Verify error message appears
4. Verify retry option works

# Expected: Clear error message, functional retry

# Test Case 5: Camera Unavailable
1. Use device with no camera or camera in use
2. Attempt to open Garden Vision
3. Verify appropriate error handling

# Expected: Graceful degradation, clear messaging

# Test Case 6: Poor Image Quality
1. Capture very dark/blurry image
2. Process through analysis
3. Verify quality warnings

# Expected: Quality assessment, helpful guidance
```

---

### TEST002: Cross-Browser Testing

#### Browser Compatibility Matrix
```
Chrome (Desktop):   ✅ Full support
Firefox (Desktop):  ✅ Full support  
Safari (Desktop):   ⚠️  Limited (requires HTTPS)
Edge (Desktop):     ✅ Full support

Chrome (Mobile):    ✅ Full support
Firefox (Mobile):   ✅ Full support
Safari (Mobile):    ✅ Full support
Samsung Internet:   ⚠️  Test required
```

#### Testing Procedure
```bash
# For each browser:
1. Test camera permission flow
2. Test image capture quality
3. Test processing performance
4. Test UI responsiveness
5. Test error handling

# Document any browser-specific issues
# Note performance differences
# Test on different screen sizes
```

---

### TEST003: Performance Testing

#### Processing Speed Benchmarks
```typescript
// Performance test script
const performanceTest = async () => {
  const testImages = [
    { name: 'small', size: '640x480' },
    { name: 'medium', size: '1280x720' },
    { name: 'large', size: '1920x1080' }
  ];
  
  for (const image of testImages) {
    const startTime = performance.now();
    await imageRecognitionService.processImage(image.data);
    const endTime = performance.now();
    
    console.log(`${image.name}: ${endTime - startTime}ms`);
  }
};

// Target performance:
// Small (640x480): < 1 second
// Medium (1280x720): < 3 seconds  
// Large (1920x1080): < 5 seconds
```

#### Memory Usage Testing
```javascript
// Monitor memory usage during processing
const monitorMemory = () => {
  if (performance.memory) {
    console.log('Used:', performance.memory.usedJSHeapSize);
    console.log('Total:', performance.memory.totalJSHeapSize);
    console.log('Limit:', performance.memory.jsHeapSizeLimit);
  }
};

// Test for memory leaks
// Capture multiple images and monitor memory growth
```

---

## 🔧 Maintenance Procedures

### MAINT001: Regular Health Checks

#### Weekly Monitoring
```bash
# 1. Check error rates in application logs
grep "Garden Vision Error" /var/log/app.log | wc -l

# 2. Monitor performance metrics
# Check processing time trends
# Monitor memory usage patterns

# 3. Review user feedback
# Check support tickets related to camera issues
# Monitor user satisfaction scores

# 4. Test core functionality
# Perform manual smoke tests on key flows
# Verify camera access on different devices
```

#### Monthly Reviews
```bash
# 1. Browser compatibility check
# Test on latest browser versions
# Check for new browser APIs or changes

# 2. Performance optimization review
# Analyze processing time trends
# Identify optimization opportunities

# 3. Feature usage analysis
# Review which features are most/least used
# Identify improvement areas

# 4. Security review
# Check camera permission implementations
# Review data handling practices
```

---

### MAINT002: Dependency Updates

#### Update Procedure
```bash
# 1. Check for updates
npm outdated

# 2. Test updates in development
npm update --dev
npm run test
npm run build

# 3. Test Garden Vision specifically
# Run full test suite
# Manual testing of camera functionality

# 4. Deploy with monitoring
# Deploy to staging first
# Monitor for errors post-deployment
```

#### Camera API Changes
```typescript
// Monitor for getUserMedia API changes
// Check browser compatibility updates
// Test on new device/OS versions

// Update camera service as needed
// Maintain backwards compatibility
// Document any breaking changes
```

---

## 🐛 Troubleshooting Procedures

### TROUBLE001: Camera Access Issues

#### Problem: Permission Denied
```bash
# Diagnosis steps:
1. Check browser security settings
2. Verify HTTPS context (production)
3. Check site permissions in browser
4. Test on different browsers

# Common causes:
- HTTP instead of HTTPS in production
- Browser blocking camera access
- Site permissions revoked by user
- Corporate firewall blocking media

# Solutions:
- Ensure HTTPS in production
- Clear browser data and retry
- Guide user through permission reset
- Check network/firewall settings
```

#### Problem: Camera Not Found
```bash
# Diagnosis steps:
1. Check if device has camera
2. Verify camera not in use by other apps
3. Test camera in other applications
4. Check device permissions (mobile)

# Common causes:
- No camera device available
- Camera in use by another application
- Device permissions disabled
- Hardware failure

# Solutions:
- Verify device capabilities
- Close other applications using camera
- Check device-level permissions
- Suggest device restart
```

---

### TROUBLE002: Image Processing Issues

#### Problem: Slow Processing
```bash
# Diagnosis steps:
1. Check image resolution and size
2. Monitor device performance
3. Check for concurrent processing
4. Review algorithm efficiency

# Performance targets:
- 640x480: < 1 second
- 1280x720: < 3 seconds
- 1920x1080: < 5 seconds

# Optimization steps:
- Reduce image resolution if needed
- Implement progressive processing
- Use Web Workers for heavy computation
- Cache intermediate results
```

#### Problem: Poor Detection Accuracy
```bash
# Diagnosis steps:
1. Check image quality (lighting, focus)
2. Review detection confidence scores
3. Analyze image characteristics
4. Check algorithm parameters

# Common causes:
- Poor lighting conditions
- Low image resolution
- Complex garden layouts
- Algorithm limitations

# Improvements:
- Guide user on optimal conditions
- Adjust detection thresholds
- Enhance algorithm robustness
- Provide feedback for improvement
```

---

### TROUBLE003: UI/UX Issues

#### Problem: Modal Not Opening
```bash
# Diagnosis steps:
1. Check console for JavaScript errors
2. Verify component state management
3. Test click event handlers
4. Check CSS z-index conflicts

# Common solutions:
- Fix JavaScript errors
- Reset component state
- Verify event handlers attached
- Adjust CSS positioning
```

#### Problem: Results Not Displaying
```bash
# Diagnosis steps:
1. Check data structure returned from analysis
2. Verify results modal state
3. Check for rendering errors
4. Review data transformation

# Debug commands:
console.log('Analysis result:', analysisData);
console.log('Component state:', componentState);
console.log('Render data:', renderData);
```

---

## 📋 Standard Operating Procedures

### SOP001: Release Deployment

#### Pre-Deployment Checklist
```bash
# 1. Code Review
- [ ] Code reviewed by team member
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Performance benchmarks met

# 2. Testing
- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Mobile device testing completed
- [ ] Error handling verified

# 3. Performance
- [ ] Processing speed within targets
- [ ] Memory usage acceptable
- [ ] Camera access working reliably
- [ ] UI responsive on all devices
```

#### Deployment Steps
```bash
# 1. Build production version
npm run build

# 2. Deploy to staging
# Test all functionality in staging environment

# 3. Deploy to production
# Monitor error rates and performance

# 4. Post-deployment verification
# Test camera access
# Verify processing performance
# Check error rates in logs
```

---

### SOP002: User Support

#### Common Support Scenarios

**Scenario 1: User Can't Access Camera**
```
1. Verify browser and device compatibility
2. Check HTTPS requirement in production
3. Guide user through permission reset
4. Test on different browser if needed
5. Escalate to technical team if persists
```

**Scenario 2: Poor Analysis Results**
```
1. Ask for description of garden setup
2. Request sample image if possible
3. Provide guidance on optimal conditions
4. Suggest alternative capture angles
5. Document feedback for algorithm improvement
```

**Scenario 3: Performance Issues**
```
1. Check device specifications
2. Suggest image resolution adjustment
3. Verify network connectivity
4. Check for other running applications
5. Provide optimization recommendations
```

#### Support Documentation Templates
```markdown
# Camera Access Issues
Try these steps:
1. Ensure you're using Chrome, Firefox, or Safari
2. Check that camera permission is granted
3. In browser settings, verify camera access for the site
4. Try refreshing the page
5. If on mobile, ensure the camera isn't being used by another app

# Poor Recognition Results
For better results:
1. Ensure good lighting (natural light preferred)
2. Hold device steady when capturing
3. Capture from 2-3 meters away for full garden view
4. Avoid shadows across the garden area
5. Make sure plants are clearly visible
```

---

## 📊 Quality Assurance

### QA001: Code Quality Standards

#### Code Review Checklist
```typescript
// 1. Type Safety
- [ ] All functions have proper TypeScript types
- [ ] No 'any' types unless absolutely necessary
- [ ] Interfaces properly defined and used

// 2. Error Handling
- [ ] Try-catch blocks around async operations
- [ ] User-friendly error messages
- [ ] Proper cleanup in error scenarios

// 3. Performance
- [ ] No memory leaks in camera handling
- [ ] Efficient image processing algorithms
- [ ] Proper resource cleanup

// 4. Security
- [ ] Camera permissions properly requested
- [ ] No sensitive data in logs
- [ ] Secure handling of image data
```

#### Testing Standards
```bash
# 1. Unit Test Coverage
- [ ] Core services (camera, recognition) > 80%
- [ ] Utility functions > 90%
- [ ] Critical paths 100% covered

# 2. Integration Tests
- [ ] Camera permission flow
- [ ] Image capture and processing
- [ ] Results display and interaction

# 3. E2E Tests
- [ ] Complete user workflows
- [ ] Error scenarios
- [ ] Cross-browser compatibility
```

---

### QA002: Performance Standards

#### Response Time Requirements
```
Camera Open: < 2 seconds
Image Capture: < 1 second
Image Processing: < 3 seconds (720p)
Results Display: < 1 second
Total Workflow: < 10 seconds
```

#### Resource Usage Limits
```
Memory Usage: < 50MB increase during processing
CPU Usage: < 80% sustained during analysis
Battery Impact: Minimal (< 5% per analysis)
Network Usage: Local processing only
```

#### Quality Metrics
```
Detection Accuracy: > 80% for clear images
User Satisfaction: > 4.0/5.0 rating
Error Rate: < 5% of total usage
Support Tickets: < 2% of active users
```

---

This comprehensive procedures document ensures consistent development, testing, and maintenance of the Garden Vision component while providing clear guidance for troubleshooting and support scenarios.