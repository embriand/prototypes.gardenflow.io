import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing, Sequence, AbsoluteFill, Audio, staticFile, Img } from 'remotion';

/**
 * Crop Creation Tutorial - Version Réaliste avec vrais labels français
 * 20 secondes, contexte immersif, vrais textes de l'app
 */

interface CropCreationRealisticProps {
  appName?: string;
}

// Couleurs réelles de GardenFlow depuis le screenshot
const GF_COLORS = {
  grey50: '#FAFAFA',
  grey100: '#F5F5F5',
  grey600: '#757575',
  grey900: '#212121',

  // Couleurs Gantt réelles
  blue: '#3b82f6',
  lightBlue: '#93c5fd',
  green: '#10b981',
  lightGreen: '#6ee7b7',
  amber: '#f59e0b',

  purpleStart: '#9333ea',
  purpleEnd: '#7e22ce',
};

const ZOOM_SCALE = 1.0;

export const CropCreationRealistic: React.FC<CropCreationRealisticProps> = () => {
  // Frame durations - Adjusted flow with gap
  // voice_01: 4.15s = 125 frames (intro)
  // voice_02: 2.93s = 88 frames (FAB click)
  // voice_03: 4.49s = 135 frames (plant details with family selection)
  // voice_04: 5.14s = 154 frames (location)
  // voice_05: 5.26s = 158 frames (timeline - without "sauvegarder")
  // GAP: 1 second = 30 frames (breathing room between scenes)
  // voice_06: 2.74s = 82 frames + 40 frames padding = 122 frames (save - starts with "La culture apparait")
  // Total: ~25.7s = 812 frames

  return (
    <AbsoluteFill style={{ backgroundColor: GF_COLORS.grey50 }}>
      {/* Audio tracks synchronized with each scene */}
      <Sequence from={0} durationInFrames={125}>
        <Audio src={staticFile('voiceover/voice_01_intro.mp3')} />
      </Sequence>

      <Sequence from={125} durationInFrames={88}>
        <Audio src={staticFile('voiceover/voice_02_fab.mp3')} />
      </Sequence>

      <Sequence from={213} durationInFrames={135}>
        <Audio src={staticFile('voiceover/voice_03_plant.mp3')} />
      </Sequence>

      <Sequence from={348} durationInFrames={154}>
        <Audio src={staticFile('voiceover/voice_04_location.mp3')} />
      </Sequence>

      <Sequence from={502} durationInFrames={158}>
        <Audio src={staticFile('voiceover/voice_05_timeline.mp3')} />
      </Sequence>

      {/* 30-frame gap (660-690) for breathing room between phrases */}

      <Sequence from={690} durationInFrames={122}>
        <Audio src={staticFile('voiceover/voice_06_save.mp3')} />
      </Sequence>

      {/* Scene 1: Title (0-125 frames, ~4.15s) */}
      <Sequence from={0} durationInFrames={125}>
        <TitleScene />
      </Sequence>

      {/* Scene 2: CropPlanner avec FAB (125-213 frames, ~2.93s) */}
      <Sequence from={125} durationInFrames={88}>
        <CropPlannerScene />
      </Sequence>

      {/* Scene 3: Form - Plante & Détails avec famille (213-348 frames, ~4.49s) */}
      <Sequence from={213} durationInFrames={135}>
        <PlantDetailsTabScene />
      </Sequence>

      {/* Scene 4: Form - Emplacement (348-502 frames, ~5.14s) */}
      <Sequence from={348} durationInFrames={154}>
        <LocationTabScene />
      </Sequence>

      {/* Scene 5: Form - Timing & Aperçu (502-660 frames, ~5.26s) */}
      <Sequence from={502} durationInFrames={158}>
        <TimingTabScene />
      </Sequence>

      {/* Scene 6: Sauvegarde & Gantt (690-812 frames, ~4.07s) */}
      <Sequence from={690} durationInFrames={122}>
        <SaveAndGanttScene />
      </Sequence>
    </AbsoluteFill>
  );
};

