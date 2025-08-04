import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Leaf, Sparkles, Flower } from 'lucide-react';
import { CompanionPlant } from './models/PollinationModel';

interface CompanionsViewProps {
  companionPlants: CompanionPlant[];
}

const CompanionsView: React.FC<CompanionsViewProps> = ({ companionPlants }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Companion Plants</h2>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Sparkles className="h-3 w-3 mr-1" /> Enhances Pollination
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companionPlants.map((plant, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-green-500" />
                {plant.name}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <p className="text-sm">{plant.benefits}</p>
              
              <div>
                <h3 className="text-sm font-medium mb-1 flex items-center">
                  <Flower className="h-4 w-4 mr-1 text-purple-500" />
                  Compatible With
                </h3>
                <div className="flex flex-wrap gap-1">
                  {plant.compatibleWith.map((crop, idx) => (
                    <Badge key={idx} variant="secondary">{crop}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="text-sm border-t pt-2 mt-2">
                <span className="font-medium">Recommendation: </span>
                {plant.plantingRecommendation}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-green-600" />
            Why Companion Planting Matters
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-2 text-sm">
          <p>
            Companion planting is a strategic method to increase pollinator activity in your garden,
            resulting in better crop yields and healthier plants.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Attracts a diversity of beneficial insects to your garden</li>
            <li>Extends the bloom season to support pollinators throughout the growing season</li>
            <li>Creates habitat for pollinators to rest and reproduce</li>
            <li>May reduce the need for manual pollination of certain crops</li>
            <li>Often provides additional benefits such as pest control or soil improvement</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanionsView;