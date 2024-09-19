import { StatusBar } from 'expo-status-bar';
import { View, ImageBackground, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { GameEngine } from 'react-native-game-engine';
import entities from '../entities';
import Physics from '../Physics';
import { Dimensions } from 'react-native';
import { useNavigation,useFocusEffect } from "expo-router";  // ใช้ useNavigation เพื่อสร้างการนำทาง
import useBGgame from '../hooks/bggame';
import usesfx from '../hooks/sfx';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoint, setCurrentpoint] = useState(0);
  const navigation = useNavigation();  // สร้างการนำทาง
  const { playSound, stopSound } = useBGgame();  // Get the play and stop functions from the hook
  const { playCoinSound, playDeathSound, playPoleSound } = usesfx();

  // Start and stop background sound based on page focus
  useFocusEffect(
    React.useCallback(() => {
      playSound();  // Start playing the sound when the page is focused

      return () => {
        stopSound();  // Stop the sound when the page is unfocused

      };
    }, [])
  );
  useEffect(() => {
    setRunning(true);
  }, []);

  const handleEvent = (e) => {
    if (e.type === 'game_over') {
      setRunning(false); // Stops the game
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
    setCurrentpoint(0); // Reset points
    setRunning(true); // Start the game again
    gameEngine.swap(entities()); // Reset the entities
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      resizeMode="cover"
      style={{ flex: 1 ,width: width, height: height }}
    >
      <Text style={{
        position: 'absolute',
        top: 15,  // ระบุตำแหน่งด้านบนของหน้าจอ
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 40,
        color: 'white',
        margin: 2,
        zIndex: 1, // ทำให้ Text อยู่ด้านบน
        textShadowColor: 'black',
        textShadowRadius: 15,
        
      }}>
        {currentPoint} Points
      </Text>

      { !running && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 3 }}>
          <TouchableOpacity
            onPress={resetGame}
            style={{
              padding: 20,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 10,
              zIndex: 3,
              marginBottom: 20, // เพิ่มการเว้นวรรคด้านล่างปุ่ม Play
            }}
          >
            <Text style={{ color: 'white', fontSize: 30, textAlign: 'center' }}>Play</Text>
          </TouchableOpacity>

          {/* ปุ่มกลับไปหน้าแรก */}
          <TouchableOpacity
            onPress={() => navigation.navigate('index')}  // นำทางกลับไปยังหน้า index
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
        entities={entities()}
        running={running}
        onEvent={handleEvent} // Handle game events like game-over
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents={running ? 'auto' : 'none'} // Allow touches when running, block when not
      >
      </GameEngine>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}
