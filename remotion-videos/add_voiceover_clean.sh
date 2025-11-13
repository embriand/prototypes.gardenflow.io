#!/bin/bash

echo "Adding synchronized voiceover (removing original audio)..."
echo ""

# Scene timings for 38-second video:
# Scene 1: 0.0  - 4.5s  (0ms)
# Scene 2: 4.5  - 7.5s  (4500ms)
# Scene 3: 7.5  - 12.0s (7500ms)
# Scene 4: 12.0 - 18.0s (12000ms)
# Scene 5: 18.0 - 24.0s (18000ms)
# Scene 6: 24.0 - 27.5s (24000ms)
# Scene 7: 27.5 - 32.5s (27500ms)
# Scene 8: 32.5 - 38.0s (32500ms)

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

echo ""
echo "✓ Clean synchronized video created!"
echo "Output: out/crop-creation-with-voiceover.mp4"
echo ""
ls -lh ../out/crop-creation-with-voiceover.mp4
