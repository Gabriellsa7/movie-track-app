import { Link, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface ILinkProblemProps {
  message: string;
  actionLabel: string;
  actionHref: Href;
}

export function LinkProblem({
  message,
  actionLabel,
  actionHref,
}: ILinkProblemProps) {
  return (
    <View
      accessibilityRole="alert"
      className="gap-3 rounded-[14px] border border-danger-border-color bg-danger-soft-bg-color p-4"
    >
      <Text className="font-sans text-sm leading-[21px] text-primary-text-color">
        {message}
      </Text>
      <Link href={actionHref} replace asChild>
        <Pressable accessibilityRole="link" className="self-start">
          <Text className="font-semibold text-sm text-accent-text-color">
            {actionLabel}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
