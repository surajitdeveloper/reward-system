import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page on initial load', () => {
  render(<App />);
  const loginHeader = screen.getByText(/Admin Portal/i);
  expect(loginHeader).toBeInTheDocument();
});
