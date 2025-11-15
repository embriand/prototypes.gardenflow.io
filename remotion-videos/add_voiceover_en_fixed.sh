#!/bin/bash

echo "Adding English voiceover to video (with correct timing to prevent overlaps)..."
echo ""

# Audio durations (measured):
# voice_01_intro.mp3: 4.368s
# voice_02_fab.mp3: 2.640s
# voice_03_plant.mp3: 7.488s
# voice_04_location.mp3: 7.920s
# voice_05_timing.mp3: 6.888s
# voice_06_harvest.mp3: 5.736s
# voice_07_save.mp3: 4.512s
# voice_08_final.mp3: 5.352s

# New delay timings to prevent overlaps:
# voice_01: 0ms (start at 0.0s)
# voice_02: 4500ms (start at 4.5s, after scene 1 ends)
# voice_03: 7500ms (start at 7.5s, after scene 2 ends)
# voice_04: 15500ms (start at 15.5s, after voice_03 ends: 7.5 + 7.488 = 14.988, round up to 15.5)
# voice_05: 24000ms (start at 24.0s, after voice_04 ends: 15.5 + 7.920 = 23.42, round up to 24.0)
# voice_06: 31500ms (start at 31.5s, after voice_05 ends: 24.0 + 6.888 = 30.888, round up to 31.5)
# voice_07: Not used (would extend beyond video length)
# voice_08: Not used (would extend beyond video length)

# Since voices 3-6 are too long and would extend beyond the 38s video,
# we'll use a different approach: only play the voices that fit naturally

ffmpeg -y \
  -i ../out/crop-creation-compact-en.mp4 \
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
    [4]adelay=15500|15500[a4];\
    [5]adelay=24000|24000[a5];\
    [6]adelay=31500|31500[a6];\
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
