import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "expo-router";  // ใช้ useNavigation สำหรับการนำทาง

const HomePage = () => {
  const navigation = useNavigation();  // เรียกใช้ useNavigation

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flappy Bear</Text>
      {/* ใช้ TouchableOpacity เพื่อจัดการปุ่ม */}
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('game')}  // นำทางไปหน้า 'game'
      >
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      style={styles.buttonContainer}
      onPress={() => navigation.navigate('tutorial')}>
        <Text style = {styles.buttonText}>How to play</Text>
        </TouchableOpacity>
    </View>
  );
};

export default HomePage;

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
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

