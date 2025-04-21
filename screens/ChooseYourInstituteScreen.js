import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ChooseYourInstituteScreen() {
  const navigation = useNavigation();

  const handleInstituteSelection = (institute) => {
    navigation.navigate('InstructorLogin', { institute });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/Colegio-de-Montalban.webp')} style={styles.logo} />
        <Image source={require('../assets/images/ICS-old-icon.png')} style={styles.logo1} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Choose your Institute:</Text>

        <TouchableOpacity style={[styles.button, styles.icsButton]} onPress={() => handleInstituteSelection('ICS')}>
          <Image source={require('../assets/images/ICS-icon.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>ICS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.ibeButton]} onPress={() => handleInstituteSelection('IBE')}>
          <Image source={require('../assets/images/IBE-icon.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>IBE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.iteButton]} onPress={() => handleInstituteSelection('ITE')}>
          <Image source={require('../assets/images/ITE-icon.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>ITE</Text>
        </TouchableOpacity>
      </View>

      <Image source={require('../assets/images/down-bg.png')} style={styles.buildingImage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#49873E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    top: 40,
  },
  logo: {
    width: 55,
    height: 70,
  },
  logo1: {
    width: 58,
    height: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    bottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
    marginBottom: 50,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    padding: 15,
    borderRadius: 50,
    marginBottom: 30,
  },
  icsButton: {
    backgroundColor: '#FFA500',
  },
  ibeButton: {
    backgroundColor: '#FFD700',
  },
  iteButton: {
    backgroundColor: '#87CEEB',
  },
  buttonIcon: {
    width: 40,
    height: 40,
    marginRight: -10,
    right: 70,
  },
  buttonText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'black',
    right: 20,
  },
  buildingImage: {
    width: '100%',
    height: 200,
    position: 'absolute',
    bottom: 0,
    opacity: 0.7,
  },
});
