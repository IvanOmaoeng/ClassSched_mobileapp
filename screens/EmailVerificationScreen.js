import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmailVerificationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email || '';
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateAndStoreCode();
  }, []);

  const generateAndStoreCode = async () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    await AsyncStorage.setItem('verificationCode', newCode);
    
    // Show the code in an alert (for development/testing)
    // In production, this would be sent via email
    Alert.alert(
      'Verification Code (Development)',
      `Your verification code is: ${newCode}\n\nIn production, this would be sent to your email.`
    );
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    try {
      const storedCode = await AsyncStorage.getItem('verificationCode');
      
      if (verificationCode === storedCode) {
        await AsyncStorage.setItem(`verified_${email}`, 'true');
        Alert.alert('Success', 'Email verified successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('InstructorLogin')
          }
        ]);
      } else {
        Alert.alert('Error', 'Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    generateAndStoreCode();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Email Verification</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.emailDisplay}>{email}</Text>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Please enter the 6-digit verification code that has been generated for your email address.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Verification Code:</Text>
          <TextInput
            style={styles.input}
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="Enter 6-digit code"
            placeholderTextColor="#a0a0a0"
            keyboardType="numeric"
            maxLength={6}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.disabledButton]} 
          onPress={handleVerifyCode}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Verify Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.resendButton} 
          onPress={handleResendCode}
          disabled={isLoading}
        >
          <Text style={[styles.resendButtonText, isLoading && styles.disabledText]}>
            {isLoading ? 'Processing...' : 'Resend Code'}
          </Text>
        </TouchableOpacity>
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
  messageContainer: {
    marginBottom: 20,
  },
  message: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
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
  emailDisplay: {
    backgroundColor: '#C6EDAF',
    borderRadius: 5,
    padding: 8,
    color: 'black',
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#FFD700',
    width: 160,
    height: 50,
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  resendButtonText: {
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});