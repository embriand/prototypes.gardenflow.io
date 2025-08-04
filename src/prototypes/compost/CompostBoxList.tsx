// File: components/compost/CompostBoxList.tsx
import React from 'react';
import { AlertTriangle, ThermometerSun, BarChart3, RotateCw, Edit, Trash2 } from 'lucide-react';
import { FillLevelIndicator } from './ui/card';
import { 
  formatDate, getStatusColor, getTemperatureIndicator, needsAction,
  getDaysSinceLastTurned
} from './utils/compostHelpers';
import { CompostBox } from './data/compostInitialData';

interface CompostBoxListItemProps {
  box: CompostBox;
  onView: (box: CompostBox) => void;
  onEdit: (box: CompostBox) => void;
  onTurn: (boxId: number) => void;
  onDelete: (boxId: number) => void;
}

const CompostBoxListItem: React.FC<CompostBoxListItemProps> = ({ box, onView, onEdit, onTurn, onDelete }) => {
  const needsAttention = needsAction(box);
  const daysSinceLastTurn = getDaysSinceLastTurned(box.lastTurned);
  
  return (
    <div className={`flex items-center gap-4 p-3 border rounded ${needsAttention ? 'border-orange-300 bg-orange-50' : ''}`}>
      <div className="flex-1">
        <div className="font-medium flex items-center gap-2">
          {box.name}
          {needsAttention && <AlertTriangle className="w-4 h-4 text-orange-500" />}
        </div>
        <div className="text-sm text-gray-500">
          Démarré: {formatDate(box.startDate)}
        </div>
      </div>
      <div className="flex-1 max-w-xs">
        <FillLevelIndicator level={box.fillLevel} />
        <div className="text-xs text-right mt-1">{box.fillLevel}%</div>
      </div>
      <div className={`px-2 py-1 rounded ${getStatusColor(box.status)}`}>
        {box.status}
      </div>
      <div className="flex items-center gap-2">
        <ThermometerSun className={`w-4 h-4 ${getTemperatureIndicator(box.temperature)}`} />
        <span className={getTemperatureIndicator(box.temperature)}>{box.temperature}°C</span>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => onView(box)} 
          className="p-1 text-blue-500"
          title="Voir détails"
        >
          <BarChart3 className="w-4 h-4" />
        </button>
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
    </div>
  );
};

interface CompostBoxListProps {
  boxes: CompostBox[];
  onView: (box: CompostBox) => void;
  onEdit: (box: CompostBox) => void;
  onTurn: (boxId: number) => void;
  onDelete: (boxId: number) => void;
}

const CompostBoxList: React.FC<CompostBoxListProps> = ({ boxes, onView, onEdit, onTurn, onDelete }) => {
  if (!boxes || boxes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun bac trouvé avec les critères sélectionnés
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {boxes.map(box => (
        <CompostBoxListItem 
          key={box.id} 
          box={box} 
          onView={onView}
          onEdit={onEdit}
          onTurn={onTurn}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CompostBoxList;