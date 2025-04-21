import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { DataTable, Text } from "react-native-paper";
import { database } from "../firebaseConfig"; // Import your Firebase config
import { ref, get } from "firebase/database"; // Firebase Database functions

const InstructorLogs = () => {
  const [logs, setLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data from Firebase
  const fetchLogs = async () => {
    setRefreshing(true);
    try {
      const snapshot = await get(ref(database, "RFID_Cards"));
      const data = snapshot.val();

      // Convert the data into an array
      const logsArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setLogs(logsArray);
    } catch (error) {
      console.error("Error fetching logs: ", error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLogs(); // Fetch logs on component mount
  }, []);

  // Function to determine row color based on institute
  const getRowColor = (institute) => {
    // Directly match the institutes to their respective color codes based on the legend
    const instituteColors = {
      ICS: "#ffb347", // Orange
      ITE: "#57b9ff", // Blue
      IBE: "#ffed29", // Yellow
    };

    // Default color for unknown institutes
    return instituteColors[institute] || "#E0E0E0"; // Gray for unknown institutes
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Instructor Attendance Logs</Text>

      {/* Scrollable Table */}
      <ScrollView
        horizontal // Enable horizontal scrolling for the table
        style={styles.horizontalScroll}
        contentContainerStyle={{ flexDirection: "row" }}
      >
        <ScrollView
          style={styles.tableContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchLogs} />}
        >
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title style={styles.column}>UID</DataTable.Title>
              <DataTable.Title style={styles.column}>Name</DataTable.Title>
              <DataTable.Title style={styles.column}>Institute</DataTable.Title>
              <DataTable.Title style={styles.column}>Building</DataTable.Title>
              <DataTable.Title style={styles.column}>Room</DataTable.Title>
              <DataTable.Title style={styles.column}>Time In</DataTable.Title>
              <DataTable.Title style={styles.column}>Time Out</DataTable.Title>
            </DataTable.Header>

            {logs.map((log, index) => (
              <DataTable.Row key={index} style={[styles.row, { backgroundColor: getRowColor(log.Institute) }]}>
                <DataTable.Cell style={styles.cell}>
                  <Text style={styles.cellText}>{log.UID}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                  <Text style={styles.cellText}>{log.Name}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                  <Text style={styles.cellText}>{log.Institute}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                  <Text style={styles.cellText}>{log.Building}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                  <Text style={styles.cellText}>{log.Room}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                  <Text style={styles.cellText}>{log.TimeIn}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                  <Text style={styles.cellText}>{log.TimeOut}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>
      </ScrollView>

      {/* Legend Box */}
      <View style={styles.legendContainer}>
        <View style={styles.legendRow}>
          <View style={[styles.legendBox, { backgroundColor: "#ffb347" }]} />
          <Text style={styles.legendText}>ICS</Text>
          <View style={[styles.legendBox, { backgroundColor: "#57b9ff" }]} />
          <Text style={styles.legendText}>ITE</Text>
          <View style={[styles.legendBox, { backgroundColor: "#ffed29" }]} />
          <Text style={styles.legendText}>IBE</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#49873E",
    padding: 10,
    marginTop: 35,
  },
  header: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "white",
  },
  horizontalScroll: {
    flex: 1,
    marginBottom: 20,
  },
  tableContainer: {
    flexGrow: 1,
  },
  tableHeader: {
    backgroundColor: "#C8E6C9",
    marginTop: 30,
  },
  row: {
    minWidth: "100%",
  },
  column: {
    minWidth: 120,
    justifyContent: "center",
  },
  cell: {
    minWidth: 120,
    justifyContent: "center",
  },
  cellText: {
    flexWrap: "wrap",
    textAlign: "center",
    fontWeight: "bold",
  },
  legendContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
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
    color: "black",
    marginRight: 15,
  },
});

export default InstructorLogs;
