import { useRef, useEffect } from 'react';
import { Audio } from 'expo-av';

const useBGsound = () => {
  const soundRef = useRef(null);  // Use ref to hold the sound object
  const currentVolume = useRef(1);  // Store current volume in a ref to track it persistently

  // Array of music files
  const musicFiles = [
    require('../assets/backgroundMusics/bgmain1.mp3'),
    require('../assets/backgroundMusics/bgmain2.mp3'),
    require('../assets/backgroundMusics/bgmain3.mp3'),
    // Add more music files as needed
  ];

  // Function to get a random music file
  const getRandomMusicFile = () => {
    const randomIndex = Math.floor(Math.random() * musicFiles.length);
    return musicFiles[randomIndex];
  };

  // Function to play sound
  const playSound = async () => {
    if (!soundRef.current) {
      try {
        const { sound: bgSound } = await Audio.Sound.createAsync(
          getRandomMusicFile()  // Get a random music file
        );
        soundRef.current = bgSound;
        bgSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            bgSound.unloadAsync();  // Unload the finished sound
            soundRef.current = null;
            playSound();  // Play another random song after finishing
          }
        });

        // Set the initial volume when the sound starts
        await bgSound.setVolumeAsync(currentVolume.current);
        await bgSound.playAsync();
      } catch (error) {
        console.error('Error loading or playing sound:', error);
      }
    } 
  };

  // Function to stop sound
  const stopSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      } catch (error) {
        console.error('Error stopping or unloading sound:', error);
      }
    }
  };

  // Function to set volume
  const setVolume = async (volume) => {
    currentVolume.current = volume;  // Update the volume ref
    if (soundRef.current) {
      try {
        await soundRef.current.setVolumeAsync(volume);  // Set volume if sound is playing
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  };

  // Return the functions to control sound
  return {
    playSound,
    stopSound,
    setVolume,
  };
};

export default useBGsound;
