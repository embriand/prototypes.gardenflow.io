#!/bin/bash

echo "Adding English voiceover to video..."
echo ""

# Scene timings (in milliseconds):
# Scene 1: 0ms (0-4.5s)
# Scene 2: 4500ms (4.5-7.5s)
# Scene 3: 7500ms (7.5-12s)
# Scene 4: 12000ms (12-18s)
# Scene 5: 18000ms (18-24s)
# Scene 6: 24000ms (24-27.5s)
# Scene 7: 27500ms (27.5-32.5s)
# Scene 8: 32500ms (32.5-38s)

# Audio durations:
# voice_01_intro.mp3: 4.368s
# voice_02_fab.mp3: 2.640s
# voice_03_plant.mp3: 7.488s
# voice_04_location.mp3: 7.920s
# voice_05_timing.mp3: 6.888s
# voice_06_harvest.mp3: 5.736s
# voice_07_save.mp3: 4.512s
# voice_08_final.mp3: 5.352s
# Total: 44.904s

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

echo ""
echo "✓ English video with synchronized voiceover created!"
echo "Output: out/crop-creation-with-voiceover-en.mp4"
echo ""
ls -lh ../out/crop-creation-with-voiceover-en.mp4
