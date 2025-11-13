#!/usr/bin/env python3
"""
Generate French voiceover for crop creation tutorial video (v2 - proper capitalization)
Uses gTTS (Google Text-to-Speech) - free and no API key required
"""

import os
from gtts import gTTS

# Script segments with timing (updated with proper capitalization)
segments = [
    {
        "text": "Découvrez comment créer une nouvelle culture en quatre étapes simples.",
        "filename": "voice_01_intro.mp3",
        "start": 0,
        "end": 2
    },
    {
        "text": "Cliquez sur le bouton plus pour commencer.",
        "filename": "voice_02_fab.mp3",
        "start": 2,
        "end": 4
    },
    {
        "text": "Première étape : sélectionnez la famille de plante et sa variété.",
        "filename": "voice_03_plant.mp3",
        "start": 4,
        "end": 8
    },
    {
        "text": "Deuxième étape : choisissez le projet, la parcelle et la zone.",
        "filename": "voice_04_location.mp3",
        "start": 8,
        "end": 12
    },
    {
        "text": "Troisième étape : visualisez le planning de semis, culture et récolte.",
        "filename": "voice_05_timeline.mp3",
        "start": 12,
        "end": 16
    },
    {
        "text": "Dernière étape : sauvegardez et votre culture apparaît dans le planning.",
        "filename": "voice_06_save.mp3",
        "start": 16,
        "end": 20
    }
]

# Create output directory
os.makedirs("voiceover", exist_ok=True)

print("🎙️  Génération de la voix-off en français...\n")

# Generate each segment
for i, segment in enumerate(segments, 1):
    print(f"Segment {i}/6: {segment['text'][:50]}...")

    # Generate TTS
    tts = gTTS(text=segment['text'], lang='fr', slow=False)

    # Save to file
    filepath = os.path.join("voiceover", segment['filename'])
    tts.save(filepath)

    print(f"✓ Sauvegardé: {filepath}")

print("\n✅ Tous les segments générés!")
print("\nFichiers créés dans le dossier 'voiceover/':")
for segment in segments:
    print(f"  - {segment['filename']}")

print("\n📝 Prochaine étape: Assembler avec FFmpeg")
print("Commande: python3 assemble-voiceover.py")
