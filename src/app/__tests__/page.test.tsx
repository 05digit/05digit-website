import { render, screen, fireEvent, act } from '@testing-library/react';
import Home from '../page';

// Mock audio API and canvas
beforeEach(() => {
  // Mock window.AudioContext
  window.AudioContext = jest.fn().mockImplementation(() => ({
    createAnalyser: jest.fn().mockReturnValue({
      connect: jest.fn(),
      getByteFrequencyData: jest.fn(),
      getByteTimeDomainData: jest.fn(),
      frequencyBinCount: 32,
      fftSize: 64,
    }),
    createMediaElementSource: jest.fn().mockReturnValue({
      connect: jest.fn(),
    }),
    resume: jest.fn().mockResolvedValue(undefined),
    state: 'running',
    destination: {},
  })) as unknown as typeof AudioContext;

  window.webkitAudioContext = window.AudioContext;

  // Mock HTMLMediaElement
  Object.defineProperty(global.window.HTMLMediaElement.prototype, 'play', {
    configurable: true,
    get() {
      return jest.fn().mockResolvedValue(undefined);
    }
  });

  Object.defineProperty(global.window.HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    get() {
      return jest.fn();
    }
  });

  Object.defineProperty(global.window.HTMLMediaElement.prototype, 'load', {
    configurable: true,
    get() {
      return jest.fn();
    }
  });

  // Mock RequestAnimationFrame
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    return setTimeout(() => cb(Date.now()), 0) as unknown as number;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => clearTimeout(id));

  // Mock Canvas
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
    fillRect: jest.fn(),
    createLinearGradient: jest.fn().mockReturnValue({
      addColorStop: jest.fn(),
    }),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Home Page', () => {
  it('renders the page with initial state correctly', () => {
    render(<Home />);

    // Header
    expect(screen.getByText('digit')).toBeInTheDocument();

    // Play button
    expect(screen.getByRole('button', { name: /PLAY/i })).toBeInTheDocument();

    // Visualizer text
    expect(screen.getByText('visualizer // bars')).toBeInTheDocument();

    // Tracks
    expect(screen.getAllByText('Primityva').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Nebeskambink').length).toBeGreaterThan(0);
    expect(screen.getAllByText('apakau').length).toBeGreaterThan(0);
    expect(screen.getAllByText('perfect').length).toBeGreaterThan(0);
  });

  it('toggles play/pause state', async () => {
    render(<Home />);

    const playButton = screen.getByRole('button', { name: /PLAY/i });
    expect(screen.getByText('ready')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(playButton);
    });

    // UI should update to playing state
    expect(screen.getByRole('button', { name: /PAUSE/i })).toBeInTheDocument();
    expect(screen.getByText('playing')).toBeInTheDocument();

    const pauseButton = screen.getByRole('button', { name: /PAUSE/i });

    await act(async () => {
      fireEvent.click(pauseButton);
    });

    expect(screen.getByRole('button', { name: /PLAY/i })).toBeInTheDocument();
    expect(screen.getByText('ready')).toBeInTheDocument();
  });

  it('selects a track from the list', async () => {
    render(<Home />);

    // Click the button containing the track text. The track list items are buttons.
    // There's an h3 with the text and a div with the text inside a button.
    const buttons = screen.getAllByRole('button');
    const track2Button = buttons.find(b => b.textContent && b.textContent.includes('Nebeskambink') && b.textContent.includes('02'));

    if (track2Button) {
        await act(async () => {
            fireEvent.click(track2Button);
        });
    } else {
        throw new Error('Track 2 button not found');
    }

    // Wait for async load if playing
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(screen.getByText('ready')).toBeInTheDocument();
  });

  it('toggles visualizer mode', async () => {
    render(<Home />);

    expect(screen.getByText('visualizer // bars')).toBeInTheDocument();

    const toggleButton = screen.getByText('toggle mode');

    await act(async () => {
      fireEvent.click(toggleButton);
    });

    expect(screen.getByText('visualizer // wave')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(toggleButton);
    });

    expect(screen.getByText('visualizer // bars')).toBeInTheDocument();
  });

  it('toggles video mute state', async () => {
      render(<Home />);

      const muteButton = screen.getByRole('button', { name: 'Mute Toggle' });
      expect(muteButton).toBeInTheDocument();

      // By default it should be muted. MuteX icon should be present, but since it's SVG we just test the click.

      await act(async () => {
          fireEvent.click(muteButton);
      });

      // Iframe should be updated with mute=0
      const iframe = screen.getByTitle('Digit') as HTMLIFrameElement;
      expect(iframe.src).toContain('mute=0');

      await act(async () => {
          fireEvent.click(muteButton);
      });

      expect(iframe.src).toContain('mute=1');
  });

  it('handles next and prev video clip', async () => {
      render(<Home />);

      const nextVideoButton = screen.getByRole('button', { name: 'Next Clip' });
      const prevVideoButton = screen.getByRole('button', { name: 'Previous Clip' });

      let iframe = screen.getByTitle('Digit') as HTMLIFrameElement;
      expect(iframe.src).toContain('F4NdmdLr7_w');

      await act(async () => {
          fireEvent.click(nextVideoButton);
      });

      iframe = screen.getByTitle('Primityva') as HTMLIFrameElement;
      expect(iframe.src).toContain('nNoiPOPh9j8');

      await act(async () => {
          fireEvent.click(prevVideoButton);
      });

      iframe = screen.getByTitle('Digit') as HTMLIFrameElement;
      expect(iframe.src).toContain('F4NdmdLr7_w');
  });
});
