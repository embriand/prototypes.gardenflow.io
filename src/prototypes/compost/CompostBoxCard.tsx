// File: components/compost/CompostBoxCard.tsx
import React from 'react';
import { Trash2, Edit, AlertTriangle, ThermometerSun, Droplets, History, RotateCw } from 'lucide-react';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter 
} from './ui/card';
import { FillLevelIndicator } from './ui/card';
import { 
  formatDate, getStatusColor, getTemperatureIndicator, 
  getMoistureColor, getDaysSinceLastTurned, needsAction 
} from './utils/compostHelpers';
import { CompostBox } from './data/compostInitialData';

interface CompostBoxCardProps {
  box: CompostBox;
  onView: (box: CompostBox) => void;
  onEdit: (box: CompostBox) => void;
  onTurn: (boxId: number) => void;
  onDelete: (boxId: number) => void;
}

/**
 * Card component for displaying a single compost box with its key information
 * 
 * @param {CompostBox} box - The compost box data object
 * @param {Function} onView - Function to call when clicking on details
 * @param {Function} onEdit - Function to call when editing the box
 * @param {Function} onTurn - Function to call when turning the compost
 * @param {Function} onDelete - Function to call when deleting the box
 */
const CompostBoxCard: React.FC<CompostBoxCardProps> = ({ box, onView, onEdit, onTurn, onDelete }) => {
  const needsAttention = needsAction(box);
  const daysSinceLastTurn = getDaysSinceLastTurned(box.lastTurned);
  
  return (
    <Card className={`w-full ${needsAttention ? 'border-orange-300' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span className="truncate">{box.name}</span>
          {needsAttention && (
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          )}
        </CardTitle>
        <CardDescription className="flex justify-between">
          <span>Démarré le: {formatDate(box.startDate)}</span>
          <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(box.status)}`}>
            {box.status}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-sm mb-1 flex justify-between">
              <span>Niveau de Remplissage</span>
              <span>{box.fillLevel}%</span>
            </div>
            <FillLevelIndicator level={box.fillLevel} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-sm flex items-center gap-2">
              <ThermometerSun className={`w-4 h-4 ${getTemperatureIndicator(box.temperature)}`} />
              <span className={getTemperatureIndicator(box.temperature)}>{box.temperature}°C</span>
            </div>
            <div className="text-sm flex items-center gap-2">
              <Droplets className={`w-4 h-4 ${getMoistureColor(box.moisture)}`} />
              <span className={getMoistureColor(box.moisture)}>{box.moisture}</span>
            </div>
          </div>
          <div className="text-sm flex items-center gap-2">
            <History className="w-4 h-4" />
            <span>Retourné il y a {daysSinceLastTurn} jour{daysSinceLastTurn > 1 ? 's' : ''}</span>
          </div>
          <div className="text-sm mt-2">
            <div className="font-medium mb-1">Matériaux:</div>
            <div className="flex flex-wrap gap-1">
              {box.materials.slice(0, 3).map((material, index) => (
                <span key={index} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                  {material}
                </span>
              ))}
              {box.materials.length > 3 && (
                <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                  +{box.materials.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <button 
          onClick={() => onView(box)} 
          className="text-blue-500 text-sm hover:underline"
        >
          Détails
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => onTurn(box.id)} 
            className="p-1 text-blue-500"
            title="Retourner le compost"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onEdit(box)} 
            className="p-1 text-green-500"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(box.id)} 
            className="p-1 text-red-500"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CompostBoxCard;