// Title Scene - 2s
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 80, stiffness: 120 } });
  const opacity = interpolate(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${GF_COLORS.green} 0%, ${GF_COLORS.lightGreen} 100%)`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        transform: `scale(${scale})`,
        opacity,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 72,
          fontWeight: 800,
          marginBottom: 48,
          letterSpacing: '-2px',
          textTransform: 'uppercase',
          fontFamily: 'system-ui, -apple-system, sans-serif',
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
        <div style={{ fontSize: 96, fontWeight: 700, color: 'white', marginBottom: 24 }}>
          Comment créer une culture
        </div>
        <div style={{ fontSize: 42, color: 'rgba(255,255,255,0.9)' }}>
          Guide rapide en 4 étapes
        </div>
      </div>
    </AbsoluteFill>
  );
};

// CropPlanner Scene avec contexte Gantt - Multiple crops
const CropPlannerScene: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const fabPulse = frame > 30 ? Math.sin((frame - 30) * 0.2) * 0.1 + 1.1 : 1;

  // Sample crops data
  const crops = [
    { name: '🥬 Laitue', semis: '3 / 5', culture: '5 / 8', recolte: '8 / 10' },
    { name: '🥕 Carottes', semis: '2 / 4', culture: '4 / 9', recolte: '9 / 11' },
    { name: '🌶️ Poivrons', semis: '4 / 6', culture: '6 / 10', recolte: '10 / 12' },
    { name: '🥒 Concombres', semis: '5 / 6', culture: '6 / 9', recolte: '9 / 11' },
  ];

  return (
    <AbsoluteFill style={{ background: '#f8fafc', opacity: fadeIn }}>
      {/* Top Bar avec contexte */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 88,
        background: 'white',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{ fontSize: 26, fontWeight: 600, color: GF_COLORS.grey900 }}>
            Planification des Cultures
          </div>
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#dbeafe',
            borderRadius: 20,
            fontSize: 18,
            color: '#1e40af',
            fontWeight: 500,
          }}>
            Projet actuel: Jardin Potager 2025
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* Stock FAB */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${GF_COLORS.green} 0%, ${GF_COLORS.lightGreen} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.25)',
          }}>
            <div style={{ fontSize: 32, color: 'white' }}>📦</div>
          </div>

          {/* PDF FAB */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.25)',
          }}>
            <div style={{ fontSize: 32, color: 'white' }}>📄</div>
          </div>

          {/* Ajouter FAB - Highlighted with pointer */}
          <div style={{
            position: 'relative',
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${GF_COLORS.purpleStart} 0%, ${GF_COLORS.purpleEnd} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: frame > 30 ? '0 8px 24px 0 rgba(147, 51, 234, 0.4)' : '0 4px 14px 0 rgba(147, 51, 234, 0.25)',
            transform: `scale(${fabPulse})`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <div style={{ fontSize: 42, color: 'white', fontWeight: 'bold' }}>+</div>
            {/* Pointer arrow */}
            {frame > 40 && (
              <div style={{
                position: 'absolute',
                top: -50,
                right: -20,
                fontSize: 48,
                animation: 'bounce 1s infinite',
              }}>
                👆
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gantt view with multiple crops */}
      <div style={{
        marginTop: 120,
        padding: '24px 48px',
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: GF_COLORS.grey600, marginBottom: 20 }}>
            Période des cultures
          </div>
          {/* Timeline header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 4,
            marginBottom: 20,
          }}>
            {['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'].map((month, i) => (
              <div key={i} style={{ fontSize: 16, color: GF_COLORS.grey600, textAlign: 'center' }}>
                {month}
              </div>
            ))}
          </div>
          {/* Multiple crop rows */}
          {crops.map((crop, index) => (
            <div key={index} style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              alignItems: 'center',
              gap: 16,
              padding: '16px 0',
              borderTop: `1px solid ${GF_COLORS.grey100}`,
            }}>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{crop.name}</div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: 4,
              }}>
                <div style={{ gridColumn: crop.semis, height: 32, background: GF_COLORS.lightBlue, borderRadius: 6 }} />
                <div style={{ gridColumn: crop.culture, height: 32, background: GF_COLORS.green, borderRadius: 6 }} />
                <div style={{ gridColumn: crop.recolte, height: 32, background: GF_COLORS.amber, borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Skeleton Loader Component
const SkeletonLoader: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: '#f8fafc',
      padding: '120px 48px 24px 48px',
    }}>
      {/* Gantt skeleton */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 32,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}>
        {/* Header skeleton */}
        <div style={{
          height: 24,
          width: 200,
          backgroundColor: GF_COLORS.grey100,
          borderRadius: 4,
          marginBottom: 20,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }} />

        {/* Timeline header skeleton */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 4,
          marginBottom: 20,
        }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              height: 16,
              backgroundColor: GF_COLORS.grey100,
              borderRadius: 4,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }} />
          ))}
        </div>

        {/* Crop rows skeleton */}
        {Array.from({ length: 4 }).map((_, rowIndex) => (
          <div key={rowIndex} style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            alignItems: 'center',
            gap: 16,
            padding: '16px 0',
            borderTop: `1px solid ${GF_COLORS.grey100}`,
          }}>
            <div style={{
              height: 24,
              backgroundColor: GF_COLORS.grey100,
              borderRadius: 4,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }} />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 4,
            }}>
              <div style={{
                gridColumn: '3 / 5',
                height: 32,
                backgroundColor: GF_COLORS.grey100,
                borderRadius: 6,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }} />
              <div style={{
                gridColumn: '5 / 8',
                height: 32,
                backgroundColor: GF_COLORS.grey100,
                borderRadius: 6,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }} />
              <div style={{
                gridColumn: '8 / 10',
                height: 32,
                backgroundColor: GF_COLORS.grey100,
                borderRadius: 6,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Plant Details Tab Scene - 4s (VRAIS LABELS avec sélection famille intégrée)
const PlantDetailsTabScene: React.FC = () => {
  const frame = useCurrentFrame();

  const modalAppear = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.165, 0.84, 0.44, 1),
  });

  const fieldFade = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      {/* Background with skeleton */}
      <SkeletonLoader />

      <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 24,
        width: '90%',
        maxWidth: 1400,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        transform: `scale(${ZOOM_SCALE})`,
        overflow: 'hidden',
        opacity: modalAppear,
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          backgroundColor: GF_COLORS.grey50,
          borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: GF_COLORS.grey900 }}>
            Ajouter une nouvelle culture
          </div>
          <div style={{ fontSize: 36, color: GF_COLORS.grey600, cursor: 'pointer' }}>×</div>
        </div>

        {/* Tabs - VRAIS LABELS */}
        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: `1px solid #e5e7eb`,
          padding: '0 32px',
          backgroundColor: 'white',
        }}>
          <Tab label="Plante et détails" active color={GF_COLORS.blue} />
          <Tab label="Emplacement" color={GF_COLORS.green} />
          <Tab label="Timing et aperçu" color={GF_COLORS.purpleStart} />
          <Tab label="Planification récolte" optional color={GF_COLORS.amber} />
        </div>

        {/* Content */}
        <div style={{ padding: 32, opacity: fieldFade }}>
          {/* Section: Sélection de la famille (intégrée au form) */}
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: GF_COLORS.grey600,
            marginBottom: 20,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            Choisir une famille de plante
          </div>

          {/* Search bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 20px',
            backgroundColor: GF_COLORS.grey50,
            borderRadius: 12,
            border: `1px solid ${GF_COLORS.grey100}`,
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 18 }}>🔍</span>
            <span style={{ fontSize: 16, color: GF_COLORS.grey600 }}>
              Rechercher une plante...
            </span>
          </div>

          {/* Mini categories grid (2x3) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 32,
          }}>
            {[
              { icon: '🥬', name: 'Légumes', color: '#10b981', selected: true },
              { icon: '🌸', name: 'Fleurs', color: '#ec4899' },
              { icon: '🌿', name: 'Aromates', color: '#059669' },
              { icon: '🌳', name: 'Arbres', color: '#92400e' },
              { icon: '🍓', name: 'Fruits', color: '#dc2626' },
              { icon: '🌾', name: 'Céréales', color: '#d97706' },
            ].map((category, index) => (
              <div
                key={index}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: `2px solid ${category.selected ? category.color : GF_COLORS.grey100}`,
                  backgroundColor: category.selected ? `${category.color}10` : 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: category.selected ? `0 4px 12px ${category.color}40` : 'none',
                }}
              >
                <div style={{ fontSize: 32 }}>{category.icon}</div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: category.selected ? category.color : GF_COLORS.grey900,
                }}>
                  {category.name}
                </div>
              </div>
            ))}
          </div>

          {/* Section: Informations de la plante */}
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: GF_COLORS.grey600,
            marginBottom: 20,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            Informations de la plante
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            marginBottom: 32,
          }}>
            <FormField label="Famille de plante *" value="🍅 Tomates" highlight />
            <FormField label="Variété" value="Tomate Cerise" />
            <FormField label="Année" value="2025" />
          </div>

          {/* Section: Ordre - quantité */}
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: GF_COLORS.grey600,
            marginBottom: 20,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            Ordre - quantité
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            <FormField label="Ordre" value="1" />
            <FormField label="Quantité" value="10 graines" />
          </div>
        </div>
      </div>
      </div>
    </AbsoluteFill>
  );
};

