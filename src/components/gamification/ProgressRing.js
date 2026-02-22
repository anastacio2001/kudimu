import React from 'react';
import { motion } from 'framer-motion';

/**
 * ProgressRing - Anel de progresso animado para XP/Reputação
 * Inspirado em Duolingo e Apple Watch
 */
const ProgressRing = ({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8,
  color = '#0ea5e9',
  children,
  showPercentage = false,
  glowEffect = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle with glow */}
        {glowEffect && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 2}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="opacity-20 blur-sm"
          />
        )}
        
        {/* Main progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1.5,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.3
          }}
        />
      </svg>
      
      {/* Content inside ring */}
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        {children}
        {showPercentage && (
          <motion.span 
            className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {Math.round(progress)}%
          </motion.span>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
