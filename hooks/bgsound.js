import { useRef } from 'react';
import { Audio } from 'expo-av';

const useBGsound = () => {
  const soundRef = useRef(null);  // Use ref to hold the sound object

  // Function to play sound
  const playSound = async () => {
    if (!soundRef.current) {
      console.log('Loading and setting sound...');
      try {
        const { sound: bgSound } = await Audio.Sound.createAsync(
          require('../assets/BG/bgmain.mp3')  // Adjust the path to your song file
        );
        soundRef.current = bgSound;  // Store the sound object in the ref

        bgSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {  // If the sound finishes

            bgSound.replayAsync();  // Replay the sound when it finishes
          }
        });

        await bgSound.playAsync();  // Automatically play sound
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

export default useBGsound;
