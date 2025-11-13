import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing, Sequence, AbsoluteFill } from 'remotion';

interface CropCreationTutorialV2Props {
  appName?: string;
}

/**
 * Accurate Crop Creation Tutorial based on real GardenFlow app structure
 *
 * Key differences from V1:
 * - Uses actual circular FAB button with Plus icon (not rectangular button)
 * - Shows proper backdrop blur modal (black/40 with backdrop-blur-sm)
 * - Accurate form layout with gray header, proper spacing
 * - Real field grouping with section headers
 * - Proper grid layouts (lg:grid-cols-3, lg:grid-cols-2)
 * - Authentic rounded-xl inputs with proper borders
 * - min-h-[450px] tab content areas with blank space
 * - Realistic proportions and spacing
 */
export const CropCreationTutorialV2: React.FC<CropCreationTutorialV2Props> = ({
  appName = "GardenFlow"
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#f9fafb' }}>
      {/* Scene 1: Title (0-75 frames, 2.5s) */}
      <Sequence from={0} durationInFrames={75}>
        <TitleScene appName={appName} />
      </Sequence>

      {/* Scene 2: App Interface with FAB (75-150 frames, 2.5s) */}
      <Sequence from={75} durationInFrames={75}>
        <AppInterfaceScene />
      </Sequence>

      {/* Scene 3: Plant Details Tab (150-285 frames, 4.5s) */}
      <Sequence from={150} durationInFrames={135}>
        <PlantDetailsTabScene />
      </Sequence>

      {/* Scene 4: Location Tab (285-420 frames, 4.5s) */}
      <Sequence from={285} durationInFrames={135}>
        <LocationTabScene />
      </Sequence>

      {/* Scene 5: Timing Tab (420-585 frames, 5.5s) */}
      <Sequence from={420} durationInFrames={165}>
        <TimingTabScene />
      </Sequence>

      {/* Scene 6: Harvest Tab (585-690 frames, 3.5s) */}
      <Sequence from={585} durationInFrames={105}>
        <HarvestTabScene />
      </Sequence>

      {/* Scene 7: Save Success (690-840 frames, 5s) */}
      <Sequence from={690} durationInFrames={150}>
        <SaveSuccessScene />
      </Sequence>

      {/* Scene 8: Outro (840-900 frames, 2s) */}
      <Sequence from={840} durationInFrames={60}>
        <OutroScene appName={appName} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Scene 1: Title
const TitleScene: React.FC<{ appName: string }> = ({ appName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 100 } });
  const subtitleOpacity = interpolate(frame, [25, 50], [0, 1]);

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        transform: `scale(${titleScale})`,
        fontSize: 80,
        fontWeight: 700,
        color: 'white',
        marginBottom: 24,
      }}>
        🌱 {appName}
      </div>
      <div style={{
        opacity: subtitleOpacity,
        fontSize: 40,
        color: 'rgba(255, 255, 255, 0.9)',
      }}>
        Crop Creation Tutorial
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: App Interface with FAB
const AppInterfaceScene: React.FC = () => {
  const frame = useCurrentFrame();

  const appFadeIn = interpolate(frame, [0, 20], [0, 1]);
  const fabScale = spring({
    frame: frame - 30,
    fps: 30,
    from: 1,
    to: 1.15,
    config: { damping: 100 },
  });
  const fabPulse = frame > 40 ? Math.sin((frame - 40) * 0.2) * 0.05 + 1 : 1;

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, rgb(249, 250, 251) 0%, rgb(243, 244, 246) 100%)',
      opacity: appFadeIn,
    }}>
      {/* Top Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        {/* Left side - title */}
        <div style={{ fontSize: 24, fontWeight: 600 }}>Crop Planner</div>

        {/* Right side - action buttons */}
        <div style={{ display: 'flex', gap: 16 }}>
          {/* Inventory button */}
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ fontSize: 24, color: 'white' }}>📦</div>
          </div>

          {/* PDF button */}
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ fontSize: 24, color: 'white' }}>📄</div>
          </div>

          {/* FAB - Add Crop Button */}
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: frame > 30 ? '0 10px 25px rgba(147, 51, 234, 0.4)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
            transform: `scale(${frame > 30 ? fabScale * fabPulse : 1})`,
            cursor: 'pointer',
          }}>
            <div style={{
              fontSize: 32,
              color: 'white',
              fontWeight: 'bold',
              lineHeight: 1,
            }}>
              +
            </div>
          </div>
        </div>
      </div>

      {/* Gantt View placeholder */}
      <div style={{
        position: 'absolute',
        top: 120,
        left: 40,
        right: 40,
        bottom: 40,
        backgroundColor: 'white',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: 32,
      }}>
        <div style={{ fontSize: 20, color: '#6b7280', marginBottom: 20 }}>Gantt View</div>
        {/* Empty state illustration */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60%',
          opacity: 0.3,
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🌾</div>
          <div style={{ fontSize: 18, color: '#9ca3af' }}>No crops yet</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Plant Details Tab
const PlantDetailsTabScene: React.FC = () => {
  const frame = useCurrentFrame();

  const modalOpacity = interpolate(frame, [0, 20], [0, 1]);
  const modalScale = interpolate(frame, [0, 20], [0.95, 1]);
  const fieldAppear1 = interpolate(frame, [30, 50], [0, 1]);
  const fieldAppear2 = interpolate(frame, [60, 80], [0, 1]);

  return (
    <AbsoluteFill style={{
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 8,
        width: '100%',
        maxWidth: 1152,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        opacity: modalOpacity,
        transform: `scale(${modalScale})`,
      }}>
        {/* Header - gray background */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          borderRadius: '8px 8px 0 0',
        }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Add New Crop</div>
          <div style={{
            width: 20,
            height: 20,
            cursor: 'pointer',
            fontSize: 20,
            color: '#6b7280',
          }}>×</div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          paddingLeft: 16,
          paddingRight: 16,
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <TabButton label="Plant Details" active color="#2563eb" />
            <TabButton label="Location" active={false} color="#059669" />
            <TabButton label="Timing Preview" active={false} color="#9333ea" />
            <TabButton label="Harvest Planning" active={false} color="#f59e0b" optional />
          </div>
        </div>

        {/* Tab Content with min-height and spacing */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 24,
          minHeight: 450,
        }}>
          {/* Section 1: Plant Information */}
          <div style={{ opacity: fieldAppear1, marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#6b7280', marginBottom: 16 }}>
              Plant Information
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              <FormField label="Plant Family *" value="🍅 Tomatoes" selected />
              <FormField label="Variety" value="Cherry Tomato" disabled />
              <FormField label="Year" value="2025" />
            </div>
          </div>

          {/* Section 2: Order & Quantity */}
          <div style={{ opacity: fieldAppear2, marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#6b7280', marginBottom: 16 }}>
              Order & Quantity
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
              <FormField label="Order" value="1" />
              <FormField label="Seed Quantity" value="10" />
            </div>
          </div>

          {/* Blank space to show realistic form height */}
          <div style={{ height: 150 }} />
        </div>

        {/* Footer buttons */}
        <div style={{
          padding: 16,
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          backgroundColor: 'white',
        }}>
          <Button label="Cancel" secondary />
          <Button label="Continue" disabled={frame < 100} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Location Tab
const LocationTabScene: React.FC = () => {
  const frame = useCurrentFrame();

  const field1 = interpolate(frame, [15, 35], [0, 1]);
  const field2 = interpolate(frame, [45, 65], [0, 1]);
  const field3 = interpolate(frame, [75, 95], [0, 1]);

  return (
    <AbsoluteFill style={{
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    }}>
      <FormModal title="Add New Crop">
        <Tabs>
          <TabButton label="Plant Details" active={false} color="#2563eb" />
          <TabButton label="Location" active color="#059669" />
          <TabButton label="Timing Preview" active={false} color="#9333ea" />
          <TabButton label="Harvest Planning" active={false} color="#f59e0b" optional />
        </Tabs>

        <div style={{ padding: 24, minHeight: 450 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#6b7280', marginBottom: 16 }}>
            Location Selection
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {field1 > 0 && (
              <div style={{ opacity: field1 }}>
                <FormField label="Project" value="🏡 My Home Garden" selected />
              </div>
            )}

            {field2 > 0 && (
              <div style={{ opacity: field2 }}>
                <FormField label="Parcel *" value="North Garden Bed" selected />
              </div>
            )}

            {field3 > 0 && (
              <div style={{ opacity: field3 }}>
                <FormField label="Zone *" value="Zone A - Full Sun" selected />
              </div>
            )}

            {/* Blank space */}
            <div style={{ height: 200 }} />
          </div>
        </div>

        <div style={{
          padding: 16,
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
        }}>
          <Button label="Back" secondary />
          <Button label="Continue" disabled={frame < 100} />
        </div>
      </FormModal>
    </AbsoluteFill>
  );
};

// Scene 5: Timing Tab
const TimingTabScene: React.FC = () => {
  const frame = useCurrentFrame();

  const timelineAppear = interpolate(frame, [15, 35], [0, 1]);
  const sowProgress = interpolate(frame, [50, 75], [0, 1]);
  const cultureProgress = interpolate(frame, [80, 105], [0, 1]);
  const harvestProgress = interpolate(frame, [110, 135], [0, 1]);

  return (
    <AbsoluteFill style={{
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    }}>
      <FormModal title="Add New Crop">
        <Tabs>
          <TabButton label="Plant Details" active={false} color="#2563eb" />
          <TabButton label="Location" active={false} color="#059669" />
          <TabButton label="Timing Preview" active color="#9333ea" />
          <TabButton label="Harvest Planning" active={false} color="#f59e0b" optional />
        </Tabs>

        <div style={{ padding: 24, minHeight: 450, opacity: timelineAppear }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
            Annual Crop Lifecycle
          </div>

          {/* Timeline bar */}
          <div style={{
            height: 80,
            backgroundColor: '#f3f4f6',
            borderRadius: 12,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Sowing */}
            <div style={{
              position: 'absolute',
              left: '10%',
              width: `${sowProgress * 12}%`,
              height: '100%',
              backgroundColor: '#93c5fd',
            }} />
            {/* Culture */}
            {sowProgress >= 1 && (
              <div style={{
                position: 'absolute',
                left: '22%',
                width: `${cultureProgress * 40}%`,
                height: '100%',
                backgroundColor: '#60a5fa',
              }} />
            )}
            {/* Harvest */}
            {cultureProgress >= 1 && (
              <div style={{
                position: 'absolute',
                left: '62%',
                width: `${harvestProgress * 23}%`,
                height: '100%',
                backgroundColor: '#2563eb',
              }} />
            )}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            gap: 32,
            marginTop: 24,
            justifyContent: 'center',
          }}>
            <LegendItem color="#93c5fd" label="Sowing" />
            <LegendItem color="#60a5fa" label="Culture" />
            <LegendItem color="#2563eb" label="Harvest" />
          </div>

          <div style={{
            marginTop: 24,
            fontSize: 16,
            color: '#6b7280',
            textAlign: 'center',
          }}>
            Week 10 → Week 52 (42 weeks)
          </div>
        </div>

        <div style={{
          padding: 16,
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
        }}>
          <Button label="Back" secondary />
          <Button label="Continue" />
        </div>
      </FormModal>
    </AbsoluteFill>
  );
};

// Scene 6: Harvest Tab
const HarvestTabScene: React.FC = () => {
  const frame = useCurrentFrame();

  const fieldsAppear = interpolate(frame, [15, 35], [0, 1]);
  const summaryAppear = interpolate(frame, [50, 70], [0, 1]);

  return (
    <AbsoluteFill style={{
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    }}>
      <FormModal title="Add New Crop">
        <Tabs>
          <TabButton label="Plant Details" active={false} color="#2563eb" />
          <TabButton label="Location" active={false} color="#059669" />
          <TabButton label="Timing Preview" active={false} color="#9333ea" />
          <TabButton label="Harvest Planning" active color="#f59e0b" optional />
        </Tabs>

        <div style={{ padding: 24, minHeight: 450 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#6b7280', marginBottom: 16, opacity: fieldsAppear }}>
            Expected Yield
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, opacity: fieldsAppear }}>
            <FormField label="Quantity" value="25" />
            <FormField label="Unit" value="kg" />
          </div>

          {summaryAppear > 0 && (
            <div style={{
              marginTop: 24,
              padding: 20,
              backgroundColor: '#d1fae5',
              border: '2px solid #10b981',
              borderRadius: 12,
              textAlign: 'center',
              opacity: summaryAppear,
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>
                Expected: 25 kg
              </div>
            </div>
          )}

          {/* Blank space */}
          <div style={{ height: 200 }} />
        </div>

        <div style={{
          padding: 16,
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
        }}>
          <Button label="Cancel" secondary />
          <Button label="Save Crop" primary />
        </div>
      </FormModal>
    </AbsoluteFill>
  );
};

// Scene 7: Save Success
const SaveSuccessScene: React.FC = () => {
  const frame = useCurrentFrame();

  const modalClose = interpolate(frame, [0, 30], [1, 0]);
  const ganttAppear = interpolate(frame, [40, 60], [0, 1]);
  const checkmarkAppear = spring({
    frame: frame - 70,
    fps: 30,
    config: { damping: 100 },
  });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, rgb(249, 250, 251) 0%, rgb(243, 244, 246) 100%)',
    }}>
      {/* Modal fading out */}
      {modalClose > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: `rgba(0, 0, 0, ${modalClose * 0.4})`,
          backdropFilter: `blur(${modalClose * 4}px)`,
          opacity: modalClose,
        }} />
      )}

      {/* Gantt View */}
      {ganttAppear > 0 && (
        <div style={{
          width: '90%',
          height: '80%',
          margin: '5% auto',
          backgroundColor: 'white',
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: 32,
          opacity: ganttAppear,
        }}>
          <div style={{ fontSize: 28, fontWeight: 600, marginBottom: 32 }}>
            Crop Planner - Gantt View
          </div>

          {/* Crop entry */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: 24,
            borderRadius: 12,
            position: 'relative',
          }}>
            <div style={{
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              🍅 Tomatoes
              <span style={{ fontSize: 16, fontWeight: 400, color: '#6b7280' }}>
                Zone A - Full Sun
              </span>
            </div>

            {/* Timeline bar */}
            <div style={{
              height: 48,
              backgroundColor: '#e5e7eb',
              borderRadius: 8,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', left: '10%', width: '12%', height: '100%', backgroundColor: '#93c5fd' }} />
              <div style={{ position: 'absolute', left: '22%', width: '40%', height: '100%', backgroundColor: '#60a5fa' }} />
              <div style={{ position: 'absolute', left: '62%', width: '23%', height: '100%', backgroundColor: '#2563eb' }} />
            </div>

            {/* Success checkmark */}
            {checkmarkAppear > 0 && (
              <div style={{
                position: 'absolute',
                top: -16,
                right: -16,
                width: 64,
                height: 64,
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 40,
                color: 'white',
                fontWeight: 'bold',
                transform: `scale(${checkmarkAppear})`,
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
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

// Scene 8: Outro
const OutroScene: React.FC<{ appName: string }> = ({ appName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 100 } });
  const fadeIn = interpolate(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        transform: `scale(${scale})`,
        fontSize: 64,
        fontWeight: 700,
        color: 'white',
        marginBottom: 16,
      }}>
        Crop Created! 🎉
      </div>
      <div style={{
        opacity: fadeIn,
        fontSize: 32,
        color: 'rgba(255, 255, 255, 0.9)',
      }}>
        Start planning with {appName}
      </div>
    </AbsoluteFill>
  );
};

// Helper Components
const FormModal: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 8,
      width: '100%',
      maxWidth: 1152,
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
        borderRadius: '8px 8px 0 0',
      }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>{title}</div>
        <div style={{ width: 20, height: 20, fontSize: 20, color: '#6b7280' }}>×</div>
      </div>
      {children}
    </div>
  );
};

const Tabs: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      paddingLeft: 16,
      paddingRight: 16,
    }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {children}
      </div>
    </div>
  );
};

const TabButton: React.FC<{
  label: string;
  active: boolean;
  color: string;
  optional?: boolean;
}> = ({ label, active, color, optional }) => {
  return (
    <div style={{
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
      fontSize: 14,
      fontWeight: active ? 600 : 500,
      color: active ? color : '#6b7280',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      {label}
      {optional && (
        <span style={{
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 2,
          paddingBottom: 2,
          borderRadius: 9999,
          fontSize: 10,
          fontWeight: 600,
          backgroundColor: active ? '#fef3c7' : '#f3f4f6',
          color: active ? '#92400e' : '#6b7280',
        }}>
          Optional
        </span>
      )}
    </div>
  );
};

const FormField: React.FC<{
  label: string;
  value: string;
  selected?: boolean;
  disabled?: boolean;
}> = ({ label, value, selected, disabled }) => {
  return (
    <div>
      <div style={{
        fontSize: 14,
        fontWeight: 500,
        color: '#374151',
        marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        padding: 12,
        backgroundColor: disabled ? '#f9fafb' : 'white',
        border: selected ? '1px solid #10b981' : '1px solid #d1d5db',
        borderRadius: 12,
        fontSize: 16,
        color: disabled ? '#6b7280' : '#111827',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}>
        {value}
      </div>
    </div>
  );
};

const Button: React.FC<{
  label: string;
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
}> = ({ label, primary, secondary, disabled }) => {
  return (
    <div style={{
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 12,
      paddingBottom: 12,
      borderRadius: 8,
      fontSize: 16,
      fontWeight: 500,
      backgroundColor: primary
        ? '#10b981'
        : secondary
        ? '#f3f4f6'
        : '#3b82f6',
      color: secondary ? '#374151' : 'white',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}>
      {label}
    </div>
  );
};

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 32,
        height: 32,
        backgroundColor: color,
        borderRadius: 6,
      }} />
      <span style={{ fontSize: 16, color: '#374151' }}>{label}</span>
    </div>
  );
};
