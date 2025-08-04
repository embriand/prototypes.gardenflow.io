 
  import React, { useState } from 'react';
  import { PollinationAnalyzer } from './PollinationAnalyzer';
  
  const Pollination: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<'analyzer' | 'history' | 'about'>('analyzer');
    
    return (
      <div className="min-h-screen bg-slate-100">
        {/* En-tête de l'application */}
        <header className="bg-emerald-700 text-white p-4 shadow-md">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Analyse de Pollinisation</h1>
            
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <button
                    onClick={() => setCurrentTab('analyzer')}
                    className={`px-4 py-2 rounded transition ${
                      currentTab === 'analyzer' ? 'bg-white text-emerald-700' : 'text-white hover:bg-emerald-600'
                    }`}
                  >
                    Analyseur
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('history')}
                    className={`px-4 py-2 rounded transition ${
                      currentTab === 'history' ? 'bg-white text-emerald-700' : 'text-white hover:bg-emerald-600'
                    }`}
                  >
                    Historique
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('about')}
                    className={`px-4 py-2 rounded transition ${
                      currentTab === 'about' ? 'bg-white text-emerald-700' : 'text-white hover:bg-emerald-600'
                    }`}
                  >
                    À propos
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        {/* Contenu principal */}
        <main className="container mx-auto py-8 px-4">
          {currentTab === 'analyzer' && <PollinationAnalyzer />}
          
          {currentTab === 'history' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-emerald-700 mb-6">Historique des Analyses</h2>
              <p className="text-slate-500 text-center py-8">Aucune analyse n'a encore été effectuée.</p>
            </div>
          )}
          
          {currentTab === 'about' && (
            <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-emerald-700 mb-6">À propos de GardenFlow Pollination</h2>
              
              <div className="prose prose-emerald">
                <p>
                  <strong>GardenFlow Pollination</strong> est un outil d'analyse de pollinisation qui utilise
                  la vision par ordinateur pour évaluer l'efficacité de la pollinisation dans votre jardin
                  ou exploitation agricole.
                </p>
                
                <h3>Comment ça marche</h3>
                <p>
                  Notre application compare des photos prises à deux moments différents :
                </p>
                <ol>
                  <li><strong>Pendant la floraison</strong> - pour détecter les fleurs</li>
                  <li><strong>Pendant la fructification</strong> - pour détecter les fruits formés</li>
                </ol>
                
                <p>
                  En analysant ces deux images, notre algorithme peut déterminer :
                </p>
                <ul>
                  <li>Le taux de pollinisation (% de fleurs ayant produit des fruits)</li>
                  <li>La qualité de la pollinisation par zone</li>
                  <li>Les facteurs environnementaux influençant la pollinisation</li>
                  <li>Des recommandations pour améliorer la pollinisation</li>
                </ul>
              </div>
            </div>
          )}
        </main>
        
        {/* Pied de page */}
        <footer className="bg-slate-800 text-white p-6 mt-12">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} GardenFlow. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    );
  };
  
  export default Pollination;