
// import React, { useState } from 'react';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card';
// import { Badge } from '../../../components/ui/badge';
// import { Button } from '../../../components/ui/button';
// import { CalendarIcon, Leaf, AlertTriangle, Bell, Info, Activity, CheckCircle, XCircle, BarChart2 } from 'lucide-react';

// // Mock data interface for the pollination model
// const mockPollinationData = {
//   crops: [
//     {
//       product_item_uuid: "ee2a593a-3938-4fe1-a067-dfe7c250f9a2",
//       name: "Carotte",
//       family: "Apiacées",
//       category: "vegetable",
//       quantity: 24,
//       location: {
//         parcel: "Vegetable Plot",
//         zone: "Root Vegetables"
//       },
//       pollination: {
//         type: "entomophilous",
//         method: "self and cross-pollination",
//         selfFertile: true,
//         needs: "medium",
//         pollinators: ["bees", "wasps", "flies", "beetles"],
//         bloomPeriod: {
//           estimatedStartWeek: 19,
//           estimatedEndWeek: 23,
//           year: 2025
//         },
//         potentialPollinizers: [],
//         pollinatorActivity: {
//           "19": { level: "0.16", forecast: "low" },
//           "20": { level: "0.67", forecast: "moderate" },
//           "21": { level: "0.98", forecast: "high" },
//           "22": { level: "0.65", forecast: "moderate" },
//           "23": { level: "0.35", forecast: "low" }
//         },
//         status: "adequate",
//         score: 60,
//         recommendations: []
//       }
//     },
//     {
//       product_item_uuid: "c7a58109-65f4-4c35-9960-6a0802d909b5",
//       name: "Pastèque",
//       family: "Cucurbitacées",
//       category: "fruit",
//       quantity: 5,
//       location: {
//         parcel: "P2",
//         zone: "Z21"
//       },
//       pollination: {
//         type: "entomophilous",
//         method: "cross-pollination",
//         selfFertile: false,
//         needs: "high", 
//         pollinators: ["bees", "squash bees"],
//         bloomPeriod: {
//           estimatedStartWeek: 13,
//           estimatedEndWeek: 15,
//           year: 2025
//         },
//         potentialPollinizers: [],
//         pollinatorActivity: {
//           "13": { level: "0.40", forecast: "low" },
//           "14": { level: "1.00", forecast: "high" },
//           "15": { level: "0.35", forecast: "low" }
//         },
//         status: "insufficient",
//         score: 0,
//         recommendations: [
//           "Plant companion flowers to attract more pollinators",
//           "Plant compatible pollinizers like other watermelon varieties within 100 meters",
//           "Increase variety diversity for better cross-pollination"
//         ]
//       }
//     },
//     {
//       product_item_uuid: "d109b761-c934-4226-a1cc-7ba2e0a925ef",
//       name: "Pommier",
//       family: "Rosacées",
//       category: "tree",
//       quantity: 1,
//       location: {
//         parcel: "P22",
//         zone: "P22Z1"
//       },
//       pollination: {
//         type: "entomophilous",
//         method: "cross-pollination",
//         selfFertile: false,
//         needs: "high",
//         pollinators: ["bees", "bumblebees", "hover flies"],
//         bloomPeriod: {
//           estimatedStartWeek: 12,
//           estimatedEndWeek: 14,
//           year: 2025
//         },
//         potentialPollinizers: [
//           {
//             name: "Fuji",
//             distance: "0.00",
//             inRange: true,
//             bloomOverlap: true,
//             effectivenessScore: 100
//           }
//         ],
//         pollinatorActivity: {
//           "12": { level: "0.44", forecast: "moderate" },
//           "13": { level: "1.00", forecast: "high" },
//           "14": { level: "0.38", forecast: "low" }
//         },
//         status: "optimal",
//         score: 100,
//         recommendations: []
//       }
//     },
//     {
//       product_item_uuid: "49f10f54-ae10-49b3-b9d1-8dee8c784bd7",
//       name: "Pommier",
//       family: "Rosacées",
//       category: "tree",
//       quantity: 1,
//       location: {
//         parcel: "P2",
//         zone: "Z21"
//       },
//       pollination: {
//         type: "entomophilous",
//         method: "cross-pollination",
//         selfFertile: false,
//         needs: "high",
//         pollinators: ["bees", "bumblebees", "hover flies"],
//         bloomPeriod: {
//           estimatedStartWeek: 6,
//           estimatedEndWeek: 7,
//           year: 2025
//         },
//         potentialPollinizers: [
//           {
//             name: "Fuji",
//             distance: "5.83",
//             inRange: true,
//             bloomOverlap: false,
//             effectivenessScore: 0
//           }
//         ],
//         pollinatorActivity: {
//           "6": { level: "0.31", forecast: "low" },
//           "7": { level: "0.20", forecast: "low" }
//         },
//         status: "insufficient",
//         score: 0,
//         recommendations: [
//           "Plant companion flowers to attract more pollinators",
//           "Increase variety diversity for better cross-pollination"
//         ]
//       }
//     },
//     {
//       product_item_uuid: "867e526c-4414-4a6b-80da-7c423ec8bdfe",
//       name: "Fuji",
//       family: "Rosacées",
//       category: "fruit",
//       quantity: 5,
//       location: {
//         parcel: "NewP1",
//         zone: "NewP1Z1"
//       },
//       pollination: {
//         type: "entomophilous",
//         method: "cross-pollination",
//         selfFertile: false,
//         needs: "high",
//         pollinators: ["bees", "bumblebees", "hover flies"],
//         bloomPeriod: {
//           estimatedStartWeek: 11,
//           estimatedEndWeek: 12,
//           year: 2025
//         },
//         potentialPollinizers: [
//           {
//             name: "Pommier",
//             distance: "0.00",
//             inRange: true,
//             bloomOverlap: true,
//             effectivenessScore: 100
//           }
//         ],
//         pollinatorActivity: {
//           "11": { level: "0.20", forecast: "low" },
//           "12": { level: "0.38", forecast: "low" }
//         },
//         status: "adequate",
//         score: 70,
//         recommendations: []
//       }
//     },
//     {
//       product_item_uuid: "e7dbe958-fc23-4577-97bf-1e08066d331c",
//       name: "Cœur de Bœuf",
//       family: "Solanacées",
//       category: "vegetable",
//       quantity: 6,
//       location: {
//         parcel: "Vegetable Plot",
//         zone: "Tomato Bed"
//       },
//       pollination: {
//         type: "entomophilous",
//         method: "self-pollination",
//         selfFertile: true,
//         needs: "low",
//         pollinators: ["bumblebees", "carpenter bees", "wind"],
//         bloomPeriod: {
//           estimatedStartWeek: 24,
//           estimatedEndWeek: 29,
//           year: 2025
//         },
//         potentialPollinizers: [],
//         pollinatorActivity: {
//           "24": { level: "0.30", forecast: "low" },
//           "25": { level: "0.60", forecast: "moderate" },
//           "26": { level: "0.85", forecast: "high" },
//           "27": { level: "0.90", forecast: "high" },
//           "28": { level: "0.70", forecast: "high" },
//           "29": { level: "0.40", forecast: "moderate" }
//         },
//         status: "optimal",
//         score: 90,
//         recommendations: []
//       }
//     }
//   ],
//   pollinators: {
//     bees: {
//       population: "moderate",
//       trend: "stable",
//       activity: {
//         morning: "high",
//         midday: "very high",
//         afternoon: "moderate",
//         evening: "low"
//       },
//       favoredPlants: ["Fraise", "Pommier", "Fuji"],
//       attractionPlants: ["lavender", "borage", "sunflower"]
//     },
//     bumblebees: {
//       population: "high",
//       trend: "increasing",
//       activity: {
//         morning: "moderate",
//         midday: "high",
//         afternoon: "high",
//         evening: "moderate"
//       },
//       favoredPlants: ["Cœur de Bœuf", "Pastèque"],
//       attractionPlants: ["foxglove", "comfrey", "snapdragon"]
//     },
//     hoverflies: {
//       population: "low",
//       trend: "fluctuating",
//       activity: {
//         morning: "low",
//         midday: "moderate",
//         afternoon: "moderate",
//         evening: "low"
//       },
//       favoredPlants: ["Carotte", "Fraise"],
//       attractionPlants: ["fennel", "dill", "cosmos"]
//     },
//     butterflies: {
//       population: "moderate",
//       trend: "increasing",
//       activity: {
//         morning: "low",
//         midday: "high",
//         afternoon: "high",
//         evening: "moderate"
//       },
//       favoredPlants: ["Fraise"],
//       attractionPlants: ["butterfly bush", "milkweed", "zinnia"]
//     }
//   },
//   companionPlants: [
//     {
//       name: "Borage",
//       benefits: "Attracts pollinators, especially bees",
//       compatibleWith: ["Fraise", "Cœur de Bœuf"],
//       plantingRecommendation: "Plant near strawberries and tomatoes"
//     },
//     {
//       name: "Phacelia",
//       benefits: "Excellent pollinator attractor, beneficial insect habitat",
//       compatibleWith: ["Carotte", "Pommier", "Fuji"],
//       plantingRecommendation: "Plant as border or between fruit trees"
//     },
//     {
//       name: "Sweet Alyssum",
//       benefits: "Attracts hover flies and beneficial insects",
//       compatibleWith: ["Carotte", "Fraise"],
//       plantingRecommendation: "Use as ground cover between vegetable rows"
//     },
//     {
//       name: "Calendula",
//       benefits: "Attracts pollinators and repels pests",
//       compatibleWith: ["Cœur de Bœuf", "Pastèque"],
//       plantingRecommendation: "Plant throughout vegetable beds"
//     },
//     {
//       name: "Nasturtium",
//       benefits: "Attracts pollinators and acts as trap crop",
//       compatibleWith: ["Pastèque", "Carotte"],
//       plantingRecommendation: "Plant at edges of garden beds"
//     }
//   ],
//   gardenStats: {
//     pollinationScore: 53,
//     pollinatorDiversity: 4,
//     companionPlantingScore: 65,
//     highNeedCrops: 4,
//     highNeedCropsAtRisk: 2,
//     currentWeek: 18,
//     activeBloomingCrops: 1
//   }
// };

