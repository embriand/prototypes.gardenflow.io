// File: components/compost/CompostBoxGrid.tsx
import React from 'react';
import CompostBoxCard from './CompostBoxCard';
import { CompostBox } from './data/compostInitialData';

interface CompostBoxGridProps {
  boxes: CompostBox[];
  onView: (box: CompostBox) => void;
  onEdit: (box: CompostBox) => void;
  onTurn: (boxId: number) => void;
  onDelete: (boxId: number) => void;
}

/**
 * Grid view component for displaying compost boxes in a responsive grid layout
 * 
 * @param boxes - Array of box objects to display
 * @param onView - Function to call when viewing box details
 * @param onEdit - Function to call when editing a box
 * @param onTurn - Function to call when turning a compost box
 * @param onDelete - Function to call when deleting a box
 */
const CompostBoxGrid: React.FC<CompostBoxGridProps> = ({ boxes, onView, onEdit, onTurn, onDelete }) => {
  // Show a message if no boxes are available
  if (!boxes || boxes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun bac trouvé avec les critères sélectionnés
      </div>
    );
  }

  // Display boxes in a responsive grid layout
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {boxes.map(box => (
        <CompostBoxCard 
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

export default CompostBoxGrid;