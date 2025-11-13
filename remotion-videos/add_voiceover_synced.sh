#!/bin/bash

echo "Adding synchronized voiceover to video..."
echo ""

# Scene timings (in milliseconds):
# Scene 1: 0-2s (0ms)
# Scene 2: 2-4s (2000ms)
# Scene 3: 4-8s (4000ms)
# Scene 4: 8-12s (8000ms)
# Scene 5: 12-15s (12000ms)
# Scene 6: 15-18s (15000ms)
# Scene 7: 18-22s (18000ms)
# Scene 8: 22-28s (22000ms)

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
    [2]adelay=2000|2000[a2];\
    [3]adelay=4000|4000[a3];\
    [4]adelay=8000|8000[a4];\
    [5]adelay=12000|12000[a5];\
    [6]adelay=15000|15000[a6];\
    [7]adelay=18000|18000[a7];\
    [8]adelay=22000|22000[a8];\
    [a1][a2][a3][a4][a5][a6][a7][a8]amix=inputs=8:duration=longest[aout]" \
  -map 0:v -map "[aout]" \
  -c:v copy -c:a aac -b:a 192k \
  ../out/crop-creation-compact-with-voice-synced.mp4

echo ""
echo "✓ Synchronized video created!"
echo "Output: out/crop-creation-compact-with-voice-synced.mp4"
echo ""
ls -lh ../out/crop-creation-compact-with-voice-synced.mp4
