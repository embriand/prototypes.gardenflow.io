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

### 3. CropCreationCompact (Production Tutorial Video with Multi-Language Support)
A complete 38-second tutorial showing how to create a crop in GardenFlow, available in multiple languages with synchronized voiceovers.

**8 Scenes:**
1. **Title Screen** (0-4.5s): GardenFlow branding + "Create a crop in 4 simple steps"
2. **FAB Click** (4.5-7.5s): Crop planner context with Gantt chart + FAB button
3. **Plant Selection** (7.5-12s): Category badges + family selection + order/quantity fields
4. **Location Selection** (12-18s): Project → Parcel → Zone sequential flow
5. **Timeline Planning** (18-24s): Sowing/harvest date selection with visual calendar
6. **Harvest Planning** (24-27.5s): Quantity and unit fields (NOT dates)
7. **Save & Gantt Result** (27.5-32.5s): Crop appearing in Gantt chart
8. **Success Screen** (32.5-38s): "Crop created!" with GardenFlow branding

**Duration:** 1140 frames (38 seconds at 30fps)
**Resolution:** 1920x1080
**Supported Languages:** French (fr), English (en), German (de), Spanish (es), Korean (ko)
**Features:**
- Fully translated UI elements (buttons, labels, plant names, locations)
- Language-specific voiceovers (8 audio segments per language)
- Automatic language selection in app based on user's language preference

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

## Creating Multi-Language Tutorial Videos

### Overview

The video system supports multiple languages with fully translated UI elements and synchronized voiceovers. All translations are centralized in `src/translations/cropCreationTranslations.ts`.

### Recent Updates (November 2025)

**Fixed: Category Badges Hardcoded in French**

Issue: Category badges (All/Vegetables/Fruits/Herbs) were hardcoded in French in `CropCreationCompact.tsx`, causing all language versions to show French text.

**What was fixed:**
- Added `categoryAll`, `categoryVegetables`, `categoryFruits`, `categoryHerbs` to translations interface
- Added translations for all 5 languages (fr, en, de, es, ko)
- Updated component to use `t.categoryAll`, `t.categoryVegetables`, etc. instead of hardcoded strings
- Re-rendered all language videos with corrected translations
- Updated deployment: All videos (EN, DE, ES, KO) deployed to API storage with proper translations

**Files changed:**
- `src/translations/cropCreationTranslations.ts` (lines 47-51, 124-128, 200-204, 276-280, 352-356, 428-432)
- `src/compositions/CropCreationCompact.tsx` (lines 373-377)

**Lesson learned:** ALWAYS verify the component uses translation variables for ALL text elements before rendering any language version. Hardcoded strings will propagate to all videos.

**Deployment Status:**
All corrected videos have been deployed to API storage:
- ✅ `crop-creation-tutorial-with-voice-en.mp4` (1.4M) - English with voiceover
- ✅ `crop-creation-tutorial-with-voice-de.mp4` (1.4M) - German with voiceover
- ✅ `crop-creation-tutorial-with-voice-es.mp4` (1.4M) - Spanish with voiceover
- ✅ `crop-creation-tutorial-with-voice-ko.mp4` (1.3M) - Korean with voiceover
- ✅ French video (`crop-creation-tutorial-with-voice.mp4`) was created previously

**Currently Supported Languages:**
- French (fr) - Base language
- English (en)
- German (de)
- Spanish (es)
- Korean (ko)

### Translation System Architecture

**Translation File** (`src/translations/cropCreationTranslations.ts`):
```typescript
export type Language = 'fr' | 'en' | 'de' | 'es' | 'ko';

interface Translations {
  title: string;
  subtitle: string;
  modalTitle: string;
  // ... all UI text elements
  plantFamilyValue: string;      // e.g., "🍅 Tomatoes"
  plantVarietyValue: string;     // e.g., "Cherry Tomato"
  parcelValue: string;           // e.g., "North Square"
  zoneValue: string;             // e.g., "Zone A - Full Sun"
  cropName: string;              // e.g., "🍅 Tomatoes"
  // ... more fields
}

export const translations: Record<Language, Translations> = {
  fr: { /* French translations */ },
  en: { /* English translations */ },
  de: { /* German translations */ },
  es: { /* Spanish translations */ },
  ko: { /* Korean translations */ }
};
```

**Composition Registration** (`src/Root.tsx`):
```typescript
// Register a composition for each language
<Composition
  id="CropCreationCompact-EN"
  component={CropCreationCompact}
  durationInFrames={1140}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{ appName: 'GardenFlow', language: 'en' as const }}
/>
<Composition
  id="CropCreationCompact-DE"
  component={CropCreationCompact}
  defaultProps={{ language: 'de' as const }}
  // ... same other props
/>
// ... repeat for ES, KO
```

