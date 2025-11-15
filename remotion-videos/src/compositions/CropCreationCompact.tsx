import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing, Sequence, AbsoluteFill } from 'remotion';
import { getTranslations, type Language } from '../translations/cropCreationTranslations';

/**
 * Compact Crop Creation Tutorial - 38 seconds, high zoom, actual Gantt design
 * Based on real screenshot with minimal white space
 * Supports multiple languages (fr, en)
 */

interface CropCreationCompactProps {
  appName?: string;
  language?: Language;
}

// GardenFlow Colors from screenshot
const GF_COLORS = {
  grey50: '#FAFAFA',
  grey100: '#F5F5F5',
  grey600: '#757575',
  grey900: '#212121',

  // Actual colors from Gantt
  blue: '#3b82f6',
  lightBlue: '#93c5fd',
  green: '#10b981',
  lightGreen: '#6ee7b7',
  amber: '#f59e0b',

  purpleStart: '#9333ea',
  purpleEnd: '#7e22ce',
};

// No zoom to avoid cropping
const ZOOM_SCALE = 1.0;

export const CropCreationCompact: React.FC<CropCreationCompactProps> = ({ language = 'fr' }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: GF_COLORS.grey50 }}>
      {/* Scene 1: Title (0-135 frames, 4.5s) - Audio: 4.15s */}
      <Sequence from={0} durationInFrames={135}>
        <TitleScene language={language} />
      </Sequence>

      {/* Scene 2: FAB Click (135-225 frames, 3s) - Audio: 2.90s */}
      <Sequence from={135} durationInFrames={90}>
        <FABClickScene language={language} />
      </Sequence>

      {/* Scene 3: Form - Plant Selection (225-360 frames, 4.5s) - Audio: 4.06s */}
      <Sequence from={225} durationInFrames={135}>
        <PlantSelectionScene language={language} />
      </Sequence>

      {/* Scene 4: Form - Location (360-540 frames, 6s) - Audio: 5.33s */}
      <Sequence from={360} durationInFrames={180}>
        <LocationSelectionScene language={language} />
      </Sequence>

      {/* Scene 5: Form - Timeline (540-720 frames, 6s) - Audio: 5.74s */}
      <Sequence from={540} durationInFrames={180}>
        <TimelineScene language={language} />
      </Sequence>

      {/* Scene 6: Form - Harvest Planning (720-825 frames, 3.5s) - Audio: 3.31s */}
      <Sequence from={720} durationInFrames={105}>
        <HarvestPlanningScene language={language} />
      </Sequence>

      {/* Scene 7: Save & Gantt Result (825-975 frames, 5s) - Audio: 4.82s */}
      <Sequence from={825} durationInFrames={150}>
        <SaveAndGanttScene language={language} />
      </Sequence>

      {/* Scene 8: Success Screen (975-1140 frames, 5.5s) - Audio: 5.04s */}
      <Sequence from={975} durationInFrames={165}>
        <SuccessScene language={language} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Title Scene - 2s
