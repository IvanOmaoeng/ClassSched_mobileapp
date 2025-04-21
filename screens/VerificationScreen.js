import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert, ActivityIndicator } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, get, set } from 'firebase/database';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function VerificationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { InstructorIDno, email, code, userData } = route.params;
  
  const [enteredCode, setEnteredCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(90);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputRefs = useRef([]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleCodeChange = (text, index) => {
    const newCode = [...enteredCode];
    newCode[index] = text;
    setEnteredCode(newCode);
    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !enteredCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const clearInputs = () => {
    setEnteredCode(['', '', '', '', '', '']);
    inputRefs.current[0].focus();
  };

  const handleVerify = async () => {
    setLoading(true);
    
    const enteredCodeString = enteredCode.join('');
    if (enteredCodeString === code) {
      try {
        const instructorRef = ref(database, `instructors/${InstructorIDno}`);
        const snapshot = await get(instructorRef);
        
        if (snapshot.exists()) {
          const instructorData = snapshot.val();
          
          if (instructorData.email === email) {
            setLoading(false);
            navigation.navigate('InstructorMainScreen', { userData: instructorData });
          } else {
            setLoading(false);
            Alert.alert("Error", "The email does not match. Please check your email.");
          }
        } else {
          setLoading(false);
          Alert.alert("Error", "Instructor ID not found.");
        }
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", "An error occurred during verification. Please try again.");
      }
    } else {
      setLoading(false);
      Alert.alert("Error", "Invalid verification code. Please try again.", [
        { text: "OK", onPress: () => clearInputs() }
      ]);
    }
  };

  const resendCode = () => {
    if (timer > 0) {
      Alert.alert('Please wait', `You can request a new code in ${timer} seconds`);
      return;
    }
    // Implement code resend logic here
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify Your Account</Text>
        <Text style={styles.subtitle}>
          We emailed you the six-digit code to {email}{'\n'}
          Enter the code below to confirm your email address.
        </Text>

        <View style={styles.codeContainer}>
          {Array.from({ length: 6 }).map((_, index) => (
            <TextInput
              key={index}
              ref={ref => inputRefs.current[index] = ref}
              style={styles.codeInput}
              value={enteredCode[index]}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>VERIFY</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={resendCode}
          disabled={timer > 0}
        >
          <Text style={styles.resendText}>
            {timer > 0 ? `Resend code in ${timer}s` : "If you didn't receive a code !! RESEND"}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#49873E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#C6EDAF',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 30,
  },
  codeInput: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  verifyButton: {
    backgroundColor: 'green',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resendButton: {
    padding: 10,
  },
  resendText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});