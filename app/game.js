import { StatusBar } from 'expo-status-bar';
import { View, ImageBackground, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { GameEngine } from 'react-native-game-engine';
import entities from '../entities';
import Physics from '../Physics';
import { Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from "expo-router"; 
import usesfx from '../hooks/sfx';
import AsyncStorage from '@react-native-async-storage/async-storage'; // นำเข้า AsyncStorage
import { SafeAreaView } from 'react-native-safe-area-context'; // นำเข้า SafeAreaView

const { width, height } = Dimensions.get('window');

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoint, setCurrentpoint] = useState(0);
  const [highScore, setHighScore] = useState(0); // เพิ่ม state สำหรับคะแนนสูงสุด
  const navigation = useNavigation();
  const { playCoinSound, playDeathSound, playPoleSound } = usesfx();

  // ฟังก์ชันในการดึงคะแนนสูงสุดจาก AsyncStorage
  const loadHighScore = async () => {
    try {
      const storedHighScore = await AsyncStorage.getItem('highScore');
      if (storedHighScore !== null) {
        setHighScore(parseInt(storedHighScore)); // ตั้งค่าคะแนนสูงสุดที่เก็บไว้
      }
    } catch (error) {
      console.error('Error loading high score:', error);
    }
  };

  // ฟังก์ชันในการบันทึกคะแนนสูงสุด
  const saveHighScore = async (score) => {
    try {
      await AsyncStorage.setItem('highScore', score.toString());
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  };

  // โหลดคะแนนสูงสุดเมื่อหน้าโฟกัส
  useFocusEffect(
    React.useCallback(() => {
      loadHighScore(); // โหลดคะแนนสูงสุดเมื่อหน้าถูกโฟกัส
    }, [])
  );

  useEffect(() => {
    setRunning(true);
  }, []);

  const handleEvent = (e) => {
    if (e.type === 'game_over') {
      setRunning(false); // Stops the game
      gameEngine.stop();
      playDeathSound();

      // ตรวจสอบคะแนนปัจจุบันและคะแนนสูงสุด
      if (currentPoint > highScore) {
        setHighScore(currentPoint); // ตั้งค่าคะแนนสูงสุดใหม่
        saveHighScore(currentPoint); // บันทึกคะแนนสูงสุดใหม่ใน AsyncStorage
      }
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
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/background.jpg')}
        resizeMode="cover"
        style={{ flex: 1, width: width, height: height }}
      >
        {/* แสดงคะแนนปัจจุบัน */}
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

        {/* แสดงคะแนนสูงสุด */}
        <Text style={{
          position: 'absolute',
          bottom: 20,  // แสดงด้านล่างคะแนนปัจจุบัน
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 30,
          color: 'white',
          margin: 2,
          zIndex: 1,
          textShadowColor: 'black',
          textShadowRadius: 15,
        }}>
          High Score: {highScore} Points
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
                marginBottom: 20,
              }}
            >
              <Text style={{ color: 'white', fontSize: 30, textAlign: 'center' }}>Play</Text>
            </TouchableOpacity>

            {/* ปุ่มกลับไปหน้าแรก */}
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
          entities={entities()}
          running={running}
          onEvent={handleEvent}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents={running ? 'auto' : 'none'}
        />
        <StatusBar style="auto" />
      </ImageBackground>
    </SafeAreaView>
  );
}
