import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import useBGsound from "../hooks/bgsound";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RootLayout = () => {
    const { playSound, stopSound, setVolume } = useBGsound();
    const [volume, setVolumeState] = useState(1);

    // โหลดค่าระดับเสียงจาก AsyncStorage เมื่อ component mount
    useEffect(() => {
        const loadResources = async () => {
            try {
                const savedVolume = await AsyncStorage.getItem('volume');
                if (savedVolume !== null) {
                    const volumeValue = parseFloat(savedVolume);
                    setVolumeState(volumeValue);
                    setVolume(volumeValue);
                }
            } catch (error) {
                console.error('Failed to load resources:', error);
            }
        };
        loadResources();
    }, []);


    // เริ่มเล่นเพลงเมื่อหน้าจอถูก focus และหยุดเมื่อออกจากหน้า
    useFocusEffect(
        React.useCallback(() => {
            playSound();
            return () => {
                stopSound();
            };
        }, [])
    );

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }}/>
            <Stack.Screen name="game" options={{ headerShown: false }}/>
            <Stack.Screen name="tutorial" options={{ headerShown: false }}/>
            <Stack.Screen name="credit" options={{ headerShown: false }}/>
        </Stack>
    );
};

export default RootLayout;