// Narration: "Découvrez comment créer une nouvelle culture {t.subtitle}"
const TitleScene: React.FC<{ language: Language }> = ({ language }) => {
  const t = getTranslations(language);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 80, stiffness: 120 } });
  const opacity = interpolate(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${GF_COLORS.green} 0%, ${GF_COLORS.lightGreen} 100%)`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 80,
    }}>
      {/* GardenFlow Logo */}
      <div style={{
        fontSize: 72,
        fontWeight: 800,
        marginBottom: 48,
        opacity,
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
      }}>
        <span style={{
          background: 'linear-gradient(to right, #2ebddc, #56c89a)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Garden
        </span>
        <span style={{
          background: 'linear-gradient(to right, #ff9a3d, #ff7b7b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Flow
        </span>
      </div>

      {/* Title */}
      <div style={{
        transform: `scale(${scale})`,
        opacity,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 96, fontWeight: 700, color: 'white', marginBottom: 24 }}>
          {t.title}
        </div>
        <div style={{ fontSize: 42, color: 'rgba(255,255,255,0.9)' }}>
          {t.subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// FAB Click Scene - 2s
// Shows real crop planner with skeleton rows
const FABClickScene: React.FC<{ language: Language }> = ({ language }) => {
  const t = getTranslations(language);
  const frame = useCurrentFrame();

  const fabPulse = frame > 30 ? Math.sin((frame - 30) * 0.2) * 0.1 + 1.1 : 1;
  const modalAppear = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#f8fafc' }}>
      {/* Header with GardenFlow branding */}
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
        padding: '0 32px',
      }}>
        {/* GardenFlow Logo */}
        <div style={{
          fontSize: 32,
          fontWeight: 800,
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
        }}>
          <span style={{
            background: 'linear-gradient(to right, #2ebddc, #56c89a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Garden
          </span>
          <span style={{
            background: 'linear-gradient(to right, #ff9a3d, #ff7b7b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Flow
          </span>
        </div>

        {/* Add Crop FAB */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${GF_COLORS.purpleStart} 0%, ${GF_COLORS.purpleEnd} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(147, 51, 234, 0.5)',
          transform: `scale(${fabPulse})`,
          cursor: 'pointer',
        }}>
          <div style={{ fontSize: 48, color: 'white', fontWeight: 'bold' }}>+</div>
        </div>
      </div>

      {/* Crop Planner Content - Gantt Chart */}
      <div style={{
        marginTop: 120,
        padding: '0 32px',
      }}>
        <h1 style={{
          fontSize: 40,
          fontWeight: 700,
          color: GF_COLORS.grey900,
          marginBottom: 24,
        }}>
          {t.ganttTitle}
        </h1>

        {/* Gantt table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 80px repeat(12, 1fr) 120px',
          gap: 0,
          backgroundColor: 'white',
          borderRadius: '12px 12px 0 0',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 24px',
          fontSize: 18,
          fontWeight: 600,
          color: GF_COLORS.grey600,
        }}>
          <div>{t.ganttName}</div>
          <div>{t.ganttOrder}</div>
          <div>{t.january}</div>
          <div>{t.february}</div>
          <div>{t.march}</div>
          <div>{t.april}</div>
          <div>{t.may}</div>
          <div>{t.june}</div>
          <div>{t.july}</div>
          <div>{t.august}</div>
          <div>{t.september}</div>
          <div>{t.october}</div>
          <div>{t.november}</div>
          <div>{t.december}</div>
          <div>{t.tabHarvest}</div>
        </div>

        {/* Skeleton crop rows */}
        <SkeletonCropRow name="🥕 Carottes" order="1" />
        <SkeletonCropRow name="🥬 Salades" order="2" />
        <SkeletonCropRow name="🥒 Concombres" order="3" />
      </div>

      {/* Modal backdrop */}
      {modalAppear > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: `rgba(0, 0, 0, ${modalAppear * 0.4})`,
          backdropFilter: `blur(${modalAppear * 4}px)`,
        }} />
      )}
    </AbsoluteFill>
  );
};

// Skeleton Crop Row Component
const SkeletonCropRow: React.FC<{ name: string; order: string }> = ({ name, order }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '200px 80px repeat(12, 1fr) 120px',
    gap: 0,
    backgroundColor: 'white',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
    alignItems: 'center',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: GF_COLORS.grey100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 600,
        color: GF_COLORS.grey600,
      }}>
        {order}
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, opacity: 0.4 }}>{name}</div>
    </div>
    <div style={{ fontSize: 20, color: GF_COLORS.grey600, opacity: 0.4 }}>{order}</div>

    {/* Empty timeline placeholder */}
    <div style={{ gridColumn: '3 / 15', height: 40, backgroundColor: GF_COLORS.grey50, borderRadius: 8 }} />

    <div />
  </div>
);

// Plant Selection Scene - 4s (compact form)
const PlantSelectionScene: React.FC<{ language: Language }> = ({ language }) => {
  const t = getTranslations(language);
  const frame = useCurrentFrame();

  const categoriesAppear = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' });
  const fieldFade = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 24,
        width: '85%',
        maxWidth: 1400,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        transform: `scale(${ZOOM_SCALE})`,
        overflow: 'hidden',
      }}>
        {/* Compact Header */}
        <div style={{
          padding: '24px 32px',
          backgroundColor: GF_COLORS.grey50,
          borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: GF_COLORS.grey900 }}>
            {t.title}
          </div>
          <div style={{ fontSize: 42, color: GF_COLORS.grey600 }}>×</div>
        </div>

        {/* Tabs - compact */}
        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: `1px solid #e5e7eb`,
          padding: '0 32px',
        }}>
          <Tab label={t.tabPlant} active color={GF_COLORS.blue} />
          <Tab label={t.tabLocation} color={GF_COLORS.green} />
          <Tab label={t.tabPlanning} color={GF_COLORS.purpleStart} />
          <Tab label={t.tabHarvest} color={GF_COLORS.amber} />
        </div>

        {/* Content */}
        <div style={{ padding: 32 }}>
          {/* Category badges */}
          <div style={{
            display: 'flex',
            gap: 12,
            marginBottom: 24,
            opacity: categoriesAppear,
          }}>
            <CategoryBadge label={t.categoryAll} active color="#3b82f6" />
            <CategoryBadge label={t.categoryVegetables} color="#10b981" />
            <CategoryBadge label={t.categoryFruits} color="#ef4444" />
            <CategoryBadge label={t.categoryHerbs} color="#059669" />
          </div>

          {/* Plant family and details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            marginBottom: 24,
            opacity: fieldFade,
          }}>
            <FormField label={t.plantFamily} value={t.plantFamilyValue} highlight />
            <FormField label={t.plantVariety} value={t.plantVarietyValue} />
          </div>

          {/* Order and Quantity */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            opacity: fieldFade,
          }}>
            <FormField label={t.plantOrder} value="1" />
            <FormField label={t.seedQuantity} value="10" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Category Badge Component
