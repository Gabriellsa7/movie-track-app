import { Share } from 'react-native';

export async function shareLink(message: string, url: string): Promise<void> {
  await Share.share({ message: `${message} ${url}`, url });
}
