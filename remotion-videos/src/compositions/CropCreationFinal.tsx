import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing, Sequence, AbsoluteFill } from 'remotion';

/**
 * Final Crop Creation Tutorial - Slower paced with actual GardenFlow design system
 * Duration: 60 seconds (1800 frames at 30fps)
 *
 * Design System:
 * - Premium greyscale palette
 * - Glass morphism effects
 * - Metallic nature green accents
 * - Smooth elegant transitions
 */

interface CropCreationFinalProps {
  appName?: string;
}

// GardenFlow Design Tokens
const GF_COLORS = {
  grey50: '#FAFAFA',
  grey100: '#F5F5F5',
  grey200: '#E8E8E8',
  grey300: '#D3D3D3',
  grey500: '#9E9E9E',
  grey600: '#757575',
  grey700: '#616161',
  grey900: '#212121',

  // Nature Metallic Green (gradient)
  greenStart: '#2E7D32',
  greenMid: '#66BB6A',
  greenEnd: '#2E7D32',

  // Purple for add button
  purpleStart: '#9333ea',
  purpleEnd: '#7e22ce',

  // Glass morphism
  glassWhite: 'rgba(255, 255, 255, 0.25)',
  glassDark: 'rgba(0, 0, 0, 0.25)',
};

// Increased zoom scale for better visibility
const ZOOM_SCALE = 1.3;

export const CropCreationFinal: React.FC<CropCreationFinalProps> = ({
  appName = "GardenFlow"
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: GF_COLORS.grey50 }}>
      {/* Scene 1: Title (0-120 frames, 4s) */}
      <Sequence from={0} durationInFrames={120}>
        <TitleScene appName={appName} />
      </Sequence>

      {/* Scene 2: App Interface (120-270 frames, 5s) */}
      <Sequence from={120} durationInFrames={150}>
        <AppInterfaceScene />
      </Sequence>

      {/* Scene 3: Plant Tab (270-570 frames, 10s) */}
      <Sequence from={270} durationInFrames={300}>
        <PlantTabScene />
      </Sequence>

      {/* Scene 4: Location Tab (570-870 frames, 10s) */}
      <Sequence from={570} durationInFrames={300}>
        <LocationTabScene />
      </Sequence>

      {/* Scene 5: Timing Tab (870-1170 frames, 10s) */}
      <Sequence from={870} durationInFrames={300}>
        <TimingTabScene />
      </Sequence>

      {/* Scene 6: Harvest Tab (1170-1410 frames, 8s) */}
      <Sequence from={1170} durationInFrames={240}>
        <HarvestTabScene />
      </Sequence>

      {/* Scene 7: Save (1410-1650 frames, 8s) */}
      <Sequence from={1410} durationInFrames={240}>
        <SaveScene />
      </Sequence>

      {/* Scene 8: Outro (1650-1800 frames, 5s) */}
      <Sequence from={1650} durationInFrames={150}>
        <OutroScene appName={appName} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Title Scene - 4 seconds
