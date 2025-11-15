# Voiceover Script for Crop Creation Video (English)

**Total Duration**: 38 seconds
**Language**: English
**Tone**: Professional, clear, friendly

---

## Timeline and Script

### 0:00 - 0:04.5 (Scene 1: Title)
**Text**: "Discover how to create a new crop in 4 simple steps."

**Notes**:
- Welcoming and enthusiastic tone
- Speed: Normal to moderate
- Emphasis on "4 simple steps"

---

### 0:04.5 - 0:07.5 (Scene 2: FAB Click)
**Text**: "Start by clicking the plus button."

**Notes**:
- Short and direct sentence
- Instructive tone

---

### 0:07.5 - 0:12 (Scene 3: Plant Selection)
**Text**: "Select the plant family, like tomatoes, then the order and quantity."

**Notes**:
- Concise and direct
- Natural flow without pauses

---

### 0:12 - 0:18 (Scene 4: Location)
**Text**: "Next, choose the location: first the project, then the parcel, and finally the concerned zone."

**Notes**:
- Fluid rhythm
- Clear enumeration of three elements

---

### 0:18 - 0:24 (Scene 5: Timeline Planning)
**Text**: "Define sowing and harvest periods by consulting the integrated calendar to optimize your planning."

**Notes**:
- Emphasis on the three phases
- Descriptive tone

---

### 0:24 - 0:27.5 (Scene 6: Harvest Planning)
**Text**: "Set the expected harvest quantity and unit."

**Notes**:
- Direct and concise
- Clear instruction

---

### 0:27.5 - 0:32.5 (Scene 7: Save & Gantt Result)
**Text**: "Save your crop. It appears immediately in your Gantt planning."

**Notes**:
- Positive conclusion tone
- Light emphasis on "appears immediately"

---

### 0:32.5 - 0:38 (Scene 8: Success!)
**Text**: "Your crop is created! Start planning your garden with GardenFlow now."

**Notes**:
- Enthusiastic and encouraging tone
- Pause after "crop is created!"
- End on an inviting note
- Clear call-to-action

---

## Technical Instructions

### To generate the voice with gtts-cli:

```bash
#!/bin/bash
# File: generate_voiceover_en.sh

mkdir -p voiceover-en

# Scene 1 (0-4.5s)
gtts-cli "Discover how to create a new crop in 4 simple steps." \
  --lang en \
  --output voiceover-en/voice_01_intro.mp3

# Scene 2 (4.5-7.5s)
gtts-cli "Start by clicking the plus button." \
  --lang en \
  --output voiceover-en/voice_02_fab.mp3

# Scene 3 (7.5-12s)
gtts-cli "Select the plant family, like tomatoes, then the order and quantity." \
  --lang en \
  --output voiceover-en/voice_03_plant.mp3

# Scene 4 (12-18s)
gtts-cli "Next, choose the location: first the project, then the parcel, and finally the concerned zone." \
  --lang en \
  --output voiceover-en/voice_04_location.mp3

# Scene 5 (18-24s)
gtts-cli "Define sowing and harvest periods by consulting the integrated calendar to optimize your planning." \
  --lang en \
  --output voiceover-en/voice_05_timing.mp3

# Scene 6 (24-27.5s)
gtts-cli "Set the expected harvest quantity and unit." \
  --lang en \
  --output voiceover-en/voice_06_harvest.mp3

# Scene 7 (27.5-32.5s)
gtts-cli "Save your crop. It appears immediately in your Gantt planning." \
  --lang en \
  --output voiceover-en/voice_07_save.mp3

# Scene 8 (32.5-38s)
gtts-cli "Your crop is created! Start planning your garden with GardenFlow now." \
  --lang en \
  --output voiceover-en/voice_08_final.mp3

echo "✓ All English voiceover files generated!"
```

---

## Adding Voice to Video with FFmpeg

### Step 1: Generate the 8 audio files
Use the script above to generate:
- `voice_01_intro.mp3` (0-4.5s)
- `voice_02_fab.mp3` (4.5-7.5s)
- `voice_03_plant.mp3` (7.5-12s)
- `voice_04_location.mp3` (12-18s)
- `voice_05_timing.mp3` (18-24s)
- `voice_06_harvest.mp3` (24-27.5s)
- `voice_07_save.mp3` (27.5-32.5s)
- `voice_08_final.mp3` (32.5-38s)

### Step 2: Add synchronized voiceover
```bash
#!/bin/bash
# File: add_voiceover_en.sh

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
  -i voiceover-en/voice_01_intro.mp3 \
  -i voiceover-en/voice_02_fab.mp3 \
  -i voiceover-en/voice_03_plant.mp3 \
  -i voiceover-en/voice_04_location.mp3 \
  -i voiceover-en/voice_05_timing.mp3 \
  -i voiceover-en/voice_06_harvest.mp3 \
  -i voiceover-en/voice_07_save.mp3 \
  -i voiceover-en/voice_08_final.mp3 \
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
  ../out/crop-creation-with-voiceover-en.mp4

echo "✓ English video with synchronized voiceover created!"
ls -lh ../out/crop-creation-with-voiceover-en.mp4
```

---

## Complete Text (For Copy-Paste)

```
Discover how to create a new crop in 4 simple steps. Start by clicking the plus button. Select the plant family, like tomatoes, then the order and quantity. Next, choose the location: first the project, then the parcel, and finally the concerned zone. Define sowing and harvest periods by consulting the integrated calendar to optimize your planning. Set the expected harvest quantity and unit. Save your crop. It appears immediately in your Gantt planning. Your crop is created! Start planning your garden with GardenFlow now.
```

**Word count**: ~85
**Estimated duration**: ~38 seconds (normal speed)

---

## Final Output File

**Suggested name**: `crop-creation-tutorial-en-with-voice.mp4`
**Location**: `out/crop-creation-with-voiceover-en.mp4`
**Storage path**: `../../api.gardenflow.io/storage/media/videos/crop-creation-tutorial-with-voice-en.mp4`
