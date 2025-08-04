import { FC } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Crop, PollinationStatus, getStatusColor, getScoreColor } from './models/PollinationModel';

interface PlantDetailModalProps {
  plant: Crop | null;
  onClose: () => void;
}

const PlantDetailModal: FC<PlantDetailModalProps> = ({ plant, onClose }) => {
  if (!plant) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Overlay backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto bg-white relative z-10">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>{plant.name}</CardTitle>
              <CardDescription>
                {plant.family} • {plant.quantity} plants • {plant.location.parcel}
              </CardDescription>
            </div>
            <Badge variant="outline" className={`${getStatusColor(plant.pollination.status as PollinationStatus)} text-white`}>
              {plant.pollination.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Pollination Details</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <dt className="text-sm text-gray-500">Type</dt>
                <dd className="text-sm capitalize">{plant.pollination.type}</dd>
                
                <dt className="text-sm text-gray-500">Method</dt>
                <dd className="text-sm">{plant.pollination.method}</dd>
                
                <dt className="text-sm text-gray-500">Self-Fertile</dt>
                <dd className="text-sm">{plant.pollination.selfFertile ? 'Yes' : 'No'}</dd>
                
                <dt className="text-sm text-gray-500">Needs</dt>
                <dd className="text-sm capitalize">{plant.pollination.needs}</dd>
                
                <dt className="text-sm text-gray-500">Bloom Period</dt>
                <dd className="text-sm">
                  Weeks {plant.pollination.bloomPeriod.estimatedStartWeek} - {plant.pollination.bloomPeriod.estimatedEndWeek}, {plant.pollination.bloomPeriod.year}
                </dd>
                
                <dt className="text-sm text-gray-500">Score</dt>
                <dd className={`text-sm font-bold ${getScoreColor(plant.pollination.score)}`}>
                  {plant.pollination.score}%
                </dd>
              </dl>
              
              <h3 className="text-lg font-medium mt-4 mb-2">Pollinators</h3>
              <div className="flex flex-wrap gap-1 mb-4">
                {plant.pollination.pollinators.map((pollinator, index) => (
                  <Badge key={index} variant="secondary" className="capitalize">{pollinator}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Pollinator Activity by Week</h3>
              <div className="flex flex-col gap-2">
                {Object.entries(plant.pollination.pollinatorActivity).map(([week, activity]) => (
                  <div key={week} className="flex items-center">
                    <div className="w-12">Week {week}</div>
                    <div className="h-4 flex-1 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          activity.forecast === 'high' ? 'bg-green-500' : 
                          activity.forecast === 'moderate' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${parseFloat(activity.level) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-right capitalize text-sm">{activity.forecast}</div>
                  </div>
                ))}
              </div>
              
              {plant.pollination.potentialPollinizers.length > 0 && (
                <>
                  <h3 className="text-lg font-medium mt-4 mb-2">Potential Pollinizers</h3>
                  <ul className="pl-5 list-disc">
                    {plant.pollination.potentialPollinizers.map((pollinizer, idx) => (
                      <li key={idx} className="mb-1">
                        <span className="font-medium">{pollinizer.name}</span> - 
                        {pollinizer.distance}m away, 
                        {pollinizer.bloomOverlap ? (
                          <span className="text-green-600"> bloom periods overlap</span>
                        ) : (
                          <span className="text-red-600"> bloom periods don't overlap</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              {plant.pollination.recommendations.length > 0 && (
                <>
                  <h3 className="text-lg font-medium mt-4 mb-2 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-1 text-amber-500" />
                    Recommendations
                  </h3>
                  <ul className="pl-5 list-disc">
                    {plant.pollination.recommendations.map((rec, idx) => (
                      <li key={idx} className="mb-1">{rec}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlantDetailModal;