import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react'; // for React 18+ or '@testing-library/react-hooks' for older versions
import '@testing-library/jest-dom';

// Dummy implementation inline for testing purposes, typically you'd import these:
// import * as api from '../api/userApi';
// import UserProfile from '../components/UserProfile';
// import useCounter from '../hooks/useCounter';
// import Button from '../components/Button';

// Mocking the API functions
const api = {
  fetchUser: jest.fn()
};

// Dummy Hook
const useCounter = (initial = 0) => {
  const [count, setCount] = React.useState(initial);
  const increment = () => setCount((c) => c + 1);
  return { count, increment };
};

// Dummy Button Component
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
);

// Dummy Profile Component
const UserProfile = ({ userId }) => {
  const [user, setUser] = React.useState(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    api.fetchUser(userId)
      .then(setUser)
      .catch(() => setError(true));
  }, [userId]);

  if (error) return <div>Failed to load user data</div>;
  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
};

describe('Frontend Sample Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. React Component using @testing-library/react', () => {
    it('renders the Button component with text and handles clicks', () => {
      const mockOnClick = jest.fn();
      render(<Button onClick={mockOnClick} text="Click Me" />);
      
      const buttonEl = screen.getByText(/Click Me/i);
      expect(buttonEl).toBeInTheDocument();
      
      fireEvent.click(buttonEl);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('2. Custom Hook or Utility Function', () => {
    it('should increment counter automatically in useCounter hook', () => {
      // For React 18+, renderHook is part of @testing-library/react
      const { result } = renderHook(() => useCounter(0));
      
      expect(result.current.count).toBe(0);
      
      act(() => {
        result.current.increment();
      });
      
      expect(result.current.count).toBe(1);
    });
  });

  describe('3. Component with Mocked API Calls', () => {
    it('should fetch and display user data on load', async () => {
      const mockUser = { id: 1, name: 'Alice Frontend' };
      api.fetchUser.mockResolvedValueOnce(mockUser);
      
      render(<UserProfile userId={1} />);
      
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText(/Alice Frontend/i)).toBeInTheDocument();
      });
      
      expect(api.fetchUser).toHaveBeenCalledWith(1);
    });

    it('should handle API errors gracefully', async () => {
      api.fetchUser.mockRejectedValueOnce(new Error('Network Error'));
      
      render(<UserProfile userId={1} />);
      
      await waitFor(() => {
        expect(screen.getByText(/Failed to load user data/i)).toBeInTheDocument();
      });
    });
  });

  describe('4. Snapshot Testing', () => {
    it('matches the previous snapshot for Button component', () => {
      const { asFragment } = render(<Button text="Snapshot Button" />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