// const PollinationDashboard = () => {
//   const [selectedPlant, setSelectedPlant] = useState(null);
//   const [filter, setFilter] = useState('all');
//   const [currentWeek] = useState(mockPollinationData.gardenStats.currentWeek);
  
//   // Helper functions
//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'optimal': return 'bg-green-500';
//       case 'adequate': return 'bg-blue-500';
//       case 'insufficient': return 'bg-red-500';
//       default: return 'bg-gray-500';
//     }
//   };
  
//   const getScoreColor = (score) => {
//     if (score >= 80) return 'text-green-600';
//     if (score >= 50) return 'text-blue-600';
//     return 'text-red-600';
//   };
  
//   const filteredCrops = filter === 'all' 
//     ? mockPollinationData.crops 
//     : mockPollinationData.crops.filter(crop => crop.pollination.status === filter);
  
//   const atRiskCrops = mockPollinationData.crops.filter(
//     crop => crop.pollination.needs === 'high' && crop.pollination.status !== 'optimal'
//   );
  
//   const currentlyBlooming = mockPollinationData.crops.filter(
//     crop => crop.pollination.bloomPeriod.estimatedStartWeek <= currentWeek && 
//            crop.pollination.bloomPeriod.estimatedEndWeek >= currentWeek
//   );
  
