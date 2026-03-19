import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('Frontend App Tests', () => {
  it('renders the ShopSmart logo text on screen correctly', () => {
    // Render the component
    render(<App />);
    
    // Ensure the new UI elements display
    const titleElement = screen.getByText(/Future of/i);
    expect(titleElement).toBeInTheDocument();
  });
});
