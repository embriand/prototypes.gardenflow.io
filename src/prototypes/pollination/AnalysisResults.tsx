// AnalysisResults.tsx - Composant d'affichage des résultats
import React from 'react';
import { AnalysisResult } from './types';
import { Info, BarChart4, Leaf, AlertCircle } from 'lucide-react';

interface AnalysisResultsProps {
  results: AnalysisResult;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Overview card */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Info size={20} className="text-emerald-600" />
          Résultat Global
        </h2>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-slate-500">Taux de pollinisation</p>
            <p className="text-2xl font-bold text-emerald-700">{results.pollinationRate}%</p>
          </div>
          <div className="h-20 w-20 rounded-full border-4 border-emerald-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-emerald-700">
              {results.pollinationRate >= 70 ? 'A' : results.pollinationRate >= 50 ? 'B' : 'C'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-2 rounded-md">
            <p className="text-xs text-slate-500">Fleurs</p>
            <p className="text-xl font-bold text-blue-700">{results.flowerCount}</p>
          </div>
          <div className="bg-green-50 p-2 rounded-md">
            <p className="text-xs text-slate-500">Fruits</p>
            <p className="text-xl font-bold text-green-700">{results.fruitCount}</p>
          </div>
          <div className="bg-amber-50 p-2 rounded-md col-span-2">
            <p className="text-xs text-slate-500">Qualité de pollinisation</p>
            <p className="text-xl font-bold text-amber-700">{results.pollinationQuality}</p>
          </div>
        </div>
      </div>
      
      {/* Efficiency by zones */}
      <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <BarChart4 size={20} className="text-emerald-600" />
          Efficacité par Zone
        </h2>
        <div className="overflow-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Fleurs</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Fruits</th>
                <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Taux</th>
                <th className="py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {results.pollinationEfficiency.map((zone, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="py-2 px-3 text-sm">{zone.zone}</td>
                  <td className="py-2 px-3 text-sm text-center">{zone.flowerCount}</td>
                  <td className="py-2 px-3 text-sm text-center">{zone.fruitCount}</td>
                  <td className="py-2 px-3 text-sm text-right font-medium">{zone.rate}%</td>
                  <td className="py-2 px-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          zone.rate >= 70 ? 'bg-green-500' : 
                          zone.rate >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${zone.rate}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Environmental factors */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Leaf size={20} className="text-emerald-600" />
          Facteurs Environnementaux
        </h2>
        <ul className="space-y-2">
          {Object.entries(results.environmentalFactors).map(([factor, value], index) => (
            <li key={index} className="flex justify-between border-b pb-2">
              <span className="text-sm capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className={`text-sm font-medium ${
                value === 'Excellente' ? 'text-green-600' : 
                value === 'Bonne' ? 'text-blue-600' : 
                value === 'Adéquate' ? 'text-amber-600' : 'text-slate-600'
              }`}>{value}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Activité des insectes</h3>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-sm mb-1"><span className="font-medium">Diversité:</span> {results.insectActivity.diversity}</p>
            <p className="text-sm mb-1"><span className="font-medium">Espèce dominante:</span> {results.insectActivity.dominantSpecies}</p>
            <p className="text-sm italic text-slate-600">{results.insectActivity.notes}</p>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <AlertCircle size={20} className="text-emerald-600" />
          Recommandations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.recommendations.map((rec, index) => (
            <div key={index} className="bg-slate-50 p-3 rounded-md border-l-4 border-emerald-500">
              <p className="text-slate-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;