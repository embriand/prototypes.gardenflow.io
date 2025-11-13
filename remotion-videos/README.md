# GardenFlow Video Prototypes with Remotion

This folder contains video prototypes created with Remotion for the GardenFlow project.

## What is Remotion?

Remotion is a framework for creating videos programmatically using React. It allows you to:
- Write video components using React
- Use CSS, animations, and all web technologies
- Leverage frame-based animations with `useCurrentFrame()` hook
- Render videos to MP4, WebM, and other formats

## How Remotion Works

### Core Concepts

1. **Frame-based rendering**: Each frame is a React component render
   ```tsx
   const frame = useCurrentFrame(); // Returns 0, 1, 2, 3...
   const { fps } = useVideoConfig(); // Frames per second
   ```

2. **Interpolation**: Smoothly animate values over time
   ```tsx
   const opacity = interpolate(frame, [0, 30], [0, 1]); // 0→1 over 30 frames
   ```

3. **Compositions**: Define your video templates
   ```tsx
   <Composition
     id="MyVideo"
     component={MyVideo}
     durationInFrames={150}  // 5 seconds at 30fps
     fps={30}
     width={1920}
     height={1080}
   />
   ```

### Animation Flow

```
Timeline: [Frame 0] → [Frame 30] → [Frame 60] → [Frame 90]...
          |          |            |            |
          ↓          ↓            ↓            ↓
     useCurrentFrame() gives you the current frame number
          ↓          ↓            ↓            ↓
     interpolate() calculates intermediate values
          ↓          ↓            ↓            ↓
     React renders your component with those values
```

## Available Commands

### Preview Videos in Browser
```bash
npm run video:preview
```
Opens an interactive studio where you can:
- See all your compositions
- Scrub through the timeline
- Change props in real-time
- Preview before rendering

### Render Videos

Render a specific composition:
```bash
npm run video:render-intro      # Renders GardenIntro to out/garden-intro.mp4
npm run video:render-timeline   # Renders CropTimeline to out/crop-timeline.mp4
```

Or render with custom parameters:
```bash
npx remotion render remotion-videos/src/Root.tsx GardenIntro out/my-video.mp4
```

## Project Structure

```
remotion-videos/
├── src/
│   ├── Root.tsx                    # Register all compositions here
│   └── compositions/
│       ├── GardenIntro.tsx        # Garden introduction video
│       └── CropTimeline.tsx       # Crop growth timeline animation
├── remotion.config.ts             # Remotion configuration
└── README.md                      # This file
```

## Example Compositions

### 1. GardenIntro
A welcoming video that introduces the garden with:
- Animated title with spring physics
- Fading subtitle
- Plant count with counter animation
- Animated gradient background

**Props:**
- `gardenName`: string - Name of the garden
- `plantCount`: number - Number of plants

### 2. CropTimeline
An animated timeline showing crop growth stages:
- Timeline progress bar
- Stage markers (sowing, germination, growth, flowering, harvest)
- Date display with day counter
- Smooth transitions between stages

**Props:**
- `cropName`: string - Name of the crop
- `sowingDate`: string - Start date (YYYY-MM-DD)
- `harvestDate`: string - Harvest date (YYYY-MM-DD)

### 3. CropCreationCompact (Production Tutorial Video)
A complete 38-second tutorial showing how to create a crop in GardenFlow, with synchronized French voiceover.

**8 Scenes:**
1. **Title Screen** (0-4.5s): GardenFlow branding + "Créer une culture en 4 étapes simples"
2. **FAB Click** (4.5-7.5s): Crop planner context with Gantt chart + FAB button
3. **Plant Selection** (7.5-12s): Category badges + family selection + order/quantity fields
4. **Location Selection** (12-18s): Project → Parcel → Zone sequential flow
5. **Timeline Planning** (18-24s): Sowing/harvest date selection with visual calendar
6. **Harvest Planning** (24-27.5s): Quantity and unit fields (NOT dates)
7. **Save & Gantt Result** (27.5-32.5s): Crop appearing in Gantt chart
8. **Success Screen** (32.5-38s): "Culture créée !" with GardenFlow branding

**Duration:** 1140 frames (38 seconds at 30fps)
**Resolution:** 1920x1080
**Voiceover:** French, 8 audio segments synchronized with scenes

## Creating New Videos

1. Create a new component in `src/compositions/`
2. Register it in `src/Root.tsx`:
   ```tsx
   <Composition
     id="MyNewVideo"
     component={MyNewVideo}
     durationInFrames={300}
     fps={30}
     width={1920}
     height={1080}
   />
   ```
3. Preview with `npm run video:preview`
4. Render with `npx remotion render ... MyNewVideo out/video.mp4`

