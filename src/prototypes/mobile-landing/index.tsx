import React, { useState } from 'react';
import { Map, Calendar, CheckSquare, Leaf, Bell, Settings, Users, Clock, BarChart, Info } from 'lucide-react';
import MobileDeviceFrame from '../../components/MobileDeviceFrame';

const DummyComponent = ({ onBack }: { title: string; onBack: () => void }) => (
  <>
  <div 
      style={{ 
      backgroundColor: '#111111',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 50
      }} 
      className="min-h-screen flex flex-col items-center justify-center text-white space-y-4"
  >
      <div className="text-center space-y-6">
      <h1 className="text-2xl">En cours de développement</h1>
      <button 
          onClick={(e) => {
          e.stopPropagation();
          onBack();
          }}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 transition-colors rounded-md"
      >
          Retour
      </button>
      </div>
  </div>
  </>
);

const MobileLanding = () => {
  const [currentView, setCurrentView] = useState<string | React.ReactElement>('');
  const [selectedTile, setSelectedTile] = useState<{ view: string } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

interface Tile {
    title: string;
    icon: React.ReactElement;
    description: string;
    size: string;
    style: React.CSSProperties;
    textColor: string;
    view: string;
}

const handleTileClick = (tile: Tile): void => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedTile(tile);

    // Si c'est un composant temporaire/dummy
    if (tile.view === 'DummyComponent') {
        setCurrentView(
            <DummyComponent 
                title={tile.title}
                onBack={() => {
                    setCurrentView('landing');
                    setIsTransitioning(false);
                    setSelectedTile(null);
                }} 
            />
        );
        return;
    }

    // Simulate navigation for prototype
    setTimeout(() => {
        console.log(`Navigation to: ${tile.view}`);
        setIsTransitioning(false);
        setSelectedTile(null);
    }, 500);
};

  const tiles = [
    {
      title: 'Agenda',
      icon: <Calendar className="w-8 h-8" />,
      description: 'Quoi de neuf aujourd\'hui ?',
      size: 'col-span-2 row-span-2',
      style: { backgroundColor: '#343233' }, // Carbon
      textColor: 'text-white',
      view: 'calendarEvents'
    },
    {
      title: 'Tâches',
      icon: <CheckSquare className="w-8 h-8" />,
      description: '',
      size: 'col-span-1 row-span-1',
      style: { backgroundColor: '#3B5639' }, // Pine
      textColor: 'text-white',
      view: 'mobileClientTask'
    },
    {
      title: 'Crops',
      icon: <Leaf className="w-8 h-8" />,
      description: 'Vos cultures',
      size: 'col-span-2 row-span-1',
      style: { backgroundColor: '#D2D4AD' }, // Crystal Palace
      textColor: 'text-gray-800',
      view: 'cropPlanner'
    },
    {
      title: 'Annonces',
      icon: <Bell className="w-8 h-8" />,
      description: '',
      size: 'col-span-1 row-span-1',
      style: { backgroundColor: '#C7B144' }, // Sulphur
      textColor: 'text-gray-800',
      view: 'DummyComponent'
    },
    {
      title: 'Agenda',
      icon: <Clock className="w-8 h-8" />,
      description: 'Quoi de neuf ?',
      size: 'col-span-1 row-span-1',
      style: { backgroundColor: '#3B5639' }, // Pine
      textColor: 'text-white',
      view: 'calendarEvents'
    },
    {
      title: 'Stats',
      icon: <BarChart className="w-8 h-8" />,
      description: '',
      size: 'col-span-1 row-span-1',
      style: { backgroundColor: '#D2D4AD' }, // Crystal Palace
      textColor: 'text-gray-800',
      view: 'DummyComponent'
    },
    {
      title: 'L\'équipe',
      icon: <Users className="w-8 h-8" />,
      description: 'L\'équipe de l\'association',
      size: 'col-span-3 row-span-1',
      style: { backgroundColor: '#7B3C45' }, // Wild Berry
      textColor: 'text-white',
      view: 'DummyComponent'
    },
    {
        title: 'Map',
        icon: <Map className="w-8 h-8" />,
        description: '',
        size: 'col-span-3 row-span-1',
        style: { backgroundColor: '#7B3C45' }, // Wild Berry
        textColor: 'text-white',
        view: 'mapMobile'
      }
  ];

  return (
    <MobileDeviceFrame>
      <div style={{ backgroundColor: '#111111' }} className="h-full p-4 font-mono overflow-hidden">
      <style>
        {`
          @keyframes rotateOut {
            from {
              transform: perspective(1000px) rotateX(0deg);
            }
            to {
              transform: perspective(1000px) rotateX(90deg);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideOut {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(-20px);
            }
          }

          .tile {
            transform-style: preserve-3d;
            transform-origin: center center;
            backface-visibility: hidden;
          }

          .tile.rotating {
            animation: rotateOut 0.5s ease-in-out forwards;
            pointer-events: none;
          }

          .tile:hover {
            transform: translateY(4px);
            opacity: 0.9;
          }
        `}
      </style>

      <div className="w-full max-w-4xl mx-auto">        
        <div className="grid grid-cols-3 gap-3">
          {tiles.map((tile, index) => (
            <div 
              key={index} 
              className={`
                ${tile.size} 
                rounded-lg
                cursor-pointer 
                tile
                ${selectedTile?.view === tile.view ? 'rotating' : ''}
                ${isTransitioning ? 'pointer-events-none' : ''}
              `}
              style={{
                ...tile.style,
                minHeight: '160px',
                transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out'
              }}
              onClick={() => {
                if (tile.view === 'DummyComponent') {
                  setCurrentView(<DummyComponent 
                    title={tile.title} 
                    onBack={() => {
                      setCurrentView('');
                      setIsTransitioning(false);
                      setSelectedTile(null);
                    }} 
                  />);
                } else {
                  handleTileClick(tile);
                }}}
                >
              <div className="p-6 h-full flex flex-col justify-center items-center space-y-4">
                <div className={tile.textColor}>
                  {tile.icon}
                </div>
                <h2 className={`font-semibold text-lg ${tile.textColor} font-mono tracking-wide`}>
                  {tile.title}
                </h2>
                <p className={`text-sm ${tile.textColor} font-mono tracking-tight text-center max-w-[80%] opacity-90`}>
                  {tile.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {currentView}

      </div>
    </MobileDeviceFrame>
  );
};

export default React.memo(MobileLanding);