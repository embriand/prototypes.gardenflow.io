#!/bin/bash

echo "Generating German voiceover files..."
echo ""

mkdir -p voiceover-de

# Scene 1 (0-4.5s) - 4.5s available
gtts-cli "Erstellen Sie eine Kultur in 4 einfachen Schritten." \
  --lang de \
  --output voiceover-de/voice_01_intro.mp3

# Scene 2 (4.5-7.5s) - 3.0s available
gtts-cli "Klicken Sie auf die Plus-Schaltfläche." \
  --lang de \
  --output voiceover-de/voice_02_fab.mp3

# Scene 3 (7.5-12s) - 4.5s available
gtts-cli "Wählen Sie die Pflanzenfamilie, zum Beispiel Tomaten." \
  --lang de \
  --output voiceover-de/voice_03_plant.mp3

# Scene 4 (12-18s) - 6.0s available
gtts-cli "Wählen Sie den Standort: Projekt, Parzelle und Zone." \
  --lang de \
  --output voiceover-de/voice_04_location.mp3

# Scene 5 (18-24s) - 6.0s available
gtts-cli "Definieren Sie Aussaat- und Erntezeiten mit dem Kalender." \
  --lang de \
  --output voiceover-de/voice_05_timing.mp3

# Scene 6 (24-27.5s) - 3.5s available
gtts-cli "Geben Sie die Erntemenge und Einheit an." \
  --lang de \
  --output voiceover-de/voice_06_harvest.mp3

# Scene 7 (27.5-32.5s) - 5.0s available
gtts-cli "Speichern Sie. Die Kultur erscheint im Gantt-Plan." \
  --lang de \
  --output voiceover-de/voice_07_save.mp3

# Scene 8 (32.5-38s) - 5.5s available
gtts-cli "Kultur erstellt! Beginnen Sie jetzt mit GardenFlow." \
  --lang de \
  --output voiceover-de/voice_08_final.mp3

echo ""
echo "✓ All German voiceover files generated!"
echo ""

# Show durations
for file in voiceover-de/voice_*.mp3; do
  duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$file" 2>&1)
  echo "$file: ${duration}s"
done
