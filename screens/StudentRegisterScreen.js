import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, Alert } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useNavigation } from '@react-navigation/native';
import { auth, database } from '../firebaseConfig'; 
import { ref, set } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function StudentRegisterScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentNo, setStudentNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !studentNo || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields must be filled out');
      return;
    }
    if (password.length < 8 || !/\d/.test(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters long and include at least one number.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const studentData = {
        firstName,
        lastName,
        studentNo,
        email,
        password
      };

      const studentRef = ref(database, `students/${studentNo}`);
      await set(studentRef, studentData);

      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.navigate('StudentLogin') }
      ]);

      setFirstName('');
      setLastName('');
      setStudentNo('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error registering student:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          'Registration Error',
          'This email is already registered. Please use a different email address or try logging in.',
          [
            { text: 'OK', onPress: () => setEmail('') },
            { text: 'Go to Login', onPress: () => navigation.navigate('StudentLogin') }
          ]
        );
      } else {
        Alert.alert('Registration Error', 'Failed to register. Please try again later.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>REGISTER ACCOUNT</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>First name:</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor="#a0a0a0"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last name:</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor="#a0a0a0"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Student no.:</Text>
          <TextInput
            style={styles.input}
            value={studentNo}
            onChangeText={setStudentNo}
            placeholder="Student no."
            placeholderTextColor="#a0a0a0"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#a0a0a0"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#a0a0a0"
            secureTextEntry={!showPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password:</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor="#a0a0a0"
            secureTextEntry={!showPassword}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            size={20}
            fillColor='green'
            unFillColor='#C6EDAF'
            iconStyle={{ borderColor: '#C6EDAF' }}
            isChecked={showPassword}
            onPress={() => setShowPassword(!showPassword)}
          />
          <Text style={styles.checkboxLabel}>Show Password</Text>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/Colegio-de-Montalban.webp')}
            style={styles.CDMlogo}
            resizeMode="contain"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C8C4A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logo: {
    width: 60, 
    height: 50,
    right: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    top:80,
  },
  inputContainer: {
    marginTop: 10,
    top: 70,
  },
  label: {
    color: 'white',
    fontSize: 15,
    marginBottom: 5,
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
    marginVertical: 10,
    top: 65,
  },
  checkboxLabel: {
    color: 'white',
    marginLeft: 10,
    right: 300, 
  },
  registerButton: {
    backgroundColor: '#FFD700',
    width: 160,
    height: 50,
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    top: 45,
  },
  registerButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  CDMlogo: {
    width: 450,
    height: 450,
    bottom:300,
    left:120, 
    opacity:0.1,  
  },
});