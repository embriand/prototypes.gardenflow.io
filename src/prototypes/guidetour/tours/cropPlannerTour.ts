import { TourFlow } from '../types/TourTypes';

export const cropPlannerOverviewTour: TourFlow = {
  id: 'crop-planner-overview',
  name: 'Planificateur de cultures',
  description: 'Découvrez comment planifier et gérer vos cultures efficacement',
  version: '1.0.0',
  steps: [
    {
      id: 'welcome',
      title: 'Bienvenue dans le Planificateur de cultures',
      content: 'Ce tour vous guidera à travers les fonctionnalités principales pour planifier et gérer vos cultures. Vous apprendrez à utiliser les vues, filtres, et outils avancés.',
      target: '[data-tour="crop-planner-main"]',
      placement: 'center',
      showSkip: true,
      delay: 500
    },
    {
      id: 'project-info',
      title: 'Projet actuel',
      content: 'Ici s\'affiche le projet sélectionné. Assurez-vous d\'avoir un projet par défaut configuré depuis le tableau de bord.',
      target: '[data-tour="current-project"]',
      placement: 'bottom',
      showSkip: true
    },
    {
      id: 'view-selector',
      title: 'Sélection de vue',
      content: 'Choisissez entre la vue Calendrier (mensuelle) et la vue Gantt (chronologique) pour visualiser vos cultures.',
      target: '[data-tour="view-selector"]',
      placement: 'bottom',
      showSkip: true
    },
    {
      id: 'year-navigation',
      title: 'Navigation par année',
      content: 'Naviguez entre les années pour planifier sur le long terme. Utilisez les flèches ou cliquez directement sur l\'année.',
      target: '[data-tour="year-navigation"]',
      placement: 'bottom',
      showSkip: true
    },
    {
      id: 'search-bar',
      title: 'Barre de recherche',
      content: 'Recherchez rapidement vos cultures par famille, espèce ou variété. La recherche filtre automatiquement les résultats.',
      target: '[data-tour="search-bar"]',
      placement: 'bottom',
      showSkip: true
    },
    {
      id: 'action-buttons',
      title: 'Boutons d\'action principaux',
      content: 'Accédez rapidement aux fonctionnalités : Compagnonnage (associations bénéfiques), Rotation (planification des successions), Récoltes (suivi), Ajout de cultures, et Stock de semences.',
      target: '[data-tour="action-buttons"]',
      placement: 'bottom',
      showSkip: true,
      delay: 300
    },
    {
      id: 'companion-feature',
      title: 'Analyse des compagnonnages',
      content: 'Le bouton Compagnons vous permet d\'analyser les associations bénéfiques entre vos cultures selon les principes de permaculture.',
      target: '[data-tour="companion-button"]',
      placement: 'bottom',
      showSkip: true
    },
    {
      id: 'rotation-feature',
      title: 'Planification des rotations',
      content: 'L\'outil Rotation vous aide à planifier les successions de cultures pour maintenir la santé du sol et optimiser les rendements.',
      target: '[data-tour="rotation-button"]',
      placement: 'bottom',
      showSkip: true
    },
    {
      id: 'harvest-tracking',
      title: 'Suivi des récoltes',
      content: 'Le bouton Récoltes vous permet de suivre et enregistrer vos récoltes pour un meilleur suivi de la productivité.',
      target: '[data-tour="harvest-button"]',
      placement: 'bottom',
      showSkip: true
    },
    {
      id: 'add-crop',
      title: 'Ajout de nouvelles cultures',
      content: 'Cliquez sur Ajouter pour créer une nouvelle culture. Le formulaire vous guidera à travers tous les paramètres nécessaires.',
      target: '[data-tour="add-button"]',
      placement: 'bottom',
      showSkip: true
    },
    {
      id: 'inventory-management',
      title: 'Gestion du stock',
      content: 'Le bouton Stock vous donne accès à votre inventaire de semences avec des statistiques détaillées et la possibilité de gérer les quantités.',
      target: '[data-tour="inventory-button"]',
      placement: 'bottom',
      showSkip: true
    },
    {
      id: 'filters',
      title: 'Système de filtrage',
      content: 'Utilisez les filtres pour affiner l\'affichage par famille de plantes, parcelles, ou autres critères. Les filtres se combinent pour des recherches précises.',
      target: '[data-tour="filter-button"]',
      placement: 'left',
      showSkip: true
    },
    {
      id: 'completion',
      title: 'Tour terminé !',
      content: 'Vous connaissez maintenant les fonctionnalités principales du Planificateur de cultures. Explorez chaque section pour découvrir toutes les possibilités. Bon jardinage !',
      target: '[data-tour="crop-planner-main"]',
      placement: 'center',
      showSkip: false,
      delay: 500
    }
  ],
  autoStart: false,
  skippable: true
};

export default cropPlannerOverviewTour;