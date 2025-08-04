// File: components/compost/CompostBoxDetails.tsx
import React from 'react';
import { X, RotateCw, Edit, Calendar } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from './ui/Dialog';
import { 
  Tabs, TabsList, TabsTrigger, TabsContent 
} from './ui/Tabs';
import { 
  Card, CardHeader, CardTitle, CardContent, CardFooter 
} from './ui/Card';
import { FillLevelIndicator } from './ui/Card';
import { 
  formatDate, getStatusColor, getTemperatureIndicator, 
  getMoistureColor, getDaysSinceLastTurned 
} from './utils/compostHelpers';
import { CompostBox } from './data/compostInitialData';

interface CompostBoxDetailsProps {
  box: CompostBox;
  onClose: () => void;
  onEdit: (box: CompostBox) => void;
  onTurn: (boxId: number) => void;
}

const CompostBoxDetails: React.FC<CompostBoxDetailsProps> = ({ box, onClose, onEdit, onTurn }) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-3xl">
      <DialogHeader>
        <div className="flex justify-between items-center">
          <DialogTitle>Détails du Bac: {box.name}</DialogTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      </DialogHeader>
      
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="schedule">Planification</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Informations de base</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date de création:</span>
                      <span>{formatDate(box.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Statut:</span>
                      <span className={`px-2 py-0.5 rounded text-sm ${getStatusColor(box.status)}`}>
                        {box.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Dernier retournement:</span>
                      <span>{formatDate(box.lastTurned)} ({getDaysSinceLastTurned(box.lastTurned)} jours)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Conditions actuelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Remplissage:</span>
                      <span>{box.fillLevel}%</span>
                    </div>
                    <FillLevelIndicator level={box.fillLevel} />
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Température:</span>
                      <span className={getTemperatureIndicator(box.temperature)}>
                        {box.temperature}°C
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Humidité:</span>
                      <span className={getMoistureColor(box.moisture)}>
                        {box.moisture}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Matériaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {box.materials.map((material, index) => (
                    <div key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {material}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => onTurn(box.id)} 
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                <RotateCw className="w-4 h-4" />
                Retourner le compost
              </button>
              <button 
                onClick={() => {
                  onEdit(box);
                  onClose();
                }} 
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historique des actions</CardTitle>
            </CardHeader>
            <CardContent>
              {box.history && box.history.length > 0 ? (
                <div className="space-y-2">
                  {box.history.map((entry, index) => (
                    <div key={index} className="border-l-2 border-green-500 pl-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.action}</span>
                        <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                      </div>
                      {entry.notes && <p className="text-sm mt-1">{entry.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Aucun historique disponible pour ce bac
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Planification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-gray-500">
                Aucune tâche planifiée pour ce bac
              </div>
              {/* Scheduler interface could be added here */}
            </CardContent>
            <CardFooter>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded w-full justify-center">
                <Calendar className="w-4 h-4" />
                Planifier une nouvelle tâche
              </button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
);

export default CompostBoxDetails;