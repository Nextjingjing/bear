import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Dimensions, 
  ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const CreditsPage = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      resizeMode="cover"
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Credits</Text>

          <View style={styles.creditContainer}>
            <View style={styles.creditItem}>
              <Text style={styles.creditText}>ID: 6601012610083</Text>
              <Text style={styles.nameText}>Pruek Tanvorakul</Text>
              <Text style={styles.roleText}>Art Assets & Game Design</Text>
            </View>

            <View style={styles.creditItem}>
              <Text style={styles.creditText}>ID: 6601012610148</Text>
              <Text style={styles.nameText}>Witthawin Thitichettrakul</Text>
              <Text style={styles.roleText}>Music, Debugging & Gameplay</Text>
            </View>

            <View style={styles.creditItem}>
              <Text style={styles.creditText}>ID: 6601012610067</Text>
              <Text style={styles.nameText}>Pongjun Junjam</Text>
              <Text style={styles.roleText}>Project Management & Gameplay</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.buttonContainer}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </ImageBackground>
  );
};

export default CreditsPage;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'CustomFont-Regular',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  creditContainer: {
    width: '90%',
    marginBottom: 40,
  },
  creditItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  creditText: {
    fontSize: 18,
    fontFamily: 'CustomFont-Regular',
    color: '#fff',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'CustomFont-Regular',
    color: '#fff',
    marginBottom: 5,
  },
  roleText: {
    fontSize: 18,
    fontFamily: 'CustomFont-Regular',
    color: '#aaa',
  },
  buttonContainer: {
    width: 150,
    backgroundColor: '#f57c00',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'CustomFont-Regular',
  },
});
