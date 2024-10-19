import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '@/components/counter/counter'; // Adjust the path as needed

describe('Counter Component', () => {
  it('renders with initial count', () => {
    render(<Counter />);
    expect(screen.getByText(/count:/i)).toHaveTextContent('Count: 0');
  });

  it('increments count when increment button is clicked', () => {
    render(<Counter />);
    const button = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(button);
    expect(screen.getByText(/count:/i)).toHaveTextContent('Count: 1');
  });
});
