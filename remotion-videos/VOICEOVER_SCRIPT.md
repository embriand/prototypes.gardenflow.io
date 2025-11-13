# Script de Voix-Off pour Vidéo Création de Culture

**Durée totale**: 28 secondes
**Langue**: Français
**Ton**: Professionnel, clair, amical

---

## Timeline et Script

### 0:00 - 0:02 (Scène 1: Titre)
**Texte**: "Découvrez comment créer une nouvelle culture en 4 étapes simples."

**Notes**:
- Ton accueillant et enthousiaste
- Vitesse: Normale à modérée
- Emphase sur "4 étapes simples"

---

### 0:02 - 0:04 (Scène 2: Clic FAB)
**Texte**: "Commencez en cliquant sur le bouton plus."

**Notes**:
- Phrase courte et directe
- Ton instructif

---

### 0:04 - 0:08 (Scène 3: Sélection Plante)
**Texte**: "Première étape : choisissez votre plante et sa variété."

**Notes**:
- Emphase sur "Première étape"
- Pause légère après "plante"

---

### 0:08 - 0:12 (Scène 4: Localisation)
**Texte**: "Deuxième étape : sélectionnez le projet, la parcelle et la zone."

**Notes**:
- Rythme fluide
- Énumération claire des trois éléments

---

### 0:12 - 0:15 (Scène 5: Timing et Aperçu)
**Texte**: "Troisième étape : visualisez le planning de semis, culture et récolte."

**Notes**:
- Emphase sur les trois phases
- Ton descriptif

---

### 0:15 - 0:18 (Scène 6: Planification Récolte)
**Texte**: "Consultez les dates de récolte et planifiez votre calendrier."

**Notes**:
- Ton informatif
- Rythme fluide
- Emphase sur "planifiez"

---

### 0:18 - 0:22 (Scène 7: Sauvegarde et Gantt)
**Texte**: "Dernière étape : votre culture sauvegardée apparaît dans le planning."

**Notes**:
- Ton de conclusion positive
- Légère emphase sur "apparaît dans le planning"

---

### 0:22 - 0:28 (Scène 8: Culture Créée!)
**Texte**: "Culture créée ! Commencez à planifier votre jardin avec GardenFlow."

**Notes**:
- Ton enthousiaste et encourageant
- Pause après "Culture créée !"
- Finir sur une note invitante
- Call-to-action clair

---

## Instructions Techniques

### Pour générer la voix avec un outil TTS:

#### Option 1: ElevenLabs (Recommandé)
```bash
# Utilisez une voix française naturelle
# Voix recommandées: "Antoine" (homme) ou "Charlotte" (femme)
# Stabilité: 50%
# Similarité: 75%
# Style: 0% (neutre)
```

#### Option 2: Google Cloud Text-to-Speech
```python
from google.cloud import texttospeech

client = texttospeech.TextToSpeechClient()

# Configuration pour chaque segment
synthesis_input = texttospeech.SynthesisInput(text="Votre texte ici")
voice = texttospeech.VoiceSelectionParams(
    language_code="fr-FR",
    name="fr-FR-Neural2-B",  # Voix masculine naturelle
    ssml_gender=texttospeech.SsmlVoiceGender.MALE
)
audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3,
    speaking_rate=1.0,  # Vitesse normale
    pitch=0.0
)
```

#### Option 3: Azure Text-to-Speech
```python
import azure.cognitiveservices.speech as speechsdk

speech_config = speechsdk.SpeechConfig(
    subscription="YOUR_KEY",
    region="YOUR_REGION"
)
speech_config.speech_synthesis_voice_name = "fr-FR-HenriNeural"
```

---

## Ajout de la Voix à la Vidéo avec FFmpeg

### Étape 1: Générer les 8 fichiers audio
Générez chaque segment de voix et nommez-les:
- `voice_01_intro.mp3` (0-2s)
- `voice_02_fab.mp3` (2-4s)
- `voice_03_plant.mp3` (4-8s)
- `voice_04_location.mp3` (8-12s)
- `voice_05_timing.mp3` (12-15s)
- `voice_06_harvest.mp3` (15-18s)
- `voice_07_save.mp3` (18-22s)
- `voice_08_final.mp3` (22-28s)

### Étape 2: Créer un fichier de concaténation
Créez `voiceover.txt`:
```
file 'voice_01_intro.mp3'
file 'voice_02_fab.mp3'
file 'voice_03_plant.mp3'
file 'voice_04_location.mp3'
file 'voice_05_timing.mp3'
file 'voice_06_harvest.mp3'
file 'voice_07_save.mp3'
file 'voice_08_final.mp3'
```

