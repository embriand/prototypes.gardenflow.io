#!/bin/bash

echo "Generating Spanish voiceover files..."
echo ""

mkdir -p voiceover-es

# Scene 1 (0-4.5s) - 4.5s available
gtts-cli "Cree un cultivo en 4 pasos sencillos." \
  --lang es \
  --output voiceover-es/voice_01_intro.mp3

# Scene 2 (4.5-7.5s) - 3.0s available
gtts-cli "Haga clic en el botón más." \
  --lang es \
  --output voiceover-es/voice_02_fab.mp3

# Scene 3 (7.5-12s) - 4.5s available
gtts-cli "Seleccione la familia de planta, como tomates." \
  --lang es \
  --output voiceover-es/voice_03_plant.mp3

# Scene 4 (12-18s) - 6.0s available
gtts-cli "Elija la ubicación: proyecto, parcela y zona." \
  --lang es \
  --output voiceover-es/voice_04_location.mp3

# Scene 5 (18-24s) - 6.0s available
gtts-cli "Defina períodos de siembra y cosecha con el calendario." \
  --lang es \
  --output voiceover-es/voice_05_timing.mp3

# Scene 6 (24-27.5s) - 3.5s available
gtts-cli "Indique la cantidad y unidad de cosecha." \
  --lang es \
  --output voiceover-es/voice_06_harvest.mp3

# Scene 7 (27.5-32.5s) - 5.0s available
gtts-cli "Guarde. El cultivo aparece en su planificación Gantt." \
  --lang es \
  --output voiceover-es/voice_07_save.mp3

# Scene 8 (32.5-38s) - 5.5s available
gtts-cli "Cultivo creado! Comience ahora con GardenFlow." \
  --lang es \
  --output voiceover-es/voice_08_final.mp3

echo ""
echo "✓ All Spanish voiceover files generated!"
echo ""

# Show durations
for file in voiceover-es/voice_*.mp3; do
  duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$file" 2>&1)
  echo "$file: ${duration}s"
done
