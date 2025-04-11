// src/hooks/useStarCounter.js
import { useState, useEffect } from 'react';

export function useStarCounter() {
  // Use localStorage to persist star count
  const [starCount, setStarCount] = useState(() => {
    const savedCount = localStorage.getItem('pottyStarCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  // Update localStorage when starCount changes
  useEffect(() => {
    localStorage.setItem('pottyStarCount', starCount.toString());
  }, [starCount]);

  const addStar = () => {
    setStarCount(prev => prev + 1);
  };

  const resetStars = () => {
    setStarCount(0);
  };

  return {
    starCount,
    addStar,
    resetStars
  };
}