//   const upcomingBlooms = mockPollinationData.crops.filter(
//     crop => crop.pollination.bloomPeriod.estimatedStartWeek > currentWeek && 
//            crop.pollination.bloomPeriod.estimatedStartWeek <= currentWeek + 4
//   );

//   return (
//     <div className="flex flex-col gap-4 w-full p-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Garden Pollination Dashboard</h1>
//         <div className="flex items-center">
//           <CalendarIcon className="h-5 w-5 mr-2" />
//           <span>Current Week: {currentWeek} / {new Date().getFullYear()}</span>
//         </div>
//       </div>
      
//       {/* Garden Overview Statistics */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500">Garden Pollination Score</span>
//               <div className="flex items-end gap-2">
//                 <span className={`text-3xl font-bold ${getScoreColor(mockPollinationData.gardenStats.pollinationScore)}`}>
//                   {mockPollinationData.gardenStats.pollinationScore}%
//                 </span>
//                 <Leaf className="h-5 w-5 text-green-500" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500">Pollinator Diversity</span>
//               <div className="flex items-end gap-2">
//                 <span className="text-3xl font-bold text-indigo-600">
//                   {mockPollinationData.gardenStats.pollinatorDiversity}
//                 </span>
//                 <span className="text-sm">species</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500">High-Need Plants At Risk</span>
//               <div className="flex items-center gap-2">
//                 <span className="text-3xl font-bold text-amber-600">
//                   {mockPollinationData.gardenStats.highNeedCropsAtRisk}
//                 </span>
//                 <span className="text-sm">of {mockPollinationData.gardenStats.highNeedCrops}</span>
//                 {mockPollinationData.gardenStats.highNeedCropsAtRisk > 0 && 
//                   <AlertTriangle className="h-5 w-5 text-amber-500" />
//                 }
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500">Currently Blooming</span>
//               <div className="flex items-end gap-2">
//                 <span className="text-3xl font-bold text-pink-600">
//                   {mockPollinationData.gardenStats.activeBloomingCrops}
//                 </span>
//                 <span className="text-sm">plants</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
      
