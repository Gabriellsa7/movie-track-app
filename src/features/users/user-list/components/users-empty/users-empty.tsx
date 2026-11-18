import { Text, View } from 'react-native';

export function UsersEmpty({ search }: { search: string }) {
  return (
    <View className="gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
      <Text className="font-semibold text-sm text-primary-text-color">
        {search ? `No one found for “${search}”` : 'No one else here yet'}
      </Text>
      <Text className="font-sans text-caption text-tertiary-text-color">
        {search
          ? 'Check the name or try another search.'
          : 'When other people join, they show up here.'}
      </Text>
    </View>
  );
}