### Critical Requirements Before Rendering

**⚠️ IMPORTANT: Verify All UI Elements Use Translations**

Before rendering any video, you MUST verify that the composition uses translation variables for ALL text elements. Hardcoded strings will appear in the wrong language across all language versions.

**Common Hardcoded Text Locations:**

1. **Category Badges** (`src/compositions/CropCreationCompact.tsx` line ~374):
   ```tsx
   // ❌ WRONG - Hardcoded French text
   <CategoryBadge label="Tous" active color="#3b82f6" />
   <CategoryBadge label="🥬 Légumes" color="#10b981" />

   // ✅ CORRECT - Using translation variables
   <CategoryBadge label={t.categoryAll} active color="#3b82f6" />
   <CategoryBadge label={t.categoryVegetables} color="#10b981" />
   ```

2. **Plant Names and Values**: Use `t.plantFamilyValue`, `t.plantVarietyValue`
3. **Location Names**: Use `t.parcelValue`, `t.zoneValue`, `t.projectValue`
4. **Crop Names**: Use `t.cropName` in Gantt chart rows
5. **All UI Labels**: Use `t.plantFamily`, `t.parcel`, etc.

**Verification Checklist:**

Before rendering, search the component for hardcoded strings:
```bash
# Search for potential hardcoded text (excluding imports and comments)
grep -n "label=\"[A-Z]" src/compositions/CropCreationCompact.tsx
grep -n "value=\"[A-Z]" src/compositions/CropCreationCompact.tsx

# Look for emoji patterns (often in hardcoded plant names)
grep -n "\"🥬\|\"🍅\|\"🍓\|\"🌿" src/compositions/CropCreationCompact.tsx
```

**What to Check:**
- All `<CategoryBadge label=` use `t.category*`
- All dropdown values use `t.*Value` variables
- All form labels use `t.*` translation keys
- No French/English/etc. words in quotes (except in translations file)
- All months use `t.january`, `t.february`, etc.

### Complete Workflow: Adding a New Language

#### Step 1: Add Translations

Edit `src/translations/cropCreationTranslations.ts`:

```typescript
// 1. Update Language type
export type Language = 'fr' | 'en' | 'de' | 'es' | 'ko' | 'ja'; // Add 'ja' for Japanese

// 2. Add complete translation set
export const translations: Record<Language, Translations> = {
  // ... existing languages
  ja: {
    title: '作物を作成',
    subtitle: '4つの簡単なステップで',
    modalTitle: '作物を作成',
    tabPlant: '植物',
    tabLocation: '場所',
    tabPlanning: '計画',
    tabHarvest: '収穫',
    // ... translate ALL fields
    plantFamilyValue: '🍅 トマト',
    plantVarietyValue: 'チェリートマト',
    parcelValue: '北区画',
    zoneValue: 'ゾーン A - 日当たり良好',
    cropName: '🍅 トマト',
    // ... complete all translations
  }
};
```

**Important:** Translate ALL fields including:
- UI labels (buttons, tabs, form fields)
- Example values (plant names, locations, project names)
- Success messages and calls-to-action

#### Step 2: Register Composition

Add to `src/Root.tsx`:

```typescript
<Composition
  id="CropCreationCompact-JA"
  component={CropCreationCompact}
  durationInFrames={1140}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    appName: 'GardenFlow',
    language: 'ja' as const
  }}
/>
```

#### Step 3: Create Voiceover Script

Create `VOICEOVER_SCRIPT_JA.md`:

```markdown
# Japanese Voiceover Script

## Scene 1 (0-4.5s) - Title Screen
**Script:** 「4つの簡単なステップで作物を作成します。」
**Duration:** ~3.5s

## Scene 2 (4.5-7.5s) - FAB Click
**Script:** 「プラスボタンをクリックします。」
**Duration:** ~2.5s

## Scene 3 (7.5-12s) - Plant Selection
**Script:** 「トマトなどの植物の種類を選択し、順序と数量を指定します。」
**Duration:** ~4.0s

## Scene 4 (12-18s) - Location Selection
**Script:** 「場所を選択してください：プロジェクト、区画、ゾーン。」
**Duration:** ~5.5s

## Scene 5 (18-24s) - Timeline Planning
**Script:** 「カレンダーで播種と収穫の時期を設定します。」
**Duration:** ~5.5s

## Scene 6 (24-27.5s) - Harvest Planning
**Script:** 「予想収穫量と単位を入力します。」
**Duration:** ~3.0s

## Scene 7 (27.5-32.5s) - Save & Gantt
**Script:** 「保存してください。ガントチャートに作物が表示されます。」
**Duration:** ~4.5s

## Scene 8 (32.5-38s) - Success
**Script:** 「作物の作成が完了しました！今すぐGardenFlowを始めましょう。」
**Duration:** ~5.0s
```

