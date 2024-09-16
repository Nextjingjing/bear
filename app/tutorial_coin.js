import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
import { useNavigation } from "expo-router";

const Totorial = () => {
    const navigation = useNavigation(); 
    return (
        <View style={styles.container}>
            <Text style={styles.title}>How to play!!</Text>
            <Image 
                source={require('../assets/coin_tutorial.jpg')}  // Adjusted path
                style={styles.logo} 
                />
                <Text style={styles.title}>Collect Coins!!</Text>
              
            {/* Row for Next and Previous buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity 
                    style={styles.buttonContainer}
                    onPress={() => navigation.navigate('tutorial_move')}>
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.buttonContainer}
                    onPress={() => navigation.navigate('tutorial_dead')}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>

            {/* Back button placed below the row */}
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

export default Totorial;

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
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%', // Adjust the width to control button spacing
        marginBottom: 20, // Adds space between the row and Back button
    },
    backButtonContainer: {
        alignItems: 'center', // Centers the Back button horizontally
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
