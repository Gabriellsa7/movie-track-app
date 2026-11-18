import { Star } from 'lucide-react-native';
import { View } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

export function StarIcon({ fill, size }: { fill: number; size: number }) {
  const scheme = useAppTheme();
  const filled = color(scheme, 'star-filled-color');

  return (
    <View style={{ width: size + 2, height: size + 2 }}>
      <View className="absolute left-px top-px">
        <Star
          size={size}
          strokeWidth={1.6}
          color={color(scheme, 'star-empty-color')}
        />
      </View>
      {fill > 0 && (
        <View
          className="absolute left-px top-px overflow-hidden"
          style={{ width: size * fill, height: size }}
        >
          <Star size={size} strokeWidth={1.6} color={filled} fill={filled} />
        </View>
      )}
    </View>
  );
}