//       <Tabs defaultValue="crops" className="w-full">
//         <TabsList className="mb-4">
//           <TabsTrigger value="crops">Crops</TabsTrigger>
//           <TabsTrigger value="bloom-calendar">Bloom Calendar</TabsTrigger>
//           <TabsTrigger value="pollinators">Pollinators</TabsTrigger>
//           <TabsTrigger value="companions">Companion Plants</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="crops">
//           <div className="flex justify-between mb-4">
//             <div className="flex gap-2">
//               <Button 
//                 variant={filter === 'all' ? 'default' : 'outline'} 
//                 size="sm"
//                 onClick={() => setFilter('all')}
//               >
//                 All
//               </Button>
//               <Button 
//                 variant={filter === 'optimal' ? 'default' : 'outline'} 
//                 size="sm"
//                 onClick={() => setFilter('optimal')}
//                 className="bg-green-500 hover:bg-green-600 text-white"
//               >
//                 Optimal
//               </Button>
//               <Button 
//                 variant={filter === 'adequate' ? 'default' : 'outline'} 
//                 size="sm"
//                 onClick={() => setFilter('adequate')}
//                 className="bg-blue-500 hover:bg-blue-600 text-white"
//               >
//                 Adequate
//               </Button>
//               <Button 
//                 variant={filter === 'insufficient' ? 'default' : 'outline'} 
//                 size="sm"
//                 onClick={() => setFilter('insufficient')}
//                 className="bg-red-500 hover:bg-red-600 text-white"
//               >
//                 Insufficient
//               </Button>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredCrops.map((crop) => (
//               <Card key={crop.product_item_uuid} className="overflow-hidden">
//                 <CardHeader className="pb-2">
//                   <div className="flex justify-between">
//                     <CardTitle>{crop.name}</CardTitle>
//                     <Badge variant="outline" className={`${getStatusColor(crop.pollination.status)} text-white`}>
//                       {crop.pollination.status}
//                     </Badge>
//                   </div>
//                   <CardDescription>
//                     {crop.family} • {crop.quantity} plants • {crop.location.parcel}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="pb-2">
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <p className="text-sm text-gray-500">Pollination Score</p>
//                       <p className={`text-xl font-bold ${getScoreColor(crop.pollination.score)}`}>
//                         {crop.pollination.score}%
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Bloom Period</p>
//                       <p className="text-sm">
//                         Week {crop.pollination.bloomPeriod.estimatedStartWeek} - {crop.pollination.bloomPeriod.estimatedEndWeek}
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="mb-4">
//                     <p className="text-sm text-gray-500 mb-1">Pollinators</p>
//                     <div className="flex flex-wrap gap-1">
//                       {crop.pollination.pollinators.map((pollinator, index) => (
//                         <Badge key={index} variant="secondary">{pollinator}</Badge>
//                       ))}
//                     </div>
//                   </div>
                  
