import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation(); 

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/Cdm-bg.png')}  
        style={styles.backgroundImage}
      >
        <Image
          source={require('../assets/images/Colegio-de-Montalban.webp')}  
          style={styles.logo} 
        />
      
        <Text style={styles.schoolName}>Colegio</Text>
        <Text style={styles.schoolName}>de</Text>
        <Text style={styles.schoolName}>Montalban</Text>
      
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={() => navigation.navigate('ChooseYourInstitute')} 
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logo: {
    width: 70, 
    height: 60,
    position: 'absolute',
    top: 40,
    left: 5,
  },
  schoolName: {
    fontSize: 50,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    top: -200,
  },
  startButton: {
    backgroundColor: '#FFD700', // Yellow color
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 300,
  },
  buttonText: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
