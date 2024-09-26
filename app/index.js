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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import useBGsound from "../hooks/bgsound";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';  // Import expo-font

const { width, height } = Dimensions.get('window');

const HomePage = () => {
  const navigation = useNavigation();
  const { playSound, stopSound, setVolume } = useBGsound();
  const [page, setPage] = useState(1);
  const [volume, setVolumeState] = useState(1);
  const [fontsLoaded, setFontsLoaded] = useState(false); // Track font loading

  // Load volume from AsyncStorage and custom font
  useEffect(() => {
    const loadResources = async () => {
      try {
        const savedVolume = await AsyncStorage.getItem('volume');
        if (savedVolume !== null) {
          const volumeValue = parseFloat(savedVolume);
          setVolumeState(volumeValue);
          setVolume(volumeValue);
        }

        // Load the custom font
        await Font.loadAsync({
          'CustomFont-Regular': require('../assets/fonts/Matemasie-Regular.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Failed to load resources:', error);
      }
    };
    loadResources();
  }, []);

  const handleVolumeChange = async (value) => {
    setVolumeState(value);
    setVolume(value);
    try {
      await AsyncStorage.setItem('volume', value.toString());
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
      playSound();
      return () => {
        stopSound();
      };
    }, [])
  );

  // Render nothing until fonts are loaded
  if (!fontsLoaded) {
    return null; // You can return a loading spinner here if needed
  }

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
              onPress={() => navigation.navigate('game')}
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
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'CustomFont-Regular',  // Use the loaded custom font
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
    fontFamily: 'CustomFont-Regular',  // Use the custom font here as well
  },
  buttonContainer: {
    width: 200,
    backgroundColor: '#f57c00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'CustomFont-Regular',  // Custom font for button text
  },
  slider: {
    width: 200,
    height: 60,
  },
});
