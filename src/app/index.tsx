import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="font-display text-5xl text-text">Movie Track</Text>
      <Text className="mt-2 font-sans text-text-muted">
        Seu diário de cinema
      </Text>
    </View>
  );
}
