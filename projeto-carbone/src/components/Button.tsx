import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={`button button-${variant} ${isLoading ? 'button-loading' : ''}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="button-spinner"></span>
          <span>{typeof children === 'string' && children.endsWith('...') ? children : `${children}...`}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
