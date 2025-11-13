import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

interface CropTimelineProps {
  cropName: string;
  sowingDate: string;
  harvestDate: string;
}

export const CropTimeline: React.FC<CropTimelineProps> = ({
  cropName,
  sowingDate,
  harvestDate,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Timeline progress (0 to 1)
  const timelineProgress = interpolate(
    frame,
    [60, durationInFrames - 30],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.65, 0, 0.35, 1), // Smooth ease
    }
  );

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 30], [0, 1]);

  // Calculate days between dates
  const sowing = new Date(sowingDate);
  const harvest = new Date(harvestDate);
  const totalDays = Math.floor((harvest.getTime() - sowing.getTime()) / (1000 * 60 * 60 * 24));

  // Stage markers
  const stages = [
    { name: 'Sowing', emoji: '🌱', position: 0 },
    { name: 'Germination', emoji: '🌿', position: 0.15 },
    { name: 'Growth', emoji: '🪴', position: 0.4 },
    { name: 'Flowering', emoji: '🌸', position: 0.65 },
    { name: 'Harvest', emoji: '🍅', position: 1 },
  ];

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#1a2f1a',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        height: '100%',
        padding: 100,
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          fontSize: 80,
          fontWeight: 'bold',
          color: '#a8d896',
          marginBottom: 100,
        }}
      >
        {cropName} Growth Timeline
      </div>

      {/* Timeline container */}
      <div style={{ width: '80%', position: 'relative' }}>
        {/* Background line */}
        <div
          style={{
            height: 8,
            backgroundColor: '#3a4f3a',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Progress line */}
          <div
            style={{
              height: '100%',
              backgroundColor: '#6fb557',
              width: `${timelineProgress * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Stage markers */}
        {stages.map((stage, index) => {
          const isActive = timelineProgress >= stage.position;
          const markerScale = isActive ? 1 : 0.7;
          const markerOpacity = isActive ? 1 : 0.3;

          return (
            <div
              key={stage.name}
              style={{
                position: 'absolute',
                left: `${stage.position * 100}%`,
                top: -20,
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Emoji marker */}
              <div
                style={{
                  fontSize: 48,
                  transform: `scale(${markerScale})`,
                  opacity: markerOpacity,
                  marginBottom: 20,
                }}
              >
                {stage.emoji}
              </div>

              {/* Stage name */}
              <div
                style={{
                  fontSize: 24,
                  color: isActive ? '#a8d896' : '#5a6a5a',
                  fontWeight: isActive ? 'bold' : 'normal',
                  marginTop: 30,
                  whiteSpace: 'nowrap',
                }}
              >
                {stage.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dates */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '80%',
          marginTop: 120,
          fontSize: 28,
          color: '#8fbc8f',
        }}
      >
        <div>{sowingDate}</div>
        <div>{totalDays} days</div>
        <div>{harvestDate}</div>
      </div>
    </div>
  );
};