### Étape 3: Concaténer les fichiers audio
```bash
ffmpeg -f concat -safe 0 -i voiceover.txt -c copy voiceover_complete.mp3
```

### Étape 4: Ajouter la voix à la vidéo
```bash
ffmpeg -i out/crop-creation-compact.mp4 \
       -i voiceover_complete.mp3 \
       -c:v copy \
       -c:a aac \
       -map 0:v:0 \
       -map 1:a:0 \
       -shortest \
       out/crop-creation-compact-with-voice.mp4
```

### Alternative: Ajouter avec timing précis
Si vous voulez contrôler exactement le timing:

```bash
ffmpeg -i out/crop-creation-compact.mp4 \
       -i voice_01_intro.mp3 \
       -i voice_02_fab.mp3 \
       -i voice_03_plant.mp3 \
       -i voice_04_location.mp3 \
       -i voice_05_timing.mp3 \
       -i voice_06_harvest.mp3 \
       -i voice_07_save.mp3 \
       -i voice_08_final.mp3 \
       -filter_complex "\
         [1]adelay=0|0[a1];\
         [2]adelay=2000|2000[a2];\
         [3]adelay=4000|4000[a3];\
         [4]adelay=8000|8000[a4];\
         [5]adelay=12000|12000[a5];\
         [6]adelay=15000|15000[a6];\
         [7]adelay=18000|18000[a7];\
         [8]adelay=22000|22000[a8];\
         [a1][a2][a3][a4][a5][a6][a7][a8]amix=inputs=8:duration=longest[aout]" \
       -map 0:v -map "[aout]" \
       -c:v copy -c:a aac \
       out/crop-creation-compact-with-voice.mp4
```

---

## Alternative Simple: Outils en Ligne

### 1. Kapwing
1. Téléchargez `crop-creation-compact.mp4`
2. Allez sur https://www.kapwing.com
3. Utilisez l'outil "Add Voiceover"
4. Enregistrez directement ou importez des fichiers audio

### 2. Descript
1. Importez la vidéo
2. Utilisez la fonction "Overdub" ou "Text-to-Speech"
3. Tapez le script et générez la voix
4. Exportez la vidéo finale

### 3. Remotion avec Audio (Avancé)
Si vous voulez intégrer directement dans Remotion:

```typescript
import { Audio, useCurrentFrame } from 'remotion';

// Dans chaque scène:
<Audio
  src={staticFile('voiceover/intro.mp3')}
  startFrom={0}
  endAt={60}
/>
```

---

## Texte Complet (Pour Copy-Paste)

```
Découvrez comment créer une nouvelle culture en 4 étapes simples. Commencez en cliquant sur le bouton plus. Première étape : choisissez votre plante et sa variété. Deuxième étape : sélectionnez le projet, la parcelle et la zone. Troisième étape : visualisez le planning de semis, culture et récolte. Consultez les dates de récolte et planifiez votre calendrier. Dernière étape : votre culture sauvegardée apparaît dans le planning. Culture créée ! Commencez à planifier votre jardin avec GardenFlow.
```

**Nombre de mots**: ~77
**Durée estimée**: ~27 secondes (vitesse normale)

---

## Services Recommandés pour la Génération de Voix

### Gratuits
- **Google Cloud TTS**: 1 million de caractères/mois gratuits
- **Microsoft Azure**: 5 millions de caractères gratuits la première année
- **Murf.ai**: Version d'essai gratuite

### Payants (Qualité Supérieure)
- **ElevenLabs**: $5-22/mois, voix très naturelles
- **Play.ht**: $19-99/mois, excellentes voix françaises
- **Resemble.ai**: $29+/mois, clonage de voix possible

### Qualité Maximale
- **Enregistrement professionnel**: Fiverr (~$10-50 pour 20 secondes)

---

## Conseils pour une Voix Parfaite

1. **Rythme**: Ne pas parler trop vite (120-150 mots/minute)
2. **Pauses**: Ajouter de courtes pauses entre les étapes
3. **Ton**: Professionnel mais amical
4. **Volume**: Normaliser à -16 LUFS
5. **Bruit de fond**: Utiliser un gate ou noise reduction si nécessaire

---

## Fichier de Sortie Final

**Nom suggéré**: `crop-creation-tutorial-fr-with-voice.mp4`
**Localisation**: `out/crop-creation-compact-with-voice.mp4`
