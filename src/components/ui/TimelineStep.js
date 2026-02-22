import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * TimelineStep - Componente de passo no timeline
 */
const TimelineStep = ({ number, title, description, icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex gap-4 items-start"
    >
      {/* Number Circle */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {number}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex items-center gap-3 mb-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h4 className="text-xl font-semibold">{title}</h4>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
};

TimelineStep.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string,
  delay: PropTypes.number,
};

export default TimelineStep;
