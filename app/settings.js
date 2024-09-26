import { View,Text, TouchableOpacity, StyleSheet } from "react-native"
import Slider from '@react-native-community/slider';
const Settings = () => {
<View>
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
        onPress={handlePrevious}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>

</View>
}
export default Settings;

const styles = StyleSheet.create({
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
  });