//                   {crop.pollination.recommendations.length > 0 && (
//                     <div className="mt-2">
//                       <div className="text-sm text-amber-600 font-medium flex items-center gap-1">
//                         <AlertTriangle className="h-4 w-4" />
//                         Recommendations:
//                       </div>
//                       <ul className="text-sm mt-1 pl-5 list-disc">
//                         {crop.pollination.recommendations.map((rec, index) => (
//                           <li key={index}>{rec}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </CardContent>
//                 <CardFooter className="border-t pt-2 pb-2">
//                   <Button 
//                     variant="ghost" 
//                     size="sm"
//                     onClick={() => setSelectedPlant(crop)}
//                   >
//                     View Details
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>
        
//         <TabsContent value="bloom-calendar">
//           <Card>
//             <CardHeader>
//               <CardTitle>Bloom Calendar</CardTitle>
//               <CardDescription>View when your plants are blooming throughout the season</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr>
//                       <th className="text-left p-2 border-b">Plant</th>
//                       {Array.from({length: 30}, (_, i) => i + 1).map(week => (
//                         <th key={week} className={`p-2 border-b text-center w-8 ${week === currentWeek ? 'bg-blue-100' : ''}`}>
//                           {week}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {mockPollinationData.crops.map(crop => (
//                       <tr key={crop.product_item_uuid}>
//                         <td className="p-2 border-b font-medium">{crop.name}</td>
//                         {Array.from({length: 30}, (_, i) => i + 1).map(week => {
//                           const isBloomWeek = week >= crop.pollination.bloomPeriod.estimatedStartWeek && 
//                                              week <= crop.pollination.bloomPeriod.estimatedEndWeek;
//                           const isPeakBloom = isBloomWeek && 
//                             week > crop.pollination.bloomPeriod.estimatedStartWeek + 1 && 
//                             week < crop.pollination.bloomPeriod.estimatedEndWeek - 1;
//                           const isCurrent = week === currentWeek;
                          
//                           let cellClass = 'p-2 border-b text-center';
                          
//                           if (isCurrent && isBloomWeek) {
//                             cellClass += ' bg-pink-500 text-white';
//                           } else if (isPeakBloom) {
//                             cellClass += ' bg-pink-300';
//                           } else if (isBloomWeek) {
//                             cellClass += ' bg-pink-100';
//                           } else if (isCurrent) {
//                             cellClass += ' bg-blue-100';
//                           }
                          
