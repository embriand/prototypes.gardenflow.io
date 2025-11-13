# Language Switching for Tutorial Videos

## Overview

The GardenFlow tutorial videos now support multiple languages and automatically switch based on the user's selected language in the application.

## Available Videos

### French (Default)
- **File**: `crop-creation-tutorial-with-voice.mp4`
- **Size**: 1.1 MB
- **Duration**: 38 seconds
- **Voiceover**: French with 8 synchronized segments

### English
- **File**: `crop-creation-tutorial-with-voice-en.mp4`
- **Size**: 1.2 MB
- **Duration**: 38 seconds
- **Voiceover**: English with 8 synchronized segments

## How Language Switching Works

### 1. Video Naming Convention

Videos follow this naming pattern:
```
crop-creation-tutorial-with-voice.mp4      # French (default, no suffix)
crop-creation-tutorial-with-voice-en.mp4   # English
crop-creation-tutorial-with-voice-es.mp4   # Spanish (future)
crop-creation-tutorial-with-voice-de.mp4   # German (future)
```

### 2. Automatic Detection in Components

Both `TutorialDropdown.tsx` and `GlobalTutorialDropdown.tsx` detect the user's language and construct the appropriate video URL:

```typescript
// Get current language from i18n
const currentLanguage = i18n.language; // 'fr', 'en', 'es', etc.

// French is default (no suffix), others get language code suffix
const videoSuffix = currentLanguage === 'fr' ? '' : `-${currentLanguage}`;
const videoUrl = `/storage/media/videos/crop-creation-tutorial-with-voice${videoSuffix}.mp4`;
```

### 3. Component Updates

**TutorialDropdown.tsx** (Crop Planner specific):
```typescript
export const TutorialDropdown: React.FC<TutorialDropdownProps> = ({
  className = "",
  size = 20
}) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const videoSuffix = currentLanguage === 'fr' ? '' : `-${currentLanguage}`;
  const videoUrl = `/storage/media/videos/crop-creation-tutorial-with-voice${videoSuffix}.mp4`;

  const tutorials: TutorialOption[] = [
    {
      id: 'crop-creation-tutorial',
      type: 'video',
      videoUrl: videoUrl,  // Dynamically switches based on language
      hasVoiceover: true
    }
  ];
};
```

**GlobalTutorialDropdown.tsx** (Global app tutorials):
```typescript
export const GlobalTutorialDropdown: React.FC<GlobalTutorialDropdownProps> = ({
  className = "",
  size = 20,
  variant = 'icon-only'
}) => {
  const { t, i18n } = useTranslation('tutorials');
  const currentLanguage = i18n.language;
  const videoSuffix = currentLanguage === 'fr' ? '' : `-${currentLanguage}`;
  const cropCreationVideoUrl = `/storage/media/videos/crop-creation-tutorial-with-voice${videoSuffix}.mp4`;

  const allTutorials: TutorialOption[] = [
    {
      id: 'crop-creation-tutorial',
      type: 'video',
      videoUrl: cropCreationVideoUrl,  // Dynamically switches
      pages: ['/cropPlanner']
    }
  ];
};
```

## Testing Language Switching

### 1. Switch Language in App
1. Open GardenFlow app: http://localhost:5174
2. Go to crop planner: http://localhost:5174/cropPlanner
3. Click the tutorial dropdown (graduation cap icon)
4. Play "How to Create a Crop" video → Should play French version

5. Switch app language to English (via language selector)
6. Open tutorial dropdown again
7. Play "How to Create a Crop" video → Should now play English version

### 2. Verify Video URLs

**French (when `i18n.language === 'fr'`):**
```
/storage/media/videos/crop-creation-tutorial-with-voice.mp4
```

**English (when `i18n.language === 'en'`):**
```
/storage/media/videos/crop-creation-tutorial-with-voice-en.mp4
```

**Spanish (when `i18n.language === 'es'`):**
```
/storage/media/videos/crop-creation-tutorial-with-voice-es.mp4
```

### 3. Direct URL Testing

```bash
# Test French video
curl -I http://localhost:5174/storage/media/videos/crop-creation-tutorial-with-voice.mp4

# Test English video
curl -I http://localhost:5174/storage/media/videos/crop-creation-tutorial-with-voice-en.mp4
```

Both should return HTTP 200 OK.

## Adding New Language Videos

