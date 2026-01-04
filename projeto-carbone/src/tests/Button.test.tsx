import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button Component', () => {
  it('deve renderizar o botão com texto', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('deve aplicar a variante primary', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('button-primary');
  });

  it('deve aplicar a variante secondary', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByText('Secondary Button');
    expect(button).toHaveClass('button-secondary');
  });

  it('deve mostrar loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('deve estar desabilitado quando disabled=true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