const TitleScene: React.FC<{ appName: string }> = ({ appName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 80, stiffness: 100 } });
  const subtitleOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${GF_COLORS.greenStart} 0%, ${GF_COLORS.greenMid} 50%, ${GF_COLORS.greenEnd} 100%)`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        transform: `scale(${titleScale})`,
        fontSize: 96,
        fontWeight: 700,
        color: 'white',
        marginBottom: 32,
        textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}>
        🌱 {appName}
      </div>
      <div style={{
        opacity: subtitleOpacity,
        fontSize: 48,
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.95)',
      }}>
        Creating Your First Crop
      </div>
    </AbsoluteFill>
  );
};

// App Interface - 5 seconds
const AppInterfaceScene: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const fabHighlight = frame > 90 ? Math.sin((frame - 90) * 0.15) * 0.1 + 1.05 : 1;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${GF_COLORS.grey50} 0%, ${GF_COLORS.grey100} 100%)`,
      opacity: fadeIn,
    }}>
      {/* Top Bar with glass effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 88,
        background: GF_COLORS.glassWhite,
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}>
        <div style={{ fontSize: 28, fontWeight: 600, color: GF_COLORS.grey900 }}>
          Crop Planner
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          {/* Inventory FAB */}
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${GF_COLORS.greenStart} 0%, ${GF_COLORS.greenMid} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px 0 rgba(46, 125, 50, 0.25)',
          }}>
            <div style={{ fontSize: 36, color: 'white' }}>📦</div>
          </div>

          {/* PDF FAB */}
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.25)',
          }}>
            <div style={{ fontSize: 36, color: 'white' }}>📄</div>
          </div>

          {/* Add Crop FAB - Highlighted */}
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${GF_COLORS.purpleStart} 0%, ${GF_COLORS.purpleEnd} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: frame > 90 ? '0 8px 24px 0 rgba(147, 51, 234, 0.4)' : '0 4px 14px 0 rgba(147, 51, 234, 0.25)',
            transform: `scale(${fabHighlight})`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <div style={{
              fontSize: 48,
              color: 'white',
              fontWeight: 'bold',
              lineHeight: 1,
            }}>
              +
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Gantt View */}
      <div style={{
        position: 'absolute',
        top: 128,
        left: 48,
        right: 48,
        bottom: 48,
        backgroundColor: 'white',
        borderRadius: 16,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: 40,
      }}>
        <div style={{ fontSize: 24, fontWeight: 600, color: GF_COLORS.grey700, marginBottom: 24 }}>
          Gantt View
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70%',
          opacity: 0.3,
        }}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>🌾</div>
          <div style={{ fontSize: 22, color: GF_COLORS.grey500 }}>Click + to add your first crop</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Plant Tab - 10 seconds, slower pace
const PlantTabScene: React.FC = () => {
  const frame = useCurrentFrame();

  const modalAppear = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.165, 0.84, 0.44, 1),
  });

  const sectionHeader = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' });
  const field1 = interpolate(frame, [100, 140], [0, 1], { extrapolateRight: 'clamp' });
  const field2 = interpolate(frame, [160, 200], [0, 1], { extrapolateRight: 'clamp' });
  const field3 = interpolate(frame, [220, 260], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: GF_COLORS.glassDark,
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 16,
        width: '100%',
        maxWidth: 900,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        opacity: modalAppear,
        transform: `scale(${modalAppear * ZOOM_SCALE})`,
      }}>
        <FormHeader title="Add New Crop" />
        <TabNav activeTab="plant" />

        <div style={{ padding: 32, minHeight: 500, overflowY: 'auto' }}>
          {/* Section Header */}
          <div style={{
            fontSize: 19,
            fontWeight: 600,
            color: GF_COLORS.grey600,
            marginBottom: 20,
            opacity: sectionHeader,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            Plant Information
          </div>

          {/* Fields Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
            <div style={{ opacity: field1 }}>
              <FieldLabel text="Plant Family *" />
              <FieldInput value="🍅 Tomatoes" highlight />
            </div>
            <div style={{ opacity: field2 }}>
              <FieldLabel text="Variety" />
              <FieldInput value="Cherry Tomato" disabled />
            </div>
            <div style={{ opacity: field3 }}>
              <FieldLabel text="Year" />
              <FieldInput value="2025" />
            </div>
          </div>

          {/* Second Section */}
          <div style={{
            fontSize: 19,
            fontWeight: 600,
            color: GF_COLORS.grey600,
            marginBottom: 20,
            opacity: field3,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            Order & Quantity
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, opacity: field3 }}>
            <div>
              <FieldLabel text="Order" />
              <FieldInput value="1" />
            </div>
            <div>
              <FieldLabel text="Seed Quantity" />
              <FieldInput value="10" />
            </div>
          </div>
        </div>

        <FormFooter />
      </div>
    </AbsoluteFill>
  );
};

