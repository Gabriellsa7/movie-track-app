// In-memory stand-in for expo-secure-store, which needs a device.
export const secureStoreValues = new Map<string, string>();

export function getItemAsync(key: string): Promise<string | null> {
  return Promise.resolve(secureStoreValues.get(key) ?? null);
}

export function setItemAsync(key: string, value: string): Promise<void> {
  secureStoreValues.set(key, value);
  return Promise.resolve();
}

export function deleteItemAsync(key: string): Promise<void> {
  secureStoreValues.delete(key);
  return Promise.resolve();
}
