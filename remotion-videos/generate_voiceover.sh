#!/bin/bash

# Generate voiceover files for GardenFlow video tutorial
# Using Google TTS (gtts-cli)

# Create voiceover directory if it doesn't exist
mkdir -p voiceover

echo "Generating voiceover files..."

# Scene 1 (0-2s) - Intro
echo "1/8 - Generating intro..."
gtts-cli "Découvrez comment créer une nouvelle culture en 4 étapes simples." \
  --lang fr \
  --output voiceover/voice_01_intro.mp3

# Scene 2 (2-4s) - FAB click
echo "2/8 - Generating FAB click..."
gtts-cli "Commencez en cliquant sur le bouton plus." \
  --lang fr \
  --output voiceover/voice_02_fab.mp3

# Scene 3 (4-8s) - Plant selection
echo "3/8 - Generating plant selection..."
gtts-cli "Première étape : choisissez votre plante et sa variété." \
  --lang fr \
  --output voiceover/voice_03_plant.mp3

# Scene 4 (8-12s) - Location
echo "4/8 - Generating location..."
gtts-cli "Deuxième étape : sélectionnez le projet, la parcelle et la zone." \
  --lang fr \
  --output voiceover/voice_04_location.mp3

# Scene 5 (12-15s) - Timing
echo "5/8 - Generating timing..."
gtts-cli "Troisième étape : visualisez le planning de semis, culture et récolte." \
  --lang fr \
  --output voiceover/voice_05_timing.mp3

# Scene 6 (15-18s) - Harvest planning
echo "6/8 - Generating harvest planning..."
gtts-cli "Consultez les quantités de récoltes et leur unité." \
  --lang fr \
  --output voiceover/voice_06_harvest.mp3

# Scene 7 (18-22s) - Save and Gantt
echo "7/8 - Generating save..."
gtts-cli "Dernière étape : votre culture sauvegardée apparaît dans le planning." \
  --lang fr \
  --output voiceover/voice_07_save.mp3

# Scene 8 (22-28s) - Success
echo "8/8 - Generating success..."
gtts-cli "Culture créée ! Commencez à planifier votre jardin avec GardenFlow." \
  --lang fr \
  --output voiceover/voice_08_final.mp3

echo ""
echo "✓ All voiceover files generated successfully!"
echo ""
echo "Files created in voiceover/ directory:"
ls -lh voiceover/
