#!/bin/bash

echo "Adding Spanish voiceover to video..."
echo ""

ffmpeg -y \
  -i ../out/crop-creation-compact-es.mp4 \
  -i voiceover-es/voice_01_intro.mp3 \
  -i voiceover-es/voice_02_fab.mp3 \
  -i voiceover-es/voice_03_plant.mp3 \
  -i voiceover-es/voice_04_location.mp3 \
  -i voiceover-es/voice_05_timing.mp3 \
  -i voiceover-es/voice_06_harvest.mp3 \
  -i voiceover-es/voice_07_save.mp3 \
  -i voiceover-es/voice_08_final.mp3 \
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
  ../out/crop-creation-with-voiceover-es.mp4

echo ""
echo "✓ Spanish video with synchronized voiceover created!"
echo "Output: out/crop-creation-with-voiceover-es.mp4"
echo ""
ls -lh ../out/crop-creation-with-voiceover-es.mp4
