import { useController, type Control } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { PRIORITIES, PRIORITY_SHORT_LABELS } from '@/lib/watchlist';
import type {
  IItemFormInput,
  IItemFormOutput,
} from '../../constants/constants';

interface IPrioritySelectProps {
  control: Control<IItemFormInput, unknown, IItemFormOutput>;
}

export function PrioritySelect({ control }: IPrioritySelectProps) {
  const {
    field: { value, onChange },
  } = useController({ control, name: 'priority' });

  return (
    <View className="gap-2">
      <Text className="font-semibold text-sm text-primary-text-color">
        Priority
      </Text>
      <View
        accessibilityRole="radiogroup"
        className="flex-row rounded-[10px] border border-primary-border-color bg-primary-bg-color p-1"
      >
        {PRIORITIES.map((priority) => {
          const isSelected = value === priority;
          return (
            <Pressable
              key={priority}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              onPress={() => {
                onChange(priority);
              }}
              className={`h-[38px] flex-1 items-center justify-center rounded-[7px] ${
                isSelected ? 'bg-accent-bg-color' : ''
              }`}
            >
              <Text
                className={`font-semibold text-sm ${
                  isSelected
                    ? 'text-on-accent-text-color'
                    : 'text-tertiary-text-color'
                }`}
              >
                {PRIORITY_SHORT_LABELS[priority]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
