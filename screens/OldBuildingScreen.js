import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, update } from 'firebase/database';


const firebaseConfig = {
    apiKey: "AIzaSyA6RfaxbGGgkl6WY3EFx4k3VYVNW4RXW6Y",
    authDomain: "class-s-database.firebaseapp.com",
    databaseURL: "https://class-s-database-default-rtdb.firebaseio.com",
    projectId: "class-s-database",
    storageBucket: "class-s-database.appspot.com",
    messagingSenderId: "222242197245",
    appId: "1:222242197245:web:26f4b4d9b45c4b271a3894",
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const OldBuildingFloors = [
  { name: '1st Floor', rooms: Array.from({ length: 10 }, (_, i) => `${i + 101}`) },
  { name: '2nd Floor', rooms: Array.from({ length: 10 }, (_, i) => `${i + 201}`) },
  { name: '3rd Floor', rooms: Array.from({ length: 10 }, (_, i) => `${i + 301}`) },
];

const BUILDING_NAME = "Old";

export default function OldBuildingScreen() {
  const [selectedFloor, setSelectedFloor] = useState(OldBuildingFloors[0]);
  const [roomsInfo, setRoomsInfo] = useState({});
  const [rfidCards, setRfidCards] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const roomsRef = ref(database, 'OB_Rooms_Information');
    const unsubscribeRooms = onValue(roomsRef, (snapshot) => {
      if (snapshot.exists()) {
        setRoomsInfo(snapshot.val());
      }
    });

    const rfidRef = ref(database, 'RFID_Cards');
    const unsubscribeRfid = onValue(rfidRef, (snapshot) => {
      if (snapshot.exists()) {
        setRfidCards(snapshot.val());
      }
      setLoading(false);
    });

    return () => {
      unsubscribeRooms();
      unsubscribeRfid();
    };
  }, []);

  const handleRoomPress = (room) => {
    const roomData = roomsInfo[room];
    setSelectedRoom({
      roomNumber: room,
      status: getRoomStatus(room),
      ...roomData
    });
    setModalVisible(true);
  };

  const clearRoomData = (room) => {
    const roomRef = ref(database, `OB_Rooms_Information/${room}`);
    update(roomRef, {
      Intructor: 'N/A',
      Section: 'N/A',
      Email: 'N/A',
      Date: 'N/A',
      Time: 'N/A',
      TimeIn: null,
      TimeOut: null,
    }).then(() => {
      console.log(`Room ${room} data cleared.`);
    }).catch((error) => {
      console.error(`Failed to clear data for room ${room}:`, error);
    });
  };

  const getRoomStatus = (room) => {
    if (room === '105') {
      const rfidData = rfidCards['14:d3:95:a7'];
      if (rfidData?.TimeOut) {
        clearRoomData('105'); 
        return 'Available';
      } else if (rfidData?.TimeIn && !rfidData?.TimeOut) {
        return 'Occupied';
      }
    }
    return 'Pending';
  };

  const getRoomColor = (room) => {
    if (room === '105') {
      const rfidData = rfidCards['14:d3:95:a7'];
      if (rfidData?.TimeOut) {
        return '#4CAF50'; 
      } else if (rfidData?.TimeIn && !rfidData?.TimeOut) {
        return 'red'; 
      }
    }
    return '#FFA500'; 
  };

  const renderRoom = (room) => (
    <TouchableOpacity
      key={room}
      style={[styles.roomButton, { backgroundColor: getRoomColor(room) }]}
      onPress={() => handleRoomPress(room)}
    >
      <Text style={styles.roomText}>{room}</Text>
      <Text style={styles.availabilityText}>
        {getRoomStatus(room)}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CLASSROOM SCHEDULE</Text>
      <Text style={styles.title2}>( {BUILDING_NAME} Building )</Text>

      <View style={styles.floorSelector}>
        {OldBuildingFloors.map((floor) => (
          <TouchableOpacity
            key={floor.name}
            style={[styles.floorButton, selectedFloor.name === floor.name && styles.selectedFloorButton]}
            onPress={() => setSelectedFloor(floor)}
          >
            <Text style={[styles.floorButtonText, selectedFloor.name === floor.name && styles.selectedFloorButtonText]}>
              {floor.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.roomsContainer}>
        {selectedFloor.rooms.map(renderRoom)}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{BUILDING_NAME} Building - Room {selectedRoom?.roomNumber}</Text>
            <Text style={styles.modalStatus}>
              Status: {selectedRoom?.status || 'Pending'}
            </Text>

            <Text style={styles.modalText}>
              Instructor: {selectedRoom?.Intructor || 'N/A'}
            </Text>
            <Text style={styles.modalText}>
              Ins/Sec: {selectedRoom?.Section || 'N/A'}
            </Text>
            <Text style={styles.modalText}>
              Email: {selectedRoom?.Email || 'N/A'}
            </Text>
            <Text style={styles.modalText}>
              Date: {selectedRoom?.Date || 'N/A'}
            </Text>
            <Text style={styles.modalText}>
              Time: {selectedRoom?.Time || 'N/A'}
            </Text>

            {selectedRoom?.status !== 'Occupied' && (
              <TouchableOpacity
                style={[styles.modalButton, styles.requestButton]}
                onPress={() => console.log('Requesting room', selectedRoom.roomNumber)}
              >
                <Text style={styles.buttonText}>Request</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.legendContainer}>
        <View style={styles.legendRow}>
          <View style={[styles.legendBox, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Available</Text>

          <View style={[styles.legendBox, { backgroundColor: '#FFA500' }]} />
          <Text style={styles.legendText}>Pending</Text>

          <View style={[styles.legendBox, { backgroundColor: 'red' }]} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#49873E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f0f4f8',
    textAlign: 'center',
    marginVertical: 16,
    marginTop: 30,
  },
  title2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f0f4f8',
    textAlign: 'center',
    marginVertical: 16,
    marginBottom: 20,
    bottom: 20,
  },
  floorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  floorButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  selectedFloorButton: {
    backgroundColor: '#3498db',
  },
  floorButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  selectedFloorButtonText: {
    color: '#ffffff',
  },
  roomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  roomButton: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roomText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  availabilityText: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 4,
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
    color: 'green',
  },
  modalStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#3498db',
  },
  modalText: {
    fontSize: 15,
    marginBottom: 10,
    fontWeight: '550',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#f39c12',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  legendContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  legendText: {
    fontSize: 14,
    color: 'black',
    marginRight: 15,
  },
});
