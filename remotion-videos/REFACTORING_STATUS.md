# Refactoring Status: Multi-Language Support for Crop Creation Video

## ✅ Completed Steps

### 1. Created Translation System
- **File**: `src/translations/cropCreationTranslations.ts`
- Centralized all French and English text
- Type-safe translation function `getTranslations(language)`
- Supports: `fr` (French) and `en` (English)

### 2. Updated CropCreationCompact Component
- Added `language` prop to `CropCreationCompactProps`
- Updated all 8 scenes to accept language prop:
  - TitleScene
  - FABClickScene
  - PlantSelectionScene
  - LocationSelectionScene
  - TimelineScene
  - HarvestPlanningScene
  - SaveAndGanttScene
  - SuccessScene
- Replaced all hardcoded French text with `t.propertyName` translations

### 3. Registered Compositions
- **File**: `src/Root.tsx`
- `CropCreationCompact` - French version (language='fr')
- `CropCreationCompact-EN` - English version (language='en')
- Both render at 1140 frames (38 seconds at 30fps)

### 4. Fixed Issues
- Changed composition ID from `CropCreationCompact_EN` to `CropCreationCompact-EN` (underscore not allowed)
- Fixed `grey700` reference to `grey600` in LegendItem component

## ⏳ Remaining Tasks

### Task 1: Render English Video (No Audio)
```bash
cd /Users/emmanuelbriand/Documents/workspace/gardenflow/prototypes
npx remotion render remotion-videos/src/index.ts CropCreationCompact-EN out/crop-creation-compact-en.mp4
```
- Expected output: `out/crop-creation-compact-en.mp4` (~235 KB)
- Duration: 38 seconds
- Resolution: 1920x1080 @ 30fps

### Task 2: Combine English Video with English Voiceover
The English voiceover files already exist in `voiceover-en/`:
- voice_01_intro.mp3 (4.368s)
- voice_02_fab.mp3 (2.640s)
- voice_03_plant.mp3 (7.488s)
- voice_04_location.mp3 (7.920s)
- voice_05_timing.mp3 (6.888s)
- voice_06_harvest.mp3 (5.736s)
- voice_07_save.mp3 (4.512s)
- voice_08_final.mp3 (5.352s)

Run the existing script:
```bash
cd /Users/emmanuelbriand/Documents/workspace/gardenflow/prototypes/remotion-videos
./add_voiceover_en.sh
```

This will create: `out/crop-creation-with-voiceover-en.mp4`

### Task 3: Update API Storage
Replace the CURRENT English video (which has French text) with the NEW English video:

```bash
# Remove old English video (has French text with English audio)
rm /Users/emmanuelbriand/Documents/workspace/gardenflow/api.gardenflow.io/storage/media/videos/crop-creation-tutorial-with-voice-en.mp4

# Copy new English video (has English text with English audio)
cp /Users/emmanuelbriand/Documents/workspace/gardenflow/prototypes/out/crop-creation-with-voiceover-en.mp4 \
   /Users/emmanuelbriand/Documents/workspace/gardenflow/api.gardenflow.io/storage/media/videos/crop-creation-tutorial-with-voice-en.mp4
```

### Task 4: Verify Both Videos
```bash
# French video (should have French text + French audio)
ls -lh /Users/emmanuelbriand/Documents/workspace/gardenflow/api.gardenflow.io/storage/media/videos/crop-creation-tutorial-with-voice.mp4

# English video (should have English text + English audio)
ls -lh /Users/emmanuelbriand/Documents/workspace/gardenflow/api.gardenflow.io/storage/media/videos/crop-creation-tutorial-with-voice-en.mp4
```

### Task 5: Test in Application
1. Open http://localhost:5174/cropPlanner
2. Click tutorial dropdown
3. Set language to French → Video should show French text + French audio
4. Set language to English → Video should show English text + English audio

## 📁 File Structure

```
remotion-videos/
├── src/
│   ├── index.ts                                    # Entry point with registerRoot()
│   ├── Root.tsx                                    # Compositions registry
│   ├── translations/
│   │   └── cropCreationTranslations.ts             # ✅ NEW: Centralized translations
│   └── compositions/
│       └── CropCreationCompact.tsx                 # ✅ UPDATED: Multi-language support
├── voiceover/                                      # French audio files
│   ├── voice_01_intro.mp3
│   ├── voice_02_fab.mp3
│   └── ... (8 files total)
├── voiceover-en/                                   # ✅ English audio files
│   ├── voice_01_intro.mp3
│   ├── voice_02_fab.mp3
│   └── ... (8 files total)
├── generate_voiceover.sh                           # Generate French audio
├── generate_voiceover_en.sh                        # ✅ Generate English audio
├── add_voiceover_clean.sh                          # Add French voiceover to video
├── add_voiceover_en.sh                             # ✅ Add English voiceover to video
├── VOICEOVER_SCRIPT.md                             # French script
├── VOICEOVER_SCRIPT_EN.md                          # ✅ English script
├── VIDEO_REQUIREMENTS.md                           # Original requirements
└── REFACTORING_STATUS.md                           # ✅ THIS FILE
```

## 🔄 Translation System Details

### Available Languages
- `fr`: French (default)
- `en`: English

### Translation Keys
All text in the video is controlled by these keys:

