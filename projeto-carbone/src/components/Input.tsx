import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  ariaLabel?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  ariaLabel,
  id,
  ...props
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="input-wrapper">
      <label htmlFor={inputId} className="input-label">
        {label}
      </label>
      <input
        id={inputId}
        className={`input-field ${error ? 'input-error' : ''}`}
        aria-label={ariaLabel || label}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="input-error-message" role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${inputId}-helper`} className="input-helper-text">
          {helperText}
        </span>
      )}
    </div>
  );
};
