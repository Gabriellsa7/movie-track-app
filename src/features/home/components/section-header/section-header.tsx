import { Link, type Href } from 'expo-router';
import { Text, View } from 'react-native';

interface ISectionHeaderProps {
  title: string;
  linkLabel: string;
  href: Href;
}

export function SectionHeader({ title, linkLabel, href }: ISectionHeaderProps) {
  return (
    <View className="flex-row items-baseline justify-between">
      <Text
        accessibilityRole="header"
        className="font-semibold text-heading text-primary-text-color"
      >
        {title}
      </Text>
      <Link href={href} asChild>
        <Text
          accessibilityRole="link"
          className="py-2 font-semibold text-label text-accent-text-color"
        >
          {linkLabel}
        </Text>
      </Link>
    </View>
  );
}