// Location Tab Scene - 4s (VRAIS LABELS)
const LocationTabScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fieldFade = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      {/* Background with skeleton */}
      <SkeletonLoader />

      <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 24,
        width: '90%',
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
          <div style={{ fontSize: 28, fontWeight: 700, color: GF_COLORS.grey900 }}>
            Ajouter une nouvelle culture
          </div>
          <div style={{ fontSize: 36, color: GF_COLORS.grey600 }}>×</div>
        </div>

        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: `1px solid #e5e7eb`,
          padding: '0 32px',
        }}>
          <Tab label="Plante et détails" color={GF_COLORS.blue} />
          <Tab label="Emplacement" active color={GF_COLORS.green} />
          <Tab label="Timing et aperçu" color={GF_COLORS.purpleStart} />
          <Tab label="Planification récolte" optional color={GF_COLORS.amber} />
        </div>

        <div style={{ padding: 32, opacity: fieldFade }}>
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: GF_COLORS.grey600,
            marginBottom: 24,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            Emplacement
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <FormField label="Projet" value="🏡 Jardin Potager 2025" highlight />
            <FormField label="Parcelle *" value="Carré Nord" highlight />
            <FormField label="Zone" value="Zone A - Plein Soleil" highlight />
          </div>
        </div>
      </div>
      </div>
    </AbsoluteFill>
  );
};

