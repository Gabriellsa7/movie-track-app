import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  isMonthBefore,
  isOutsideRange,
  isSameDay,
  monthOf,
  monthTitle,
  monthWeeks,
  shiftMonth,
  WEEKDAY_LABELS,
} from '@/lib/calendar';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

interface ICalendarSheetProps {
  title: string;
  visible: boolean;
  selected: Date | undefined;
  minimumDate?: Date;
  maximumDate?: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export function CalendarSheet({
  title,
  visible,
  selected,
  minimumDate,
  maximumDate,
  onSelect,
  onClose,
}: ICalendarSheetProps) {
  const scheme = useAppTheme();
  const insets = useSafeAreaInsets();
  const today = new Date();
  const [shown, setShown] = useState(() => monthOf(selected ?? today));
  const previous = shiftMonth(shown, -1);
  const next = shiftMonth(shown, 1);
  const canGoBack =
    !minimumDate || !isMonthBefore(previous, monthOf(minimumDate));
  const canGoForward =
    !maximumDate || !isMonthBefore(monthOf(maximumDate), next);

  function pick(day: Date) {
    onSelect(day);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={() => {
        setShown(monthOf(selected ?? new Date()));
      }}
    >
      <Pressable
        accessibilityLabel="Close"
        onPress={onClose}
        className="flex-1 bg-overlay-bg-color/60"
      />
      <View
        className="gap-3 rounded-t-[22px] border-t border-primary-border-color bg-secondary-bg-color px-5 pt-2.5"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="mb-1 h-1 w-10 self-center rounded-sm bg-secondary-border-color" />
        <Text
          accessibilityRole="header"
          className="font-semibold text-base text-primary-text-color"
        >
          {title}
        </Text>

        <View className="h-11 flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous month"
            accessibilityState={{ disabled: !canGoBack }}
            disabled={!canGoBack}
            onPress={() => {
              setShown(previous);
            }}
            className="h-11 w-11 items-center justify-center rounded-xl border border-primary-border-color disabled:opacity-30"
          >
            <ChevronLeft
              size={20}
              color={color(scheme, 'primary-text-color')}
            />
          </Pressable>
          <Text className="font-semibold text-[15px] text-primary-text-color">
            {monthTitle(shown)}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next month"
            accessibilityState={{ disabled: !canGoForward }}
            disabled={!canGoForward}
            onPress={() => {
              setShown(next);
            }}
            className="h-11 w-11 items-center justify-center rounded-xl border border-primary-border-color disabled:opacity-30"
          >
            <ChevronRight
              size={20}
              color={color(scheme, 'primary-text-color')}
            />
          </Pressable>
        </View>

        <View className="gap-1">
          <View className="flex-row">
            {WEEKDAY_LABELS.map((label, index) => (
              <Text
                key={`${label}-${String(index)}`}
                className="flex-1 text-center font-semibold text-xs text-tertiary-text-color"
              >
                {label}
              </Text>
            ))}
          </View>
          {monthWeeks(shown).map((week) => (
            <View key={week.find(Boolean)?.toISOString()} className="flex-row">
              {week.map((day, index) => {
                if (!day) {
                  return (
                    <View
                      key={`blank-${String(index)}`}
                      className="h-11 flex-1"
                    />
                  );
                }
                const isSelected = selected ? isSameDay(day, selected) : false;
                const isToday = isSameDay(day, today);
                const disabled = isOutsideRange(day, minimumDate, maximumDate);
                return (
                  <View key={day.toISOString()} className="h-11 flex-1 p-0.5">
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={day.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                      accessibilityState={{ selected: isSelected, disabled }}
                      disabled={disabled}
                      onPress={() => {
                        pick(day);
                      }}
                      className={`flex-1 items-center justify-center rounded-[10px] disabled:opacity-30 ${
                        isSelected
                          ? 'bg-accent-bg-color'
                          : isToday
                            ? 'border border-accent-border-color'
                            : ''
                      }`}
                    >
                      <Text
                        className={`font-semibold text-sm ${
                          isSelected
                            ? 'text-on-accent-text-color'
                            : isToday
                              ? 'text-accent-text-color'
                              : 'text-primary-text-color'
                        }`}
                      >
                        {day.getDate()}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View className="flex-row gap-2.5">
          {!isOutsideRange(today, minimumDate, maximumDate) && (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                pick(today);
              }}
              className="h-[52px] flex-1 items-center justify-center rounded-xl border border-primary-border-color bg-primary-bg-color"
            >
              <Text className="font-semibold text-[15px] text-primary-text-color">
                Today
              </Text>
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            className="h-[52px] flex-1 items-center justify-center"
          >
            <Text className="font-semibold text-[15px] text-secondary-text-color">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
