#!/bin/bash

echo "Generating English voiceover for crop creation tutorial..."
echo ""

mkdir -p voiceover-en

# Scene 1 (0-4.5s)
echo "Generating voice_01_intro.mp3..."
gtts-cli "Discover how to create a new crop in 4 simple steps." \
  --lang en \
  --output voiceover-en/voice_01_intro.mp3

# Scene 2 (4.5-7.5s)
echo "Generating voice_02_fab.mp3..."
gtts-cli "Start by clicking the plus button." \
  --lang en \
  --output voiceover-en/voice_02_fab.mp3

# Scene 3 (7.5-12s)
echo "Generating voice_03_plant.mp3..."
gtts-cli "First, select the plant family, for example tomatoes, then indicate the order and quantity." \
  --lang en \
  --output voiceover-en/voice_03_plant.mp3

# Scene 4 (12-18s)
echo "Generating voice_04_location.mp3..."
gtts-cli "Next, choose the location: first the project, then the parcel, and finally the concerned zone." \
  --lang en \
  --output voiceover-en/voice_04_location.mp3

# Scene 5 (18-24s)
echo "Generating voice_05_timing.mp3..."
gtts-cli "Define sowing and harvest periods by consulting the integrated calendar to optimize your planning." \
  --lang en \
  --output voiceover-en/voice_05_timing.mp3

# Scene 6 (24-27.5s)
echo "Generating voice_06_harvest.mp3..."
gtts-cli "Estimate your production by indicating the expected harvest quantity and unit." \
  --lang en \
  --output voiceover-en/voice_06_harvest.mp3

# Scene 7 (27.5-32.5s)
echo "Generating voice_07_save.mp3..."
gtts-cli "Save your crop. It appears immediately in your Gantt planning." \
  --lang en \
  --output voiceover-en/voice_07_save.mp3

# Scene 8 (32.5-38s)
echo "Generating voice_08_final.mp3..."
gtts-cli "Your crop is created! Start planning your garden with GardenFlow now." \
  --lang en \
  --output voiceover-en/voice_08_final.mp3

echo ""
echo "✓ All English voiceover files generated!"
echo ""
echo "Verifying audio durations:"
for file in voiceover-en/*.mp3; do
  duration=$(ffprobe -i "$file" -show_entries format=duration -v quiet -of csv="p=0" 2>/dev/null)
  if [ $? -eq 0 ]; then
    printf "%-30s: %.2f seconds\n" "$(basename $file)" "$duration"
  fi
done
