import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

interface GardenIntroProps {
  gardenName: string;
  plantCount: number;
}

export const GardenIntro: React.FC<GardenIntroProps> = ({ gardenName, plantCount }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animate title entrance with spring physics
  const titleScale = spring({
    frame,
    fps,
    config: {
      damping: 100,
    },
  });

  // Fade in the subtitle
  const subtitleOpacity = interpolate(
    frame,
    [30, 60],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Animate plant count with number counter effect
  const displayedPlantCount = Math.floor(
    interpolate(
      frame,
      [60, 120],
      [0, plantCount],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    )
  );

  // Background gradient animation
  const backgroundHue = interpolate(
    frame,
    [0, 300],
    [120, 150] // From green to blue-green
  );

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: `hsl(${backgroundHue}, 60%, 90%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Title */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          fontSize: 120,
          fontWeight: 'bold',
          color: '#2d5016',
          textAlign: 'center',
          marginBottom: 40,
        }}
      >
        {gardenName}
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          fontSize: 48,
          color: '#4a7c29',
          textAlign: 'center',
        }}
      >
        Welcome to your garden planning journey
      </div>

      {/* Plant count */}
      {frame > 60 && (
        <div
          style={{
            marginTop: 80,
            fontSize: 72,
            color: '#2d5016',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <span style={{ fontSize: 100 }}>🌱</span>
          <span>{displayedPlantCount} plants</span>
        </div>
      )}
    </div>
  );
};
