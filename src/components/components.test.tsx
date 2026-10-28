import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Logo, LogoMark } from './logo';
import { ScreenPlaceholder } from './screen-placeholder';
import { Toaster } from './toaster';

describe('When we render the shared components', () => {
  it('should show the screen title as a header', async () => {
    await render(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        }}
      >
        <ScreenPlaceholder title="Meus filmes" />
      </SafeAreaProvider>,
    );

    expect(
      screen.getByRole('header', { name: 'Meus filmes' }),
    ).toBeOnTheScreen();
  });

  it('should render the toaster for the current scheme', async () => {
    await expect(render(<Toaster scheme="light" />)).resolves.toBeDefined();
  });

  it('should show the logo with the app name', async () => {
    await render(<Logo />);

    expect(screen.getByText('Movie Track')).toBeOnTheScreen();
  });

  it('should draw the mark at the size asked', async () => {
    await expect(render(<LogoMark size={72} />)).resolves.toBeDefined();
  });
});
