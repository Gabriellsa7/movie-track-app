import { useController, type Control } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { DateField } from '@/components/form/date-field';
import type {
  IItemFormInput,
  IItemFormOutput,
} from '../../constants/constants';
import { useTranslation } from 'react-i18next';

interface IPlannedDateFieldProps {
  control: Control<IItemFormInput, unknown, IItemFormOutput>;
}

export function PlannedDateField({ control }: IPlannedDateFieldProps) {
  const { t } = useTranslation();
  const {
    field: { value, onChange },
  } = useController({ control, name: 'plannedFor' });

  return (
    <View className="gap-1.5">
      <View className="flex-row items-end gap-2">
        <View className="flex-1">
          <DateField
            control={control}
            name="plannedFor"
            label={t('watchlist.form.plannedFor')}
            minimumDate={new Date()}
          />
        </View>
        {value ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onChange('');
            }}
            className="min-h-[52px] justify-center rounded-xl border border-primary-border-color px-3.5"
          >
            <Text className="font-semibold text-[13px] text-secondary-text-color">
              {t('watchlist.form.noDate')}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <Text className="font-sans text-xs text-tertiary-text-color">
        {t('watchlist.form.plannedHint')}
      </Text>
    </View>
  );
}
