import React from 'react';
import { X, Calendar, MapPin, Layers, Hash } from 'lucide-react';
import { Crop } from '../types';

interface CropDetailsModalProps {
  crop: Crop | null;
  onClose: () => void;
}

const CropDetailsModal: React.FC<CropDetailsModalProps> = ({ crop, onClose }) => {
  if (!crop) return null;

  const formatWeekRange = (start?: number, end?: number) => {
    if (!start || !end) return 'Non défini';
    return `Semaine ${start} à ${end}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{crop.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${crop.color}`} />
            <div>
              <div className="font-medium">{crop.name}</div>
              {crop.variety && (
                <div className="text-sm text-gray-600">{crop.variety}</div>
              )}
              <div className="text-xs text-gray-500">{crop.family}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-gray-500" />
              <span>Parcelle: {crop.parcelUuid}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Layers size={16} className="text-gray-500" />
              <span>Zone: {crop.zoneUuid}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Hash size={16} className="text-gray-500" />
              <span>Quantité: {crop.quantity}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-gray-500" />
              <span>Année: {crop.year}</span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Calendrier de culture</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Semis:</span>
                <span className="font-medium">
                  {formatWeekRange(crop.sowStartWeek, crop.sowEndWeek)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Culture:</span>
                <span className="font-medium">
                  {formatWeekRange(crop.cultureStartWeek, crop.cultureEndWeek)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Récolte:</span>
                <span className="font-medium">
                  {formatWeekRange(crop.harvestStartWeek, crop.harvestEndWeek)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Visualisation</h3>
            <div className="relative h-12 bg-gray-100 rounded overflow-hidden">
              {crop.sowStartWeek && crop.sowEndWeek && (
                <div
                  className="absolute h-4 bg-green-400 opacity-70 top-0"
                  style={{
                    left: `${(crop.sowStartWeek / 52) * 100}%`,
                    width: `${((crop.sowEndWeek - crop.sowStartWeek) / 52) * 100}%`
                  }}
                  title="Semis"
                />
              )}
              {crop.cultureStartWeek && crop.cultureEndWeek && (
                <div
                  className="absolute h-4 bg-blue-400 opacity-70 top-4"
                  style={{
                    left: `${(crop.cultureStartWeek / 52) * 100}%`,
                    width: `${((crop.cultureEndWeek - crop.cultureStartWeek) / 52) * 100}%`
                  }}
                  title="Culture"
                />
              )}
              {crop.harvestStartWeek && crop.harvestEndWeek && (
                <div
                  className="absolute h-4 bg-orange-400 opacity-70 top-8"
                  style={{
                    left: `${(crop.harvestStartWeek / 52) * 100}%`,
                    width: `${((crop.harvestEndWeek - crop.harvestStartWeek) / 52) * 100}%`
                  }}
                  title="Récolte"
                />
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Jan</span>
              <span>Juin</span>
              <span>Déc</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropDetailsModal;