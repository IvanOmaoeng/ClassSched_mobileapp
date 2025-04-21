import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput, Alert } from 'react-native';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { useRoute } from '@react-navigation/native';

export default function RoomScreen() {
  const route = useRoute();
  const userType = route.params?.userType || ''; 

  const [roomInformation, setRoomInformation] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [timer, setTimer] = useState(300);
  const [isRequestingNewRoom, setIsRequestingNewRoom] = useState(false);
  const [date, setDate] = useState('');
  const [instructor, setInstructor] = useState('');
  const [email, setEmail] = useState('');
  const [section, setSection] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const roomsRef = ref(db, 'Rooms_Information');

    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      setRoomInformation(data || {});
    });
  }, []);

  useEffect(() => {
    let interval;
    if (requestSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setRequestSent(false);
      setTimer(300);
    }
    return () => clearInterval(interval);
  }, [requestSent, timer]);

  const getCurrentDateInPhilippines = () => {
    const now = new Date();
    const philippinesOffset = 8 * 60; // UTC+8
    const localDate = new Date(now.getTime() + philippinesOffset * 60 * 1000);
    const year = localDate.getUTCFullYear();
    const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(localDate.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleRoomPress = (roomNumber) => {
    const roomData = roomInformation[roomNumber];
    if (roomData) {
      setSelectedRoom({ roomNumber, ...roomData });
      setIsRequestingNewRoom(false);
      setModalVisible(true);
    } else {
      if (userType === 'student') {
        Alert.alert('No Schedule', 'No schedule on this room');
      } else {
        setSelectedRoom({ roomNumber });
        setIsRequestingNewRoom(true);
        setDate(getCurrentDateInPhilippines());
        setModalVisible(true);
      }
    }
  };

  const handleRequestOccupiedRoom = async () => {
    if (!selectedRoom) return;

    try {
      const db = getDatabase();
      const requestingRoomRef = ref(db, 'Requesting_Room');
      const newRequestRef = push(requestingRoomRef);
      await set(newRequestRef, {
        roomNumber: selectedRoom.roomNumber,
        timestamp: new Date().toISOString(),
        details: selectedRoom,
        status: 'pending'
      });
      setRequestSent(true);
      setModalVisible(false);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const handleRequestAvailableRoom = async () => {
    if (!selectedRoom || !instructor || !email || !section || !time) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const db = getDatabase();
      const requestingClassroomRef = ref(db, 'Requesting_Classroom/' + selectedRoom.roomNumber);
      const newRequestRef = push(requestingClassroomRef);
      await set(newRequestRef, {
        roomNumber: selectedRoom.roomNumber,
        date,
        instructor,
        email,
        section,
        time,
        timestamp: new Date().toISOString(),
        status: 'pending'
      });
      setDate('');
      setInstructor('');
      setEmail('');
      setSection('');
      setTime('');
      setRequestSent(true);
      setModalVisible(false);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const renderRooms = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => {
      const roomNumber = (start + i).toString();
      const isOccupied = !!roomInformation[roomNumber];
      
      return (
        <TouchableOpacity
          key={roomNumber}
          style={[styles.roomButton, { backgroundColor: isOccupied ? '#FF0000' : '#CDDC39' }]}
          onPress={() => handleRoomPress(roomNumber)}
        >
          <Text style={styles.roomText}>{roomNumber}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        CLASSROOM SCHEDULE - <Text style={styles.userType}> "{userType}" </Text>
      </Text>
      <ScrollView style={styles.content}>
        <View style={styles.columnsContainer}>
          <View style={styles.column}>
            <Text style={styles.columnHeader}>Old</Text>
            <View style={styles.roomsGrid}>
              {renderRooms(101, 110)}
              <View style={styles.roomsGrid1}>
                {renderRooms(201, 210)}
              </View>
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.columnHeader}>New</Text>
            <View style={styles.roomsGrid}>
              {renderRooms(301, 310)}
              <View style={styles.roomsGrid1}>
                {renderRooms(401, 410)}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Room {selectedRoom?.roomNumber}</Text>

            {isRequestingNewRoom ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date: {date}</Text>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Instructor: enter instructor name"
                    value={instructor ? `Instructor: ${instructor}` : ""}
                    onChangeText={(text) => setInstructor(text.replace("Instructor: ", ""))}
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Email: enter email"
                    value={email ? `Email: ${email}` : ""}
                    onChangeText={(text) => setEmail(text.replace("Email: ", ""))}
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Section: enter section"
                    value={section ? `Section: ${section}` : ""}
                    onChangeText={(text) => setSection(text.replace("Section: ", ""))}
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Time: enter time"
                    value={time ? `Time: ${time}` : ""}
                    onChangeText={(text) => setTime(text.replace("Time: ", ""))}
                    style={styles.input}
                  />
                </View>

                {userType === "instructor" && (
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.requestButton]}
                      onPress={handleRequestAvailableRoom}
                    >
                      <Text style={styles.submitbutton}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalText}>Date: {selectedRoom?.Date || ''}</Text>
                <Text style={styles.modalText}>Instructor: {selectedRoom?.Intructor || ''}</Text>
                <Text style={styles.modalText}>Email: {selectedRoom?.Email || ''}</Text>
                <Text style={styles.modalText}>Section: {selectedRoom?.Section || ''}</Text>
                <Text style={styles.modalText}>Time: {selectedRoom?.Time || ''}</Text>
        

                {userType === "instructor" && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.requestButton]}
                    onPress={handleRequestOccupiedRoom}
                    disabled={requestSent}
                  >
                    <Text style={styles.buttonText}>{requestSent ? "Request Sent" : "Request"}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
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
    padding: 16,
    backgroundColor: '#4CAF50',
  },
  header: {
    backgroundColor: 'green',
    fontSize: 25,
    fontWeight: 'bold',
    fontStyle:"italic",
    marginBottom: 20,
    marginTop: 40,
   // textDecorationLine: 'underline',
    right: 10,
    color: 'white',
    padding: 10,
    alignItems: 'center',
  },
  userType: {
    fontSize: 20,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 10,
  },
  column: {
    width: '50%',
  },
  columnHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roomsGrid1: {
    marginTop:20 ,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roomButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
  },
  roomText: {
    color: 'black',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'green',

  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'semi-bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    alignItems: 'center',
    margin: 0,
  },
  requestButton: {
    backgroundColor: '#4CAF50',
    marginTop: 10,
  },
  cancelButton: {
    marginTop:10,
    backgroundColor: '#FF0000',
  },
  submitbutton:{
    padding:0,
    paddingHorizontal:60,
    color: 'white',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
});
