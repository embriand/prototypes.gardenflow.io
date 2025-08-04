import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, LineChart, ChevronDown, ArrowUpRight } from 'lucide-react';

const PollinisationCompareToolData = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedCrop, setSelectedCrop] = useState('all');
  
  // Données de démonstration pour le graphique
  const historicalData = [
    { month: 'Avr', 'courges': 61, 'tomates': 58, 'fraises': 70, 'aubergines': 52, 'poivrons': 47 },
    { month: 'Mai', 'courges': 68, 'tomates': 72, 'fraises': 81, 'aubergines': 59, 'poivrons': 63 },
    { month: 'Juin', 'courges': 76, 'tomates': 85, 'fraises': 75, 'aubergines': 63, 'poivrons': 69 },
    { month: 'Juil', 'courges': 82, 'tomates': 79, 'fraises': 62, 'aubergines': 74, 'poivrons': 77 },
    { month: 'Août', 'courges': 71, 'tomates': 65, 'fraises': 48, 'aubergines': 81, 'poivrons': 80 },
    { month: 'Sept', 'courges': 67, 'tomates': 59, 'fraises': 41, 'aubergines': 68, 'poivrons': 71 }
  ];
  
  // Tendances annuelles
  const yearlyTrends = [
    { year: 2022, 'taux': 61 },
    { year: 2023, 'taux': 68 },
    { year: 2024, 'taux': 74 },
  ];
  
  // Calcul de la moyenne pour toutes les cultures
  const processedData = historicalData.map(item => {
    const sumValues = item.courges + item.tomates + item.fraises + item.aubergines + item.poivrons;
    return {
      ...item,
      all: Math.round(sumValues / 5)
    };
  });
  
  // Données pour les meilleures pratiques
  const bestPractices = [
    { practice: "Plantes compagnes", impact: 15, description: "Planter des fleurs attractives à proximité" },
    { practice: "Hôtel à insectes", impact: 12, description: "Fournir des habitats pour les pollinisateurs" },
    { practice: "Arrosage matinal", impact: 8, description: "Favorise l'humidité durant les visites" },
    { practice: "Diversité variétale", impact: 7, description: "Cultiver plusieurs variétés de chaque espèce" }
  ];
  
  // Calculer l'évolution annuelle
  const calculateYearlyChange = () => {
    if (yearlyTrends.length > 1) {
      const currentYear = yearlyTrends[yearlyTrends.length - 1].taux;
      const previousYear = yearlyTrends[yearlyTrends.length - 2].taux;
      const change = currentYear - previousYear;
      const percentChange = Math.round((change / previousYear) * 100);
      
      return {
        value: change,
        percent: percentChange,
        positive: change > 0
      };
    }
    return { value: 0, percent: 0, positive: false };
  };
  
  const yearlyChange = calculateYearlyChange();
  
  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-slate-50 rounded-lg">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-emerald-700 mb-2">Historique et Comparaison de Pollinisation</h1>
        <p className="text-slate-600">Analysez les tendances et performances de pollinisation au fil du temps</p>
      </header>
      
      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <label className="font-medium text-slate-700 flex items-center gap-2">
              <Calendar size={18} className="text-emerald-600" />
              Année
            </label>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="pr-8 py-2 pl-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <label className="font-medium text-slate-700 flex items-center gap-2">
              <LineChart size={18} className="text-emerald-600" />
              Culture
            </label>
            <div className="relative">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="pr-8 py-2 pl-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
              >
                <option value="all">Toutes les cultures</option>
                <option value="courges">Courges</option>
                <option value="tomates">Tomates</option>
                <option value="fraises">Fraises</option>
                <option value="aubergines">Aubergines</option>
                <option value="poivrons">Poivrons</option>
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Graphiques et statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Tendance annuelle */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-3">Tendance Annuelle</h2>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-slate-500 text-sm">Taux moyen de pollinisation</p>
              <p className="text-3xl font-bold text-emerald-700">{yearlyTrends[yearlyTrends.length-1].taux}%</p>
            </div>
            <div className={`flex items-center gap-1 ${yearlyChange.positive ? 'text-green-600' : 'text-red-600'}`}>
              <ArrowUpRight size={18} className={!yearlyChange.positive ? 'transform rotate-90' : ''} />
              <span className="font-semibold">{yearlyChange.positive ? '+' : ''}{yearlyChange.percent}%</span>
              <span className="text-slate-500 text-xs">vs 2023</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={yearlyTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Taux moyen']} />
              <Bar dataKey="taux" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Évolution mensuelle */}
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <h2 className="font-semibold text-lg mb-3">Évolution Mensuelle {selectedCrop !== 'all' ? `- ${selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}` : ''}</h2>
          
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Taux de pollinisation']} />
              <Legend />
              {selectedCrop === 'all' ? (
                <Bar dataKey="all" name="Moyenne" fill="#10b981" radius={[4, 4, 0, 0]} />
              ) : (
                <Bar 
                  dataKey={selectedCrop} 
                  name={selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} 
                  fill={
                    selectedCrop === 'courges' ? '#10b981' : 
                    selectedCrop === 'tomates' ? '#f97316' :
                    selectedCrop === 'fraises' ? '#ef4444' :
                    selectedCrop === 'aubergines' ? '#8b5cf6' :
                    '#3b82f6'
                  } 
                  radius={[4, 4, 0, 0]} 
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Meilleures pratiques */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold text-lg mb-4">Meilleures Pratiques pour Améliorer la Pollinisation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={bestPractices}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 20]} />
                <YAxis type="category" dataKey="practice" width={120} />
                <Tooltip formatter={(value) => [`+${value}%`, 'Impact potentiel']} />
                <Bar dataKey="impact" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {bestPractices.map((practice, index) => (
              <div key={index} className="p-3 bg-emerald-50 rounded-md">
                <p className="font-medium text-emerald-800">{practice.practice}</p>
                <p className="text-sm text-slate-600">{practice.description}</p>
                <p className="text-sm text-emerald-700 font-semibold mt-1">Impact: +{practice.impact}% sur le taux de pollinisation</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Conseils saisonniers */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-3">Conseils Saisonniers</h2>
        
        <div className="border border-emerald-100 rounded-lg p-4 bg-emerald-50">
          <h3 className="font-medium text-emerald-800 mb-2">Période optimale pour améliorer la pollinisation</h3>
          <p className="text-slate-700 mb-3">Selon l'analyse de vos données, la période idéale pour mettre en place des actions d'amélioration de la pollinisation est <strong>début juin</strong>, environ 2-3 semaines avant le pic habituel de floraison.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white p-3 rounded border border-slate-200">
              <h4 className="font-medium text-emerald-700">Actions prioritaires</h4>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Installer des plantes compagnes à proximité des cultures</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Placer des points d'eau peu profonds pour les insectes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Éviter tout traitement durant la période de floraison</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-3 rounded border border-slate-200">
              <h4 className="font-medium text-emerald-700">Cultures nécessitant attention</h4>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span><strong>Fraises</strong>: Déclin observé en fin de saison</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span><strong>Tomates</strong>: Performance optimale en juin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span><strong>Aubergines</strong>: Pic de pollinisation en août</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollinisationCompareToolData;