#!/bin/bash

echo "Adding voiceover to video..."

# Step 1: Create concat file for ffmpeg
cat > voiceover/concat.txt <<EOF
file 'voice_01_intro.mp3'
file 'voice_02_fab.mp3'
file 'voice_03_plant.mp3'
file 'voice_04_location.mp3'
file 'voice_05_timing.mp3'
file 'voice_06_harvest.mp3'
file 'voice_07_save.mp3'
file 'voice_08_final.mp3'
EOF

echo "Step 1: Concatenating audio files..."
ffmpeg -y -f concat -safe 0 -i voiceover/concat.txt -c copy voiceover/voiceover_complete.mp3

echo "Step 2: Adding voiceover to video..."
ffmpeg -y \
  -i ../out/crop-creation-compact.mp4 \
  -i voiceover/voiceover_complete.mp3 \
  -c:v copy \
  -c:a aac \
  -map 0:v:0 \
  -map 1:a:0 \
  -shortest \
  ../out/crop-creation-compact-with-voice.mp4

echo ""
echo "✓ Video with voiceover created!"
echo "Output: out/crop-creation-compact-with-voice.mp4"
echo ""
ls -lh ../out/crop-creation-compact-with-voice.mp4
