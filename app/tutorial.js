import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation,useFocusEffect } from "expo-router";
import React,{ useState } from 'react';

const Tutorial = () => {
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>

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
