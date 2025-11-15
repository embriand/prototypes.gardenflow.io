#!/bin/bash

echo "Fixing English audio timing by speeding up longer clips..."
echo ""

cd voiceover-en

# Scene durations:
# Scene 1: 4.5s
# Scene 2: 3.0s
# Scene 3: 4.5s
# Scene 4: 6.0s
# Scene 5: 6.0s
# Scene 6: 3.5s
# Scene 7: 5.0s
# Scene 8: 5.5s

# Current audio durations and what they need to be:
# voice_01: 4.368s → OK (fits in 4.5s)
# voice_02: 2.640s → OK (fits in 3.0s)
# voice_03: 7.488s → needs to be ~4.3s (speed up by 1.74x)
# voice_04: 7.920s → needs to be ~5.8s (speed up by 1.37x)
# voice_05: 6.888s → needs to be ~5.8s (speed up by 1.19x)
# voice_06: 5.736s → needs to be ~3.3s (speed up by 1.74x)
# voice_07: 4.512s → OK (fits in 5.0s)
# voice_08: 5.352s → OK (fits in 5.5s)

# Backup originals
mkdir -p original_backup
cp voice_03_plant.mp3 original_backup/
cp voice_04_location.mp3 original_backup/
cp voice_05_timing.mp3 original_backup/
cp voice_06_harvest.mp3 original_backup/

# Speed up voice_03 (plant) from 7.488s to 4.3s (1.74x)
ffmpeg -y -i original_backup/voice_03_plant.mp3 -filter:a "atempo=1.74" voice_03_plant.mp3

# Speed up voice_04 (location) from 7.920s to 5.8s (1.37x)
ffmpeg -y -i original_backup/voice_04_location.mp3 -filter:a "atempo=1.37" voice_04_location.mp3

# Speed up voice_05 (timing) from 6.888s to 5.8s (1.19x)
ffmpeg -y -i original_backup/voice_05_timing.mp3 -filter:a "atempo=1.19" voice_05_timing.mp3

# Speed up voice_06 (harvest) from 5.736s to 3.3s (1.74x)
ffmpeg -y -i original_backup/voice_06_harvest.mp3 -filter:a "atempo=1.74" voice_06_harvest.mp3

echo ""
echo "✓ Audio files adjusted!"
echo ""
echo "New durations:"
for file in voice_*.mp3; do
  duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$file")
  echo "$file: ${duration}s"
done