## Tips

- **Use `interpolate()`** for smooth transitions
- **Spring animations** (`spring()`) for natural physics
- **Easing functions** for custom animation curves
- **Frame calculations**: `seconds = frame / fps`
- **Context values**: `useVideoConfig()` for fps, dimensions, duration

## Creating Tutorial Videos with Voiceover

### Complete Workflow: Crop Creation Tutorial

This section documents the full process to create a production-ready tutorial video with French voiceover.

#### Step 1: Design & Requirements

Create a requirements document (e.g., `VIDEO_REQUIREMENTS.md`) with:
- Scene breakdown with precise timings
- Voiceover script in target language
- UI specifications matching the real app
- Color palette and branding guidelines
- Common mistakes to avoid

**Key Requirements:**
- Match real app structure (reference `../../app.gardenflow.io/src/components/`)
- Use lowercase for titles (e.g., "Créer une culture" not "CRÉER UNE CULTURE")
- Include GardenFlow gradient branding
- Show realistic context (Gantt rows, skeleton data)
- Accurate field labels and flows

#### Step 2: Build Video Composition

```bash
# 1. Edit composition in src/compositions/CropCreationCompact.tsx
# 2. Preview in real-time
npm run video:preview

# 3. Render video without audio
npx remotion render src/Root.tsx CropCreationCompact ../out/crop-creation-compact.mp4
```

**Composition Structure:**
```tsx
export const CropCreationCompact: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={135}>
        <TitleScene />
      </Sequence>
      <Sequence from={135} durationInFrames={90}>
        <FABClickScene />
      </Sequence>
      {/* ...more scenes */}
    </AbsoluteFill>
  );
};
```

#### Step 3: Generate French Voiceover

Create voiceover script file (`VOICEOVER_SCRIPT.md`) with 8 segments, then generate audio:

```bash
#!/bin/bash
# File: generate_voiceover.sh

mkdir -p voiceover

# Scene 1 (0-4.5s)
gtts-cli "Découvrez comment créer une nouvelle culture en 4 étapes simples." \
  --lang fr \
  --output voiceover/voice_01_intro.mp3

# Scene 2 (4.5-7.5s)
gtts-cli "Commencez en cliquant sur le bouton plus." \
  --lang fr \
  --output voiceover/voice_02_fab.mp3

# Scene 3 (7.5-12s)
gtts-cli "Sélectionnez d'abord la famille de plante, par exemple tomates, puis indiquez l'ordre et la quantité." \
  --lang fr \
  --output voiceover/voice_03_plant.mp3

# Scene 4 (12-18s)
gtts-cli "Choisissez ensuite l'emplacement : d'abord le projet, puis la parcelle, et enfin la zone concernée." \
  --lang fr \
  --output voiceover/voice_04_location.mp3

# Scene 5 (18-24s)
gtts-cli "Définissez les périodes de semis et de récolte en consultant le calendrier intégré pour optimiser votre planning." \
  --lang fr \
  --output voiceover/voice_05_timing.mp3

# Scene 6 (24-27.5s)
gtts-cli "Estimez votre production en indiquant la quantité et l'unité de récolte attendue." \
  --lang fr \
  --output voiceover/voice_06_harvest.mp3

# Scene 7 (27.5-32.5s)
gtts-cli "Enregistrez votre culture. Elle apparaît immédiatement dans votre planification Gantt." \
  --lang fr \
  --output voiceover/voice_07_save.mp3

# Scene 8 (32.5-38s)
gtts-cli "Votre culture est créée ! Commencez dès maintenant à planifier votre jardin avec GardenFlow." \
  --lang fr \
  --output voiceover/voice_08_final.mp3

chmod +x generate_voiceover.sh
./generate_voiceover.sh
```

**Verify audio durations:**
```bash
for file in voiceover/*.mp3; do
  echo "$(basename $file): $(ffprobe -i "$file" -show_entries format=duration -v quiet -of csv="p=0") seconds"
done
```

#### Step 4: Synchronize Audio with Video

Use FFmpeg to overlay voiceover segments at precise timestamps:

