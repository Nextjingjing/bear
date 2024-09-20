import { StatusBar } from 'expo-status-bar';
import { View, ImageBackground, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { GameEngine } from 'react-native-game-engine';
import entities from '../entities';
import Physics from '../Physics';
import { Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from "expo-router";
import useBGgame from '../hooks/bggame';
import usesfx from '../hooks/sfx';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoint, setCurrentpoint] = useState(0);
  const [route, setRoute] = useState(null); // Track selected route
  const navigation = useNavigation();
  const { playSound, stopSound } = useBGgame();
  const { playCoinSound, playDeathSound, playPoleSound } = usesfx();

  // Start and stop background sound based on page focus
  useFocusEffect(
    React.useCallback(() => {
      playSound();
      return () => {
        stopSound();
      };
    }, [])
  );

  useEffect(() => {
    setRunning(true);
  }, []);

  const handleEvent = (e) => {
    if (e.type === 'game_over') {
      setRunning(false);
      gameEngine.stop();
      setCurrentpoint(0);
      playDeathSound();
    }
    if (e.type === 'new_point') {
      setCurrentpoint(currentPoint + 100);
      playPoleSound();
    }

    if (e.type === 'coin_collected') {
      setCurrentpoint(currentPoint + 20);
      playCoinSound();
    }
  };

  const resetGame = () => {
    setCurrentpoint(0);
    setRunning(true);
    setRoute(null); // Reset route
    gameEngine.swap(entities());
  };

  const chooseRoute = (selectedRoute) => {
    setRoute(selectedRoute);
    setRunning(true); // Start the game after route selection
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      resizeMode="cover"
      style={{ flex: 1, width: width, height: height }}
    >
      <Text style={{
        position: 'absolute',
        top: 15,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 40,
        color: 'white',
        margin: 2,
        zIndex: 1,
        textShadowColor: 'black',
        textShadowRadius: 15,
      }}>
        {currentPoint} Points
      </Text>

      {!running && !route && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 3 }}>
          {/* Route selection */}
          <Text style={{ color: 'white', fontSize: 20, marginBottom: 20 }}>Choose Your Route</Text>
          <TouchableOpacity
            onPress={() => chooseRoute('easy')}
            style={{
              padding: 15,
              backgroundColor: 'rgba(0, 255, 0, 0.7)',
              borderRadius: 10,
              zIndex: 3,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>Easy Route</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => chooseRoute('hard')}
            style={{
              padding: 15,
              backgroundColor: 'rgba(255, 0, 0, 0.7)',
              borderRadius: 10,
              zIndex: 3,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>Hard Route</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('index')}
            style={{
              padding: 15,
              backgroundColor: 'rgba(255, 0, 0, 0.7)',
              borderRadius: 10,
              zIndex: 3,
            }}
          >
            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}

      <GameEngine
        ref={(ref) => setGameEngine(ref)}
        systems={[Physics]}
        entities={entities(route)} // Pass the selected route to entities
        running={running}
        onEvent={handleEvent}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents={running ? 'auto' : 'none'}
      >
      </GameEngine>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}
