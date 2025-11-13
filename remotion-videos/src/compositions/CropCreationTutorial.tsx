import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing, Sequence, AbsoluteFill } from 'remotion';

interface CropCreationTutorialProps {
  appName?: string;
}

export const CropCreationTutorial: React.FC<CropCreationTutorialProps> = ({
  appName = "GardenFlow"
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#f9fafb' }}>
      {/* Scene 1: Title (0-90 frames, 3 seconds) */}
      <Sequence from={0} durationInFrames={90}>
        <TitleScene appName={appName} />
      </Sequence>

      {/* Scene 2: Open Form (90-180 frames, 3 seconds) */}
      <Sequence from={90} durationInFrames={90}>
        <OpenFormScene />
      </Sequence>

      {/* Scene 3: Tab 1 - Plant Selection (180-300 frames, 4 seconds) */}
      <Sequence from={180} durationInFrames={120}>
        <PlantSelectionScene />
      </Sequence>

      {/* Scene 4: Tab 2 - Location (300-420 frames, 4 seconds) */}
      <Sequence from={300} durationInFrames={120}>
        <LocationSelectionScene />
      </Sequence>

      {/* Scene 5: Tab 3 - Timeline Preview (420-570 frames, 5 seconds) */}
      <Sequence from={420} durationInFrames={150}>
        <TimelinePreviewScene />
      </Sequence>

      {/* Scene 6: Tab 4 - Harvest Planning (570-660 frames, 3 seconds) */}
      <Sequence from={570} durationInFrames={90}>
        <HarvestPlanningScene />
      </Sequence>

      {/* Scene 7: Save & Result (660-810 frames, 5 seconds) */}
      <Sequence from={660} durationInFrames={150}>
        <SaveResultScene />
      </Sequence>

      {/* Scene 8: Closing (810-900 frames, 3 seconds) */}
      <Sequence from={810} durationInFrames={90}>
        <ClosingScene appName={appName} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Scene 1: Title
const TitleScene: React.FC<{ appName: string }> = ({ appName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 100 },
  });

  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1]);

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
    }}>
      <div style={{
        transform: `scale(${titleScale})`,
        fontSize: 96,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 30,
      }}>
        🌱 {appName}
      </div>
      <div style={{
        opacity: subtitleOpacity,
        fontSize: 48,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
      }}>
        How to Create a Crop
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Open Form
const OpenFormScene: React.FC = () => {
  const frame = useCurrentFrame();

  const buttonY = interpolate(frame, [0, 30], [500, 350], {
    extrapolateRight: 'clamp',
  });

  const buttonScale = spring({
    frame: frame - 30,
    fps: 30,
    from: 1,
    to: 1.1,
    config: { damping: 100 },
  });

  const clickEffect = frame > 45 ? interpolate(frame, [45, 60], [0, 1]) : 0;
  const modalOpacity = interpolate(frame, [60, 75], [0, 1]);

  return (
    <AbsoluteFill style={{
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* Background App Interface */}
      <div style={{
        width: '90%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 16,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: 40,
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 30 }}>
          Crop Planner
        </div>

        {/* Add Crop Button */}
        <div style={{
          position: 'absolute',
          top: buttonY,
          left: '50%',
          transform: `translateX(-50%) scale(${frame < 45 ? buttonScale : 1})`,
        }}>
          <button style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '20px 40px',
            fontSize: 32,
            fontWeight: 'bold',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            boxShadow: frame > 30 ? '0 10px 25px rgba(59, 130, 246, 0.4)' : 'none',
            position: 'relative',
          }}>
            + Add Crop
            {/* Click effect */}
            {clickEffect > 0 && (
              <div style={{
                position: 'absolute',
                inset: -10,
                borderRadius: 12,
                border: '3px solid #3b82f6',
                opacity: 1 - clickEffect,
                transform: `scale(${1 + clickEffect * 0.2})`,
              }} />
            )}
          </button>
        </div>
      </div>

      {/* Modal appears */}
      {modalOpacity > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: `rgba(0, 0, 0, ${modalOpacity * 0.5})`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            width: '80%',
            height: '70%',
            backgroundColor: 'white',
            borderRadius: 20,
            opacity: modalOpacity,
            transform: `scale(${modalOpacity})`,
            padding: 40,
          }}>
            <div style={{ fontSize: 32, fontWeight: 'bold' }}>Create New Crop</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Scene 3: Plant Selection
