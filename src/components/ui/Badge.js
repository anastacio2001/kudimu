import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '../../constants/design-system';

/**
 * Badge Component - Componente de badge moderno
 * 
 * @param {Object} props
 * @param {'iniciante' | 'confiavel' | 'lider' | 'embaixador' | 'success' | 'warning' | 'error' | 'info' | 'default'} props.variant
 * @param {'sm' | 'md' | 'lg'} props.size - Tamanho do badge
 * @param {React.ReactNode} props.icon - Ícone do badge
 * @param {React.ReactNode} props.children - Conteúdo do badge
 */
const Badge = ({
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  children,
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center gap-1.5 rounded-full font-medium';
  
  // Variant classes
  const variantClasses = {
    iniciante: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    confiavel: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    lider: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    embaixador: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    success: 'bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-300',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
    error: 'bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-300',
    info: 'bg-info-50 text-info-700 dark:bg-info-900/30 dark:text-info-300',
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };
  
  // Combined classes
  const badgeClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <span className={badgeClasses} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

Badge.propTypes = {
  variant: PropTypes.oneOf([
    'iniciante',
    'confiavel',
    'lider',
    'embaixador',
    'success',
    'warning',
    'error',
    'info',
    'default',
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Badge;
