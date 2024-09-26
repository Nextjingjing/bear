import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ImageBackground, 
  Dimensions 
} from "react-native";
import Slider from '@react-native-community/slider';
import { useNavigation, useFocusEffect } from "@react-navigation/native";  // Use useNavigation for navigation
import useBGsound from "../hooks/bgsound";  // Import the custom hook
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';  // Ensure you're using expo-status-bar
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const HomePage = () => {
  const navigation = useNavigation();  // Call useNavigation
  const { playSound, stopSound, setVolume } = useBGsound();  // Get the play and stop functions from the hook
  const [page, setPage] = useState(1); // change page
  const [volume, setVolumeState] = useState(1);  // Initial volume is 100%

  // Load volume from AsyncStorage when the component mounts
  useEffect(() => {
    const loadVolume = async () => {
      try {
        const savedVolume = await AsyncStorage.getItem('volume');
        if (savedVolume !== null) {
          const volumeValue = parseFloat(savedVolume);
          setVolumeState(volumeValue);
          setVolume(volumeValue);
        }
      } catch (error) {
        console.error('Failed to load volume:', error);
      }
    };
    loadVolume();
  }, []);

  const handleVolumeChange = async (value) => {
    setVolumeState(value);  // Update the local state
    setVolume(value);  // Update the sound volume
    try {
      await AsyncStorage.setItem('volume', value.toString());  // Save volume to AsyncStorage
    } catch (error) {
      console.error('Failed to save volume:', error);
    }
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  const handlePrevious = () => {
    setPage(page - 1);
  };

  // Start and stop background sound based on page focus
  useFocusEffect(
    React.useCallback(() => {
      playSound();  // Start playing the sound when the page is focused

      return () => {
        stopSound();  // Stop the sound when the page is unfocused
      };
    }, [])
  );

  return (

      <ImageBackground
        source={require('../assets/background.jpg')}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.container}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />

          {page === 1 && (
            <>
              <Text style={styles.title}>Flappy Bear</Text>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate('game')}  // Navigate to 'game' page
              >
                <Text style={styles.buttonText}>Start Game</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.buttonContainer}
                onPress={() => navigation.navigate('tutorial')}
              >
                <Text style={styles.buttonText}>How to play</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.buttonContainer}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Settings</Text>
              </TouchableOpacity>
            </>
          )}

          {page === 2 && (
            <>
              <Text style={styles.title}>Settings</Text>

              <Text style={styles.subtitle}>Background Music Volume:</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={handleVolumeChange}
                step={0.1}
                minimumTrackTintColor="#39da11"
                maximumTrackTintColor="#ff3600"
                thumbTintColor="#1EB1FC"
              />

              <TouchableOpacity 
                style={styles.buttonContainer}
                onPress={handlePrevious}
              >
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <StatusBar style="auto" />
      </ImageBackground>

  );
};

export default HomePage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#87CEEB',  // Ensure this matches the StatusBar background
  },
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Removed backgroundColor since ImageBackground is handling it
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  buttonContainer: {
    width: 200,
    backgroundColor: '#f57c00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  slider: {
    width: 200,
    height: 60,
  },
});
