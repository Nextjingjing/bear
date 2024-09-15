import { View, Text,StyleSheet,TouchableOpacity } from 'react-native';
import { useNavigation } from "expo-router";
const Totorial = () => {
    const navigation = useNavigation(); 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to play!!</Text>
      <TouchableOpacity 
      style={styles.buttonContainer}
      onPress={() => navigation.navigate('index')}>
        <Text style = {styles.buttonText}>Back</Text>
        </TouchableOpacity>
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
    logo: {
      width: 150,
      height: 150,
      marginBottom: 20,
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
  });
  
