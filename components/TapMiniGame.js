// components/TapMiniGame.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import useSfx from '../hooks/sfx'; // นำเข้า useSfx จากโฟลเดอร์ hooks

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define button size
const BUTTON_SIZE = 80;

const TapMiniGame = ({ onEnd }) => {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5); // 5-second timer

  // ใช้ฮุก useSfx
  const { playCoinSound } = useSfx();

  // Animated values for button position
  const buttonPosition = useRef(new Animated.ValueXY()).current;

  // Reference to the position updating interval
  const positionInterval = useRef(null);

  // Function to generate a random position within screen bounds
  const getRandomPosition = () => {
    const maxX = SCREEN_WIDTH - BUTTON_SIZE - 20; // 20 for padding
    const maxY = SCREEN_HEIGHT - BUTTON_SIZE - 100; // 100 for top elements
    const minX = 20;
    const minY = 100;

    const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    return { x: randomX, y: randomY };
  };

  // Function to animate the button to a new position
  const moveButton = () => {
    const newPos = getRandomPosition();
    Animated.spring(buttonPosition, {
      toValue: newPos,
      useNativeDriver: false,
      friction: 8,
      tension: 50,
    }).start();
  };

  useEffect(() => {
    // Initialize button position
    moveButton();

    // Set interval to move button every second
    positionInterval.current = setInterval(moveButton, 1000);

    return () => {
      // Clean up interval on unmount
      if (positionInterval.current) {
        clearInterval(positionInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prevTime => prevTime - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Mini-game ends, calculate score and notify parent
      const score = taps * 10; // 10 points per tap
      if (typeof onEnd === 'function') {
        onEnd(score);
      } else {
        console.error('onEnd prop is not a function');
      }

      // Clear the position interval when game ends
      if (positionInterval.current) {
        clearInterval(positionInterval.current);
      }
    }
  }, [timeLeft, onEnd, taps]);

  return (
    <View style={styles.container}>
      {timeLeft > 0 ? (
        <>
          <Text style={styles.instructionsText}>
            Tap as much as you can!
          </Text>
          <Animated.View style={[styles.animatedButtonContainer, buttonPosition.getLayout()]}>
            <TouchableOpacity
              style={styles.tapButton}
              onPress={async () => {
                setTaps(prevTaps => prevTaps + 1);
                moveButton(); // Optionally move button on tap
                await playCoinSound(); // เล่นเสียงเหรียญเมื่อกดปุ่ม
              }}
            >
              <Text style={styles.buttonText}>Tap!</Text>
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.tapCountText}>Taps: {taps}</Text>
        </>
      ) : (
        <>
          <Text style={styles.timerText}>Time's up!</Text>
          <Text style={styles.tapText}>Total Taps: {taps}</Text>
          <Text style={styles.scoreText}>Score: {taps * 10}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill, // Ensures the container covers the entire screen
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100, // Increased zIndex to ensure it's on top
    padding: 20,
  },
  instructionsText: {
    fontSize: 24,
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 32,
    color: '#FF4500',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  tapText: {
    fontSize: 26,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 28,
    color: '#00FF7F',
    marginTop: 10,
    fontWeight: 'bold',
  },
  tapButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // Increased elevation for Android to make it more prominent
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    zIndex: 101, // Ensures the button is above other elements
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tapCountText: {
    fontSize: 22,
    color: '#FFFFFF',
    marginTop: 10,
  },
  animatedButtonContainer: {
    position: 'absolute',
    zIndex: 101, // Ensures the button container is above other elements
  },
});

export default TapMiniGame;
