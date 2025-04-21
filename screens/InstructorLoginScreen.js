import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useNavigation } from '@react-navigation/native';
import { ref, get } from 'firebase/database';
import { database } from '../firebaseConfig'; 

export default function InstructorLoginScreen() {
  const navigation = useNavigation();
  const [InstructorIDno, setInstructorIDno] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
        const instructorRef = ref(database, `instructors/${InstructorIDno}`);
        const snapshot = await get(instructorRef); 

        if (snapshot.exists()) {
            const instructorsData = snapshot.val();
            if (instructorsData.password === password) {
                setLoading(false);
                navigation.navigate('MainScreen', { userType: 'instructor', 
                  screen: 'Rooms',
                    userId: InstructorIDno,    
                    userType: 'instructor', 
                    institute: instructorsData.institute,
                    userData: instructorsData, 
                });
            } else {
                setLoading(false);
                Alert.alert("Error", "Incorrect password, please try again.");
            }
        } else {
            setLoading(false);
            Alert.alert("Error", "Instructor ID not found. Please check your ID or register.");
        }
    } catch (error) {
        console.error('Error during login:', error);
        setLoading(false);
        Alert.alert("Error", "Failed to login. Please try again later.");
    }
};

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setInstructorIDno('');
      setPassword('');
    });
    return unsubscribe;
  }, [navigation]);

  const navigateToInstructorRegistration = () => {
    navigation.navigate('InstructorRegister');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/Colegio-de-Montalban.webp')}
          style={styles.logo}
        />
        <Image
          source={require('../assets/images/ICS-old-icon.png')}
          style={styles.logo1}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>INSTRUCTOR LOGIN</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Instructor ID no. :</Text>
          <TextInput
            style={styles.input}
            value={InstructorIDno}
            onChangeText={setInstructorIDno}
            placeholder="Enter your ID number"
            placeholderTextColor="#a0a0a0"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#a0a0a0"
            secureTextEntry={!showPassword}
          />

          <View style={styles.checkboxContainer}>
            <BouncyCheckbox
              size={20}
              fillColor="green"
              unFillColor="#C6EDAF"
              iconStyle={{ borderColor: '#C6EDAF' }}
              isChecked={showPassword}
              onPress={() => setShowPassword(!showPassword)}
            />
            <Text style={styles.showPasswordText}>Show password</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.loginButtonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToInstructorRegistration}>
          <Text style={styles.registerText}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#49873E',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 70,
    height: 60,
    position: 'absolute',
    top: 40,
    left: 5,
  },
  logo1: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 40,
    right: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 70,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    marginTop: 10,
    fontSize: 15,
    top: 10,
  },
  input: {
    backgroundColor: '#C6EDAF',
    borderRadius: 5,
    padding: 10,
    color: 'black',
    top: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    top: 1,
  },
  showPasswordText: {
    color: 'white',
    textAlign: 'left',
    marginTop: 2,
    right: 295,
    bottom: 2,
  },
  loginButton: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 0,
  },
  loginButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    color: 'white',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 20,
    fontSize: 16,
  },
});
