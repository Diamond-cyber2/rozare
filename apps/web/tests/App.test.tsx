import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App Component', () => {
  test('renders the app correctly', () => {
    render(<App />);
    const linkElement = screen.getByText(/welcome to my saas app/i);
    expect(linkElement).toBeInTheDocument();
  });
});