// Timing Tab Scene - 4s (VRAIS LABELS + couleurs Gantt)
const TimingTabScene: React.FC = () => {
  const frame = useCurrentFrame();

  const sowProgress = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' });
  const cultureProgress = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' });
  const harvestProgress = interpolate(frame, [90, 110], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      {/* Background with skeleton */}
      <SkeletonLoader />

      <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 24,
        width: '90%',
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
          <div style={{ fontSize: 28, fontWeight: 700, color: GF_COLORS.grey900 }}>
            Ajouter une nouvelle culture
          </div>
          <div style={{ fontSize: 36, color: GF_COLORS.grey600 }}>×</div>
        </div>

        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: `1px solid #e5e7eb`,
          padding: '0 32px',
        }}>
          <Tab label="Plante et détails" color={GF_COLORS.blue} />
          <Tab label="Emplacement" color={GF_COLORS.green} />
          <Tab label="Timing et aperçu" active color={GF_COLORS.purpleStart} />
          <Tab label="Planification récolte" optional color={GF_COLORS.amber} />
        </div>

        <div style={{ padding: 48 }}>
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: GF_COLORS.grey600,
            marginBottom: 24,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            Aperçu du calendrier
          </div>

          {/* Timeline bar - couleurs exactes du Gantt */}
          <div style={{
            height: 80,
            backgroundColor: '#f3f4f6',
            borderRadius: 12,
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 32,
          }}>
            {/* Semis */}
            {sowProgress > 0 && (
              <div style={{
                position: 'absolute',
                left: '10%',
                width: `${sowProgress * 12}%`,
                height: '100%',
                background: GF_COLORS.lightBlue,
              }} />
            )}
            {/* Culture */}
            {cultureProgress > 0 && (
              <div style={{
                position: 'absolute',
                left: '22%',
                width: `${cultureProgress * 40}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${GF_COLORS.lightGreen} 0%, ${GF_COLORS.green} 100%)`,
              }} />
            )}
            {/* Récolte */}
            {harvestProgress > 0 && (
              <div style={{
                position: 'absolute',
                left: '62%',
                width: `${harvestProgress * 23}%`,
                height: '100%',
                background: GF_COLORS.amber,
              }} />
            )}
          </div>

          {/* Legend - VRAIS LABELS */}
          <div style={{ display: 'flex', gap: 48, justifyContent: 'center' }}>
            <LegendItem color={GF_COLORS.lightBlue} label="Semis" opacity={sowProgress} />
            <LegendItem color={GF_COLORS.green} label="Culture" opacity={cultureProgress} />
            <LegendItem color={GF_COLORS.amber} label="Récolte" opacity={harvestProgress} />
          </div>
        </div>
      </div>
      </div>
    </AbsoluteFill>
  );
};

