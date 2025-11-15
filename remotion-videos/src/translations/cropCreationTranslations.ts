// Translations for Crop Creation Tutorial Video

export type Language = 'fr' | 'en' | 'de' | 'es' | 'ko';

interface Translations {
  // Title Scene
  title: string;
  subtitle: string;

  // Common
  modalTitle: string;

  // Tabs
  tabPlant: string;
  tabLocation: string;
  tabPlanning: string;
  tabHarvest: string;

  // Gantt Header
  ganttTitle: string;
  ganttName: string;
  ganttOrder: string;
  ganttHarvest: string;

  // Months
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;

  // Plant Selection
  plantFamily: string;
  plantVariety: string;
  plantOrder: string;
  seedQuantity: string;
  plantFamilyValue: string;
  plantVarietyValue: string;

  // Category Badges
  categoryAll: string;
  categoryVegetables: string;
  categoryFruits: string;
  categoryHerbs: string;

  // Location Selection
  project: string;
  projectValue: string;
  parcel: string;
  parcelValue: string;
  zone: string;
  zoneValue: string;

  // Timeline Planning
  sowingLabel: string;
  growthLabel: string;
  harvestLabel: string;

  // Harvest Planning
  harvestPlanningTitle: string;
  harvestPlanningSubtitle: string;
  harvestQuantityLabel: string;
  harvestUnitLabel: string;

  // Save & Gantt
  cropName: string;

  // Success Scene
  successTitle: string;
  successMessage: string;
  successCTA: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    // Title Scene
    title: 'Créer une culture',
    subtitle: 'en 4 étapes simples',

    // Common
    modalTitle: 'Créer une culture',

    // Tabs
    tabPlant: 'Plante',
    tabLocation: 'Emplacement',
    tabPlanning: 'Planning',
    tabHarvest: 'Récolte',

    // Gantt Header
    ganttTitle: 'Planification des cultures',
    ganttName: 'Nom',
    ganttOrder: 'Ordre',
    ganttHarvest: 'Récolte',

    // Months
    january: 'Janv.',
    february: 'Févr.',
    march: 'Mars',
    april: 'Avril',
    may: 'Mai',
    june: 'Juin',
    july: 'Juil.',
    august: 'Août',
    september: 'Sept.',
    october: 'Oct.',
    november: 'Nov.',
    december: 'Déc.',

    // Plant Selection
    plantFamily: 'Famille de plante *',
    plantVariety: 'Variété',
    plantOrder: 'Ordre',
    seedQuantity: 'Quantité de graines',
    plantFamilyValue: '🍅 Tomates',
    plantVarietyValue: 'Tomate Cerise',

    // Category Badges
    categoryAll: 'Tous',
    categoryVegetables: '🥬 Légumes',
    categoryFruits: '🍓 Fruits',
    categoryHerbs: '🌿 Herbes',

    // Location Selection
    project: 'Projet',
    projectValue: 'Mon Potager 2025',
    parcel: 'Parcelle *',
    parcelValue: 'Carré Nord',
    zone: 'Zone',
    zoneValue: 'Zone A - Plein Soleil',

    // Timeline Planning
    sowingLabel: 'Semis',
    growthLabel: 'Culture',
    harvestLabel: 'Récolte',

    // Harvest Planning
    harvestPlanningTitle: 'Planification des récoltes',
    harvestPlanningSubtitle: 'Estimez votre production (optionnel)',
    harvestQuantityLabel: 'Quantité de récoltes attendue',
    harvestUnitLabel: 'Unité de récolte',

    // Save & Gantt
    cropName: '🍅 Tomates',

