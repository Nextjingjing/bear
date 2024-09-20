import React, { useRef, useEffect } from 'react';
import { Audio } from 'expo-av';

const useSfx = () => {
  const coinSound = useRef(null);
  const deathSound = useRef(null);
  const poleSound = useRef(null);

  // Load sounds when the component mounts
  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound: coin } = await Audio.Sound.createAsync(
          require('../assets/collectcoin.mp3')
        );
        coinSound.current = coin;

        const { sound: death } = await Audio.Sound.createAsync(
          require('../assets/dead.mp3')
        );
        deathSound.current = death;

        const { sound: pole } = await Audio.Sound.createAsync(
          require('../assets/pole.mp3')
        );
        poleSound.current = pole;
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    };

    loadSounds();

    return () => {
      if (coinSound.current) coinSound.current.unloadAsync();
      if (deathSound.current) deathSound.current.unloadAsync();
      if (poleSound.current) poleSound.current.unloadAsync();
    };
  }, []);

  // Function to set volume for a specific sound
  async function setVolume(soundRef, volume) {
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(volume); // volume is a float between 0.0 and 1.0
    }
  }


  // Function to play and reset the coin sound
  const playCoinSound = async () => {
    if (coinSound.current) {
      await coinSound.current.replayAsync();
      setVolume(coinsound,0.7)
    }
  };

  // Function to play and reset the death sound
  const playDeathSound = async () => {
    if (deathSound.current) {
      await deathSound.current.replayAsync();
      setVolume(deathSound,0.7)
    }
  };

  // Function to play and reset the pole sound
  const playPoleSound = async () => {
    if (poleSound.current) {
      await poleSound.current.replayAsync();
      setVolume(poleSound,0.7)
    }
  };

  return {
    playCoinSound,
    playDeathSound,
    playPoleSound,
  };
};

export default useSfx;
