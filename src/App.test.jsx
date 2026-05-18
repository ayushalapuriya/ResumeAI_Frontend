import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock AuthContext
vi.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({ user: null, loading: false, isLoggedIn: false, logout: vi.fn() })
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Check if the logo/brand name renders in the Navbar for unauthenticated users
    const elements = screen.getAllByText(/Resume/i);
    expect(elements.length).toBeGreaterThan(0);
  });
});
