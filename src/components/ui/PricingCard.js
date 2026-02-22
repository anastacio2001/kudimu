import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button, Badge } from './index';

/**
 * PricingCard - Card de preços moderno
 */
const PricingCard = ({
  title,
  description,
  price,
  currency = 'AOA',
  period,
  features = [],
  highlighted = false,
  badge,
  ctaText = 'Começar',
  ctaVariant = 'outline',
  onCtaClick,
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div
        className={`
          relative h-full rounded-2xl border-2 p-8 transition-all duration-200
          ${highlighted 
            ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 shadow-xl' 
            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary-300 dark:hover:border-primary-700'
          }
          ${className}
        `}
      >
        {/* Badge Destacado */}
        {badge && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <Badge variant={highlighted ? 'iniciante' : 'info'} size="lg">
              {badge}
            </Badge>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>

        {/* Price */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-lg text-gray-600 dark:text-gray-400">{currency}</span>
            <span className="text-5xl font-bold gradient-text">{price}</span>
          </div>
          {period && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{period}</p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          variant={highlighted ? 'primary' : ctaVariant}
          size="lg"
          fullWidth
          onClick={onCtaClick}
        >
          {ctaText}
        </Button>
      </div>
    </motion.div>
  );
};

PricingCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  price: PropTypes.string.isRequired,
  currency: PropTypes.string,
  period: PropTypes.string,
  features: PropTypes.arrayOf(PropTypes.string),
  highlighted: PropTypes.bool,
  badge: PropTypes.string,
  ctaText: PropTypes.string,
  ctaVariant: PropTypes.string,
  onCtaClick: PropTypes.func,
  className: PropTypes.string,
};

export default PricingCard;