//                           return <td key={week} className={cellClass}>{isBloomWeek ? '•' : ''}</td>;
//                         })}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </CardContent>
//           </Card>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="flex items-center">
//                   <Leaf className="mr-2 h-5 w-5 text-pink-500" />
//                   Currently Blooming
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {currentlyBlooming.length > 0 ? (
//                   <ul className="pl-5 list-disc">
//                     {currentlyBlooming.map(crop => (
//                       <li key={crop.product_item_uuid}>
//                         <span className="font-medium">{crop.name}</span> - {crop.location.parcel}, {crop.location.zone}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-500">No plants currently blooming</p>
//                 )}
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="flex items-center">
//                   <Bell className="mr-2 h-5 w-5 text-amber-500" />
//                   Upcoming Blooms (Next 4 Weeks)
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {upcomingBlooms.length > 0 ? (
//                   <ul className="pl-5 list-disc">
//                     {upcomingBlooms.map(crop => (
//                       <li key={crop.product_item_uuid}>
//                         <span className="font-medium">{crop.name}</span> - Starting week {crop.pollination.bloomPeriod.estimatedStartWeek}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-500">No upcoming blooms in the next 4 weeks</p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
        
//         <TabsContent value="pollinators">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {Object.entries(mockPollinationData.pollinators).map(([key, pollinator]) => (
//               <Card key={key}>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="capitalize">{key}</CardTitle>
//                   <div className="flex gap-2">
//                     <Badge variant="outline">{pollinator.population} population</Badge>
//                     <Badge variant="outline">{pollinator.trend} trend</Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="mb-4">
//                     <h4 className="text-sm font-medium text-gray-500">Daily Activity</h4>
//                     <div className="flex justify-between mt-1">
//                       {Object.entries(pollinator.activity).map(([time, level]) => (
//                         <div key={time} className="text-center">
//                           <p className="text-xs capitalize">{time}</p>
//                           <div className={`h-16 w-4 mx-auto rounded-full overflow-hidden bg-gray-100 mt-1`}>
//                             <div 
//                               className="bg-green-500 w-full transition-all duration-300"
//                               style={{ 
//                                 height: level === 'very high' ? '100%' : 
//                                         level === 'high' ? '75%' : 
//                                         level === 'moderate' ? '50%' : '25%' 
//                               }}
//                             ></div>
//                           </div>
//                           <p className="text-xs mt-1 capitalize">{level}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-500">Favored Plants</h4>
//                       <ul className="mt-1 text-sm pl-5 list-disc">
//                         {pollinator.favoredPlants.map((plant, i) => (
//                           <li key={i}>{plant}</li>
//                         ))}
//                       </ul>
//                     </div>
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-500">Attraction Plants</h4>
//                       <ul className="mt-1 text-sm pl-5 list-disc">
//                         {pollinator.attractionPlants.map((plant, i) => (
//                           <li key={i}>{plant}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>
        
//         <TabsContent value="companions">
//           <Card>
//             <CardHeader>
//               <CardTitle>Pollinator-Friendly Companion Plants</CardTitle>
//               <CardDescription>
//                 These plants can enhance pollination in your garden when planted near specific crops
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {mockPollinationData.companionPlants.map((plant, idx) => (
//                   <Card key={idx}>
//                     <CardHeader className="pb-2">
//                       <CardTitle>{plant.name}</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="mb-3">{plant.benefits}</p>
//                       <div className="mb-3">
//                         <h4 className="text-sm font-medium text-gray-500">Compatible With:</h4>
//                         <div className="flex flex-wrap gap-1 mt-1">
//                           {plant.compatibleWith.map((crop, i) => (
//                             <Badge key={i} variant="secondary">{crop}</Badge>
//                           ))}
//                         </div>
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-500">Recommendation:</h4>
//                         <p className="text-sm mt-1">{plant.plantingRecommendation}</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
      
//       {/* Plant Detail Modal - Simplified for this prototype */}
//       {selectedPlant && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
//           <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
//             <CardHeader>
//               <div className="flex justify-between">
//                 <div>
//                   <CardTitle>{selectedPlant.name}</CardTitle>
//                   <CardDescription>
//                     {selectedPlant.family} • {selectedPlant.quantity} plants • {selectedPlant.location.parcel}
//                   </CardDescription>
//                 </div>
//                 <Badge variant="outline" className={`${getStatusColor(selectedPlant.pollination.status)} text-white`}>
//                   {selectedPlant.pollination.status}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="text-lg font-medium mb-2">Pollination Details</h3>
//                   <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
//                     <dt className="text-sm text-gray-500">Type</dt>
//                     <dd className="text-sm capitalize">{selectedPlant.pollination.type}</dd>
                    
//                     <dt className="text-sm text-gray-500">Method</dt>
//                     <dd className="text-sm">{selectedPlant.pollination.method}</dd>
                    
//                     <dt className="text-sm text-gray-500">Self-Fertile</dt>
//                     <dd className="text-sm">{selectedPlant.pollination.selfFertile ? 'Yes' : 'No'}</dd>
                    
//                     <dt className="text-sm text-gray-500">Needs</dt>
//                     <dd className="text-sm capitalize">{selectedPlant.pollination.needs}</dd>
                    
//                     <dt className="text-sm text-gray-500">Bloom Period</dt>
//                     <dd className="text-sm">Weeks {selectedPlant.pollination.bloomPeriod.estimatedStartWeek} - {selectedPlant.pollination.bloomPeriod.estimatedEndWeek}</dd>
                    
//                     <dt className="text-sm text-gray-500">Score</dt>
//                     <dd className={`text-sm font-bold ${getScoreColor(selectedPlant.pollination.score)}`}>
//                       {selectedPlant.pollination.score}%
//                     </dd>
//                   </dl>
                  
//                   <h3 className="text-lg font-medium mt-4 mb-2">Pollinators</h3>
//                   <div className="flex flex-wrap gap-1 mb-4">
//                     {selectedPlant.pollination.pollinators.map((pollinator, index) => (
//                       <Badge key={index} variant="secondary" className="capitalize">{pollinator}</Badge>
//                     ))}
//                   </div>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-medium mb-2">Pollinator Activity by Week</h3>
//                   <div className="flex flex-col gap-2">
//                     {Object.entries(selectedPlant.pollination.pollinatorActivity).map(([week, activity]) => (
//                       <div key={week} className="flex items-center">
//                         <div className="w-12">Week {week}</div>
//                         <div className="h-4 flex-1 bg-gray-100 rounded-full overflow-hidden">
//                           <div 
//                             className={`h-full ${
//                               activity.forecast === 'high' ? 'bg-green-500' : 
//                               activity.forecast === 'moderate' ? 'bg-blue-500' : 'bg-amber-500'
//                             }`}
//                             style={{ width: `${parseFloat(activity.level) * 100}%` }}
//                           ></div>
//                         </div>
//                         <div className="w-20 text-right capitalize text-sm">{activity.forecast}</div>
//                       </div>
//                     ))}
//                   </div>
                  
//                   {selectedPlant.pollination.potentialPollinizers.length > 0 && (
//                     <>
//                       <h3 className="text-lg font-medium mt-4 mb-2">Potential Pollinizers</h3>
//                       <ul className="pl-5 list-disc">
//                         {selectedPlant.pollination.potentialPollinizers.map((pollinizer, idx) => (
//                           <li key={idx} className="mb-1">
//                             <span className="font-medium">{pollinizer.name}</span> - 
//                             {pollinizer.distance}m away, 
//                             {pollinizer.bloomOverlap ? (
//                               <span className="text-green-600"> bloom periods overlap</span>
//                             ) : (
//                               <span className="text-red-600"> bloom periods don't overlap</span>
//                             )}
//                           </li>
//                         ))}
//                       </ul>
//                     </>
//                   )}
                  
//                   {selectedPlant.pollination.recommendations.length > 0 && (
//                     <>
//                       <h3 className="text-lg font-medium mt-4 mb-2 flex items-center">
//                         <AlertTriangle className="h-5 w-5 mr-1 text-amber-500" />
//                         Recommendations
//                       </h3>
//                       <ul className="pl-5 list-disc">
//                         {selectedPlant.pollination.recommendations.map((rec, idx) => (
//                           <li key={idx} className="mb-1">{rec}</li>
//                         ))}
//                       </ul>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="border-t flex justify-end">
//               <Button variant="outline" onClick={() => setSelectedPlant(null)}>Close</Button>
//             </CardFooter>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PollinationDashboard;