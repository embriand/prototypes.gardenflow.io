# GardenFlow Video Tutorial - Requirements & Structure

## Video Overview
**Duration**: 28 seconds
**Purpose**: Tutorial video showing how to create a crop in GardenFlow
**Language**: French
**Style**: Clean, professional, minimal decorations

---

## General Design Requirements

### Typography & Styling
- **NO capital letters everywhere** - use normal sentence case
- **Title**: "Créer une culture" (not "Créé une culture")
- **Remove**: All leaf icons (🌱) and unnecessary decorations
- **Brand**: Add GardenFlow title at top with gradient style:
  ```html
  <span class="relative filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
    <span class="bg-gradient-to-r from-[#2ebddc] to-[#56c89a] bg-clip-text text-transparent">Garden</span>
    <span class="bg-gradient-to-r from-[#ff9a3d] to-[#ff7b7b] bg-clip-text text-transparent">Flow</span>
  </span>
  ```

### Scene Requirements
- **NO blank pages** - always show content
- **NO plus button alone** - show full UI context
- **First screen must show real crop planner structure** (skeleton rows, gantt chart)
- **Base structure on real app** (`./app.gardenflow.io`) - do NOT invent

---

## Scene Breakdown (8 Scenes, 28 seconds)

### Scene 1: Title Screen (0-2s, 60 frames)
- **Background**: Green gradient
- **Content**:
  - GardenFlow logo (gradient text)
  - Title: "Créer une culture en 4 étapes simples"
- **Narration**: "Découvrez comment créer une nouvelle culture en 4 étapes simples."

### Scene 2: Crop Planner Overview with FAB (2-4s, 60 frames)
- **Background**: Real crop planner interface
- **Content**:
  - GardenFlow header with navigation
  - Gantt chart with existing crop rows (skeleton data)
  - Month headers (Janv, Févr, Mars, etc.)
  - FAB button (plus icon) in top right - pulse animation
- **Narration**: "Commencez en cliquant sur le bouton plus."
- **Action**: FAB pulses, then click animation

### Scene 3: Dialog Opens - Plant Tab (4-8s, 120 frames)
- **Background**: Modal overlay on crop planner
- **Dialog Structure**:
  - Header: "Créer une culture" with close button (X)
  - 4 Tabs: Plante | Emplacement | Planning | Récolte
  - Active tab: "Plante" (blue underline)

- **Content**:
  1. **Category Badges** (appear with animation):
     - Tous (blue, selected)
     - 🥬 Légumes (green)
     - 🍓 Fruits (red)
     - 🌿 Herbes (emerald)

  2. **Famille de plante** dropdown:
     - Select opens showing: Tomates, Carottes, Salades, etc.
     - User selects "🍅 Tomates"

  3. **Below in 2 columns**:
     - Variété: "Tomate Cerise" (auto-filled, read-only)
     - Année: "2025" dropdown

  4. **Order and Quantity section**:
     - Ordre: "1" (number input)
     - Quantité de graines: "10" (number input)

- **Narration**: "Première étape : choisissez votre plante et sa variété."

### Scene 4: Location Tab (8-12s, 120 frames)
- **Dialog Structure**: Same header, tabs switch to "Emplacement" (green underline)

- **Content** (3 sections, animate in order):
  1. **Projet** (read-only display):
     - Shows: "🏡 Jardin Potager 2025"
     - Gray background, already selected

  2. **Parcelle** dropdown:
     - Opens showing: "Carré Nord", "Carré Sud", "Serre"
     - User selects "Carré Nord"

  3. **Zone** dropdown (appears after parcel selected):
     - Opens showing zones for selected parcel
     - User selects "Zone A - Plein Soleil"

- **Narration**: "Deuxième étape : sélectionnez le projet, la parcelle et la zone."

### Scene 5: Timing Tab (12-15s, 90 frames)
- **Dialog Structure**: Tabs switch to "Planning" (purple underline)

- **Content**:
  - Title: "Planning de semis, culture et récolte"
  - **Timeline visualization bar**:
    - Gray background
    - Light blue segment: Semis (8-20%)
    - Green gradient segment: Culture (20-65%)
    - Amber segment: Récolte (65-90%)
    - Animate bars appearing left to right

  - **Legend** (below timeline):
    - 🔵 Semis (appears with light blue bar)
    - 🟢 Culture (appears with green bar)
    - 🟡 Récolte (appears with amber bar)

- **Narration**: "Troisième étape : visualisez le planning de semis, culture et récolte."

### Scene 6: Harvest Planning Tab (15-18s, 90 frames)
- **Dialog Structure**: Tabs switch to "Récolte" (amber underline)
- **Badge**: "Optionnel" tag next to tab name

- **Content**:
  - Title: "📅 Période de Récolte"
  - **Two date cards** (side by side):
    - Début de récolte: "15 Novembre 2025"
    - Fin de récolte: "10 Décembre 2025"
    - Both cards have amber borders

  - **Duration badge** (centered below):
    - "🌾 Durée: 3-4 semaines"
    - Amber background

- **Narration**: "Consultez les dates de récolte et planifiez votre calendrier."

### Scene 7: Save & Gantt Result (18-22s, 120 frames)
- **Animation**: Dialog fades out, reveals gantt chart below

- **Content**:
  - Gantt chart view with new crop row added:
    - Avatar: "LAU" (green circle)
    - Name: "🍅 Tomates"
    - Order: "1"
    - Timeline bars across months:
      - Light blue bar (Semis): Jan-Mar with "S S40"
      - Green gradient bar (Culture): Apr-Oct with "C S40-52"
      - Amber bar (Récolte): Nov-Dec with "R S46-49"
    - Location badge: "P1 P1Z1-1" (green)

  - **Success indicator**:
    - Green checkmark circle animates in from right
    - Scale spring animation

