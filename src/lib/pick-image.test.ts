import * as ImagePicker from 'expo-image-picker';
import { pickImage } from './pick-image';

jest.mock('expo-image-picker', () => ({ launchImageLibraryAsync: jest.fn() }));

const launch = jest.mocked(ImagePicker.launchImageLibraryAsync);

function pickerAnswers(asset: Partial<ImagePicker.ImagePickerAsset> | null) {
  launch.mockResolvedValue(
    asset
      ? ({
          canceled: false,
          assets: [{ uri: 'file:///a.png', width: 1, height: 1, ...asset }],
        } as never)
      : ({ canceled: true, assets: null } as never),
  );
}

describe('When we pick an image', () => {
  it('should return it as an upload file', async () => {
    pickerAnswers({ fileName: 'a.png', mimeType: 'image/png', fileSize: 1000 });

    await expect(pickImage([1, 1])).resolves.toEqual({
      status: 'picked',
      file: { uri: 'file:///a.png', name: 'a.png', type: 'image/png' },
    });
    expect(launch).toHaveBeenCalledWith(
      expect.objectContaining({ aspect: [1, 1] }),
    );
  });

  it('should name the file when the device does not', async () => {
    pickerAnswers({});

    await expect(pickImage([2, 3])).resolves.toEqual({
      status: 'picked',
      file: { uri: 'file:///a.png', name: 'image.jpeg', type: 'image/jpeg' },
    });
  });

  it('should refuse an image the API would refuse', async () => {
    pickerAnswers({ mimeType: 'image/gif' });

    await expect(pickImage([1, 1])).resolves.toEqual({
      status: 'invalid',
      message: 'Use uma imagem JPEG, PNG ou WebP',
    });
  });

  it('should report a cancelled pick', async () => {
    pickerAnswers(null);

    await expect(pickImage([1, 1])).resolves.toEqual({ status: 'cancelled' });
  });
});
