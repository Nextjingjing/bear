import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  ImageBackground, 
  SafeAreaView, 
  StyleSheet 
} from 'react-native';
import { useNavigation } from "expo-router";
import * as Font from 'expo-font'; // Import expo-font

const Tutorial = () => {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false); // Track font loading

  // Load the custom font in useEffect
  useEffect(() => {
    const loadResources = async () => {
      try {
        // Load the custom font
        await Font.loadAsync({
          'CustomFont-Regular': require('../assets/fonts/Matemasie-Regular.ttf'),
        });
        setFontsLoaded(true); // Set fonts loaded to true after loading
      } catch (error) {
        console.error('Failed to load font:', error);
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
      <SafeAreaView style={styles.safeArea}>
        

        {/* Scrollable Image Section */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          {/* Main Title */}
          <Text style={styles.mainTitle}>How to Play?</Text>
        </View>
          {/* Image 1 with title */}
          <View style={styles.imageContainer}>
            <View style={styles.imageTitleContainer}>
              <Text style={styles.imageTitle}>Control</Text>
            </View>
            <Image source={require('../assets/how1.jpg')} style={styles.image} />
          </View>
          {/* Image 2 with title */}
          <View style={styles.imageContainer}>
            <View style={styles.imageTitleContainer}>
              <Text style={styles.imageTitle}>Conquer</Text>
            </View>
            <Image source={require('../assets/how2.jpg')} style={styles.image} />
          </View>
          {/* Image 3 with title */}
          <View style={styles.imageContainer}>
            <View style={styles.imageTitleContainer}>
              <Text style={styles.imageTitle}>Coin Collection</Text>
            </View>
            <Image source={require('../assets/how3.jpg')} style={styles.image} />
          </View>
        </ScrollView>

        {/* Back button */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('index')}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Tutorial;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'CustomFont-Regular',  // Apply custom font
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 100, // เพิ่ม padding ด้านล่างเพื่อให้เลื่อนได้มากขึ้น
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 15, // เท่ากันทั้งข้างบนและข้างล่างของแต่ละภาพ
    backgroundColor: '#fff', // Light green background for image container
    borderRadius: 20,
    padding: 15, // Padding around the image
  },
  imageTitleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Background color with opacity
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15, // Make the container rounded
    marginBottom: 10, // เว้นระยะห่างระหว่างกรอบหัวข้อกับรูปภาพ
  },
  imageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'CustomFont-Regular',  // Apply custom font
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 10, // ปรับระยะห่างระหว่างรูปภาพให้มากขึ้น
    resizeMode: 'contain', // Ensures the image scales correctly
    borderRadius: 20, // เพิ่มกรอบโค้งมน
    borderWidth: 3, // ความหนาของกรอบ
    borderColor: '#fff', // สีของกรอบ
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'CustomFont-Regular',  // Apply custom font
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 40, // เพิ่มระยะห่างจากขอบล่างของหน้าจอ
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#f57c00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});
