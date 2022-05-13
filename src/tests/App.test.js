import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Pannel title', () => {
  render(<App />);
  const title = screen.getByText(/RF Reformed/i);
  expect(title).toBeInTheDocument();
});