To add a new language version:

### 1. Create Voiceover Script
Copy `VOICEOVER_SCRIPT_EN.md` and translate to target language:
```bash
cp VOICEOVER_SCRIPT_EN.md VOICEOVER_SCRIPT_ES.md
# Edit and translate content
```

### 2. Generate Audio Files
Create generation script (e.g., `generate_voiceover_es.sh`):
```bash
#!/bin/bash
mkdir -p voiceover-es

gtts-cli "Spanish text here..." \
  --lang es \
  --output voiceover-es/voice_01_intro.mp3

# ... repeat for all 8 segments
```

### 3. Synchronize with Video
Create synchronization script (e.g., `add_voiceover_es.sh`):
```bash
#!/bin/bash
ffmpeg -y \
  -i ../out/crop-creation-compact.mp4 \
  -i voiceover-es/voice_01_intro.mp3 \
  -i voiceover-es/voice_02_fab.mp3 \
  # ... all 8 audio files
  -filter_complex "\
    [1]adelay=0|0[a1];\
    [2]adelay=4500|4500[a2];\
    # ... timing for all segments
    [a1][a2][a3][a4][a5][a6][a7][a8]amix=inputs=8:duration=longest:dropout_transition=0[aout]" \
  -map 0:v:0 -map "[aout]" \
  -c:v copy -c:a aac -b:a 192k \
  ../out/crop-creation-with-voiceover-es.mp4
```

### 4. Publish to Storage
```bash
cp ../out/crop-creation-with-voiceover-es.mp4 \
   ../../api.gardenflow.io/storage/media/videos/crop-creation-tutorial-with-voice-es.mp4
```

### 5. No Code Changes Needed!
The components automatically detect and use the new language video based on the naming convention.

## Fallback Behavior

If a video for the user's language doesn't exist, the app will:
1. Try to load the language-specific video (e.g., `-es.mp4`)
2. If 404, the video player will show "Video not available"
3. Consider adding a fallback to French/English in the future:

```typescript
// Future enhancement: fallback logic
const getVideoUrl = (language: string) => {
  const suffix = language === 'fr' ? '' : `-${language}`;
  return `/storage/media/videos/crop-creation-tutorial-with-voice${suffix}.mp4`;
};

// With fallback
const videoUrl = getVideoUrl(currentLanguage);
// If video doesn't exist, could fallback to English or French
```

## Storage Location

All tutorial videos are stored in:
```
api.gardenflow.io/storage/media/videos/
├── crop-creation-tutorial-with-voice.mp4       # French
├── crop-creation-tutorial-with-voice-en.mp4    # English
├── crop-creation-tutorial-with-voice-es.mp4    # Spanish (future)
└── crop-creation-tutorial-with-voice-de.mp4    # German (future)
```

## URL Access

### Development
- **API Server**: http://localhost:3000/storage/media/videos/crop-creation-tutorial-with-voice-en.mp4
- **Frontend (proxied)**: http://localhost:5174/storage/media/videos/crop-creation-tutorial-with-voice-en.mp4

### Production
- **URL**: https://api.gardenflow.io/storage/media/videos/crop-creation-tutorial-with-voice-en.mp4
- Videos are served as static files via Express

## Backend Configuration

Express static file serving is configured in `api.gardenflow.io/src/app.ts`:
```typescript
import path from 'path';

// Serve media files from storage directory
app.use('/storage', express.static(path.join(__dirname, '../storage')));
```

## Frontend Configuration

Vite proxy configuration in `app.gardenflow.io/vite.config.ts`:
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

## Performance Considerations

- Video files are cached by browsers (Cache-Control: public, max-age=0)
- Videos are served with Accept-Ranges for streaming
- File sizes:
  - French: 1.1 MB (38s)
  - English: 1.2 MB (38s)
  - ~30-32 KB/s bitrate

## Future Enhancements

1. **Automatic language detection**: Detect browser language if user hasn't set preference
2. **Subtitle support**: Add WebVTT subtitle files for accessibility
3. **Quality options**: Provide 720p, 1080p, and 4K versions
4. **Lazy loading**: Only load video when tutorial dropdown is opened
5. **Preloading**: Prefetch video when user hovers over tutorial button
6. **Analytics**: Track which language videos are most watched
7. **CDN integration**: Serve videos from CDN for better global performance