// Location Tab - 10 seconds
const LocationTabScene: React.FC = () => {
  const frame = useCurrentFrame();

  const field1 = interpolate(frame, [40, 100], [0, 1], { extrapolateRight: 'clamp' });
  const field2 = interpolate(frame, [140, 200], [0, 1], { extrapolateRight: 'clamp' });
  const field3 = interpolate(frame, [240, 280], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: GF_COLORS.glassDark,
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 16,
        width: '100%',
        maxWidth: 900,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        transform: `scale(${ZOOM_SCALE})`,
      }}>
        <FormHeader title="Add New Crop" />
        <TabNav activeTab="location" />

        <div style={{ padding: 32, minHeight: 500 }}>
          <div style={{
            fontSize: 19,
            fontWeight: 600,
            color: GF_COLORS.grey600,
            marginBottom: 24,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            Location Selection
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ opacity: field1 }}>
              <FieldLabel text="Project" />
              <FieldInput value="🏡 My Home Garden" highlight />
            </div>
            <div style={{ opacity: field2 }}>
              <FieldLabel text="Parcel *" />
              <FieldInput value="North Garden Bed" highlight />
            </div>
            <div style={{ opacity: field3 }}>
              <FieldLabel text="Zone *" />
              <FieldInput value="Zone A - Full Sun" highlight />
            </div>
          </div>
        </div>

        <FormFooter />
      </div>
    </AbsoluteFill>
  );
};

