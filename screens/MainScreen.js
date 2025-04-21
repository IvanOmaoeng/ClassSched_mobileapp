import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Dimensions, Alert, Modal, TextInput, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = 250;

export default function MainScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { userType } = route.params;
  const [userTypeDisplay, setUserTypeDisplay] = useState(userType);
  
  const [profileImage, setProfileImage] = useState(require('../assets/images/Profile-Icon.png'));

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Change Profile Picture",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: takePhoto
        },
        {
          text: "Choose from Gallery",
          onPress: pickImage
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  const [userData, setUserData] = useState(route.params?.userData || {
    firstName: '',
    lastName: '',
    userType: '',
    instituteName: '',
    email: '',
    id: '',
    studentNo: ''
  });

  const [editableData, setEditableData] = useState({ ...userData });

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(-300)).current;

  const [roomsExpanded, setRoomsExpanded] = useState(false);
  const roomsSlideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
        setUserTypeDisplay(JSON.parse(storedUserData).userType);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async (data) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
    Animated.timing(sidebarAnimation, {
      toValue: sidebarVisible ? -SIDEBAR_WIDTH : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleRooms = () => {
    setRoomsExpanded(!roomsExpanded);
    Animated.timing(roomsSlideAnimation, {
      toValue: roomsExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const roomsSlideInterpolate = roomsSlideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80], // Adjust this value based on your design
  });

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            await AsyncStorage.removeItem('userData');
            navigation.navigate('Home');
          }
        },
      ]
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditableData({ ...userData });
  };

  const handleSaveProfile = async () => {
    setUserData(editableData);
    setIsEditing(false);
    await saveUserData(editableData);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditableData({ ...userData });
    setIsEditing(false);
  };


  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.menuIcon} onPress={toggleSidebar}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>

        <Image source={require('../assets/images/waving-287_256.gif')} style={styles.profileImage} />
      </View>

        
      <View style={styles.greetingSection}>
        <Text style={styles.MorningText}>{getGreeting()}, {userData.firstName || 'User'} </Text>
        <Text style={styles.welcomeText}>Welcome! </Text>

        <Image source={require('../assets/images/dance-funny-dance.gif')} style={styles.profileImage1} />

      </View>

      <Image source={require('../assets/images/down-bg.png')} style={styles.BgImageDown} />

      <Animated.View style={[styles.sidebar, { left: sidebarAnimation }]}>
        <TouchableOpacity style={styles.closeIcon} onPress={toggleSidebar}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
        
        <View style={styles.profileSection}>
          <Image source={profileImage} style={styles.sidebarProfileImage} />
          <TouchableOpacity 
            style={styles.chooseImageButton} 
            onPress={showImageOptions}
          >
            <Text style={styles.chooseImageText}>Choose Image profile</Text>
          </TouchableOpacity>
          <Text style={styles.userName}>{userData.firstName || 'User'} {userData.lastName || ''}</Text>
          <Text style={styles.userType}>
            <Text>"{userTypeDisplay}"</Text>
          </Text>
          <TouchableOpacity 
            style={styles.manageProfileButton} 
            onPress={() => setProfileModalVisible(true)}
          >
            <Text style={styles.manageProfileText}>Manage Profile</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sidebarItem} onPress={toggleSidebar}>
          <MaterialIcons name="home" size={24} color="white" style={styles.icon} />
          <Text style={styles.HomeText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sidebarItem} onPress={toggleRooms}>
          <MaterialIcons name="meeting-room" size={24} color="white" style={styles.icon} />
          <Text style={styles.sidebarText}>Rooms</Text>
        </TouchableOpacity>


        <Animated.View style={[styles.roomsSubMenu, { height: roomsSlideInterpolate }]}>
          <TouchableOpacity 
            style={styles.roomsSubMenuItem} 
            onPress={() => navigation.navigate('NewBuildingScreen')}
          >
            <Text style={styles.roomsSubMenuText}>    New Blg</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.roomsSubMenuItem} 
            onPress={() => navigation.navigate('OldBuildingScreen')}
          >
            <Text style={styles.roomsSubMenuText}>    Old Blg</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('InstructorLogs')}>
          <MaterialIcons name="login" size={24} color="white" style={styles.icon} />
          <Text style={styles.sidebarText}>Logs</Text>
        </TouchableOpacity>
        


        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => {
          setProfileModalVisible(false);
          setIsEditing(false);
          setEditableData({ ...userData });
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => {
                setProfileModalVisible(false);
                setIsEditing(false);
                setEditableData({ ...userData });
              }}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>User Profile</Text>

            <View style={styles.profileField}>
              <Text style={styles.fieldLabel}>Email:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editableData.email}
                  onChangeText={(text) => setEditableData(prev => ({ ...prev, email: text }))}
                />
              ) : (
                <Text style={styles.fieldValue}>{userData.email}</Text>
              )}
            </View>

            <View style={styles.profileField}>
              <Text style={styles.fieldLabel}>First Name:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editableData.firstName}
                  onChangeText={(text) => setEditableData(prev => ({ ...prev, firstName: text }))}
                />
              ) : (
                <Text style={styles.fieldValue}>{userData.firstName}</Text>
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
                <Text style={styles.fieldValue}>{userData.lastName}</Text>
              )}
            </View>

            <View style={styles.profileField}>
              <Text style={styles.fieldLabel}>ID NO:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editableData.studentNo}
                  onChangeText={(text) => setEditableData(prev => ({ ...prev, studentNo: text }))}
                />
              ) : (
                <Text style={styles.fieldValue}>{userData.studentNo}</Text>
              )}
            </View>

            <View style={styles.profileField}>
              <Text style={styles.fieldLabel}>Password:</Text>
              <View style={styles.passwordContainer}>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={editableData.password}
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => setEditableData(prev => ({ ...prev, password: text }))}
                  />
                ) : (
                  <Text style={styles.fieldValue}>{showPassword ? userData.password : '••••••••'}</Text>
                )}
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {isEditing ? (
              <View style={styles.editButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.editProfileButton, styles.saveButton]}
                  onPress={handleSaveProfile}
                >
                  <MaterialIcons name="save" size={20} color="white" style={styles.editIcon} />
                  <Text style={styles.editProfileText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.editProfileButton, styles.cancelButton]}
                  onPress={handleCancelEdit}
                >
                  <MaterialIcons name="cancel" size={20} color="white" style={styles.editIcon} />
                  <Text style={styles.editProfileText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={handleEditProfile}
              >
                <MaterialIcons name="edit" size={20} color="white" style={styles.editIcon} />
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#49873E',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#49873E',
  },
  menuIcon: {
    padding: 10,
    bottom: 30,
    right: 10,
  },
  menuText: {
    color: 'white',
    fontSize: 30,
  },
  greetingSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    bottom: 140,
  },
  MorningText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginVertical: 5,
    top:40,
  },
  welcomeText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
    top: 30,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
    top: 90,
    right: 70,
  },
  profileImage1: {
    width: 90,
    height: 150,
    top: 120,
    right: 100,
  },
  BgImageDown: {
    width: '100%',
    height: '30%',
    position: 'absolute',
    bottom: 0,
    opacity: 0.9,
    resizeMode: 'cover',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#7ABA78',
    padding: 20,
    zIndex: 10,
    elevation: 10,
    top: 30,
  },
  closeIcon: {
    position: 'absolute',
    top: 25,
    right: 25,
    zIndex: 1,
  },
  closeText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    top: -10,
  },
  chooseImageButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: -20,
  },
  chooseImageText: {
    fontSize: 10,
    color: 'white',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  HomeText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 20,
  },
  sidebarProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 10,
    bottom: 20,
  },
  userName: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  userType: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 20,
    top: 20,
  },
  icon: {
    marginRight: 10,
  },
  sidebarText: {
    fontSize: 18,
    color: 'white',
  },
  logoutButton: {
    backgroundColor: '#FA7070',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    top: 250,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  manageProfileButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10,
  },
  manageProfileText: {
    fontSize: 14,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalCloseButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  modalCloseText: {
    fontSize: 24,
    color: '#666',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#49873E',
  },
  profileField: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editProfileButton: {
    backgroundColor: '#49873E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    flex: 1,
    marginLeft: 10,
  },
  editProfileText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  editIcon: {
    marginRight: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    padding: 10,
    left: 170,
    opacity: 0.1,
  },
  roomsSubMenu: {
    overflow: 'hidden',
    paddingLeft: 20,
  },
  roomsSubMenuItem: {
    paddingVertical: 10,
    
  },
  roomsSubMenuText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});