**Script Guidelines:**
- Keep sentences concise to fit within scene durations
- Use natural, conversational language
- Test audio duration matches available time (use `ffprobe`)
- If audio is too long, shorten script and regenerate

#### Step 4: Generate Voiceover Audio

Create `generate_voiceover_ja.sh`:

```bash
#!/bin/bash

echo "Generating Japanese voiceover files..."
mkdir -p voiceover-ja

# Scene 1 (0-4.5s) - 4.5s available
gtts-cli "4つの簡単なステップで作物を作成します。" \
  --lang ja \
  --output voiceover-ja/voice_01_intro.mp3

# Scene 2 (4.5-7.5s) - 3.0s available
gtts-cli "プラスボタンをクリックします。" \
  --lang ja \
  --output voiceover-ja/voice_02_fab.mp3

# Scene 3 (7.5-12s) - 4.5s available
gtts-cli "トマトなどの植物の種類を選択し、順序と数量を指定します。" \
  --lang ja \
  --output voiceover-ja/voice_03_plant.mp3

# Scene 4 (12-18s) - 6.0s available
gtts-cli "場所を選択してください：プロジェクト、区画、ゾーン。" \
  --lang ja \
  --output voiceover-ja/voice_04_location.mp3

# Scene 5 (18-24s) - 6.0s available
gtts-cli "カレンダーで播種と収穫の時期を設定します。" \
  --lang ja \
  --output voiceover-ja/voice_05_timing.mp3

# Scene 6 (24-27.5s) - 3.5s available
gtts-cli "予想収穫量と単位を入力します。" \
  --lang ja \
  --output voiceover-ja/voice_06_harvest.mp3

# Scene 7 (27.5-32.5s) - 5.0s available
gtts-cli "保存してください。ガントチャートに作物が表示されます。" \
  --lang ja \
  --output voiceover-ja/voice_07_save.mp3

# Scene 8 (32.5-38s) - 5.5s available
gtts-cli "作物の作成が完了しました！今すぐGardenFlowを始めましょう。" \
  --lang ja \
  --output voiceover-ja/voice_08_final.mp3

echo ""
echo "✓ All Japanese voiceover files generated!"
echo ""

# Show durations
for file in voiceover-ja/voice_*.mp3; do
  duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$file" 2>&1)
  echo "$file: ${duration}s"
done
```

Run the script:
```bash
chmod +x generate_voiceover_ja.sh
./generate_voiceover_ja.sh
```

**Verify audio durations fit within scenes:**
- If any clip is too long, shorten the script and regenerate
- Optionally use FFmpeg `atempo` filter to speed up audio (max 1.5x recommended)

#### Step 5: Verify Component Before Rendering

**CRITICAL STEP - Do NOT skip this!**

Before rendering, verify that the component uses translation variables:

```bash
cd /Users/emmanuelbriand/Documents/workspace/gardenflow/prototypes/remotion-videos

# Check for hardcoded strings (should return nothing or only translation file references)
grep -n "label=\"[A-Z]" src/compositions/CropCreationCompact.tsx
grep -n "\"🥬\|\"🍅\|\"🍓\|\"🌿\|Tous\|Légumes\|Fruits\|Herbes" src/compositions/CropCreationCompact.tsx

# If any hardcoded strings are found, fix them BEFORE rendering!
```

**Preview the video in browser to visually verify:**
```bash
npm run video:preview
# Select your language composition (e.g., CropCreationCompact-JA)
# Verify all text appears in the correct language
```

#### Step 6: Render Video

```bash
cd /Users/emmanuelbriand/Documents/workspace/gardenflow/prototypes

# ONLY render after verifying translations are correct!
npx remotion render remotion-videos/src/index.ts CropCreationCompact-JA out/crop-creation-compact-ja.mp4
```

**Note:** If you render before fixing hardcoded strings, you'll have to re-render all language versions!

#### Step 7: Add Voiceover to Video

Create `add_voiceover_ja.sh`:

```bash
#!/bin/bash

echo "Adding Japanese voiceover to video..."
echo ""

ffmpeg -y \
  -i ../out/crop-creation-compact-ja.mp4 \
  -i voiceover-ja/voice_01_intro.mp3 \
  -i voiceover-ja/voice_02_fab.mp3 \
  -i voiceover-ja/voice_03_plant.mp3 \
  -i voiceover-ja/voice_04_location.mp3 \
  -i voiceover-ja/voice_05_timing.mp3 \
  -i voiceover-ja/voice_06_harvest.mp3 \
  -i voiceover-ja/voice_07_save.mp3 \
  -i voiceover-ja/voice_08_final.mp3 \
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
  ../out/crop-creation-with-voiceover-ja.mp4

echo ""
echo "✓ Japanese video with synchronized voiceover created!"
echo "Output: out/crop-creation-with-voiceover-ja.mp4"
echo ""
ls -lh ../out/crop-creation-with-voiceover-ja.mp4
```

