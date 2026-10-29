import { Text, View } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { rgb } from '@/theme/palette';

const TICKET =
  'M14 17H50A4 4 0 0 1 54 21V43A4 4 0 0 1 50 47H14A4 4 0 0 1 10 43V21A4 4 0 0 1 14 17Z';
const STAR =
  'M0 -8.5L2.116 -2.912L8.084 -2.627L3.424 1.112L4.996 6.877L0 3.6L-4.996 6.877L-3.424 1.112L-8.084 -2.627L-2.116 -2.912Z';
// Both themes share the accent and the ink on it, so the mark needs no scheme.
const TILE = rgb('dark', 'accent-bg-color');
const INK = rgb('dark', 'on-accent-text-color');

// The cinema ticket with the rating star, on a 64-unit grid. assets/images/ are rendered from the same drawing.
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Rect width={64} height={64} rx={14} fill={TILE} />
      <G transform="rotate(-12 32 32)">
        <Path d={TICKET} fill={INK} />
        <Circle cx={10} cy={32} r={4.5} fill={TILE} />
        <Circle cx={54} cy={32} r={4.5} fill={TILE} />
        <Path
          d="M23 19.5V44.5"
          stroke={TILE}
          strokeWidth={2}
          strokeDasharray="3 2.5"
        />
        <Path
          d={STAR}
          transform="translate(38.5 32.8)"
          fill={TILE}
          stroke={TILE}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

export function Logo() {
  return (
    <View className="flex-row items-center gap-2.5">
      <LogoMark />
      <Text className="font-display text-stat text-primary-text-color">
        Movie Track
      </Text>
    </View>
  );
}