const CategoryBadge: React.FC<{ label: string; active?: boolean; color?: string }> = ({ label, active, color = '#6b7280' }) => (
  <div style={{
    padding: '10px 20px',
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 600,
    backgroundColor: active ? color : '#f3f4f6',
    color: active ? 'white' : '#6b7280',
    boxShadow: active ? `0 4px 12px ${color}40` : 'none',
  }}>
    {label}
  </div>
);

// Location Selection - 4s
const LocationSelectionScene: React.FC<{ language: Language }> = ({ language }) => {
  const t = getTranslations(language);
  const frame = useCurrentFrame();
  const projectAppear = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' });
  const parcelAppear = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' });
  const zoneAppear = interpolate(frame, [70, 90], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 24,
        width: '85%',
        maxWidth: 1400,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        transform: `scale(${ZOOM_SCALE})`,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '24px 32px',
          backgroundColor: GF_COLORS.grey50,
          borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: GF_COLORS.grey900 }}>
            {t.title}
          </div>
          <div style={{ fontSize: 42, color: GF_COLORS.grey600 }}>×</div>
        </div>

        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: `1px solid #e5e7eb`,
          padding: '0 32px',
        }}>
          <Tab label={t.tabPlant} color={GF_COLORS.blue} />
          <Tab label={t.tabLocation} active color={GF_COLORS.green} />
          <Tab label={t.tabPlanning} color={GF_COLORS.purpleStart} />
          <Tab label={t.tabHarvest} color={GF_COLORS.amber} />
        </div>

        <div style={{ padding: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Project (read-only) */}
            <div style={{ opacity: projectAppear }}>
              <label style={{ fontSize: 18, fontWeight: 600, color: GF_COLORS.grey600, display: 'block', marginBottom: 8 }}>
                {t.project}
              </label>
              <div style={{
                padding: 20,
                backgroundColor: GF_COLORS.grey50,
                border: `1px solid #d1d5db`,
                borderRadius: 16,
                fontSize: 24,
                color: GF_COLORS.grey900,
                fontWeight: 500,
              }}>
                {t.projectValue}
              </div>
            </div>

            {/* Parcel selection */}
            <div style={{ opacity: parcelAppear }}>
              <FormField label={t.parcel} value={t.parcelValue} highlight />
            </div>

            {/* Zone selection */}
            <div style={{ opacity: zoneAppear }}>
              <FormField label={t.zone} value={t.zoneValue} highlight />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Timeline Scene - 3s (matches actual Gantt colors)
// Narration: "Troisième étape : visualisez le planning de semis, culture et récolte."
const TimelineScene: React.FC<{ language: Language }> = ({ language }) => {
  const t = getTranslations(language);
  const frame = useCurrentFrame();

  const sowProgress = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });
  const cultureProgress = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' });
  const harvestProgress = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 24,
        width: '85%',
        maxWidth: 1400,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        transform: `scale(${ZOOM_SCALE})`,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '24px 32px',
          backgroundColor: GF_COLORS.grey50,
          borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: GF_COLORS.grey900 }}>
            {t.title}
          </div>
          <div style={{ fontSize: 42, color: GF_COLORS.grey600 }}>×</div>
        </div>

        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: `1px solid #e5e7eb`,
          padding: '0 32px',
        }}>
          <Tab label={t.tabPlant} color={GF_COLORS.blue} />
          <Tab label={t.tabLocation} color={GF_COLORS.green} />
          <Tab label={t.tabPlanning} active color={GF_COLORS.purpleStart} />
          <Tab label={t.tabHarvest} color={GF_COLORS.amber} />
        </div>

        <div style={{ padding: 48 }}>
          {/* Timeline bar - matching screenshot colors */}
          <div style={{
            height: 80,
            backgroundColor: '#f3f4f6',
            borderRadius: 12,
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 32,
          }}>
            {/* Semis (Sowing) - light blue */}
            {sowProgress > 0 && (
              <div style={{
                position: 'absolute',
                left: '8%',
                width: `${sowProgress * 12}%`,
                height: '100%',
                background: GF_COLORS.lightBlue,
              }} />
            )}
            {/* Culture - green gradient */}
            {cultureProgress > 0 && (
              <div style={{
                position: 'absolute',
                left: '20%',
                width: `${cultureProgress * 45}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${GF_COLORS.lightGreen} 0%, ${GF_COLORS.green} 100%)`,
              }} />
            )}
            {/* Récolte (Harvest) - amber */}
            {harvestProgress > 0 && (
              <div style={{
                position: 'absolute',
                left: '65%',
                width: `${harvestProgress * 25}%`,
                height: '100%',
                background: GF_COLORS.amber,
              }} />
            )}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 48, justifyContent: 'center' }}>
            <LegendItem color={GF_COLORS.lightBlue} label={t.sowingLabel} opacity={sowProgress} />
            <LegendItem color={GF_COLORS.green} label={t.growthLabel} opacity={cultureProgress} />
            <LegendItem color={GF_COLORS.amber} label={t.harvestLabel} opacity={harvestProgress} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Harvest Planning Scene - 3s (NEW - Planification Récolte tab)