- **Narration**: "Dernière étape : votre culture sauvegardée apparaît dans le planning."

### Scene 8: Success Screen (22-28s, 180 frames)
- **Background**: Green-to-blue gradient

- **Content**:
  1. **Large checkmark** (white circle with green check):
     - Spring scale animation on entry

  2. **Success message**:
     - "🎉 Culture créée !" (large, bold, white)
     - "Votre culture de tomates a été ajoutée avec succès" (smaller, below)

  3. **Call to Action**:
     - Text: "Commencez à planifier votre jardin"
     - GardenFlow logo with gradient (pulsing animation):
       - "Garden" in cyan-to-green gradient
       - "Flow" in orange-to-red gradient

- **Narration**: "Culture créée ! Commencez à planifier votre jardin avec GardenFlow."

---

## Real App Structure Reference

### CropForm Component (`app.gardenflow.io/src/components/crop-planner/CropForm.tsx`)

**Tabs**:
1. `plant` - Plant Details (blue)
2. `location` - Emplacement (green)
3. `timing` - Planning (purple)
4. `planning` - Récolte (amber, optional)

**Plant Tab Structure**:
```tsx
// Category Filter Buttons
- all (blue)
- vegetables 🥬 (green)
- fruits 🍓 (red)
- herbs 🌿 (emerald)

// Plant Family Dropdown
- selectedTemplate (Products)

// Fields Grid
- variety (read-only, from template)
- year (dropdown: 2023-2030)
- order (number input, min 1)
- quantity (number input, min 1)
```

**Location Tab Structure**:
```tsx
// Project (read-only display)
- selectedProject (from context/default)

// Parcel Selection (dropdown)
- availableParcels (filtered by project)

// Zone Selection (dropdown)
- availableZones (filtered by parcel)
```

**Timing Tab**:
- Shows timeline visualization
- Three phases: Semis, Culture, Récolte
- Uses week numbers and durations

**Harvest Planning Tab**:
- expectedHarvestQuantity (number)
- expectedHarvestUnit (kg/g/units/etc)
- harvestNotes (textarea)
- Dates calculated from timeline

---

## Color Palette (from real app)

```javascript
const GF_COLORS = {
  // Base
  grey50: '#FAFAFA',
  grey100: '#F5F5F5',
  grey600: '#757575',
  grey900: '#212121',

  // Timeline phases
  blue: '#3b82f6',        // Semis
  lightBlue: '#93c5fd',
  green: '#10b981',        // Culture
  lightGreen: '#6ee7b7',
  amber: '#f59e0b',        // Récolte

  // Branding
  purpleStart: '#9333ea',
  purpleEnd: '#7e22ce',

  // GardenFlow gradient
  cyan: '#2ebddc',
  teal: '#56c89a',
  orange: '#ff9a3d',
  red: '#ff7b7b'
};
```

---

## Voiceover Script

### Complete Script (77 words, ~27 seconds)

```
Découvrez comment créer une nouvelle culture en 4 étapes simples.

Commencez en cliquant sur le bouton plus.

Première étape : choisissez votre plante et sa variété.

Deuxième étape : sélectionnez le projet, la parcelle et la zone.

Troisième étape : visualisez le planning de semis, culture et récolte.

Consultez les dates de récolte et planifiez votre calendrier.

Dernière étape : votre culture sauvegardée apparaît dans le planning.

Culture créée ! Commencez à planifier votre jardin avec GardenFlow.
```

### Audio Files (8 segments)
- `voice_01_intro.mp3` (0-2s)
- `voice_02_fab.mp3` (2-4s)
- `voice_03_plant.mp3` (4-8s)
- `voice_04_location.mp3` (8-12s)
- `voice_05_timing.mp3` (12-15s)
- `voice_06_harvest.mp3` (15-18s)
- `voice_07_save.mp3` (18-22s)
- `voice_08_final.mp3` (22-28s)

---

## Technical Specifications

**Video**:
- Resolution: 1920x1080 (Full HD)
- Frame rate: 30fps
- Total frames: 840
- Codec: H.264
- CRF: 23 (good quality)

**Composition**:
- File: `src/compositions/CropCreationCompact.tsx`
- ID: `CropCreationCompact`
- Duration: 28 seconds (840 frames)

**Output**:
- Path: `out/crop-creation-compact.mp4`
- Size: ~1.8MB

---

## Common Mistakes to Avoid

❌ **DON'T**:
- Use "Créé" (past tense) - use "Créer" (infinitive)
- Show plus button alone without context
- Invent UI elements not in real app
- Use capital letters everywhere
- Add leaf icons or unnecessary decorations
- Show blank pages or empty screens
- Skip the category badges in plant tab
- Forget the "Optionnel" badge on harvest planning tab

✅ **DO**:
- Keep "Créer une culture" (infinitive form)
- Show full crop planner context with skeleton rows
- Base all UI on real app structure
- Use normal sentence case
- Add GardenFlow gradient branding
- Always show meaningful content
- Include all form sections in proper order
- Follow the real tab flow: Plante → Emplacement → Planning → Récolte

---

## Files Modified

1. `VOICEOVER_SCRIPT.md` - Voiceover timing and text
2. `src/compositions/CropCreationCompact.tsx` - Main video composition
3. `src/Root.tsx` - Video configuration (840 frames)
4. `VIDEO_REQUIREMENTS.md` - This documentation

---

## Render Command

```bash
cd /Users/emmanuelbriand/Documents/workspace/gardenflow/prototypes

npx remotion render remotion-videos/src/index.ts CropCreationCompact out/crop-creation-compact.mp4 --crf=23
```

---

*Last updated: 2025-11-13*
*Video version: 2.0 (28 seconds, complete flow)*
