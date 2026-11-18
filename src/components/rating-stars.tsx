import { Star } from 'lucide-react-native';
import { Pressable, View, type GestureResponderEvent } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

const STAR_COUNT = 10;
const MIN_RATING = 1;
const HALF = 0.5;

interface IRatingStarsProps {
  rating: number | undefined;
  size?: number;
  onChange?: (rating: number) => void;
}

function formatRating(rating: number): string {
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
}

function StarIcon({ fill, size }: { fill: number; size: number }) {
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

export function RatingStars({
  rating,
  size = 20,
  onChange,
}: IRatingStarsProps) {
  const value = rating ?? 0;
  const stars = Array.from({ length: STAR_COUNT }, (_, index) =>
    Math.max(0, Math.min(1, value - index)),
  );

  if (!onChange) {
    return (
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Rating ${formatRating(value)} of 10`}
        className="flex-row"
      >
        {stars.map((fill, index) => (
          <StarIcon key={index} fill={fill} size={size} />
        ))}
      </View>
    );
  }

  function pick(index: number, event: GestureResponderEvent) {
    const isLeftHalf = event.nativeEvent.locationX < (size + 2) / 2;
    onChange?.(Math.max(MIN_RATING, index + (isLeftHalf ? HALF : 1)));
  }

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Your rating"
      accessibilityValue={{
        text:
          rating === undefined ? 'Not rated' : `${formatRating(value)} of 10`,
      }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        const step =
          event.nativeEvent.actionName === 'increment' ? HALF : -HALF;
        onChange(
          Math.min(STAR_COUNT, Math.max(MIN_RATING, (rating ?? 0) + step)),
        );
      }}
      className="flex-row"
    >
      {stars.map((fill, index) => (
        <Pressable
          key={index}
          testID={`rating-star-${String(index + 1)}`}
          onPress={(event) => {
            pick(index, event);
          }}
        >
          <StarIcon fill={fill} size={size} />
        </Pressable>
      ))}
    </View>
  );
}

export { formatRating };
