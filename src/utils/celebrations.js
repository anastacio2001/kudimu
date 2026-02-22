import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

/**
 * Sistema de micro-interações e celebrações
 * Inspired by Duolingo's delight moments
 */

// Confetti celebration
export const celebrateWithConfetti = (options = {}) => {
  const defaults = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  };

  confetti({
    ...defaults,
    ...options
  });
};

// Confetti explosão no ponto clicado
export const celebrateAtPosition = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / window.innerWidth;
  const y = (event.clientY - rect.top) / window.innerHeight;

  confetti({
    particleCount: 50,
    spread: 60,
    origin: { x, y }
  });
};

// Fireworks (múltiplas explosões)
export const fireworks = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};

// Chuva de estrelas
export const starShower = () => {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'],
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star']
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle']
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
};

// Som de sucesso (Web Audio API)
export const playSuccessSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log('Audio API not supported');
  }
};

// Som de level up (progressão musical)
export const playLevelUpSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      const startTime = audioContext.currentTime + (index * 0.15);
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  } catch (error) {
    console.log('Audio API not supported');
  }
};

// Hook para celebrar XP ganho
export const useCelebration = () => {
  const celebrate = (type = 'confetti', soundEnabled = true) => {
    switch (type) {
      case 'confetti':
        celebrateWithConfetti();
        if (soundEnabled) playSuccessSound();
        break;
      case 'fireworks':
        fireworks();
        if (soundEnabled) playLevelUpSound();
        break;
      case 'stars':
        starShower();
        if (soundEnabled) playSuccessSound();
        break;
      default:
        celebrateWithConfetti();
    }
  };

  return { celebrate };
};

// Shake animation (para erros ou atenção)
export const shakeElement = (elementRef) => {
  if (!elementRef.current) return;
  
  elementRef.current.classList.add('animate-shake');
  setTimeout(() => {
    elementRef.current?.classList.remove('animate-shake');
  }, 500);
};

// Pulse animation (para chamar atenção)
export const pulseElement = (elementRef) => {
  if (!elementRef.current) return;
  
  elementRef.current.classList.add('animate-pulse-soft');
  setTimeout(() => {
    elementRef.current?.classList.remove('animate-pulse-soft');
  }, 2000);
};

export default {
  celebrateWithConfetti,
  celebrateAtPosition,
  fireworks,
  starShower,
  playSuccessSound,
  playLevelUpSound,
  useCelebration,
  shakeElement,
  pulseElement
};
