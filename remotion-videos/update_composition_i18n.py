#!/usr/bin/env python3
"""
Script to update CropCreationCompact.tsx to use translations
"""

import re

# Read the current file
with open('src/compositions/CropCreationCompact.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Scene component signatures to accept language prop
scene_updates = [
    ('const TitleScene: React.FC = () => {', 'const TitleScene: React.FC<{ language: Language }> = ({ language }) => {\n  const t = getTranslations(language);'),
    ('const FABClickScene: React.FC = () => {', 'const FABClickScene: React.FC<{ language: Language }> = ({ language }) => {\n  const t = getTranslations(language);'),
    ('const PlantSelectionScene: React.FC = () => {', 'const PlantSelectionScene: React.FC<{ language: Language }> = ({ language }) => {\n  const t = getTranslations(language);'),
    ('const LocationSelectionScene: React.FC = () => {', 'const LocationSelectionScene: React.FC<{ language: Language }> = ({ language }) => {\n  const t = getTranslations(language);'),
    ('const TimelineScene: React.FC = () => {', 'const TimelineScene: React.FC<{ language: Language }> = ({ language }) => {\n  const t = getTranslations(language);'),
    ('const HarvestPlanningScene: React.FC = () => {', 'const HarvestPlanningScene: React.FC<{ language: Language }> = ({ language }) => {\n  const t = getTranslations(language);'),
    ('const SaveAndGanttScene: React.FC = () => {', 'const SaveAndGanttScene: React.FC<{ language: Language }> = ({ language }) => {\n  const t = getTranslations(language);'),
    ('const SuccessScene: React.FC = () => {', 'const SuccessScene: React.FC<{ language: Language }> = ({ language }) => {\n  const t = getTranslations(language);'),
]

for old, new in scene_updates:
    content = content.replace(old, new)

# Replace French text with translations
text_replacements = [
    # Title scene
    ('Créer une culture', '{t.title}'),
    ('en 4 étapes simples', '{t.subtitle}'),

    # Tabs
    ('<Tab label="Plante"', '<Tab label={t.tabPlant}'),
    ('<Tab label="Emplacement"', '<Tab label={t.tabLocation}'),
    ('<Tab label="Planning"', '<Tab label={t.tabPlanning}'),
    ('<Tab label="Récolte"', '<Tab label={t.tabHarvest}'),

    # Gantt header
    ('Planification des cultures', '{t.ganttTitle}'),
    ('Planification des Cultures', '{t.ganttTitle}'),
    ('<div>Nom</div>', '<div>{t.ganttName}</div>'),
    ('<div>Ordre</div>', '<div>{t.ganttOrder}</div>'),

    # Months
    ('<div>Janv.</div>', '<div>{t.january}</div>'),
    ('<div>Févr.</div>', '<div>{t.february}</div>'),
    ('<div>Mars</div>', '<div>{t.march}</div>'),
    ('<div>Avril</div>', '<div>{t.april}</div>'),
    ('<div>Mai</div>', '<div>{t.may}</div>'),
    ('<div>Juin</div>', '<div>{t.june}</div>'),
    ('<div>Juil.</div>', '<div>{t.july}</div>'),
    ('<div>Août</div>', '<div>{t.august}</div>'),
    ('<div>Sept.</div>', '<div>{t.september}</div>'),
    ('<div>Oct.</div>', '<div>{t.october}</div>'),
    ('<div>Nov.</div>', '<div>{t.november}</div>'),
    ('<div>Déc.</div>', '<div>{t.december}</div>'),
    ('<div>Récolte</div>', '<div>{t.tabHarvest}</div>'),

    # Plant selection
    ('<FormField label="Famille de plante *" value="🍅 Tomates"', '<FormField label={t.plantFamily} value={t.plantFamilyValue}'),
    ('<FormField label="Variété" value="Tomate Cerise"', '<FormField label={t.plantVariety} value={t.plantVarietyValue}'),
    ('<FormField label="Ordre" value="1"', '<FormField label={t.plantOrder} value="1"'),
    ('<FormField label="Quantité de graines" value="10"', '<FormField label={t.seedQuantity} value="10"'),

    # Location
    ('Projet', '{t.project}'),
    ('🏡 Jardin Potager 2025', '{t.projectValue}'),
    ('<FormField label="Parcelle *" value="Carré Nord"', '<FormField label={t.parcel} value={t.parcelValue}'),
    ('<FormField label="Zone" value="Zone A - Plein Soleil"', '<FormField label={t.zone} value={t.zoneValue}'),

    # Timeline
    ('<LegendItem color={GF_COLORS.lightBlue} label="Semis"', '<LegendItem color={GF_COLORS.lightBlue} label={t.sowingLabel}'),
    ('<LegendItem color={GF_COLORS.green} label="Culture"', '<LegendItem color={GF_COLORS.green} label={t.growthLabel}'),
    ('<LegendItem color={GF_COLORS.amber} label="Récolte"', '<LegendItem color={GF_COLORS.amber} label={t.harvestLabel}'),

    # Harvest planning
    ('Planification des récoltes', '{t.harvestPlanningTitle}'),
    ('Estimez votre production (optionnel)', '{t.harvestPlanningSubtitle}'),
    ('"Quantité de récoltes attendue"', '{t.harvestQuantityLabel}'),
    ('"Unité de récolte"', '{t.harvestUnitLabel}'),

    # Success scene
    ('🎉 Culture créée !', '{t.successTitle}'),
    ('Votre culture de tomates a été ajoutée avec succès', '{t.successMessage}'),
    ('Commencez à planifier votre jardin', '{t.successCTA}'),

    # Crop name
    ('🍅 Tomates', '{t.cropName}'),
]

for old, new in text_replacements:
    content = content.replace(old, new)

# Write the updated content
with open('src/compositions/CropCreationCompact.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Updated CropCreationCompact.tsx with i18n support")
