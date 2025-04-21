import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { firebase } from '../firebaseConfig'; // Make sure this path is correct for your project

const ManageProfileScreen = ({ route }) => {
  const { userId, userType } = route.params; // Assuming userId and userType are passed as params
  const [userData, setUserData] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // For toggling edit mode

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userRef;
        if (userType === 'student') {
          userRef = firebase.database().ref('students/' + userId); // Assuming 'students' node for student data
        } else if (userType === 'instructor') {
          userRef = firebase.database().ref('instructors/' + userId); // Assuming 'instructors' node for instructor data
        }

        const snapshot = await userRef.once('value');
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          setEditableData({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            studentNo: data.studentNo,
            instructorIDno: data.instructorIDno,
          });
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, userType]);

  const renderUserIdField = () => (
    <View style={styles.profileField}>
      <Text style={styles.fieldLabel}>
        {userType === 'student' ? 'Student No:' : 'Instructor ID:'}
      </Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={userType === 'student' ? editableData.studentNo : editableData.instructorIDno}
          onChangeText={(text) =>
            setEditableData(prev => ({
              ...prev,
              [userType === 'student' ? 'studentNo' : 'instructorIDno']: text,
            }))
          }
        />
      ) : (
        <Text style={styles.fieldValue}>
          {userType === 'student' ? userData?.studentNo : userData?.instructorIDno}
        </Text>
      )}
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Profile</Text>
      <View style={styles.profileField}>
        <Text style={styles.fieldLabel}>First Name:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editableData.firstName}
            onChangeText={(text) => setEditableData(prev => ({ ...prev, firstName: text }))}
          />
        ) : (
          <Text style={styles.fieldValue}>{userData?.firstName}</Text>
        )}
      </View>

      <View style={styles.profileField}>
        <Text style={styles.fieldLabel}>Last Name:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editableData.lastName}
            onChangeText={(text) => setEditableData(prev => ({ ...prev, lastName: text }))}
          />
        ) : (
          <Text style={styles.fieldValue}>{userData?.lastName}</Text>
        )}
      </View>

      <View style={styles.profileField}>
        <Text style={styles.fieldLabel}>Email:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editableData.email}
            onChangeText={(text) => setEditableData(prev => ({ ...prev, email: text }))}
          />
        ) : (
          <Text style={styles.fieldValue}>{userData?.email}</Text>
        )}
      </View>

      {renderUserIdField()}

      <Button
        title={isEditing ? 'Save Changes' : 'Edit Profile'}
        onPress={() => {
          if (isEditing) {
            // Handle saving the changes to Firebase
            const userRef = firebase.database().ref(userType + 's/' + userId); // Determine the correct path
            userRef.update(editableData)
              .then(() => alert('Profile updated!'))
              .catch((error) => console.error('Error updating profile:', error));
          }
          setIsEditing(!isEditing);
        }}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileField: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fieldValue: {
    fontSize: 16,
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
};

export default ManageProfileScreen;
