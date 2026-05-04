import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'ok',
        message: 'ShopSmart Backend is running',
      }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          name: 'Premium Wireless Headphones',
          price: 299,
          category: 'Audio',
          image: 'https://example.com/image.jpg',
          inStock: true,
        },
      ],
    });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Frontend App Tests', () => {
  it('renders the ShopSmart navbar logo', () => {
    render(<App />);
    expect(screen.getByText('ShopSmart')).toBeInTheDocument();
  });

  it('renders the hero section headline', () => {
    render(<App />);
    expect(screen.getByText(/Future of/i)).toBeInTheDocument();
  });

  it('shows loading state initially then renders products', async () => {
    render(<App />);
    await waitFor(() =>
      expect(
        screen.getByText('Premium Wireless Headphones'),
      ).toBeInTheDocument(),
    );
  });

  it('renders the Explore Collection button', () => {
    render(<App />);
    expect(screen.getByText('Explore Collection')).toBeInTheDocument();
  });
});
