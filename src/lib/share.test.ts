import { Share } from 'react-native';
import { shareLink } from './share';

describe('When we share a link', () => {
  it('should open the share sheet with the message and the url', async () => {
    const share = jest
      .spyOn(Share, 'share')
      .mockResolvedValue({ action: 'sharedAction', activityType: undefined });

    await shareLink('Veja minha review', 'https://movietrack.app/r/1');

    expect(share).toHaveBeenCalledWith({
      message: 'Veja minha review https://movietrack.app/r/1',
      url: 'https://movietrack.app/r/1',
    });
  });
});