// Save and Gantt Result - 4s (DESIGN RÉEL DU SCREENSHOT)
const SaveAndGanttScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const modalFade = interpolate(frame, [0, 20], [1, 0]);
  const ganttAppear = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: 'clamp' });
  const textAppear = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: 'clamp' });
  const checkmark = spring({
    frame: frame - 65,
    fps,
    from: 0,
    to: 1,
    config: { damping: 80, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ background: '#f8fafc' }}>
      {modalFade > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: `rgba(0, 0, 0, ${modalFade * 0.4})`,
          backdropFilter: `blur(${modalFade * 4}px)`,
        }} />
      )}

      {/* Success message text */}
      {textAppear > 0 && (
        <div style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: textAppear,
        }}>
          <div style={{
            padding: '16px 32px',
            background: `linear-gradient(135deg, ${GF_COLORS.green} 0%, ${GF_COLORS.lightGreen} 100%)`,
            borderRadius: 16,
            fontSize: 28,
            fontWeight: 700,
            color: 'white',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
          }}>
            ✓ La culture sauvegardée apparait dans votre planning
          </div>
        </div>
      )}

      {ganttAppear > 0 && (
        <div style={{
          margin: '60px auto',
          width: '92%',
          opacity: ganttAppear,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            padding: '0 16px',
          }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: GF_COLORS.grey900 }}>
              Planification des Cultures
            </div>
          </div>

          {/* Gantt header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '180px 60px repeat(12, 1fr) 100px',
            gap: 0,
            backgroundColor: 'white',
            borderRadius: '12px 12px 0 0',
            borderBottom: '1px solid #e5e7eb',
            padding: '12px 16px',
            fontSize: 15,
            fontWeight: 600,
            color: GF_COLORS.grey600,
          }}>
            <div>Nom</div>
            <div>Ordre</div>
            <div>Janv.</div>
            <div>Févr.</div>
            <div>Mars</div>
            <div>Avril</div>
            <div>Mai</div>
            <div>Juin</div>
            <div>Juil.</div>
            <div>Août</div>
            <div>Sept.</div>
            <div>Oct.</div>
            <div>Nov.</div>
            <div>Déc.</div>
            <div>Récolte</div>
          </div>

          {/* Gantt rows - Multiple crops */}
          {[
            { name: 'Laitue', avatar: 'LAI', order: 1, semis: '3 / 5', culture: '5 / 8', recolte: '8 / 10', zone: 'P1 Z1' },
            { name: 'Carottes', avatar: 'CAR', order: 2, semis: '2 / 4', culture: '4 / 9', recolte: '9 / 11', zone: 'P1 Z2' },
            { name: 'Poivrons', avatar: 'POI', order: 3, semis: '4 / 6', culture: '6 / 10', recolte: '10 / 12', zone: 'P2 Z1' },
            { name: 'Concombres', avatar: 'CON', order: 4, semis: '5 / 6', culture: '6 / 9', recolte: '9 / 11', zone: 'P2 Z2' },
            { name: 'Tomates', avatar: 'TOM', order: 5, semis: '3 / 6', culture: '6 / 11', recolte: '11 / 13', zone: 'P1 Z1', isNew: true },
          ].map((crop, index) => (
            <div key={index} style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '180px 60px repeat(12, 1fr) 100px',
              gap: 0,
              backgroundColor: 'white',
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: crop.isNew ? GF_COLORS.purpleStart : GF_COLORS.green,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  {crop.avatar}
                </div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{crop.name}</div>
              </div>
              <div style={{ fontSize: 17, color: GF_COLORS.grey600 }}>{crop.order}</div>

              {/* Timeline bars */}
              <div style={{ gridColumn: crop.semis }}>
                <div style={{
                  height: 36,
                  background: GF_COLORS.lightBlue,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  color: '#1e40af',
                  fontWeight: 600,
                }}>
                  S
                </div>
              </div>
              <div style={{ gridColumn: crop.culture }}>
                <div style={{
                  height: 36,
                  background: `linear-gradient(90deg, ${GF_COLORS.lightGreen} 0%, ${GF_COLORS.green} 100%)`,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  color: 'white',
                  fontWeight: 600,
                }}>
                  C
                </div>
              </div>
              <div style={{ gridColumn: crop.recolte }}>
                <div style={{
                  height: 36,
                  background: GF_COLORS.amber,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  color: 'white',
                  fontWeight: 600,
                }}>
                  R
                </div>
              </div>

              <div style={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: crop.isNew ? GF_COLORS.purpleStart : GF_COLORS.green,
                  color: 'white',
                  borderRadius: 16,
                  fontSize: 13,
                  fontWeight: 600,
                }}>
                  {crop.zone}
                </div>
              </div>

              {/* Success checkmark - only on the new crop (Tomates) */}
              {crop.isNew && checkmark > 0 && (
                <div style={{
                  position: 'absolute',
                  right: -24,
                  top: '50%',
                  transform: `translateY(-50%) scale(${checkmark})`,
                  width: 72,
                  height: 72,
                  background: GF_COLORS.green,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 42,
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                }}>
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Helper Components
const Tab: React.FC<{ label: string; active?: boolean; color: string; optional?: boolean }> = ({ label, active, color, optional }) => (
  <div style={{
    padding: '16px 24px',
    borderBottom: active ? `4px solid ${color}` : '4px solid transparent',
    fontSize: 18,
    fontWeight: active ? 700 : 500,
    color: active ? color : GF_COLORS.grey600,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  }}>
    {label}
    {optional && (
      <span style={{
        padding: '2px 8px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: active ? '#fef3c7' : GF_COLORS.grey100,
        color: active ? '#92400e' : GF_COLORS.grey600,
      }}>
        (optionnel)
      </span>
    )}
  </div>
);

const FormField: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div>
    <div style={{
      fontSize: 16,
      fontWeight: 600,
      color: GF_COLORS.grey700,
      marginBottom: 10,
    }}>
      {label}
    </div>
    <div style={{
      padding: 18,
      backgroundColor: 'white',
      border: highlight ? `2px solid ${GF_COLORS.green}` : `1px solid #d1d5db`,
      borderRadius: 12,
      fontSize: 18,
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
    gap: 12,
    opacity,
  }}>
    <div style={{
      width: 48,
      height: 48,
      backgroundColor: color,
      borderRadius: 8,
    }} />
    <span style={{ fontSize: 20, fontWeight: 600, color: GF_COLORS.grey700 }}>{label}</span>
  </div>
);
