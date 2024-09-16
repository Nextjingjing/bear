import { useRef } from 'react';
import { Audio } from 'expo-av';

const useBGgame = () => {
  const soundRef = useRef(null);  // Use ref to hold the sound object

  // Function to play sound
  const playSound = async () => {
    if (!soundRef.current) {
      console.log('Loading and setting sound...');
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../assets/testsong2.mp3')  // Adjust the path to your song file
        );
        soundRef.current = newSound;  // Store the sound object in the ref

        await newSound.playAsync();  // Automatically play sound
        console.log('Sound is now playing.');
      } catch (error) {
        console.error('Error loading or playing sound:', error);
      }
    } 
  };

  // Function to stop sound
  const stopSound = async () => {
    if (soundRef.current) {
      console.log('Stopping and unloading sound...');
      try {
        await soundRef.current.stopAsync();  // Stop the sound
        await soundRef.current.unloadAsync();  // Unload the sound from memory
        soundRef.current = null;  // Reset the ref to null
        console.log('Sound stopped and unloaded.');
      } catch (error) {
        console.error('Error stopping or unloading sound:', error);
      }
    }
  };

  return {
    playSound,
    stopSound,
  };
};

export default useBGgame;
