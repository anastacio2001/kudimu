import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Card Component - Componente de cartão moderno
 * 
 * @param {Object} props
 * @param {boolean} props.hover - Adiciona efeito hover
 * @param {boolean} props.interactive - Torna o card clicável
 * @param {Function} props.onClick - Função de clique
 * @param {string} props.className - Classes CSS adicionais
 * @param {React.ReactNode} props.children - Conteúdo do card
 */
const Card = ({
  hover = false,
  interactive = false,
  onClick,
  className = '',
  children,
  ...props
}) => {
  // Base classes
  const baseClasses = 'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-soft transition-all duration-200';
  
  // Hover classes
  const hoverClasses = hover || interactive
    ? 'hover:shadow-medium hover:border-gray-300 dark:hover:border-gray-700'
    : '';
  
  // Interactive classes
  const interactiveClasses = interactive
    ? 'cursor-pointer hover:shadow-medium hover:border-primary-200 dark:hover:border-primary-800 hover:-translate-y-0.5'
    : '';
  
  // Combined classes
  const cardClasses = `${baseClasses} ${hoverClasses} ${interactiveClasses} ${className}`;
  
  // Se for interativo, usa motion.div
  if (interactive || onClick) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.15 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  // Card estático
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  hover: PropTypes.bool,
  interactive: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

/**
 * CardHeader - Cabeçalho do card
 */
export const CardHeader = ({ className = '', children }) => (
  <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-800 ${className}`}>
    {children}
  </div>
);

CardHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

/**
 * CardBody - Corpo do card
 */
export const CardBody = ({ className = '', children }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

CardBody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

/**
 * CardFooter - Rodapé do card
 */
export const CardFooter = ({ className = '', children }) => (
  <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-800 ${className}`}>
    {children}
  </div>
);

CardFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Card;