**Title Scene:**
- `title`: "Créer une culture" / "Create a crop"
- `subtitle`: "en 4 étapes simples" / "in 4 simple steps"

**Tabs:**
- `tabPlant`: "Plante" / "Plant"
- `tabLocation`: "Emplacement" / "Location"
- `tabPlanning`: "Planning" / "Planning"
- `tabHarvest`: "Récolte" / "Harvest"

**Gantt Header:**
- `ganttTitle`: "Planification des cultures" / "Crop Planning"
- `ganttName`: "Nom" / "Name"
- `ganttOrder`: "Ordre" / "Order"

**Months:**
- `january` through `december`: Abbreviated month names

**Plant Selection:**
- `plantFamily`: "Famille de plante *" / "Plant family *"
- `plantVariety`: "Variété" / "Variety"
- `plantFamilyValue`: "🍅 Tomates" / "🍅 Tomatoes"
- `plantVarietyValue`: "Tomate Cerise" / "Cherry Tomato"

**Location:**
- `project`: "Projet" / "Project"
- `projectValue`: "Mon Potager 2025" / "My Garden 2025"
- `parcel`: "Parcelle *" / "Parcel *"
- `parcelValue`: "Carré Nord" / "North Square"
- `zone`: "Zone" / "Zone"
- `zoneValue`: "Zone A - Plein Soleil" / "Zone A - Full Sun"

**Timeline:**
- `sowingLabel`: "Semis" / "Sowing"
- `growthLabel`: "Culture" / "Growth"
- `harvestLabel`: "Récolte" / "Harvest"

**Harvest Planning:**
- `harvestPlanningTitle`: "Planification des récoltes" / "Harvest planning"
- `harvestPlanningSubtitle`: "Estimez votre production (optionnel)" / "Estimate your production (optional)"
- `harvestQuantityLabel`: "Quantité de récoltes attendue" / "Expected harvest quantity"
- `harvestUnitLabel`: "Unité de récolte" / "Harvest unit"

**Success:**
- `successTitle`: "🎉 Culture créée !" / "🎉 Crop created!"
- `successMessage`: "Votre culture de tomates a été ajoutée avec succès" / "Your tomato crop has been successfully added"
- `successCTA`: "Commencez à planifier votre jardin" / "Start planning your garden"

## 🐛 Known Issues

### Fixed
- ✅ Composition ID validation (changed `_` to `-`)
- ✅ Missing color reference (`grey700` → `grey600`)

### None Currently

## 🚀 Adding New Languages

To add Spanish (es) or German (de):

1. **Update translations file:**
```typescript
// src/translations/cropCreationTranslations.ts
export type Language = 'fr' | 'en' | 'es' | 'de';

export const translations: Record<Language, Translations> = {
  fr: { ... },
  en: { ... },
  es: {
    title: 'Crear un cultivo',
    subtitle: 'en 4 pasos sencillos',
    // ... all other keys
  },
  de: {
    title: 'Eine Kultur erstellen',
    subtitle: 'in 4 einfachen Schritten',
    // ... all other keys
  }
};
```

2. **Register composition in Root.tsx:**
```tsx
<Composition
  id="CropCreationCompact-ES"
  component={CropCreationCompact}
  durationInFrames={1140}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    appName: 'GardenFlow',
    language: 'es' as const
  }}
/>
```

3. **Generate voiceover:**
```bash
# Create voiceover-es/voice_01_intro.mp3, etc.
gtts-cli "Descubre cómo crear un nuevo cultivo en 4 pasos sencillos." \
  --lang es \
  --output voiceover-es/voice_01_intro.mp3
```

4. **Render and combine:**
```bash
npx remotion render remotion-videos/src/index.ts CropCreationCompact-ES out/crop-creation-compact-es.mp4
./add_voiceover_es.sh
```

## 📝 Quick Commands Reference

```bash
# Preview all compositions
npm run video:preview

# Render French video
npx remotion render remotion-videos/src/index.ts CropCreationCompact out/crop-creation-compact.mp4

# Render English video
npx remotion render remotion-videos/src/index.ts CropCreationCompact-EN out/crop-creation-compact-en.mp4

# Add French voiceover
cd remotion-videos && ./add_voiceover_clean.sh

# Add English voiceover
cd remotion-videos && ./add_voiceover_en.sh

# Verify videos
ls -lh api.gardenflow.io/storage/media/videos/crop-creation-tutorial-with-voice*.mp4
```

## ⚠️ Important Notes

1. **Render Order**: Always render video first (without audio), then add voiceover with FFmpeg
2. **File Naming**: French uses no suffix, English uses `-en`, future languages use `-{lang}`
3. **Audio Sync**: Timing is critical - scene durations in Remotion must match adelay values in FFmpeg scripts
4. **Storage**: Videos go to `api.gardenflow.io/storage/media/videos/`
5. **Frontend**: Components automatically switch videos based on `i18n.language`

## 🎯 Success Criteria

When complete, you should have:
- ✅ French video with French text + French voiceover (1.1 MB)
- ✅ English video with English text + English voiceover (1.2 MB)
- ✅ Both videos in API storage
- ✅ Frontend automatically switches based on user language
- ✅ Clean, maintainable translation system for future languages
