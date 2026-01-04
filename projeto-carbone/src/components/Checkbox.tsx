import React from 'react';
import './Checkbox.css';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string | React.ReactNode;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  id,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="checkbox-wrapper">
      <div className="checkbox-container">
        <input
          type="checkbox"
          id={checkboxId}
          className={`checkbox-input ${error ? 'checkbox-error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
          {...props}
        />
        <label htmlFor={checkboxId} className="checkbox-label">
          {label}
        </label>
      </div>
      {error && (
        <span id={`${checkboxId}-error`} className="checkbox-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