    // Success Scene
    successTitle: '🎉 Culture créée !',
    successMessage: 'Votre culture de tomates a été ajoutée avec succès',
    successCTA: 'Commencez à planifier votre jardin',
  },

  en: {
    // Title Scene
    title: 'Create a crop',
    subtitle: 'in 4 simple steps',

    // Common
    modalTitle: 'Create a crop',

    // Tabs
    tabPlant: 'Plant',
    tabLocation: 'Location',
    tabPlanning: 'Planning',
    tabHarvest: 'Harvest',

    // Gantt Header
    ganttTitle: 'Crop Planning',
    ganttName: 'Name',
    ganttOrder: 'Order',
    ganttHarvest: 'Harvest',

    // Months
    january: 'Jan',
    february: 'Feb',
    march: 'Mar',
    april: 'Apr',
    may: 'May',
    june: 'Jun',
    july: 'Jul',
    august: 'Aug',
    september: 'Sep',
    october: 'Oct',
    november: 'Nov',
    december: 'Dec',

    // Plant Selection
    plantFamily: 'Plant family *',
    plantVariety: 'Variety',
    plantOrder: 'Order',
    seedQuantity: 'Seed quantity',
    plantFamilyValue: '🍅 Tomatoes',
    plantVarietyValue: 'Cherry Tomato',

    // Category Badges
    categoryAll: 'All',
    categoryVegetables: '🥬 Vegetables',
    categoryFruits: '🍓 Fruits',
    categoryHerbs: '🌿 Herbs',

    // Location Selection
    project: 'Project',
    projectValue: 'My Garden 2025',
    parcel: 'Parcel *',
    parcelValue: 'North Square',
    zone: 'Zone',
    zoneValue: 'Zone A - Full Sun',

    // Timeline Planning
    sowingLabel: 'Sowing',
    growthLabel: 'Growth',
    harvestLabel: 'Harvest',

    // Harvest Planning
    harvestPlanningTitle: 'Harvest planning',
    harvestPlanningSubtitle: 'Estimate your production (optional)',
    harvestQuantityLabel: 'Expected harvest quantity',
    harvestUnitLabel: 'Harvest unit',

    // Save & Gantt
    cropName: '🍅 Tomatoes',

    // Success Scene
    successTitle: '🎉 Crop created!',
    successMessage: 'Your tomato crop has been successfully added',
    successCTA: 'Start planning your garden',
  },

  de: {
    // Title Scene
    title: 'Kultur erstellen',
    subtitle: 'in 4 einfachen Schritten',

    // Common
    modalTitle: 'Kultur erstellen',

    // Tabs
    tabPlant: 'Pflanze',
    tabLocation: 'Standort',
    tabPlanning: 'Planung',
    tabHarvest: 'Ernte',

    // Gantt Header
    ganttTitle: 'Anbauplanung',
    ganttName: 'Name',
    ganttOrder: 'Reihe',
    ganttHarvest: 'Ernte',

    // Months
    january: 'Jan',
    february: 'Feb',
    march: 'Mär',
    april: 'Apr',
    may: 'Mai',
    june: 'Jun',
    july: 'Jul',
    august: 'Aug',
    september: 'Sep',
    october: 'Okt',
    november: 'Nov',
    december: 'Dez',

    // Plant Selection
    plantFamily: 'Pflanzenfamilie *',
    plantVariety: 'Sorte',
    plantOrder: 'Reihe',
    seedQuantity: 'Saatgutmenge',
    plantFamilyValue: '🍅 Tomaten',
    plantVarietyValue: 'Kirschtomate',

    // Category Badges
    categoryAll: 'Alle',
    categoryVegetables: '🥬 Gemüse',
    categoryFruits: '🍓 Früchte',
    categoryHerbs: '🌿 Kräuter',

    // Location Selection
    project: 'Projekt',
    projectValue: 'Mein Garten 2025',
    parcel: 'Parzelle *',
    parcelValue: 'Nordbeet',
    zone: 'Zone',
    zoneValue: 'Zone A - Volle Sonne',

    // Timeline Planning
    sowingLabel: 'Aussaat',
    growthLabel: 'Wachstum',
    harvestLabel: 'Ernte',

    // Harvest Planning
    harvestPlanningTitle: 'Ernteplanung',
    harvestPlanningSubtitle: 'Schätzen Sie Ihre Produktion (optional)',
    harvestQuantityLabel: 'Erwartete Erntemenge',
    harvestUnitLabel: 'Ernteeinheit',

    // Save & Gantt
    cropName: '🍅 Tomaten',

    // Success Scene
    successTitle: '🎉 Kultur erstellt!',
    successMessage: 'Ihre Tomatenkultur wurde erfolgreich hinzugefügt',
    successCTA: 'Beginnen Sie mit der Gartenplanung',
  },

  es: {
    // Title Scene
    title: 'Crear un cultivo',
    subtitle: 'en 4 pasos sencillos',

    // Common
    modalTitle: 'Crear un cultivo',

    // Tabs
    tabPlant: 'Planta',
    tabLocation: 'Ubicación',
    tabPlanning: 'Planificación',
    tabHarvest: 'Cosecha',

    // Gantt Header
    ganttTitle: 'Planificación de cultivos',
    ganttName: 'Nombre',
    ganttOrder: 'Orden',
    ganttHarvest: 'Cosecha',

    // Months
    january: 'Ene',
    february: 'Feb',
    march: 'Mar',
    april: 'Abr',
    may: 'May',
    june: 'Jun',
    july: 'Jul',
    august: 'Ago',
    september: 'Sep',
    october: 'Oct',
    november: 'Nov',
    december: 'Dic',

    // Plant Selection
    plantFamily: 'Familia de planta *',
    plantVariety: 'Variedad',
    plantOrder: 'Orden',
    seedQuantity: 'Cantidad de semillas',
    plantFamilyValue: '🍅 Tomates',
    plantVarietyValue: 'Tomate Cherry',

    // Category Badges
    categoryAll: 'Todos',
    categoryVegetables: '🥬 Verduras',
    categoryFruits: '🍓 Frutas',
    categoryHerbs: '🌿 Hierbas',

    // Location Selection
    project: 'Proyecto',
    projectValue: 'Mi Huerto 2025',
    parcel: 'Parcela *',
    parcelValue: 'Cuadro Norte',
    zone: 'Zona',
    zoneValue: 'Zona A - Pleno Sol',

    // Timeline Planning
    sowingLabel: 'Siembra',
    growthLabel: 'Cultivo',
    harvestLabel: 'Cosecha',

    // Harvest Planning
    harvestPlanningTitle: 'Planificación de cosecha',
    harvestPlanningSubtitle: 'Estime su producción (opcional)',
    harvestQuantityLabel: 'Cantidad de cosecha esperada',
    harvestUnitLabel: 'Unidad de cosecha',

    // Save & Gantt
    cropName: '🍅 Tomates',

    // Success Scene
    successTitle: '🎉 ¡Cultivo creado!',
    successMessage: 'Su cultivo de tomates se ha añadido correctamente',
    successCTA: 'Comience a planificar su huerto',
  },

  ko: {
    // Title Scene
    title: '작물 만들기',
    subtitle: '4단계로 간단하게',

    // Common
    modalTitle: '작물 만들기',

    // Tabs
    tabPlant: '식물',
    tabLocation: '위치',
    tabPlanning: '계획',
    tabHarvest: '수확',

    // Gantt Header
    ganttTitle: '작물 계획',
    ganttName: '이름',
    ganttOrder: '순서',
    ganttHarvest: '수확',

    // Months
    january: '1월',
    february: '2월',
    march: '3월',
    april: '4월',
    may: '5월',
    june: '6월',
    july: '7월',
    august: '8월',
    september: '9월',
    october: '10월',
    november: '11월',
    december: '12월',

    // Plant Selection
    plantFamily: '식물 종류 *',
    plantVariety: '품종',
    plantOrder: '순서',
    seedQuantity: '씨앗 수량',
    plantFamilyValue: '🍅 토마토',
    plantVarietyValue: '방울토마토',

    // Category Badges
    categoryAll: '전체',
    categoryVegetables: '🥬 채소',
    categoryFruits: '🍓 과일',
    categoryHerbs: '🌿 허브',

    // Location Selection
    project: '프로젝트',
    projectValue: '내 정원 2025',
    parcel: '구획 *',
    parcelValue: '북쪽 구역',
    zone: '구역',
    zoneValue: '구역 A - 햇빛',

    // Timeline Planning
    sowingLabel: '파종',
    growthLabel: '재배',
    harvestLabel: '수확',

    // Harvest Planning
    harvestPlanningTitle: '수확 계획',
    harvestPlanningSubtitle: '생산량 예측 (선택사항)',
    harvestQuantityLabel: '예상 수확량',
    harvestUnitLabel: '수확 단위',

    // Save & Gantt
    cropName: '🍅 토마토',

    // Success Scene
    successTitle: '🎉 작물 생성 완료!',
    successMessage: '토마토 작물이 추가되었습니다',
    successCTA: '정원 계획을 시작하세요',
  },
};

export function getTranslations(language: Language): Translations {
  return translations[language] || translations.fr;
}
