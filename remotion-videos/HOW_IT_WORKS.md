# How Remotion Works - Visual Guide

## 📂 File Structure & Flow

```
remotion-videos/
│
├── src/
│   ├── index.ts                 👈 ENTRY POINT
│   │   └── Calls registerRoot()
│   │       └── Registers RemotionRoot component
│   │
│   ├── Root.tsx                 👈 COMPOSITION REGISTRY
│   │   └── Defines all video compositions
│   │       ├── GardenIntro
│   │       └── CropTimeline
│   │
│   └── compositions/            👈 VIDEO COMPONENTS
│       ├── GardenIntro.tsx
│       └── CropTimeline.tsx
│
└── remotion.config.ts          👈 SETTINGS
```

## 🔄 How Videos Are Created

### Step 1: Entry Point (`index.ts`)
```
index.ts calls registerRoot(RemotionRoot)
    ↓
Remotion knows where to find your compositions
```

### Step 2: Composition Registry (`Root.tsx`)
```tsx
<Composition
  id="GardenIntro"           // Name for CLI rendering
  component={GardenIntro}     // Your React component
  durationInFrames={300}      // 10 seconds at 30fps
  fps={30}                    // Frames per second
  width={1920}                // Video dimensions
  height={1080}
  defaultProps={{...}}        // Data for your component
/>
```

### Step 3: Frame-by-Frame Rendering
```
Frame 0  → React renders GardenIntro with frame=0
Frame 1  → React renders GardenIntro with frame=1
Frame 2  → React renders GardenIntro with frame=2
...
Frame 300 → React renders GardenIntro with frame=300

Each frame = one screenshot
All frames combined = video!
```

## 🎬 Animation Timeline Example

Let's say you want text to fade in over 2 seconds at 30fps:

```
2 seconds × 30fps = 60 frames

Timeline:
Frame 0    Frame 30   Frame 60
|----------|----------|
opacity=0  opacity=0.5 opacity=1
   ↓          ↓          ↓
[Invisible][Fading][Fully visible]
```

Code:
```tsx
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 60], [0, 1]);
```

## 🧮 Frame Calculations

```tsx
const frame = useCurrentFrame();  // Current frame number
const { fps } = useVideoConfig(); // Frames per second

// Convert frames to seconds
const seconds = frame / fps;

// Examples at 30fps:
// frame=0   → 0 seconds
// frame=30  → 1 second
// frame=60  → 2 seconds
// frame=300 → 10 seconds
```

## 🎨 Animation Patterns

### 1. Linear Animation
```
Value changes at constant speed

Frame:  0   30   60   90
Value:  0   100  200  300
Graph:  /
       /
      /
```

```tsx
const x = interpolate(frame, [0, 90], [0, 300]);
```

### 2. Spring Animation
```
Natural physics (bounces at the end)

Frame:  0   30   60   90
Value:  0   80   110  100
Graph:     ╱‾‾╲
          ╱    ╲_
         ╱
```

```tsx
const x = spring({ frame, fps });
```

### 3. Easing Animation
```
Starts slow, speeds up, ends slow

Frame:  0   30   60   90
Value:  0   20   90   100
Graph:        ╱
            ╱
          ╱
        ╱
```

```tsx
const x = interpolate(frame, [0, 90], [0, 100], {
  easing: Easing.bezier(0.65, 0, 0.35, 1)
});
```

## 🎯 Real Example: Fade In Title

```tsx
export const MyVideo = () => {
  const frame = useCurrentFrame();

  // Fade in over first 30 frames (1 second at 30fps)
  const opacity = interpolate(
    frame,        // Current frame: 0, 1, 2, 3...
    [0, 30],     // Input range: start at frame 0, end at frame 30
    [0, 1],      // Output range: opacity 0 to 1
    { extrapolateRight: 'clamp' }  // Stay at 1 after frame 30
  );

  return (
    <div style={{ opacity }}>
      <h1>Hello World</h1>
    </div>
  );
};
```

**What happens:**
- Frame 0: opacity = 0 (invisible)
- Frame 15: opacity = 0.5 (half visible)
- Frame 30: opacity = 1 (fully visible)
- Frame 31+: opacity = 1 (stays visible)

## 🎭 Sequential Animations

Want multiple things to happen one after another?

```tsx
const frame = useCurrentFrame();

// Step 1: Title fades in (frames 0-30)
const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp'
});

// Step 2: Subtitle fades in (frames 30-60)
const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp'
});

// Step 3: Button appears (frames 60-90)
const buttonScale = interpolate(frame, [60, 90], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp'
});
```

**Timeline:**
```
Frames:     0        30        60        90
            |--------|---------|---------|
Title:      [fade in]
Subtitle:            [fade in]
Button:                        [scale up]
```

## 🔧 Common Patterns Cheat Sheet

### Fade In
```tsx
interpolate(frame, [0, 30], [0, 1])
```

### Fade Out
```tsx
interpolate(frame, [270, 300], [1, 0])
```

### Slide from Left
```tsx
interpolate(frame, [0, 30], [-100, 0])
```

### Slide to Right
```tsx
interpolate(frame, [0, 30], [0, 100])
```

### Scale Up (Zoom In)
```tsx
interpolate(frame, [0, 30], [0, 1])
```

### Rotate
```tsx
interpolate(frame, [0, 90], [0, 360])
```

### Counter Animation
```tsx
Math.floor(interpolate(frame, [0, 60], [0, 100]))
```

### Bouncy Entrance
```tsx
spring({ frame, fps, config: { damping: 100 } })
```

## 🎬 Studio vs Render

### Studio Mode (`npm run video:preview`)
- Interactive preview in browser
- Scrub through timeline
- Edit props in real-time
- See changes immediately
- Perfect for development

### Render Mode (`npm run video:render-intro`)
- Exports actual video file
- Uses FFmpeg under the hood
- Takes time to process
- Creates MP4/WebM/GIF
- Perfect for production

## 💡 Pro Tips

1. **Think in frames, not seconds**
   - At 30fps: 30 frames = 1 second
   - Mental math: frames ÷ 30 = seconds

2. **Use extrapolate options**
   - `'clamp'`: Stop at range limits
   - `'extend'`: Continue the pattern
   - Prevents weird values outside your range

3. **Spring for natural motion**
   - Use for entrances/exits
   - More realistic than linear
   - Users perceive it as higher quality

4. **Preview before rendering**
   - Rendering takes time
   - Always check in studio first
   - Adjust timing visually

5. **Start simple**
   - One animation at a time
   - Get timing right
   - Then add complexity

## 🚀 You're Ready!

Now you understand:
- ✅ How files connect together
- ✅ How frames become videos
- ✅ How to animate values
- ✅ Common animation patterns

**Next step**: Run `npm run video:preview` and explore! 🎉