const PlantSelectionScene: React.FC = () => {
  const frame = useCurrentFrame();

  const tabOpacity = interpolate(frame, [0, 15], [0, 1]);
  const dropdownY = interpolate(frame, [15, 45], [-100, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const selectionOpacity = interpolate(frame, [60, 75], [0, 1]);

  return (
    <AbsoluteFill style={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        width: '85%',
        height: '75%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          fontSize: 36,
          fontWeight: 'bold',
          marginBottom: 30,
          opacity: tabOpacity,
        }}>
          Create New Crop
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 30,
          marginBottom: 40,
          opacity: tabOpacity,
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: 10,
        }}>
          <TabButton label="Plant Details" active color="#3b82f6" />
          <TabButton label="Location" active={false} color="#10b981" />
          <TabButton label="Timing" active={false} color="#8b5cf6" />
          <TabButton label="Harvest" active={false} color="#f59e0b" />
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 30 }}>
          {/* Plant Family Dropdown */}
          <div style={{
            transform: `translateY(${dropdownY}px)`,
            opacity: dropdownY === 0 ? 1 : 0,
          }}>
            <label style={{ fontSize: 24, color: '#6b7280', marginBottom: 10, display: 'block' }}>
              Plant Family *
            </label>
            <div style={{
              padding: '15px 20px',
              backgroundColor: '#f3f4f6',
              borderRadius: 12,
              fontSize: 28,
              border: '2px solid #3b82f6',
              position: 'relative',
            }}>
              {frame < 60 ? 'Select a plant...' : '🍅 Tomatoes'}
            </div>
          </div>

          {/* Selected plant info appears */}
          {selectionOpacity > 0 && (
            <div style={{
              opacity: selectionOpacity,
              backgroundColor: '#eff6ff',
              padding: 25,
              borderRadius: 12,
              border: '2px solid #3b82f6',
            }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
                🍅 Solanum lycopersicum
              </div>
              <div style={{ fontSize: 20, color: '#6b7280' }}>
                Variety: Cherry Tomato • Family: Solanaceae
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Location Selection
const LocationSelectionScene: React.FC = () => {
  const frame = useCurrentFrame();

  const tab2Highlight = interpolate(frame, [0, 15], [0, 1]);
  const dropdown1 = interpolate(frame, [15, 35], [0, 1]);
  const dropdown2 = interpolate(frame, [50, 70], [0, 1]);
  const dropdown3 = interpolate(frame, [85, 105], [0, 1]);

  return (
    <AbsoluteFill style={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        width: '85%',
        height: '75%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 30 }}>
          Create New Crop
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 30,
          marginBottom: 40,
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: 10,
        }}>
          <TabButton label="Plant Details" active={false} color="#3b82f6" />
          <TabButton label="Location" active color="#10b981" highlight={tab2Highlight} />
          <TabButton label="Timing" active={false} color="#8b5cf6" />
          <TabButton label="Harvest" active={false} color="#f59e0b" />
        </div>

        {/* Location Fields */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 30 }}>
          {/* Project */}
          {dropdown1 > 0 && (
            <DropdownField
              label="Project"
              value="My Home Garden"
              opacity={dropdown1}
              selected
            />
          )}

          {/* Parcel */}
          {dropdown2 > 0 && (
            <DropdownField
              label="Parcel *"
              value="North Garden Bed"
              opacity={dropdown2}
              selected
            />
          )}

          {/* Zone */}
          {dropdown3 > 0 && (
            <DropdownField
              label="Zone *"
              value="Zone A - Full Sun"
              opacity={dropdown3}
              selected
            />
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Timeline Preview
const TimelinePreviewScene: React.FC = () => {
  const frame = useCurrentFrame();

  const tab3Highlight = interpolate(frame, [0, 15], [0, 1]);
  const timelineAppear = interpolate(frame, [20, 40], [0, 1]);
  const sowingProgress = interpolate(frame, [50, 70], [0, 1]);
  const cultureProgress = interpolate(frame, [75, 95], [0, 1]);
  const harvestProgress = interpolate(frame, [100, 120], [0, 1]);

  return (
    <AbsoluteFill style={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        width: '85%',
        height: '75%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 30 }}>
          Create New Crop
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 30,
          marginBottom: 40,
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: 10,
        }}>
          <TabButton label="Plant Details" active={false} color="#3b82f6" />
          <TabButton label="Location" active={false} color="#10b981" />
          <TabButton label="Timing" active color="#8b5cf6" highlight={tab3Highlight} />
          <TabButton label="Harvest" active={false} color="#f59e0b" />
        </div>

        {/* Timeline Visualization */}
        <div style={{
          flex: 1,
          opacity: timelineAppear,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 30 }}>
            Annual Crop Lifecycle
          </div>

          {/* Timeline Bar */}
          <div style={{
            position: 'relative',
            height: 100,
            backgroundColor: '#f3f4f6',
            borderRadius: 12,
            overflow: 'hidden',
          }}>
            {/* Sowing Phase */}
            <div style={{
              position: 'absolute',
              left: '10%',
              width: `${sowingProgress * 15}%`,
              height: '100%',
              backgroundColor: '#93c5fd',
              transition: 'width 0.3s ease',
            }} />

            {/* Culture Phase */}
            {sowingProgress >= 1 && (
              <div style={{
                position: 'absolute',
                left: '25%',
                width: `${cultureProgress * 40}%`,
                height: '100%',
                backgroundColor: '#60a5fa',
                transition: 'width 0.3s ease',
              }} />
            )}

            {/* Harvest Phase */}
            {cultureProgress >= 1 && (
              <div style={{
                position: 'absolute',
                left: '65%',
                width: `${harvestProgress * 20}%`,
                height: '100%',
                backgroundColor: '#2563eb',
                transition: 'width 0.3s ease',
              }} />
            )}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            gap: 40,
            marginTop: 30,
            justifyContent: 'center',
          }}>
            <LegendItem color="#93c5fd" label="Sowing" />
            <LegendItem color="#60a5fa" label="Culture" />
            <LegendItem color="#2563eb" label="Harvest" />
          </div>

          {/* Weeks info */}
          <div style={{
            marginTop: 30,
            fontSize: 24,
            color: '#6b7280',
            textAlign: 'center',
          }}>
            Week 10 → Week 52 (42 weeks total)
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Harvest Planning
const HarvestPlanningScene: React.FC = () => {
  const frame = useCurrentFrame();

  const tab4Highlight = interpolate(frame, [0, 15], [0, 1]);
  const fieldsAppear = interpolate(frame, [20, 40], [0, 1]);
  const summaryAppear = interpolate(frame, [50, 70], [0, 1]);

  return (
    <AbsoluteFill style={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        width: '85%',
        height: '75%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 30 }}>
          Create New Crop
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 30,
          marginBottom: 40,
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: 10,
        }}>
          <TabButton label="Plant Details" active={false} color="#3b82f6" />
          <TabButton label="Location" active={false} color="#10b981" />
          <TabButton label="Timing" active={false} color="#8b5cf6" />
          <TabButton label="Harvest (Optional)" active color="#f59e0b" highlight={tab4Highlight} />
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          opacity: fieldsAppear,
          display: 'flex',
          flexDirection: 'column',
          gap: 30,
        }}>
          <div style={{ fontSize: 24, color: '#6b7280' }}>Expected Yield</div>

          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 20, color: '#6b7280', marginBottom: 10, display: 'block' }}>
                Quantity
              </label>
              <div style={{
                padding: '15px 20px',
                backgroundColor: '#f3f4f6',
                borderRadius: 12,
                fontSize: 24,
              }}>
                25
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 20, color: '#6b7280', marginBottom: 10, display: 'block' }}>
                Unit
              </label>
              <div style={{
                padding: '15px 20px',
                backgroundColor: '#f3f4f6',
                borderRadius: 12,
                fontSize: 24,
              }}>
                kg
              </div>
            </div>
          </div>

          {/* Summary Card */}
          {summaryAppear > 0 && (
            <div style={{
              opacity: summaryAppear,
              backgroundColor: '#d1fae5',
              padding: 25,
              borderRadius: 12,
              border: '2px solid #10b981',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#059669' }}>
                Expected: 25 kg
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: Save & Result
const SaveResultScene: React.FC = () => {
  const frame = useCurrentFrame();

  const buttonAppear = interpolate(frame, [0, 15], [0, 1]);
  const buttonClick = frame > 30 ? interpolate(frame, [30, 45], [0, 1]) : 0;
  const modalClose = interpolate(frame, [45, 60], [1, 0]);
  const cropAppear = interpolate(frame, [70, 90], [0, 1]);
  const ganttAppear = interpolate(frame, [90, 110], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#f9fafb' }}>
      {/* Modal (closing) */}
      {modalClose > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: `rgba(0, 0, 0, ${modalClose * 0.5})`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            width: '85%',
            height: '75%',
            backgroundColor: 'white',
            borderRadius: 20,
            opacity: modalClose,
            transform: `scale(${modalClose})`,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
            {/* Save Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 20,
              opacity: buttonAppear,
            }}>
              <button style={{
                backgroundColor: '#e5e7eb',
                color: '#374151',
                padding: '15px 30px',
                fontSize: 24,
                borderRadius: 12,
                border: 'none',
              }}>
                Cancel
              </button>
              <button style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '15px 30px',
                fontSize: 24,
                fontWeight: 'bold',
                borderRadius: 12,
                border: 'none',
                position: 'relative',
                transform: buttonClick > 0 ? `scale(${1 - buttonClick * 0.1})` : 'scale(1)',
              }}>
                Save Crop
                {buttonClick > 0 && (
                  <div style={{
                    position: 'absolute',
                    inset: -5,
                    borderRadius: 12,
                    border: '3px solid #10b981',
                    opacity: 1 - buttonClick,
                    transform: `scale(${1 + buttonClick * 0.3})`,
                  }} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gantt View appears */}
      {cropAppear > 0 && (
        <div style={{
          width: '90%',
          height: '80%',
          margin: '5% auto',
          backgroundColor: 'white',
          borderRadius: 16,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: 40,
          opacity: cropAppear,
        }}>
          <div style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 40 }}>
            Crop Planner - Gantt View
          </div>

          {/* Gantt Timeline */}
          {ganttAppear > 0 && (
            <div style={{
              opacity: ganttAppear,
              backgroundColor: '#f9fafb',
              padding: 30,
              borderRadius: 12,
              position: 'relative',
            }}>
              <div style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 15,
              }}>
                🍅 Tomatoes
                <span style={{
                  fontSize: 20,
                  fontWeight: 'normal',
                  color: '#6b7280',
                }}>
                  Zone A - Full Sun
                </span>
              </div>

              {/* Timeline bar */}
              <div style={{
                height: 60,
                backgroundColor: '#e5e7eb',
                borderRadius: 8,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  left: '10%',
                  width: '15%',
                  height: '100%',
                  backgroundColor: '#93c5fd',
                }} />
                <div style={{
                  position: 'absolute',
                  left: '25%',
                  width: '40%',
                  height: '100%',
                  backgroundColor: '#60a5fa',
                }} />
                <div style={{
                  position: 'absolute',
                  left: '65%',
                  width: '20%',
                  height: '100%',
                  backgroundColor: '#2563eb',
                }} />
              </div>

              {/* Success checkmark */}
              <div style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 48,
                color: 'white',
                transform: `scale(${ganttAppear})`,
              }}>
                ✓
              </div>
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Scene 8: Closing
const ClosingScene: React.FC<{ appName: string }> = ({ appName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textScale = spring({
    frame,
    fps,
    config: { damping: 100 },
  });

  const fadeIn = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
    }}>
      <div style={{
        transform: `scale(${textScale})`,
        fontSize: 72,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 30,
      }}>
        Crop Created! 🎉
      </div>
      <div style={{
        opacity: fadeIn,
        fontSize: 36,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
      }}>
        Start planning your garden with {appName}
      </div>
    </AbsoluteFill>
  );
};

// Helper Components
const TabButton: React.FC<{
  label: string;
  active: boolean;
  color: string;
  highlight?: number;
}> = ({ label, active, color, highlight = 1 }) => {
  return (
    <div style={{
      fontSize: 24,
      fontWeight: active ? 'bold' : 'normal',
      color: active ? color : '#9ca3af',
      paddingBottom: 5,
      borderBottom: active ? `3px solid ${color}` : 'none',
      cursor: 'pointer',
      opacity: active ? highlight : 0.6,
    }}>
      {label}
    </div>
  );
};

const DropdownField: React.FC<{
  label: string;
  value: string;
  opacity: number;
  selected?: boolean;
}> = ({ label, value, opacity, selected }) => {
  return (
    <div style={{ opacity }}>
      <label style={{
        fontSize: 24,
        color: '#6b7280',
        marginBottom: 10,
        display: 'block',
      }}>
        {label}
      </label>
      <div style={{
        padding: '15px 20px',
        backgroundColor: selected ? '#f3f4f6' : 'white',
        borderRadius: 12,
        fontSize: 28,
        border: selected ? '2px solid #10b981' : '2px solid #e5e7eb',
      }}>
        {value}
      </div>
    </div>
  );
};

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 40,
        height: 40,
        backgroundColor: color,
        borderRadius: 6,
      }} />
      <span style={{ fontSize: 24, color: '#374151' }}>{label}</span>
    </div>
  );
};
