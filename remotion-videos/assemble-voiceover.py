#!/usr/bin/env python3
"""
Assemble voiceover segments with proper timing using pydub
"""

from pydub import AudioSegment
from pydub.generators import Sine
import os

# Create silent audio (20 seconds total = 20000ms)
silence = AudioSegment.silent(duration=20000)

# Load segments
segments = [
    {"file": "voiceover/voice_01_intro.mp3", "start": 0},      # 0-2s
    {"file": "voiceover/voice_02_fab.mp3", "start": 2000},     # 2-4s
    {"file": "voiceover/voice_03_plant.mp3", "start": 4000},   # 4-8s
    {"file": "voiceover/voice_04_location.mp3", "start": 8000}, # 8-12s
    {"file": "voiceover/voice_05_timeline.mp3", "start": 12000}, # 12-16s
    {"file": "voiceover/voice_06_save.mp3", "start": 16000},    # 16-20s
]

print("🎵 Assemblage de la voix-off avec timing précis...\n")

# Create base track
voiceover_track = silence

# Overlay each segment at its specific time
for i, segment in enumerate(segments, 1):
    print(f"Segment {i}/6: {segment['file']}")
    audio = AudioSegment.from_mp3(segment['file'])

    # Overlay at the specific position
    voiceover_track = voiceover_track.overlay(audio, position=segment['start'])
    print(f"  ✓ Positionné à {segment['start']/1000:.1f}s")

# Export final voiceover
output_file = "voiceover/voiceover_complete.mp3"
voiceover_track.export(output_file, format="mp3", bitrate="192k")

print(f"\n✅ Voix-off assemblée: {output_file}")
print(f"Durée: 20 secondes")
print("\n📝 Prochaine étape: Combiner avec la vidéo")
