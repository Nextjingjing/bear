import { useState } from 'react';
import { Audio } from 'expo-av';

const useBGsound = () => {
  const [sound, setSound] = useState(null);

  // Function to play sound
  const playSound = async () => {
    if (!sound) {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/testsong.mp3') // Adjust the path to your song file
      );
      setSound(sound);

      console.log('Playing Sound');
      await sound.playAsync();  // Automatically play sound when loaded
    }
  };

  // Function to stop sound
  const stopSound = async () => {
    if (sound) {
      console.log('Stopping Sound');
      await sound.stopAsync(); // Stop the sound
      await sound.unloadAsync(); // Unload the sound from memory
      setSound(null); // Reset the sound state
    }
  };

  return {
    playSound,
    stopSound,
  };
};

export default useBGsound;