// Narration: "Consultez les dates de récolte et planifiez votre calendrier."
const HarvestPlanningScene: React.FC<{ language: Language }> = ({ language }) => {
  const t = getTranslations(language);
  const frame = useCurrentFrame();
  const fieldFade = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' });
  const dateAppear = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 24,
        width: '85%',
        maxWidth: 1400,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        transform: `scale(${ZOOM_SCALE})`,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '24px 32px',
          backgroundColor: GF_COLORS.grey50,
          borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: GF_COLORS.grey900 }}>
            {t.title}
          </div>
          <div style={{ fontSize: 42, color: GF_COLORS.grey600 }}>×</div>
        </div>

        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: `1px solid #e5e7eb`,
          padding: '0 32px',
        }}>
          <Tab label={t.tabPlant} color={GF_COLORS.blue} />
          <Tab label={t.tabLocation} color={GF_COLORS.green} />
          <Tab label={t.tabPlanning} color={GF_COLORS.purpleStart} />
          <Tab label={t.tabHarvest} active color={GF_COLORS.amber} />
        </div>

        <div style={{ padding: 48 }}>
          {/* Section title */}
          <div style={{
            opacity: fieldFade,
            marginBottom: 32,
          }}>
            <h3 style={{
              fontSize: 24,
              fontWeight: 600,
              color: GF_COLORS.grey900,
              marginBottom: 8,
            }}>
              {t.harvestPlanningTitle}
            </h3>
            <p style={{
              fontSize: 18,
              color: GF_COLORS.grey600,
            }}>
              {t.harvestPlanningSubtitle}
            </p>
          </div>

          {/* Harvest quantity and unit fields */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            opacity: dateAppear,
          }}>
            <FormField
              label={t.harvestQuantityLabel}
              value="5"
              highlight
            />
            <FormField
              label={t.harvestUnitLabel}
              value="kg"
              highlight
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Save and Gantt Result - 4s (matches actual screenshot)
const SaveAndGanttScene: React.FC<{ language: Language }> = ({ language }) => {
  const t = getTranslations(language);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const modalFade = interpolate(frame, [0, 30], [1, 0]);
  const ganttAppear = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' });
  const checkmark = spring({
    frame: frame - 80,
    fps,
    from: 0,
    to: 1,
    config: { damping: 80, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ background: '#f8fafc' }}>
      {/* Modal fading out */}
      {modalFade > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: `rgba(0, 0, 0, ${modalFade * 0.4})`,
          backdropFilter: `blur(${modalFade * 4}px)`,
        }} />
      )}

      {/* Gantt View - matching screenshot */}
      {ganttAppear > 0 && (
        <div style={{
          margin: '80px auto',
          width: '90%',
          opacity: ganttAppear,
        }}>
          {/* Header similar to screenshot */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
            padding: '0 24px',
          }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: GF_COLORS.grey900 }}>
              {t.ganttTitle}
            </div>
          </div>

          {/* Gantt table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 80px repeat(12, 1fr) 120px',
            gap: 0,
            backgroundColor: 'white',
            borderRadius: '12px 12px 0 0',
            borderBottom: '1px solid #e5e7eb',
            padding: '16px 24px',
            fontSize: 20,
            fontWeight: 600,
            color: GF_COLORS.grey600,
          }}>
            <div>{t.ganttName}</div>
            <div>{t.ganttOrder}</div>
            <div>{t.january}</div>
            <div>{t.february}</div>
            <div>{t.march}</div>
            <div>{t.april}</div>
            <div>{t.may}</div>
            <div>{t.june}</div>
            <div>{t.july}</div>
            <div>{t.august}</div>
            <div>{t.september}</div>
            <div>{t.october}</div>
            <div>{t.november}</div>
            <div>{t.december}</div>
            <div>{t.tabHarvest}</div>
          </div>

          {/* Gantt row - Tomates (matching screenshot style) */}
          <div style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '200px 80px repeat(12, 1fr) 120px',
            gap: 0,
            backgroundColor: 'white',
            padding: '24px',
            borderBottom: '1px solid #e5e7eb',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: GF_COLORS.green,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 600,
              }}>
                LAU
              </div>
              <div style={{ fontSize: 22, fontWeight: 600 }}>{t.cropName}</div>
            </div>
            <div style={{ fontSize: 22, color: GF_COLORS.grey600 }}>1</div>

            {/* Timeline bars matching screenshot colors */}
            <div style={{ gridColumn: '3 / 6' }}>
              <div style={{
                height: 48,
                background: GF_COLORS.lightBlue,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                color: 'white',
                fontWeight: 600,
              }}>
                S S40
              </div>
            </div>
            <div style={{ gridColumn: '6 / 11' }}>
              <div style={{
                height: 48,
                background: `linear-gradient(90deg, ${GF_COLORS.lightGreen} 0%, ${GF_COLORS.green} 100%)`,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                color: 'white',
                fontWeight: 600,
              }}>
                C S40-52
              </div>
            </div>
            <div style={{ gridColumn: '11 / 13' }}>
              <div style={{
                height: 48,
                background: GF_COLORS.amber,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                color: 'white',
                fontWeight: 600,
              }}>
                R S46-49
              </div>
            </div>

            {/* Harvest badge */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                padding: '8px 16px',
                backgroundColor: GF_COLORS.green,
                color: 'white',
                borderRadius: 20,
                fontSize: 18,
                fontWeight: 600,
              }}>
                P1 P1Z1-1
              </div>
            </div>

            {/* Success checkmark */}
            {checkmark > 0 && (
              <div style={{
                position: 'absolute',
                right: -32,
                top: '50%',
                transform: `translateY(-50%) scale(${checkmark})`,
                width: 96,
                height: 96,
                background: GF_COLORS.green,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 56,
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
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

// Success Scene - 6s (NEW - Final closing screen)
// Narration: "Culture créée ! {t.successCTA} avec GardenFlow."
const SuccessScene: React.FC<{ language: Language }> = ({ language }) => {
  const t = getTranslations(language);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const checkScale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 60, stiffness: 100 },
  });

  const textFade = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' });
  const ctaFade = interpolate(frame, [90, 120], [0, 1], { extrapolateRight: 'clamp' });
  const ctaPulse = Math.sin(frame * 0.1) * 0.05 + 1;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${GF_COLORS.green} 0%, ${GF_COLORS.lightGreen} 50%, ${GF_COLORS.blue} 100%)`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 80,
    }}>
      {/* Success checkmark */}
      <div style={{
        width: 240,
        height: 240,
        background: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
        transform: `scale(${checkScale})`,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
      }}>
        <div style={{
          fontSize: 160,
          color: GF_COLORS.green,
          fontWeight: 'bold',
        }}>
          ✓
        </div>
      </div>

      {/* Success message */}
      <div style={{
        opacity: textFade,
        textAlign: 'center',
        marginBottom: 60,
      }}>
        <div style={{
          fontSize: 96,
          fontWeight: 800,
          color: 'white',
          marginBottom: 24,
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        }}>
          {t.successTitle}
        </div>
        <div style={{
          fontSize: 42,
          color: 'rgba(255, 255, 255, 0.95)',
          fontWeight: 500,
          lineHeight: 1.5,
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}>
          {t.successMessage}
        </div>
      </div>

      {/* Call to action with GardenFlow branding */}
      <div style={{
        opacity: ctaFade,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 52,
          fontWeight: 700,
          color: 'white',
          marginBottom: 32,
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        }}>
          {t.successCTA}
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 16,
          padding: '24px 48px',
          backgroundColor: 'white',
          borderRadius: 60,
          transform: `scale(${ctaPulse})`,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
        }}>
          <div style={{
            fontSize: 48,
            fontWeight: 800,
          }}>
            <span style={{
              background: 'linear-gradient(to right, #2ebddc, #56c89a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Garden
            </span>
            <span style={{
              background: 'linear-gradient(to right, #ff9a3d, #ff7b7b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Flow
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Helper Components
const Tab: React.FC<{ label: string; active?: boolean; color: string }> = ({ label, active, color }) => (
  <div style={{
    padding: '20px 28px',
    borderBottom: active ? `4px solid ${color}` : '4px solid transparent',
    fontSize: 24,
    fontWeight: active ? 700 : 500,
    color: active ? color : GF_COLORS.grey600,
  }}>
    {label}
  </div>
);

const FormField: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div>
    <div style={{
      fontSize: 22,
      fontWeight: 600,
      color: GF_COLORS.grey600,
      marginBottom: 12,
    }}>
      {label}
    </div>
    <div style={{
      padding: 24,
      backgroundColor: 'white',
      border: highlight ? `2px solid ${GF_COLORS.green}` : `1px solid #d1d5db`,
      borderRadius: 16,
      fontSize: 26,
      color: GF_COLORS.grey900,
      fontWeight: 500,
      boxShadow: highlight ? '0 4px 14px rgba(16, 185, 129, 0.15)' : 'none',
    }}>
      {value}
    </div>
  </div>
);

const LegendItem: React.FC<{ color: string; label: string; opacity: number }> = ({ color, label, opacity }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    opacity,
  }}>
    <div style={{
      width: 60,
      height: 60,
      backgroundColor: color,
      borderRadius: 8,
    }} />
    <span style={{ fontSize: 28, fontWeight: 600, color: GF_COLORS.grey600 }}>{label}</span>
  </div>
);
