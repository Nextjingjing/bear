// screens/App.js

import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import entities from '../entities';
import Physics from '../Physics';
import usesfx from '../hooks/sfx';
import TapMiniGame from '../components/TapMiniGame';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigation = useNavigation();
  const { playCoinSound, playDeathSound, playPoleSound } = usesfx();

  // Ref to track if we are after the mini-game
  const isAfterMiniGame = useRef(false);

  // Function to load high score from AsyncStorage
  const loadHighScore = async () => {
    try {
      const storedHighScore = await AsyncStorage.getItem('highScore');
      if (storedHighScore !== null) {
        setHighScore(parseInt(storedHighScore));
      }
    } catch (error) {
      console.error('Error loading high score:', error);
    }
  };

  // Function to save high score to AsyncStorage
  const saveHighScore = async (score) => {
    try {
      await AsyncStorage.setItem('highScore', score.toString());
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  };

  // Load high score when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadHighScore();
    }, [])
  );

  // Start the game when the component mounts
  useEffect(() => {
    setRunning(true);
  }, []);

  // Detect when to trigger the mini-game
  useEffect(() => {
    const milestone = Math.floor(currentPoint / 1000);
    if (milestone > lastMilestone && !showMiniGame && !showCountdown) {
      setRunning(false); // Pause the main game
      setShowCountdown(true); // Show the countdown
      setCountdown(3); // Reset countdown
      setLastMilestone(milestone); // Update last milestone
      isAfterMiniGame.current = false; // Before mini-game
    }
  }, [currentPoint, lastMilestone, showMiniGame, showCountdown]);

  // Handle the countdown
  useEffect(() => {
    let timer;
    if (showCountdown && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
      if (isAfterMiniGame.current) {
        // After mini-game, resume main game
        setRunning(true);
        isAfterMiniGame.current = false; // Reset the flag
      } else {
        // Before mini-game, show mini-game
        setShowMiniGame(true);
      }
    }
    return () => clearTimeout(timer);
  }, [showCountdown, countdown]);

  // Handle game events
  const handleEvent = (e) => {
    if (e.type === 'game_over') {
      setRunning(false);
      gameEngine.stop();
      playDeathSound();

      if (currentPoint > highScore) {
        setHighScore(currentPoint);
        saveHighScore(currentPoint);
      }
    }
    if (e.type === 'new_point') {
      setCurrentPoint(prev => prev + 100);
      playPoleSound();
    }
    if (e.type === 'coin_collected') {
      setCurrentPoint(prev => prev + 20);
      playCoinSound();
    }
  };

  // Reset the game (e.g., after game over)
  const resetGame = () => {
    setCurrentPoint(0);
    setLastMilestone(0);
    setRunning(true);
    gameEngine.swap(entities());
  };

  // Handle end of the mini-game with the score obtained
  const handleMiniGameEnd = (score) => {
    setCurrentPoint(prev => prev + score); // Add mini-game score
    setShowMiniGame(false);
    setCountdown(3);
    setShowCountdown(true);
    isAfterMiniGame.current = true; // Set flag to indicate after mini-game
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/background.jpg')}
        resizeMode="cover"
        style={{ flex: 1, width, height }}
      >
        {/* Display Current Points */}
        <Text style={styles.scoreText}>{currentPoint} Points</Text>

        {/* Display High Score */}
        <Text style={styles.highScoreText}>High Score: {highScore} Points</Text>

        {/* Overlay when the game is paused and not showing mini-game or countdown */}
        {!running && !showMiniGame && !showCountdown && (
          <View style={styles.overlay}>
            <TouchableOpacity
              onPress={resetGame}
              style={styles.playButton}
            >
              <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>

            {/* Back to Home Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('index')}
              style={styles.backButton}
            >
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Countdown Overlay */}
        {showCountdown && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        )}

        {/* Mini-Game Overlay */}
        {showMiniGame && (
          <TapMiniGame onEnd={handleMiniGameEnd} />
        )}

        {/* Game Engine */}
        <GameEngine
          ref={(ref) => setGameEngine(ref)}
          systems={[Physics]}
          entities={entities()}
          running={running}
          onEvent={handleEvent}
          style={styles.gameEngine}
          pointerEvents={running ? 'auto' : 'none'}
        />

        <StatusBar style="auto" />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scoreText: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 40,
    color: 'white',
    textShadowColor: 'black',
    textShadowRadius: 15,
    zIndex: 1,
  },
  highScoreText: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    textShadowColor: 'black',
    textShadowRadius: 15,
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 3,
  },
  playButton: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 15,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 4,
  },
  countdownText: {
    fontSize: 80,
    color: 'white',
    fontWeight: 'bold',
  },
  gameEngine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
