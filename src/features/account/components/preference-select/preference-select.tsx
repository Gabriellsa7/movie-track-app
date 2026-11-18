import { Pressable, Text, View } from 'react-native';

export interface IPreferenceOption<TValue extends string> {
  value: TValue;
  label: string;
}

interface IPreferenceSelectProps<TValue extends string> {
  title: string;
  label: string;
  options: IPreferenceOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
}

export function PreferenceSelect<TValue extends string>({
  title,
  label,
  options,
  value,
  onChange,
}: IPreferenceSelectProps<TValue>) {
  return (
    <View className="gap-2">
      <Text className="font-semibold text-[13px] text-primary-text-color">
        {title}
      </Text>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={label}
        className="flex-row rounded-xl border border-primary-border-color bg-secondary-bg-color p-1"
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              onPress={() => {
                onChange(option.value);
              }}
              className={`h-10 flex-1 items-center justify-center rounded-[9px] ${
                isSelected ? 'bg-tertiary-bg-color' : ''
              }`}
            >
              <Text
                className={`font-semibold text-sm ${
                  isSelected
                    ? 'text-primary-text-color'
                    : 'text-tertiary-text-color'
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
