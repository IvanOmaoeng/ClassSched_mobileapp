import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useNavigation } from '@react-navigation/native';
import { ref, get } from 'firebase/database';
import { database } from '../firebaseConfig'; 

export default function StudentLoginScreen() {
  const navigation = useNavigation();
  const [studentIDno, setStudentIDno] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const studentRef = ref(database, `students/${studentIDno}`);
      const snapshot = await get(studentRef);
  
      if (snapshot.exists()) {
        const studentData = snapshot.val();
        if (studentData.password === password) {
          setLoading(false);
          navigation.navigate('MainScreen', {userType: 'student',
            screen: 'Rooms',
            userId: studentIDno,
            userType: 'student',
            institute: studentData.institute,
            userData: studentData,
          });
        } else {
          setLoading(false);
          Alert.alert("Error", "Incorrect password, please try again.");
        }
      } else {
        setLoading(false);
        Alert.alert("Error", "Student ID not found. Please check your ID or register.");
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoading(false);
      Alert.alert("Error", "Failed to login. Please try again later.");
    }
  };

  const navigateToStudentRegistration = () => {
    navigation.navigate('StudentRegister');
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
        <Text style={styles.title}>STUDENT LOGIN</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Student ID no. :</Text>
          <TextInput
            style={styles.input}
            value={studentIDno}
            onChangeText={setStudentIDno}
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

        <TouchableOpacity onPress={navigateToStudentRegistration}>
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
    paddingVertical: 20,
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
    marginTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    marginBottom: 5,
    fontSize: 15,
  },
  input: {
    backgroundColor: '#C6EDAF',
    borderRadius: 5,
    padding: 10,
    color: 'black',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  showPasswordText: {
    color: 'white',
    right:295,
  },
  loginButton: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
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