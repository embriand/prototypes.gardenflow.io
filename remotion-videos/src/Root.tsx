import { Composition } from 'remotion';
import { GardenIntro } from './compositions/GardenIntro';
import { CropTimeline } from './compositions/CropTimeline';
import { CropCreationTutorial } from './compositions/CropCreationTutorial';
import { CropCreationTutorialV2 } from './compositions/CropCreationTutorialV2';
import { CropCreationFinal } from './compositions/CropCreationFinal';
import { CropCreationCompact } from './compositions/CropCreationCompact';
import { CropCreationRealistic } from './compositions/CropCreationRealistic';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Garden Introduction Video */}
      <Composition
        id="GardenIntro"
        component={GardenIntro}
        durationInFrames={300} // 10 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          gardenName: 'My Beautiful Garden',
          plantCount: 15
        }}
      />

      {/* Crop Timeline Animation */}
      <Composition
        id="CropTimeline"
        component={CropTimeline}
        durationInFrames={450} // 15 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          cropName: 'Tomatoes',
          sowingDate: '2025-03-15',
          harvestDate: '2025-07-20'
        }}
      />

      {/* Crop Creation Tutorial - Full Workflow (V1 - Abstract) */}
      <Composition
        id="CropCreationTutorial"
        component={CropCreationTutorial}
        durationInFrames={900} // 30 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          appName: 'GardenFlow'
        }}
      />

      {/* Crop Creation Tutorial V2 - Accurate App Structure */}
      <Composition
        id="CropCreationTutorialV2"
        component={CropCreationTutorialV2}
        durationInFrames={900} // 30 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          appName: 'GardenFlow'
        }}
      />

      {/* Crop Creation Final - Slower, Larger, with GF Design System */}
      <Composition
        id="CropCreationFinal"
        component={CropCreationFinal}
        durationInFrames={1800} // 60 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          appName: 'GardenFlow'
        }}
      />

      {/* Crop Creation Compact - 38s, Actual Gantt Design, Complete Flow with Voiceover */}
      <Composition
        id="CropCreationCompact"
        component={CropCreationCompact}
        durationInFrames={1140} // 38 seconds at 30fps (extended for voiceover)
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          appName: 'GardenFlow'
        }}
      />

      {/* Crop Creation Realistic - 27s, Vrais Labels FR, Contexte Immersif, With Voiceover + Integrated Family Selection + 30-frame gap */}
      <Composition
        id="CropCreationRealistic"
        component={CropCreationRealistic}
        durationInFrames={812} // 27.07 seconds at 30fps (with corrected voiceovers + 30-frame gap)
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          appName: 'GardenFlow'
        }}
      />
    </>
  );
};