// Timing Tab - 10 seconds
const TimingTabScene: React.FC = () => {
  const frame = useCurrentFrame();

  const titleAppear = interpolate(frame, [20, 60], [0, 1], { extrapolateRight: 'clamp' });
  const sowProgress = interpolate(frame, [100, 160], [0, 1], { extrapolateRight: 'clamp' });
  const cultureProgress = interpolate(frame, [170, 230], [0, 1], { extrapolateRight: 'clamp' });
  const harvestProgress = interpolate(frame, [240, 280], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: GF_COLORS.glassDark,
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 16,
        width: '100%',
        maxWidth: 900,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        transform: `scale(${ZOOM_SCALE})`,
      }}>
        <FormHeader title="Add New Crop" />
        <TabNav activeTab="timing" />

        <div style={{ padding: 48, minHeight: 500, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 48,
            opacity: titleAppear,
            color: GF_COLORS.grey900,
          }}>
            Annual Crop Lifecycle
          </div>

          {/* Timeline */}
          <div style={{
            height: 100,
            backgroundColor: GF_COLORS.grey100,
            borderRadius: 16,
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 40,
          }}>
            {/* Sowing */}
            {sowProgress > 0 && (
              <div style={{
                position: 'absolute',
                left: '10%',
                width: `${sowProgress * 12}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)',
                transition: 'width 0.3s ease',
              }} />
            )}
            {/* Culture */}
            {cultureProgress > 0 && (
              <div style={{
                position: 'absolute',
                left: '22%',
                width: `${cultureProgress * 40}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                transition: 'width 0.3s ease',
              }} />
            )}
            {/* Harvest */}
            {harvestProgress > 0 && (
              <div style={{
                position: 'absolute',
                left: '62%',
                width: `${harvestProgress * 23}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                transition: 'width 0.3s ease',
              }} />
            )}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            gap: 48,
            justifyContent: 'center',
            marginBottom: 32,
          }}>
            <LegendItem color="#93c5fd" label="Sowing" opacity={sowProgress} />
            <LegendItem color="#60a5fa" label="Culture" opacity={cultureProgress} />
            <LegendItem color="#2563eb" label="Harvest" opacity={harvestProgress} />
          </div>

          <div style={{
            fontSize: 24,
            color: GF_COLORS.grey600,
            textAlign: 'center',
            opacity: harvestProgress,
          }}>
            Week 10 → Week 52 (42 weeks total)
          </div>
        </div>

        <FormFooter />
      </div>
    </AbsoluteFill>
  );
};

// Harvest Tab - 8 seconds
const HarvestTabScene: React.FC = () => {
  const frame = useCurrentFrame();

  const fieldsAppear = interpolate(frame, [30, 80], [0, 1], { extrapolateRight: 'clamp' });
  const summaryAppear = interpolate(frame, [120, 180], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: GF_COLORS.glassDark,
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 16,
        width: '100%',
        maxWidth: 900,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        transform: `scale(${ZOOM_SCALE})`,
      }}>
        <FormHeader title="Add New Crop" />
        <TabNav activeTab="harvest" />

        <div style={{ padding: 32, minHeight: 500 }}>
          <div style={{
            fontSize: 19,
            fontWeight: 600,
            color: GF_COLORS.grey600,
            marginBottom: 24,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            opacity: fieldsAppear,
          }}>
            Expected Yield
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 24,
            marginBottom: 32,
            opacity: fieldsAppear,
          }}>
            <div>
              <FieldLabel text="Quantity" />
              <FieldInput value="25" />
            </div>
            <div>
              <FieldLabel text="Unit" />
              <FieldInput value="kg" />
            </div>
          </div>

          {/* Summary Card */}
          {summaryAppear > 0 && (
            <div style={{
              padding: 32,
              background: `linear-gradient(135deg, ${GF_COLORS.greenStart} 0%, ${GF_COLORS.greenMid} 100%)`,
              borderRadius: 16,
              textAlign: 'center',
              opacity: summaryAppear,
              transform: `scale(${summaryAppear})`,
              boxShadow: '0 4px 14px 0 rgba(46, 125, 50, 0.25)',
            }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: 'white' }}>
                Expected Harvest: 25 kg
              </div>
            </div>
          )}
        </div>

        <FormFooter saveButton />
      </div>
    </AbsoluteFill>
  );
};

// Save Scene - 8 seconds
const SaveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const modalClose = interpolate(frame, [0, 60], [1, 0]);
  const ganttAppear = interpolate(frame, [80, 120], [0, 1]);
  const checkmark = spring({
    frame: frame - 140,
    fps,
    from: 0,
    to: 1,
    config: { damping: 80, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${GF_COLORS.grey50} 0%, ${GF_COLORS.grey100} 100%)`,
    }}>
      {/* Modal fading */}
      {modalClose > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: `rgba(0, 0, 0, ${modalClose * 0.25})`,
          backdropFilter: `blur(${modalClose * 8}px)`,
        }} />
      )}

      {/* Gantt View */}
      {ganttAppear > 0 && (
        <div style={{
          width: '90%',
          height: '80%',
          margin: '5% auto',
          backgroundColor: 'white',
          borderRadius: 16,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
          padding: 48,
          opacity: ganttAppear,
        }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: GF_COLORS.grey900, marginBottom: 48 }}>
            Crop Planner - Gantt View
          </div>

          <div style={{
            backgroundColor: GF_COLORS.grey50,
            padding: 32,
            borderRadius: 16,
            position: 'relative',
            border: `1px solid ${GF_COLORS.grey200}`,
          }}>
            <div style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              color: GF_COLORS.grey900,
            }}>
              🍅 Tomatoes
              <span style={{ fontSize: 18, fontWeight: 500, color: GF_COLORS.grey600 }}>
                Zone A - Full Sun
              </span>
            </div>

            {/* Timeline */}
            <div style={{
              height: 60,
              backgroundColor: GF_COLORS.grey200,
              borderRadius: 12,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', left: '10%', width: '12%', height: '100%', background: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)' }} />
              <div style={{ position: 'absolute', left: '22%', width: '40%', height: '100%', background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' }} />
              <div style={{ position: 'absolute', left: '62%', width: '23%', height: '100%', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }} />
            </div>

            {/* Success checkmark */}
            {checkmark > 0 && (
              <div style={{
                position: 'absolute',
                top: -24,
                right: -24,
                width: 80,
                height: 80,
                background: `linear-gradient(135deg, ${GF_COLORS.greenStart} 0%, ${GF_COLORS.greenMid} 100%)`,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 48,
                color: 'white',
                fontWeight: 'bold',
                transform: `scale(${checkmark})`,
                boxShadow: '0 8px 24px 0 rgba(46, 125, 50, 0.4)',
              }}>
                ✓
              </div>
            )}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Outro - 5 seconds
const OutroScene: React.FC<{ appName: string }> = ({ appName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 80 } });
  const fadeIn = interpolate(frame, [30, 60], [0, 1]);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${GF_COLORS.greenStart} 0%, ${GF_COLORS.greenMid} 50%, ${GF_COLORS.greenEnd} 100%)`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        transform: `scale(${scale})`,
        fontSize: 72,
        fontWeight: 700,
        color: 'white',
        marginBottom: 24,
        textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}>
        Crop Created! 🎉
      </div>
      <div style={{
        opacity: fadeIn,
        fontSize: 36,
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.95)',
      }}>
        Start planning with {appName}
      </div>
    </AbsoluteFill>
  );
};

// Helper Components with GF Design System
const FormHeader: React.FC<{ title: string }> = ({ title }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: GF_COLORS.grey50,
    borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
    borderRadius: '16px 16px 0 0',
  }}>
    <div style={{ fontSize: 32, fontWeight: 700, color: GF_COLORS.grey900 }}>{title}</div>
    <div style={{ fontSize: 36, color: GF_COLORS.grey600, cursor: 'pointer' }}>×</div>
  </div>
);

const TabNav: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const tabs = [
    { id: 'plant', label: 'Plant Details', color: '#2563eb' },
    { id: 'location', label: 'Location', color: GF_COLORS.greenMid },
    { id: 'timing', label: 'Timing Preview', color: '#9333ea' },
    { id: 'harvest', label: 'Harvest Planning', color: '#f59e0b', optional: true },
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      borderBottom: `1px solid ${GF_COLORS.grey200}`,
      paddingLeft: 24,
      paddingRight: 24,
      display: 'flex',
      gap: 8,
    }}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 16,
            paddingBottom: 16,
            borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : '3px solid transparent',
            fontSize: 22,
            fontWeight: activeTab === tab.id ? 700 : 500,
            color: activeTab === tab.id ? tab.color : GF_COLORS.grey600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {tab.label}
          {tab.optional && (
            <span style={{
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 2,
              paddingBottom: 2,
              borderRadius: 9999,
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: activeTab === tab.id ? '#fef3c7' : GF_COLORS.grey100,
              color: activeTab === tab.id ? '#92400e' : GF_COLORS.grey600,
            }}>
              Optional
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const FieldLabel: React.FC<{ text: string }> = ({ text }) => (
  <div style={{
    fontSize: 20,
    fontWeight: 600,
    color: GF_COLORS.grey700,
    marginBottom: 10,
  }}>
    {text}
  </div>
);

const FieldInput: React.FC<{
  value: string;
  highlight?: boolean;
  disabled?: boolean;
}> = ({ value, highlight, disabled }) => (
  <div style={{
    padding: 20,
    backgroundColor: disabled ? GF_COLORS.grey50 : 'white',
    border: highlight ? `2px solid ${GF_COLORS.greenMid}` : `1px solid ${GF_COLORS.grey300}`,
    borderRadius: 16,
    fontSize: 22,
    color: disabled ? GF_COLORS.grey600 : GF_COLORS.grey900,
    boxShadow: highlight ? '0 4px 14px 0 rgba(46, 125, 50, 0.15)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }}>
    {value}
  </div>
);

const FormFooter: React.FC<{ saveButton?: boolean }> = ({ saveButton }) => (
  <div style={{
    padding: 24,
    borderTop: `1px solid ${GF_COLORS.grey200}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 16,
    backgroundColor: 'white',
    borderRadius: '0 0 16px 16px',
  }}>
    <div style={{
      paddingLeft: 32,
      paddingRight: 32,
      paddingTop: 16,
      paddingBottom: 16,
      borderRadius: 12,
      fontSize: 22,
      fontWeight: 600,
      backgroundColor: GF_COLORS.grey100,
      color: GF_COLORS.grey700,
      cursor: 'pointer',
    }}>
      {saveButton ? 'Cancel' : 'Back'}
    </div>
    <div style={{
      paddingLeft: 32,
      paddingRight: 32,
      paddingTop: 16,
      paddingBottom: 16,
      borderRadius: 12,
      fontSize: 22,
      fontWeight: 600,
      background: saveButton
        ? `linear-gradient(135deg, ${GF_COLORS.greenStart} 0%, ${GF_COLORS.greenMid} 100%)`
        : `linear-gradient(135deg, ${GF_COLORS.purpleStart} 0%, ${GF_COLORS.purpleEnd} 100%)`,
      color: 'white',
      cursor: 'pointer',
      boxShadow: '0 4px 14px 0 rgba(46, 125, 50, 0.25)',
    }}>
      {saveButton ? 'Save Crop' : 'Continue'}
    </div>
  </div>
);

const LegendItem: React.FC<{ color: string; label: string; opacity: number }> = ({ color, label, opacity }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    opacity,
    transition: 'opacity 0.3s ease',
  }}>
    <div style={{
      width: 50,
      height: 50,
      backgroundColor: color,
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }} />
    <span style={{ fontSize: 24, fontWeight: 600, color: GF_COLORS.grey700 }}>{label}</span>
  </div>
);
