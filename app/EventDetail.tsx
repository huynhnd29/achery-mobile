import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEvent } from "./eventContext";

const EventDetail = () => {
  const { eventName } = useEvent();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{eventName}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Cự ly:</Text>
          <Text style={styles.value}>60m</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ngày thi đấu:</Text>
          <Text style={styles.value}>25/10/2024</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sân thi đấu:</Text>
          <Text style={styles.value}>Sân vận động Quốc gia</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Target:</Text>
          <Text style={styles.value}>1</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button_event}
        onPress={() => {
          router.push({
            pathname: "/ListPlayers",
          });
        }}
      >
        <Text style={styles.label_event}>Xem danh sách thí sinh</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    width: "100%",
    backgroundColor: "#f7f7f7",
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 5,
    paddingBottom: 15,
    paddingLeft: 20,
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  value: {
    fontSize: 18,
    flex: 1,
    textAlign: "left",
  },
  button_event: {
    backgroundColor: "#e3f8ff",
    padding: 14,
    margin: 10,
    borderRadius: 10,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
    alignSelf: "center",
    marginBottom: 30,
  },
  label_event: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});

export default EventDetail;
