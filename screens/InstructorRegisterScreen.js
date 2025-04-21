import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Image } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useNavigation } from '@react-navigation/native';
import { auth, database } from '../firebaseConfig';
import { ref, set } from 'firebase/database';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

export default function InstructorRegisterScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [InstructorIDno, setInstructorIDno] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !InstructorIDno || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields must be filled out.');
      return;
    }

    if (password.length < 8 || !/\d/.test(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters long and include at least one number.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const instructorData = {
        firstName,
        lastName,
        InstructorIDno,
        email,
        password,
      };

      await set(ref(database, `instructors/${InstructorIDno}`), instructorData);

      // Send email verification
      await sendEmailVerification(user);

      // Reset form fields
      setFirstName('');
      setLastName('');
      setInstructorIDno('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Show success message and navigate to email verification
      Alert.alert('Registration Successful', 'Your account has been created successfully. Please verify your email to continue.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('EmailVerificationScreen', { email: email })
        }
      ]);
      
    } catch (error) {
      console.error('Error registering instructor:', error);
      Alert.alert('Error', 'Failed to register. Your email is already used! Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>REGISTER ACCOUNT</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>First name:</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
            placeholderTextColor="#a0a0a0"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last name:</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
            placeholderTextColor="#a0a0a0"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Instructor ID no.:</Text>
          <TextInput
            style={styles.input}
            value={InstructorIDno}
            onChangeText={setInstructorIDno}
            placeholder="Enter ID number"
            placeholderTextColor="#a0a0a0"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
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
            placeholder="Enter password"
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
            placeholder="Confirm password"
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
  formContainer: {
    backgroundColor: '#4C8C4A', 
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#C6EDAF',
    borderRadius: 5,
    padding: 8,
    color: 'black',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    bottom: 15,
  },
  checkboxLabel: {
    color: 'white',
    right: 295,
    marginBottom: 3,
  },
  registerButton: {
    backgroundColor: '#FFD700',
    width: 160,
    height: 50,
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    bottom: 30,
  },
  registerButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  CDMlogo: {
    width: 430,
    height: 430,
    bottom: 400,
    left: 175, 
    opacity: 0.1,  
  },
});