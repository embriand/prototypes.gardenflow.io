# Quick Start Guide - Remotion Videos

## 🚀 Get Started in 3 Steps

### 1. Preview Your Videos
```bash
cd /Users/emmanuelbriand/Documents/workspace/gardenflow/prototypes
npm run video:preview
```

This opens a browser with an interactive studio at `http://localhost:3001`
(The server will automatically open in your default browser)

### 2. Explore the Studio

The Remotion Studio gives you:
- **Left sidebar**: List of all your video compositions
- **Center**: Video player with timeline scrubber
- **Right sidebar**: Props you can edit in real-time
- **Bottom**: Timeline with frame-by-frame control

### 3. Render a Video

```bash
npm run video:render-intro
# or
npm run video:render-timeline
```

Your video will be saved in the `out/` folder!

---

## 📚 Understanding the Code

### Basic Video Component Structure

```tsx
import { useCurrentFrame, interpolate } from 'remotion';

export const MyVideo = () => {
  // Get current frame (0, 1, 2, 3...)
  const frame = useCurrentFrame();

  // Animate opacity from 0 to 1 over frames 0-30
  const opacity = interpolate(
    frame,           // Current value
    [0, 30],        // Input range
    [0, 1],         // Output range
    { extrapolateRight: 'clamp' }  // Don't go beyond 1
  );

  return (
    <div style={{ opacity }}>
      Hello! Frame: {frame}
    </div>
  );
};
```

### Key Hooks

```tsx
// Get current frame number
const frame = useCurrentFrame();

// Get video configuration
const { fps, durationInFrames, width, height } = useVideoConfig();

// Calculate seconds from frames
const seconds = frame / fps;
```

### Animation Helpers

```tsx
import { interpolate, spring, Easing } from 'remotion';

// Linear interpolation
const x = interpolate(frame, [0, 100], [0, 500]);

// Spring physics (bouncy, natural)
const scale = spring({
  frame,
  fps,
  config: {
    damping: 100,    // Higher = less bounce
    stiffness: 200,  // Higher = faster
  }
});

// Custom easing
const y = interpolate(
  frame,
  [0, 60],
  [0, 300],
  {
    easing: Easing.bezier(0.65, 0, 0.35, 1)
  }
);
```

---

## 🎨 Composition Registration

In `src/Root.tsx`:

```tsx
<Composition
  id="MyVideo"              // Unique ID for rendering
  component={MyVideo}        // Your React component
  durationInFrames={150}     // 5 seconds at 30fps
  fps={30}                   // Frames per second
  width={1920}               // Video width
  height={1080}              // Video height
  defaultProps={{            // Props for your component
    title: "Hello World",
    count: 42
  }}
/>
```

---

## 💡 Common Patterns

### Fade In/Out
```tsx
// Fade in (frames 0-30)
const fadeIn = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp'
});

// Fade out (frames 120-150)
const fadeOut = interpolate(frame, [120, 150], [1, 0], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp'
});
```

### Slide Animation
```tsx
const x = interpolate(
  frame,
  [0, 60],
  [-100, 0],  // Start off-screen left, end at 0
  { extrapolateRight: 'clamp' }
);
```

### Sequential Animations
```tsx
// First animation: frames 0-30
const step1 = interpolate(frame, [0, 30], [0, 1]);

// Second animation: frames 30-60
const step2 = interpolate(frame, [30, 60], [0, 1]);

// Third animation: frames 60-90
const step3 = interpolate(frame, [60, 90], [0, 1]);
```

### Counter Animation
```tsx
const displayNumber = Math.floor(
  interpolate(frame, [0, 60], [0, 100])
);
```

---

## 🎬 Rendering Options

### Render specific composition
```bash
npx remotion render src/Root.tsx CompositionId output.mp4
```

### Custom resolution
```bash
npx remotion render src/Root.tsx MyVideo out.mp4 --width=1280 --height=720
```

### Custom props
```bash
npx remotion render src/Root.tsx MyVideo out.mp4 --props='{"title":"Custom"}'
```

### Different formats
```bash
# MP4 (default)
npx remotion render src/Root.tsx MyVideo out.mp4

# WebM
npx remotion render src/Root.tsx MyVideo out.webm

# GIF
npx remotion render src/Root.tsx MyVideo out.gif

# Image sequence
npx remotion render src/Root.tsx MyVideo out --sequence
```

---

## 🐛 Troubleshooting

**"Cannot find module"**: Make sure you're in the prototypes folder
```bash
cd /Users/emmanuelbriand/Documents/workspace/gardenflow/prototypes
```

**Port already in use**: Kill the process or use a different port
```bash
npx remotion studio --port=3001
```

**FFmpeg not found**: Install FFmpeg
```bash
# macOS
brew install ffmpeg

# Linux
sudo apt install ffmpeg
```

---

## 🎯 Next Steps

1. **Modify existing videos**: Edit `GardenIntro.tsx` or `CropTimeline.tsx`
2. **Create new compositions**: Add files to `src/compositions/`
3. **Use real data**: Fetch data from your API and visualize it
4. **Add audio**: Import audio files and use `<Audio>` component
5. **Export frames**: Generate image sequences for social media

## 📖 Learn More

- [Remotion Docs](https://www.remotion.dev/docs)
- [Animation Examples](https://www.remotion.dev/docs/animate)
- [Video Showcase](https://www.remotion.dev/showcase)
