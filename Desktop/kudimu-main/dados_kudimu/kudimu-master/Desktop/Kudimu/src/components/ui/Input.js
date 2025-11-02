import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Input Component - Campo de entrada moderno e acessível
 * 
 * @param {Object} props
 * @param {string} props.label - Label do input
 * @param {string} props.error - Mensagem de erro
 * @param {string} props.helperText - Texto de ajuda
 * @param {React.ReactNode} props.leftIcon - Ícone à esquerda
 * @param {React.ReactNode} props.rightIcon - Ícone à direita
 * @param {boolean} props.required - Campo obrigatório
 * @param {boolean} props.disabled - Campo desabilitado
 * @param {'text' | 'email' | 'password' | 'number' | 'tel' | 'url'} props.type - Tipo do input
 */
const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  required = false,
  disabled = false,
  type = 'text',
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Base classes
  const baseClasses = 'block w-full rounded-lg border px-4 py-2.5 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-900 dark:text-gray-100';
  
  // State classes
  const stateClasses = error
    ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20 text-error-900 dark:text-error-300'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 text-gray-900 dark:border-gray-700 dark:focus:border-primary-400';
  
  // Icon padding
  const iconPaddingClasses = leftIcon
    ? 'pl-11'
    : rightIcon
    ? 'pr-11'
    : '';
  
  // Combined classes
  const inputClasses = `${baseClasses} ${stateClasses} ${iconPaddingClasses} ${className}`;
  
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 dark:text-gray-500">
              {leftIcon}
            </span>
          </div>
        )}
        
        {/* Input */}
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 dark:text-gray-500">
              {rightIcon}
            </span>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-sm text-error-600 dark:text-error-400"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {/* Helper Text */}
      {!error && helperText && (
        <p
          id={`${inputId}-helper`}
          className="mt-1.5 text-sm text-gray-500 dark:text-gray-400"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'url', 'search']),
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
};

export default Input;
