import React,{ useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";  // Use useNavigation for navigation
import useBGsound from "../hooks/bgsound";  // Import the custom hook

const HomePage = () => {
  const navigation = useNavigation();  // Call useNavigation
  const { playSound, stopSound } = useBGsound();  // Get the play and stop functions from the hook
  const [page,setPage] = useState(1); // change page

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
    <View style={styles.container}>
      
      {page === 1 && (<>
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
      onPress={handleNext}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
      
      </>)}
      {page === 2 &&(
        <>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity 
      style={styles.buttonContainer}
      onPress={handlePrevious}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
        </>
      )}

    </View>
  );
};

export default HomePage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#87CEEB',
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
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  buttonContainer: {
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
});
