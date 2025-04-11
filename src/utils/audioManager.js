// src/utils/audioManager.js

// Create a simple audio manager that's isolated from React's lifecycle
const AudioManager = (() => {
    let audioContext = null;
    let isInitialized = false;
    let alarmIsPlaying = false;
    let timeoutIds = [];
    
    // Initialize the audio context
    const initialize = () => {
      if (!isInitialized) {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioContext = new AudioContext();
          isInitialized = true;
        } catch (e) {
          console.error("Failed to initialize audio context:", e);
        }
      }
      return audioContext;
    };
    
    // Clear all timeouts
    const clearAllTimeouts = () => {
      timeoutIds.forEach(id => clearTimeout(id));
      timeoutIds = [];
    };
    
    // Click sound
    const playClick = () => {
      const ctx = initialize();
      if (!ctx) return;
      
      try {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.08);
      } catch (e) {
        console.error("Error playing click sound:", e);
      }
    };
    
    // Success sound
    const playSuccess = () => {
      const ctx = initialize();
      if (!ctx) return;
      
      try {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.6, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.5);
        
        // Second part
        const id = setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(900, ctx.currentTime);
          
          gain2.gain.setValueAtTime(0.4, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          
          osc2.start();
          osc2.stop(ctx.currentTime + 0.4);
        }, 100);
        
        timeoutIds.push(id);
      } catch (e) {
        console.error("Error playing success sound:", e);
      }
    };
    
    // Star sound
    const playStar = () => {
      const ctx = initialize();
      if (!ctx) return;
      
      try {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.3);
        
        // Sparkles
        for (let i = 0; i < 3; i++) {
          const id = setTimeout(() => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            
            const randomFreq = 1500 + Math.random() * 1000;
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(randomFreq, ctx.currentTime);
            
            g.gain.setValueAtTime(0.1, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            
            osc.connect(g);
            g.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
          }, i * 80);
          
          timeoutIds.push(id);
        }
      } catch (e) {
        console.error("Error playing star sound:", e);
      }
    };
    
    // Alarm sound
    const playAlarm = () => {
      const ctx = initialize();
      if (!ctx || alarmIsPlaying) return;
      
      console.log("Playing alarm sound");
      alarmIsPlaying = true;
      
      try {
        // Stop any previous sounds
        clearAllTimeouts();
        
        // Play 6 beeps
        for (let i = 0; i < 6; i++) {
          const id = setTimeout(() => {
            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(440, ctx.currentTime);
            
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            
            oscillator.connect(gain);
            gain.connect(ctx.destination);
            
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.3);
          }, i * 400);
          
          timeoutIds.push(id);
        }
        
        // Reset the alarm flag after all beeps are done
        const resetId = setTimeout(() => {
          alarmIsPlaying = false;
        }, 6 * 400 + 500);
        
        timeoutIds.push(resetId);
      } catch (e) {
        console.error("Error playing alarm sound:", e);
        alarmIsPlaying = false;
      }
    };
    
    // Stop all sounds
    const stopAll = () => {
      console.log("Stopping all sounds");
      clearAllTimeouts();
      alarmIsPlaying = false;
    };
    
    return {
      initialize,
      playClick,
      playSuccess,
      playStar,
      playAlarm,
      stopAll,
      isInitialized: () => isInitialized
    };
  })();
  
  export default AudioManager;