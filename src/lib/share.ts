import { Share } from 'react-native';

// The native share sheet for a profile or review link (FQ-19).
export async function shareLink(message: string, url: string): Promise<void> {
  await Share.share({ message: `${message} ${url}`, url });
}
