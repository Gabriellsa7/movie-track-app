import { Text, View } from 'react-native';
import type { IMonthCount } from '@/lib/stats';
import type { IMonthsInsights } from '../../utils/stats.utils';
import { Insight } from '../monthly-insight/monthly-insight';

const CHART_HEIGHT = 120;
const EMPTY_BAR_HEIGHT = 3;
const LABEL_SPACE = 18;

interface IMonthlyChartProps {
  months: IMonthCount[];
  insights: IMonthsInsights;
}

export function MonthlyChart({ months, insights }: IMonthlyChartProps) {
  const max = Math.max(...months.map((month) => month.count), 1);
  const summary = months
    .map((month) => `${month.label}: ${String(month.count)}`)
    .join(', ');

  return (
    <View className="gap-4">
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Movies watched per month. ${summary}`}
        className="gap-1.5"
      >
        <View className="flex-row items-end gap-1.5">
          {months.map((month) => (
            <View
              key={month.month}
              style={{
                flex: 1,
                height: CHART_HEIGHT,
                justifyContent: 'flex-end',
              }}
            >
              {month.count > 0 && (
                <Text className="mb-1 text-center font-semibold text-[10px] text-secondary-text-color">
                  {month.count}
                </Text>
              )}
              <View
                className={`rounded-b-[1px] rounded-t-[4px] ${
                  month.count === 0
                    ? 'bg-primary-border-color'
                    : 'bg-accent-bg-color'
                }`}
                style={{
                  alignSelf: 'stretch',
                  height: Math.max(
                    EMPTY_BAR_HEIGHT,
                    Math.round(
                      (month.count / max) * (CHART_HEIGHT - LABEL_SPACE),
                    ),
                  ),
                }}
              />
            </View>
          ))}
        </View>
        <View className="flex-row gap-1.5">
          {months.map((month) => (
            <Text
              key={month.month}
              className="flex-1 text-center font-sans text-[10px] text-tertiary-text-color"
            >
              {month.label.charAt(0)}
            </Text>
          ))}
        </View>
      </View>
      <View className="flex-row gap-3 border-t border-primary-border-color pt-3.5">
        <Insight label="This month" value={String(insights.thisMonth)} />
        <Insight
          label="Best month"
          value={
            insights.bestMonth
              ? `${insights.bestMonth.label} (${String(insights.bestMonth.count)})`
              : '–'
          }
        />
        <Insight
          label="Monthly average"
          value={String(insights.monthlyAverage)}
        />
      </View>
    </View>
  );
}
