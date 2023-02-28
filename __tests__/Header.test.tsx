//unit testing for header component
import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/divami_components/header/Header';

describe('Header', () => {
  it('should render the Header component', () => {
    render(<Header />);
    expect(screen.getByText('Divami')).toBeInTheDocument();
  });
})