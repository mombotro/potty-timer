// src/hooks/useSimpleTimer.js
import { useState, useEffect, useRef } from 'react';
import AudioManager from '../utils/audioManager';

export function useSimpleTimer(initialTime, soundEnabled = true) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const intervalRef = useRef(null);
  const hasPlayedAlarmRef = useRef(false);

  // Initialize audio
  useEffect(() => {
    AudioManager.initialize();
  }, []);

  // Timer effect
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isRunning && timeRemaining > 0) {
      // Start a new interval
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      // Timer has reached zero
      setIsRunning(false);
      setTimerExpired(true);
      
      // Play the alarm sound (only if sound is enabled)
      if (soundEnabled && !hasPlayedAlarmRef.current) {
        hasPlayedAlarmRef.current = true;
        AudioManager.playAlarm();
      }
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeRemaining, soundEnabled]);

  // Toggle timer
  const toggleTimer = () => {
    if (soundEnabled) AudioManager.playClick();
    setIsRunning(prev => !prev);
  };

  // Reset timer
  const resetTimer = (newTime) => {
    if (soundEnabled) AudioManager.playClick();
    
    // Stop any sounds that might be playing
    AudioManager.stopAll();
    
    // Clear the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Reset states
    setIsRunning(false);
    setTimeRemaining(newTime || initialTime);
    setTimerExpired(false);
    hasPlayedAlarmRef.current = false;
  };

  // Manually trigger the alarm (for debug)
  const triggerAlarm = () => {
    if (soundEnabled) {
      AudioManager.playClick();
      setTimerExpired(true);
      hasPlayedAlarmRef.current = true;
      AudioManager.playAlarm();
    }
  };

  // Success handler (for potty success)
  const handleSuccess = () => {
    if (soundEnabled) {
      AudioManager.stopAll();
      AudioManager.playSuccess();
      setTimeout(() => AudioManager.playStar(), 600);
    }
    
    resetTimer();
    setIsRunning(true);
    return true; // Return true to indicate success
  };

  // Try again handler (for unsuccessful potty attempt)
  const handleTryAgain = (nextInterval) => {
    if (soundEnabled) {
      AudioManager.stopAll();
      AudioManager.playClick();
    }
    
    resetTimer(nextInterval);
    setIsRunning(true);
    return true; // Return true to indicate success
  };

  return {
    timeRemaining,
    isRunning,
    timerExpired,
    toggleTimer,
    resetTimer,
    triggerAlarm,
    handleSuccess,
    handleTryAgain
  };
}