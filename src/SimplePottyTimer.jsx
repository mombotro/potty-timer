// src/SimplePottyTimer.jsx
import React, { useState, useEffect } from 'react';
import { useSimpleTimer } from './hooks/useSimpleTimer';
import { useStarCounter } from './hooks/useStarCounter';
import AudioManager from './utils/audioManager';
import { formatTime } from './utils/timeUtils';
import { Star, Volume2, VolumeX, Play, Pause, RefreshCw, Check, X } from 'lucide-react';
import './styles/animations.css';

const SimplePottyTimer = () => {
  // Available time intervals in minutes
  const timeIntervals = [45, 30, 15, 5];
  
  // States
  const [selectedInterval, setSelectedInterval] = useState(timeIntervals[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTimeInput, setCustomTimeInput] = useState("");
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  // Custom hooks
  const {
    timeRemaining,
    isRunning,
    timerExpired,
    toggleTimer,
    resetTimer,
    triggerAlarm,
    handleSuccess,
    handleTryAgain
  } = useSimpleTimer(selectedInterval * 60, soundEnabled);
  
  const { starCount, addStar } = useStarCounter();
  
  // Initialize audio on first interaction
  useEffect(() => {
    const initAudio = () => {
      AudioManager.initialize();
      setAudioInitialized(true);
      
      // Remove event listeners once initialized
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
    
    // Only add listeners if audio isn't initialized yet
    if (!audioInitialized) {
      document.addEventListener('click', initAudio);
      document.addEventListener('touchstart', initAudio);
      document.addEventListener('keydown', initAudio);
    }
    
    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, [audioInitialized]);
  
  // Select a time interval
  const selectInterval = (interval) => {
    setSelectedInterval(interval);
    resetTimer(interval * 60);
  };
  
  // Toggle sound on/off
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
    
    if (!soundEnabled) {
      setTimeout(() => AudioManager.playClick(), 100);
    }
  };
  
  // Handle custom time input
  const handleCustomTimeChange = (e) => {
    setCustomTimeInput(e.target.value);
  };
  
  // Toggle custom time input visibility
  const toggleCustomTimeInput = () => {
    if (soundEnabled) AudioManager.playClick();
    setShowCustomInput(prev => !prev);
    if (showCustomInput) {
      setCustomTimeInput("");
    }
  };
  
  // Apply custom time
  const applyCustomTime = () => {
    const customMinutes = parseInt(customTimeInput, 10);
    
    if (!isNaN(customMinutes) && customMinutes > 0 && customMinutes <= 120) {
      if (soundEnabled) AudioManager.playClick();
      setSelectedInterval(customMinutes);
      resetTimer(customMinutes * 60);
      setShowCustomInput(false);
    }
  };
  
  // Success handler
  const onSuccess = () => {
    addStar();
    handleSuccess();
  };
  
  // Try again handler
  const onTryAgain = () => {
    // Find next shortest interval
    const currentIndex = timeIntervals.indexOf(selectedInterval);
    let nextInterval = selectedInterval;
    
    if (currentIndex < timeIntervals.length - 1) {
      nextInterval = timeIntervals[currentIndex + 1];
      setSelectedInterval(nextInterval);
    }
    
    handleTryAgain(nextInterval * 60);
  };
  
  // Generate confetti pieces for the potty alarm screen
  const generateConfetti = () => {
    const pieces = [];
    const colors = ['#fbbf24', '#60a5fa', '#4ade80', '#f472b6', '#a78bfa'];
    
    for (let i = 0; i < 30; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 0.5;
      
      pieces.push(
        <div 
          key={i}
          className="confetti-piece confetti"
          style={{ 
            left: `${left}%`, 
            animationDelay: `${delay}s`,
            top: '50%',
            backgroundColor: colors[i % colors.length]
          }}
        />
      );
    }
    
    return pieces;
  };
  
  return (
    <main>
      {/* Audio notification */}
      {!audioInitialized && soundEnabled && (
        <div className="audio-notice">
          Click anywhere to enable sounds!
        </div>
      )}
      
      {/* Background Decorations */}
      <div className="bg-decorations">
        <div className="decoration float" style={{ top: '3rem', left: '3rem', width: '4rem', height: '4rem', backgroundColor: '#fef08a' }}></div>
        <div className="decoration float-delay" style={{ top: '6rem', right: '6rem', width: '6rem', height: '6rem', backgroundColor: '#fbcfe8' }}></div>
        <div className="decoration float-slow" style={{ bottom: '8rem', left: '8rem', width: '5rem', height: '5rem', backgroundColor: '#bfdbfe' }}></div>
        <div className="decoration float-delay-slow" style={{ bottom: '4rem', right: '4rem', width: '7rem', height: '7rem', backgroundColor: '#bbf7d0' }}></div>
      </div>
      
      <div className="container">
        {/* App Title */}
        <h1 className="app-title text-center">Potty Time!</h1>
        
        {/* Star Counter */}
        <div className="star-counter">
          <Star size={30} color="#eab308" fill="#eab308" />
          <span className="star-count">{starCount}</span>
          <button 
            onClick={toggleSound}
            className="btn-sound"
            aria-label={soundEnabled ? "Disable sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
        
        {!timerExpired ? (
          // Main Timer Screen
          <article>
            {/* Timer Display */}
            <div>
              <div className="timer-circle pulse-slow">
                <div className="timer-display">
                  {formatTime(timeRemaining)}
                </div>
              </div>
              
              {/* Control buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
                <button 
                  onClick={toggleTimer}
                  className="btn-icon btn-start"
                >
                  {isRunning ? <Pause size={36} /> : <Play size={36} />}
                </button>
                <button 
                  onClick={() => resetTimer(selectedInterval * 60)}
                  className="btn-icon btn-reset"
                >
                  <RefreshCw size={36} />
                </button>
                
                {/* Debug toilet button */}
                <button
                  onClick={triggerAlarm}
                  className="btn-icon btn-debug"
                  aria-label="Debug"
                  title="Toilet Mode"
                >
                  <svg fill="#000000" height="36px" width="36px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 459.756 459.756" xmlSpace="preserve">
                    <g id="XMLID_23_">
                      <circle id="XMLID_71_" cx="318.643" cy="48.092" r="48.079"/>
                      <path id="XMLID_505_" d="M366.478,243.35c2.359-12.106,21.335-109.465,23.663-121.411c2.302-11.808-5.405-23.246-17.213-25.549
                        c-11.811-2.299-23.247,5.406-25.548,17.214c-1.566,8.036-12.522,64.247-14.204,72.875l-43.724-59.048l30.299,22.605
                        c5.424-18.933-5.623-36.12-22.086-40.837c-22.401-6.418-46.465-3.191-66.384,8.901c-19.919,12.093-33.885,31.953-38.528,54.788
                        l-13.784,67.801c-3.434,16.892,0.901,34.434,11.808,47.782c10.414,12.744,25.77,20.361,42.14,21.025
                        c4.528,1.022-1.023,0.668,86.126,0.413l-45.143,114.079c-5.312,13.424,1.264,28.612,14.687,33.924
                        c13.428,5.312,28.614-1.268,33.924-14.687l59.337-149.95c3.19-8.062,2.175-17.181-2.709-24.345
                        c-4.871-7.143-12.955-11.413-21.597-11.413c-0.025,0-0.051,0-0.076,0l-0.634,0.002C361.904,254.276,365.348,249.147,366.478,243.35
                        z M288.9,257.721l5.695-19.877l-30.22-71.07l63.217,85.372c1.556,2.102,3.544,3.974,5.871,5.445L288.9,257.721z"/>
                      <path id="XMLID_507_" d="M268.01,331.352H133.089V215.281c0-13.626-11.046-24.673-24.673-24.673H93.881
                        c-13.626,0-24.673,11.046-24.673,24.673c0,31.962,0,206.886,0,226.994c0,9.655,7.827,17.482,17.482,17.482h102.51
                        c7.243,0,13.737-4.467,16.326-11.232l18.692-48.831c27.922-12.235,47.652-34.093,51.337-59.639
                        C276.217,335.473,272.663,331.352,268.01,331.352z"/>
                    </g>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Interval Selection */}
            <div>
              <div className="interval-selector">
                {timeIntervals.map(interval => (
                  <button
                    key={interval}
                    onClick={() => selectInterval(interval)}
                    className={`btn-interval ${selectedInterval === interval && !showCustomInput ? 'active' : ''}`}
                  >
                    {interval} min
                  </button>
                ))}
                
                {/* Custom time button */}
                <button
                  onClick={toggleCustomTimeInput}
                  className={`btn-interval ${showCustomInput ? 'active' : ''}`}
                >
                  Custom
                </button>
              </div>
              
              {/* Custom time input */}
              {showCustomInput && (
                <div className="custom-time-input">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={customTimeInput}
                    onChange={handleCustomTimeChange}
                    placeholder="1-120 minutes"
                    className="time-input"
                  />
                  <button
                    onClick={applyCustomTime}
                    className="btn-set"
                    disabled={!customTimeInput}
                  >
                    Set
                  </button>
                </div>
              )}
            </div>
          </article>
        ) : (
          // Potty Alarm Screen
          <article>
            <div>
              {/* Toilet with confetti */}
              <div className="toilet-container">
                {/* Simple toilet SVG */}
                <div className="toilet-svg bounce-slow">
                  <svg fill="#000000" height="160px" width="160px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 459.756 459.756" xmlSpace="preserve">
                    <g id="XMLID_23_">
                      <circle id="XMLID_71_" cx="318.643" cy="48.092" r="48.079"/>
                      <path id="XMLID_505_" d="M366.478,243.35c2.359-12.106,21.335-109.465,23.663-121.411c2.302-11.808-5.405-23.246-17.213-25.549
                        c-11.811-2.299-23.247,5.406-25.548,17.214c-1.566,8.036-12.522,64.247-14.204,72.875l-43.724-59.048l30.299,22.605
                        c5.424-18.933-5.623-36.12-22.086-40.837c-22.401-6.418-46.465-3.191-66.384,8.901c-19.919,12.093-33.885,31.953-38.528,54.788
                        l-13.784,67.801c-3.434,16.892,0.901,34.434,11.808,47.782c10.414,12.744,25.77,20.361,42.14,21.025
                        c4.528,1.022-1.023,0.668,86.126,0.413l-45.143,114.079c-5.312,13.424,1.264,28.612,14.687,33.924
                        c13.428,5.312,28.614-1.268,33.924-14.687l59.337-149.95c3.19-8.062,2.175-17.181-2.709-24.345
                        c-4.871-7.143-12.955-11.413-21.597-11.413c-0.025,0-0.051,0-0.076,0l-0.634,0.002C361.904,254.276,365.348,249.147,366.478,243.35
                        z M288.9,257.721l5.695-19.877l-30.22-71.07l63.217,85.372c1.556,2.102,3.544,3.974,5.871,5.445L288.9,257.721z"/>
                      <path id="XMLID_507_" d="M268.01,331.352H133.089V215.281c0-13.626-11.046-24.673-24.673-24.673H93.881
                        c-13.626,0-24.673,11.046-24.673,24.673c0,31.962,0,206.886,0,226.994c0,9.655,7.827,17.482,17.482,17.482h102.51
                        c7.243,0,13.737-4.467,16.326-11.232l18.692-48.831c27.922-12.235,47.652-34.093,51.337-59.639
                        C276.217,335.473,272.663,331.352,268.01,331.352z"/>
                    </g>
                  </svg>
                </div>
                
                {/* Confetti container */}
                <div className="confetti-container">
                  {generateConfetti()}
                </div>
              </div>
              
              <div className="potty-message">
                Time to try potty!
              </div>
              
              {/* Result buttons */}
              <div className="result-buttons">
                <button 
                  onClick={onTryAgain}
                  className="btn-again"
                >
                  <X className="result-icon" size={24} />
                  Try Again
                </button>
                <button 
                  onClick={onSuccess}
                  className="btn-success"
                >
                  <Check className="result-icon" size={24} />
                  Success!
                </button>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
};

export default SimplePottyTimer;