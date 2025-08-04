// PollinationAnalyzer.tsx - Composant principal d'analyse
import React, { useState } from 'react';
import { Upload, ChevronRight, FileUp, AlertCircle, Camera } from 'lucide-react';
import { ImageData, Flower, Fruit, Match, AnalysisResult } from './types';
import { detectFlowers, detectFruits, matchFlowersToFruits, analyzeImages } from './imageProcessing';
import ImageVisualization from './ImageVisualization';
import AnalysisResults from './AnalysisResults';

export const PollinationAnalyzer: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<ImageData | null>(null);
  const [afterImage, setAfterImage] = useState<ImageData | null>(null);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Charger des images d'exemple
  const loadSampleImages = () => {
    setBeforeImage({
      url: "/api/placeholder/640/480",
      name: "courges_fleurs.png",
      description: "Floraison de courges - 15 juin"
    });
    
    setAfterImage({
      url: "/api/placeholder/640/480",
      name: "courges_fruits.png",
      description: "Fruits de courges - 15 juillet"
    });
  };
  
  // Analyser les images
  const handleAnalyze = () => {
    if (!beforeImage || !afterImage) return;
    
    setIsAnalyzing(true);
    
    // Simuler un délai pour l'analyse
    setTimeout(() => {
      const detectedFlowers = detectFlowers(beforeImage);
      const detectedFruits = detectFruits(afterImage);
      const flowersToFruits = matchFlowersToFruits(detectedFlowers, detectedFruits);
      const results = analyzeImages(beforeImage, afterImage);
      
      setFlowers(detectedFlowers);
      setFruits(detectedFruits);
      setMatches(flowersToFruits);
      setAnalysisResults(results);
      setIsAnalyzing(false);
    }, 1500);
  };
  
  // Réinitialiser l'analyse
  const resetAnalysis = () => {
    setBeforeImage(null);
    setAfterImage(null);
    setFlowers([]);
    setFruits([]);
    setMatches([]);
    setAnalysisResults(null);
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-slate-50 rounded-lg">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-emerald-700 mb-2">Analyseur de Pollinisation</h1>
        <p className="text-slate-600">Évaluez l'efficacité de la pollinisation en comparant les photos de floraison et de fructification</p>
      </header>
      
      {/* Section d'upload d'images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Image de floraison */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Camera size={20} className="text-blue-600" />
            Image de Floraison (Avant)
          </h2>
          
          {!beforeImage ? (
          <label className="border-2 border-dashed border-slate-300 rounded-lg p-16 text-center flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
            <Upload size={36} className="text-slate-400 mb-2" />
            <p className="text-slate-500">Cliquez pour charger une photo des fleurs</p>
            <p className="text-slate-400 text-sm mt-1">(JPG, PNG - max 10MB)</p>
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  // Dans une implémentation réelle, nous traiterions le fichier téléchargé
                  // Pour cette démo, nous utilisons un placeholder
                  setBeforeImage({
                    url: "/api/placeholder/640/480",
                    name: e.target.files[0].name || "image_fleurs.png",
                    description: "Image floraison (téléchargée par l'utilisateur)"
                  });
                }
              }}
            />
          </label>
        ) : (
          // Le reste du code reste inchangé
          <div className="flex flex-col">
            <div className="relative">
              <img 
                src={beforeImage.url} 
                alt="Image avant" 
                className="w-full h-64 object-cover rounded-md"
              />
              <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                Avant
              </div>
            </div>
            <div className="mt-2">
              <p className="font-medium">{beforeImage.name}</p>
              <p className="text-sm text-slate-500">{beforeImage.description}</p>
            </div>
            <button
              onClick={() => setBeforeImage(null)}
              className="text-sm text-blue-600 hover:text-blue-800 mt-2 self-start"
            >
              Changer d'image
            </button>
          </div>
        )}
        </div>
        
        {/* Image de fructification */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Camera size={20} className="text-green-600" />
            Image de Fructification (Après)
          </h2>
          
          {!afterImage ? (
              <label className="border-2 border-dashed border-slate-300 rounded-lg p-16 text-center flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors">
                <Upload size={36} className="text-slate-400 mb-2" />
                <p className="text-slate-500">Cliquez pour charger une photo des fruits</p>
                <p className="text-slate-400 text-sm mt-1">(JPG, PNG - max 10MB)</p>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      // Dans une implémentation réelle, nous traiterions le fichier téléchargé
                      // Pour cette démo, nous utilisons un placeholder
                      setAfterImage({
                        url: "/api/placeholder/640/480",
                        name: e.target.files[0].name || "image_fruits.png",
                        description: "Image fruits (téléchargée par l'utilisateur)"
                      });
                    }
                  }}
                />
              </label>
            ): (
            <div className="flex flex-col">
              <div className="relative">
                <img 
                  src={afterImage.url} 
                  alt="Image après" 
                  className="w-full h-64 object-cover rounded-md"
                />
                <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                  Après
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium">{afterImage.name}</p>
                <p className="text-sm text-slate-500">{afterImage.description}</p>
              </div>
              <button
                onClick={() => setAfterImage(null)}
                className="text-sm text-green-600 hover:text-green-800 mt-2 self-start"
              >
                Changer d'image
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <button 
          onClick={loadSampleImages}
          className="px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
          disabled={isAnalyzing}
        >
          Charger des images d'exemple
        </button>
        
        <button 
          onClick={handleAnalyze}
          disabled={!beforeImage || !afterImage || isAnalyzing}
          className={`px-4 py-2 rounded-md font-medium text-white flex items-center gap-2 ${
            !beforeImage || !afterImage ? 
            'bg-slate-400 cursor-not-allowed' : 
            isAnalyzing ? 
            'bg-amber-500' : 
            'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {isAnalyzing ? 'Analyse en cours...' : 'Analyser les images'}
          {!isAnalyzing && <ChevronRight size={18} />}
        </button>
        
        {analysisResults && (
          <button 
            onClick={resetAnalysis}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
          >
            Réinitialiser
          </button>
        )}
      </div>
      
      {/* Visualisation des résultats */}
      {analysisResults && beforeImage && afterImage && (
        <>
          <div className="mb-6">
            <ImageVisualization
              beforeImageUrl={beforeImage.url}
              afterImageUrl={afterImage.url}
              flowers={flowers}
              fruits={fruits}
              matches={matches}
            />
          </div>
          
          <AnalysisResults results={analysisResults} />
          
          {/* Bouton de téléchargement */}
          <div className="mt-6 flex justify-end">
            <button 
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center gap-2"
            >
              <FileUp size={18} />
              Télécharger le rapport complet (PDF)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PollinationAnalyzer;