```bash
#!/bin/bash
# File: add_voiceover_clean.sh

# Scene timings (in milliseconds):
# Scene 1: 0ms
# Scene 2: 4500ms
# Scene 3: 7500ms
# Scene 4: 12000ms
# Scene 5: 18000ms
# Scene 6: 24000ms
# Scene 7: 27500ms
# Scene 8: 32500ms

ffmpeg -y \
  -i ../out/crop-creation-compact.mp4 \
  -i voiceover/voice_01_intro.mp3 \
  -i voiceover/voice_02_fab.mp3 \
  -i voiceover/voice_03_plant.mp3 \
  -i voiceover/voice_04_location.mp3 \
  -i voiceover/voice_05_timing.mp3 \
  -i voiceover/voice_06_harvest.mp3 \
  -i voiceover/voice_07_save.mp3 \
  -i voiceover/voice_08_final.mp3 \
  -filter_complex "\
    [1]adelay=0|0[a1];\
    [2]adelay=4500|4500[a2];\
    [3]adelay=7500|7500[a3];\
    [4]adelay=12000|12000[a4];\
    [5]adelay=18000|18000[a5];\
    [6]adelay=24000|24000[a6];\
    [7]adelay=27500|27500[a7];\
    [8]adelay=32500|32500[a8];\
    [a1][a2][a3][a4][a5][a6][a7][a8]amix=inputs=8:duration=longest:dropout_transition=0[aout]" \
  -map 0:v:0 -map "[aout]" \
  -c:v copy -c:a aac -b:a 192k \
  ../out/crop-creation-with-voiceover.mp4

echo "✓ Video with synchronized voiceover created!"
ls -lh ../out/crop-creation-with-voiceover.mp4
```

**Key FFmpeg Parameters:**
- `-map 0:v:0`: Map only video stream (no original audio)
- `adelay=X|X`: Delay audio in milliseconds (stereo: left|right)
- `amix=inputs=8:duration=longest`: Mix 8 audio streams, keep full duration
- `dropout_transition=0`: No fade between segments (instant transitions)
- `-c:v copy`: Don't re-encode video (faster)
- `-c:a aac -b:a 192k`: Encode audio to AAC at 192kbps

#### Step 5: Verify Synchronization

```bash
# Play video to verify timing
open ../out/crop-creation-with-voiceover.mp4

# Check video properties
ffprobe -i ../out/crop-creation-with-voiceover.mp4 -show_entries format=duration -v quiet -of csv="p=0"
# Should output: 38.000000

# Verify video has only one audio stream
ffprobe -i ../out/crop-creation-with-voiceover.mp4 -show_streams -select_streams a -v quiet
```

#### Step 6: Publish to API Storage

```bash
# Copy to API storage directory
cp ../out/crop-creation-with-voiceover.mp4 \
   ../../api.gardenflow.io/storage/media/videos/crop-creation-tutorial-with-voice.mp4

# Verify file was copied
ls -lh ../../api.gardenflow.io/storage/media/videos/
```

#### Step 7: Configure Backend & Frontend

**Backend** (`api.gardenflow.io/src/app.ts`):
```typescript
import path from 'path';

// Serve media files from storage directory
app.use('/storage', express.static(path.join(__dirname, '../storage')));
```

**Frontend** (`app.gardenflow.io/vite.config.ts`):
```typescript
server: {
  proxy: {
    '/storage': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

**Component Usage** (`app.gardenflow.io/src/components/crop-planner/TutorialDropdown.tsx`):
```typescript
const tutorials: TutorialOption[] = [
  {
    id: 'crop-creation-tutorial',
    type: 'video',
    title: t('cropPlanner.tutorial.videoIntro.title', 'How to Create a Crop'),
    description: t('cropPlanner.tutorial.videoIntro.description', 'Step-by-step guide'),
    videoUrl: '/storage/media/videos/crop-creation-tutorial-with-voice.mp4',
    hasVoiceover: true
  }
];
```

#### Troubleshooting

**Audio not synchronized:**
- Verify scene durations match audio lengths
- Check FFmpeg adelay values in milliseconds
- Ensure `duration=longest` to avoid cutting audio

**Video too short for audio:**
- Calculate total audio duration: sum all MP3 durations
- Adjust scene `durationInFrames` in composition
- Re-render video before adding audio

**Double/overlapping audio:**
- Use `-map 0:v:0` to extract only video stream
- Ensure original video has no audio track
- Use `dropout_transition=0` for clean transitions

**File not accessible:**
- Verify storage path: `../../api.gardenflow.io/storage/media/videos/`
- Check API server static file configuration
- Confirm Vite proxy forwards `/storage` requests
- Test URL: `http://localhost:3000/storage/media/videos/filename.mp4`

## Resources

- [Remotion Documentation](https://www.remotion.dev/docs)
- [Remotion Examples](https://www.remotion.dev/showcase)
- [Animation Helpers](https://www.remotion.dev/docs/animation-helpers)
- [FFmpeg Audio Filters](https://ffmpeg.org/ffmpeg-filters.html#Audio-Filters)
- [Google TTS CLI (gtts-cli)](https://pypi.org/project/gTTS/)
