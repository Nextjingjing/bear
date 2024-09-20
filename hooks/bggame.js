import { useRef } from 'react';
import { Audio } from 'expo-av';

const useBGsound = () => {
  const soundRef = useRef(null);  // Use ref to hold the sound object

  // List of songs to choose from (Adjust the paths to your actual song files)
  const songs = [
    require('../assets/BG/bgsong1.mp3'),
    require('../assets/BG/bgsong2.mp3'),
    require('../assets/BG/bgsong3.mp3'),
    require('../assets/BG/bgsong4.mp3'),
    require('../assets/BG/bgsong5.mp3'),
    // Add more songs here...
  ];

  // Function to randomly select a song
  const getRandomSong = () => {
    const randomIndex = Math.floor(Math.random() * songs.length);  // Get a random index from the songs array
    return songs[randomIndex];
  };

  // Function to load and play a song
  const playSound = async () => {
    if (!soundRef.current) {
      console.log('Loading and setting sound...');
      try {
        const randomSong = getRandomSong();  // Select a random song

        const { sound: newSound } = await Audio.Sound.createAsync(
          randomSong  // Use the random song
        );
        soundRef.current = newSound;  // Store the sound object in the ref

        newSound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish) {  // If the sound finishes
            await playNextRandomSong();  // Play the next random song
          }
        });

        await newSound.playAsync();  // Automatically play sound
        console.log('Sound is now playing.');
      } catch (error) {
        console.error('Error loading or playing sound:', error);
      }
    }
  };

  // Function to stop and unload sound
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

  // Function to play the next random song
  const playNextRandomSong = async () => {
    await stopSound();  // Stop and unload the current song
    await playSound();  // Load and play the next random song
  };

  return {
    playSound,
    stopSound,
  };
};

export default useBGsound;
