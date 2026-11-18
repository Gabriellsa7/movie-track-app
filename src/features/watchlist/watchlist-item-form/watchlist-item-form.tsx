import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItemForm } from './components/item-form/item-form';
import { EditItem } from './components/edit-item/edit-item';

export function WatchlistItemFormScreen() {
  const { itemId } = useLocalSearchParams<{ itemId?: string }>();

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {itemId ? <EditItem itemId={itemId} /> : <ItemForm />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
