// components/TapMiniGame.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TapMiniGame = ({ onEnd }) => {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5); // 5-second timer

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prevTime => prevTime - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Mini-game ends, calculate score and notify parent
      const score = taps * 5; // 5 points per tap
      if (typeof onEnd === 'function') {
        onEnd(score);
      } else {
        console.error('onEnd prop is not a function');
      }
    }
  }, [timeLeft, onEnd]);

  return (
    <View style={styles.container}>
      {timeLeft > 0 ? (
        <>
          <Text style={styles.instructionsText}>
            Tap as much as you can in {timeLeft} seconds!
          </Text>
          <TouchableOpacity
            style={styles.tapButton}
            onPress={() => setTaps(prevTaps => prevTaps + 1)}
          >
            <Text style={styles.buttonText}>Tap!</Text>
          </TouchableOpacity>
          <Text style={styles.tapCountText}>Taps: {taps}</Text>
        </>
      ) : (
        <>
          <Text style={styles.timerText}>Time's up!</Text>
          <Text style={styles.tapText}>Total Taps: {taps}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  instructionsText: {
    fontSize: 28,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  timerText: {
    fontSize: 30,
    color: 'white',
    marginBottom: 10,
  },
  tapText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  tapButton: {
    padding: 20,
    backgroundColor: 'blue',
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
  tapCountText: {
    fontSize: 20,
    color: 'white',
  },
});

export default TapMiniGame;
