import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation,useFocusEffect } from "expo-router";
import React,{ useState } from 'react';
import useBGtutorial from '../hooks/bgtutorial';

const Tutorial = () => {
    const navigation = useNavigation(); 
    const [step, setStep] = useState(1);  // Step to manage the tutorial flow
    const { playSound, stopSound } = useBGtutorial();  // Get the play and stop functions from the hook

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handlePrevious = () => {
        if (step > 1) setStep(step - 1);
    };
    // Start and stop background sound based on page focus
    useFocusEffect(
        React.useCallback(() => {
          playSound();  // Start playing the sound when the page is focused
    
          return () => {
            stopSound();  // Stop the sound when the page is unfocused
    
          };
        }, [])
      );
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>How to play!!</Text>
            
            {step === 1 && (
                <>
                    <Image 
                        source={require('../assets/up_tutorial.png')}  
                        style={styles.logo} 
                    />
                    <Text style={styles.title}>Swipe up!!</Text>
                    <Image 
                        source={require('../assets/down_tutorial.png')}  
                        style={styles.logo} 
                    />
                    <Text style={styles.title}>Swipe Down!!</Text>
                </>
            )}

            {step === 2 && (
                <>
                    <Image 
                        source={require('../assets/coin_tutorial.jpg')}  
                        style={styles.logo} 
                    />
                    <Text style={styles.title}>Collect Coins!!</Text>
                </>
            )}

            {step === 3 && (
                <>
                    <Image 
                        source={require('../assets/dead_tutorial.png')}  
                        style={styles.logo} 
                    />
                    <Text style={styles.title}>Dead!!</Text>
                </>
            )}

            {/* Row for Next and Previous buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity 
                    style={[styles.buttonContainer, step === 1 && styles.disabledButton]}
                    onPress={handlePrevious}
                    disabled={step === 1}>
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.buttonContainer, step === 3 && styles.disabledButton]}
                    onPress={handleNext}
                    disabled={step === 3}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>

            {/* Back button */}
            <View style={styles.backButtonContainer}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.navigate('index')}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Tutorial;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#87CEEB',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    buttonContainer: {
        backgroundColor: '#f57c00',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    disabledButton: {
        backgroundColor: '#A9A9A9', // Grey color for disabled state
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 20,
    },
    backButtonContainer: {
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: '#f57c00',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
});
