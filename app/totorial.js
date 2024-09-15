import { View, Text,StyleSheet,TouchableOpacity } from 'react-native';
import { useNavigation } from "expo-router";
const Totorial = () => {
    const navigation = useNavigation(); 
  return (
    <View>
      <Text>This is the tutorial page!</Text>
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
  
