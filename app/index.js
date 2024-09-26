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
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';  // Import expo-font

const { width, height } = Dimensions.get('window');

const HomePage = () => {
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [fontsLoaded, setFontsLoaded] = useState(false); // Track font loading

  // Load volume from AsyncStorage and custom font
  useEffect(() => {
    const loadResources = async () => {
      try {
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
});