Run the script:
```bash
chmod +x add_voiceover_ja.sh
./add_voiceover_ja.sh
```

#### Step 8: Deploy to API Storage

```bash
# Copy to API storage with language-specific filename
cp ../out/crop-creation-with-voiceover-ja.mp4 \
   ../../api.gardenflow.io/storage/media/videos/crop-creation-tutorial-with-voice-ja.mp4

# Verify deployment
ls -lh ../../api.gardenflow.io/storage/media/videos/crop-creation-tutorial-with-voice*.mp4
```

#### Step 9: Add App Translations

Add to `app.gardenflow.io/src/i18n/locales/ja/cropPlanner.json`:

```json
{
  "tutorial": {
    "title": "チュートリアル",
    "ariaLabel": "チュートリアルオプションを表示",
    "menuTitle": "学習リソース",
    "menuDescription": "学習方法を選択してください",
    "withVoice": "音声",
    "voiceoverEnabled": "ナレーション有効",
    "videoNotSupported": "お使いのブラウザはビデオタグをサポートしていません。",
    "videoNotAvailable": "ビデオが利用できません",
    "videoIntro": {
      "title": "作物の作成方法",
      "description": "プランナーに作物を追加するステップバイステップガイド"
    },
    "interactive": {
      "title": "インタラクティブツアー",
      "description": "機能のステップバイステップウォークスルー"
    },
    "management": {
      "title": "作物の管理",
      "description": "作物管理の高度なテクニック"
    }
  }
}
```

### Video Naming Convention

**Pattern:** `crop-creation-tutorial-with-voice-{lang}.mp4`

**Examples:**
- French (base): `crop-creation-tutorial-with-voice.mp4`
- English: `crop-creation-tutorial-with-voice-en.mp4`
- German: `crop-creation-tutorial-with-voice-de.mp4`
- Spanish: `crop-creation-tutorial-with-voice-es.mp4`
- Korean: `crop-creation-tutorial-with-voice-ko.mp4`
- Japanese: `crop-creation-tutorial-with-voice-ja.mp4`

The app automatically selects the correct video based on the user's language:

```typescript
// app.gardenflow.io/src/components/crop-planner/TutorialDropdown.tsx
const currentLanguage = i18n.language;
const videoSuffix = currentLanguage === 'fr' ? '' : `-${currentLanguage}`;
const videoUrl = `/storage/media/videos/crop-creation-tutorial-with-voice${videoSuffix}.mp4`;
```

### Audio Duration Guidelines

Each scene has a specific time budget. Keep voiceover scripts concise to fit:

| Scene | Duration | Available Time |
|-------|----------|----------------|
| 1. Title | 0-4.5s | 4.5s |
| 2. FAB Click | 4.5-7.5s | 3.0s |
| 3. Plant Selection | 7.5-12s | 4.5s |
| 4. Location | 12-18s | 6.0s |
| 5. Timeline | 18-24s | 6.0s |
| 6. Harvest | 24-27.5s | 3.5s |
| 7. Save | 27.5-32.5s | 5.0s |
| 8. Success | 32.5-38s | 5.5s |

**Tips:**
- Leave 0.2-0.5s buffer for natural pauses
- Test audio with `ffprobe` before adding to video
- If audio is too long, simplify the script or use FFmpeg `atempo` filter (max 1.5x speed)
- Verify synchronization by playing the final video

### Batch Processing Multiple Languages

To render all languages in parallel:

```bash
#!/bin/bash
# File: render_all_languages.sh

cd /Users/emmanuelbriand/Documents/workspace/gardenflow/prototypes

# Render videos in parallel
npx remotion render remotion-videos/src/index.ts CropCreationCompact-DE out/crop-creation-compact-de.mp4 &
npx remotion render remotion-videos/src/index.ts CropCreationCompact-ES out/crop-creation-compact-es.mp4 &
npx remotion render remotion-videos/src/index.ts CropCreationCompact-KO out/crop-creation-compact-ko.mp4 &

# Wait for all renders to complete
wait

echo "All videos rendered!"
```

## Resources

- [Remotion Documentation](https://www.remotion.dev/docs)
- [Remotion Examples](https://www.remotion.dev/showcase)
- [Animation Helpers](https://www.remotion.dev/docs/animation-helpers)
- [FFmpeg Audio Filters](https://ffmpeg.org/ffmpeg-filters.html#Audio-Filters)
- [Google TTS CLI (gtts-cli)](https://pypi.org/project/gTTS/)
