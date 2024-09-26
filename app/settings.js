import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Slider from '@react-native-community/slider';
import useBGsound from "../hooks/bgsound";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
    const { setVolume } = useBGsound();
    const [volume, setVolumeState] = useState(1);  // Initial volume is 100%
    const navigation = useNavigation();

    // Load volume from AsyncStorage when the component mounts
    useEffect(() => {
        const loadVolume = async () => {
            try {
                const savedVolume = await AsyncStorage.getItem('volume');
                if (savedVolume !== null) {
                    const volumeValue = parseFloat(savedVolume);
                    setVolumeState(volumeValue);
                    setVolume(volumeValue);
                }
            } catch (error) {
                console.error('Failed to load volume:', error);
            }
        };
        loadVolume();
    }, []);

    const handleVolumeChange = async (value) => {
        setVolumeState(value);  // Update the local state
        setVolume(value);  // Update the sound volume
        try {
            await AsyncStorage.setItem('volume', value.toString());  // Save volume to AsyncStorage
        } catch (error) {
            console.error('Failed to save volume:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Background Music Volume:</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={handleVolumeChange}
                step={0.1}
                minimumTrackTintColor="#39da11"
                maximumTrackTintColor="#ff3600"
                thumbTintColor="#1EB1FC"
            />
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate('index')}
            >
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#282c34',
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
    slider: {
        width: 200,
        height: 60,
    },
    buttonContainer: {
        backgroundColor: '#1EB1FC',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});
