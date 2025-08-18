import React from 'react';
import { Crop } from '../types';

interface CropPhaseBarProps {
  crop: Crop;
  phase: 'sow' | 'culture' | 'harvest';
  monthIndex: number;
  onClick?: (crop: Crop) => void;
}

const CropPhaseBar: React.FC<CropPhaseBarProps> = ({ crop, phase, monthIndex, onClick }) => {
  const monthStartWeek = monthIndex * 4 + 1;
  const monthEndWeek = (monthIndex + 1) * 4;

  let phaseStartWeek: number | undefined;
  let phaseEndWeek: number | undefined;
  let phaseColor: string;
  let phaseLabel: string;
  let phaseGradient: string;

  switch (phase) {
    case 'sow':
      phaseStartWeek = crop.sowStartWeek;
      phaseEndWeek = crop.sowEndWeek;
      phaseColor = 'bg-green-400';
      phaseGradient = 'bg-gradient-to-r from-green-400 to-green-500';
      phaseLabel = 'S';
      break;
    case 'culture':
      phaseStartWeek = crop.cultureStartWeek;
      phaseEndWeek = crop.cultureEndWeek;
      phaseColor = 'bg-blue-400';
      phaseGradient = 'bg-gradient-to-r from-blue-400 to-blue-500';
      phaseLabel = 'C';
      break;
    case 'harvest':
      phaseStartWeek = crop.harvestStartWeek;
      phaseEndWeek = crop.harvestEndWeek;
      phaseColor = 'bg-orange-400';
      phaseGradient = 'bg-gradient-to-r from-orange-400 to-orange-500';
      phaseLabel = 'R';
      break;
  }

  // Check if phase is active in this month
  if (!phaseStartWeek || !phaseEndWeek) return null;
  if (phaseEndWeek < monthStartWeek || phaseStartWeek > monthEndWeek) return null;

  // Calculate position within the month
  const effectiveStart = Math.max(phaseStartWeek, monthStartWeek);
  const effectiveEnd = Math.min(phaseEndWeek, monthEndWeek);
  
  const monthWeeks = 4;
  const startPosition = ((effectiveStart - monthStartWeek) / monthWeeks) * 100;
  const width = ((effectiveEnd - effectiveStart + 1) / monthWeeks) * 100;

  // Determine if this is the start or end of the phase
  const isPhaseStart = phaseStartWeek >= monthStartWeek;
  const isPhaseEnd = phaseEndWeek <= monthEndWeek;
  
  // Apply rounded corners based on phase boundaries
  const roundedClass = `${isPhaseStart ? 'rounded-l-full' : ''} ${isPhaseEnd ? 'rounded-r-full' : ''}`;

  // Determine vertical position based on phase type
  const verticalPosition = phase === 'sow' ? 'top-0.5' : phase === 'culture' ? 'top-[14px]' : 'bottom-0.5';

  return (
    <div
      className={`absolute h-[10px] ${phaseGradient} ${roundedClass} ${verticalPosition} opacity-85 hover:opacity-100 transition-all cursor-pointer hover:scale-y-110 hover:shadow-lg hover:z-10`}
      style={{
        left: `${startPosition}%`,
        width: `${width}%`,
        minWidth: '4px'
      }}
      onClick={() => onClick?.(crop)}
      title={`${phase === 'sow' ? 'Semis' : phase === 'culture' ? 'Culture' : 'Récolte'}: S${phaseStartWeek}-S${phaseEndWeek}`}
    >
      {/* Show label only if there's enough space */}
      {width > 15 && (
        <span className="text-[9px] text-white font-bold px-1 leading-[10px] select-none">
          {phaseLabel}
        </span>
      )}
    </div>
  );
};

export default CropPhaseBar;