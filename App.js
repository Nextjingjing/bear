import { StatusBar } from 'expo-status-bar';
import { View, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import { GameEngine } from 'react-native-game-engine';
import entities from './entities';
import Physics from './Physics';

export default function App() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setRunning(true);
  }, []);

  const handleEvent = (e) => {
    if (e.type === 'game-over') {
      setRunning(false); // Stops the game
    }
  };

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={{flex: 1}}
    >
      <GameEngine
        systems={[Physics]}
        entities={entities()}
        running={running}
        onEvent={handleEvent} // Handle game events like game-over
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
      >
      </GameEngine>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

