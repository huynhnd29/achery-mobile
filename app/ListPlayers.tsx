import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
interface ListPlayersProps {
  ArrayScoreNew: string[];
}
const ListPlayers: React.FC<ListPlayersProps> = ({ ArrayScoreNew }) => {
  const name = ["Nguyễn Văn A", "Nguyễn Văn B", "Nguyễn Văn C", "Nguyễn Văn D"];

  const [playerId, setPlayerId] = useState<number | null>(null);
  const toggleExpand = (id: number) => {
    setPlayerId(playerId === id ? null : id);
  };
  const handleClick = (playerName: string) => {
    router.push({
      pathname: "/TotalEnd/Player_center",
      params: { playerName },
    });
  };
  const [expandedPlayerId, setExpandedPlayerId] = useState<number | null>(null);
  return (
    <SafeAreaView>
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>Danh sách thí sinh</Text>
        </View>
        <View style={styles.lkt}>
          <Text style={styles.text1}>LTK 2024</Text>
          <Text style={{ paddingRight: 15 }}>Distance: 60m</Text>
        </View>
        <View>
          <TextInput
            label="Tìm kiếm"
            mode="outlined"
            style={styles.input}
            left={
              <TextInput.Icon
                icon={() => (
                  <AntDesign name="search1" size={24} color="black" />
                )}
              />
            }
          />
        </View>
        <View style={styles.list}>
          {name.map((playerName, index) => (
            <View key={index} style={styles.player}>
              <TouchableOpacity
                style={styles.view1list}
                onPress={() => {
                  toggleExpand(index);
                  handleClick(playerName);
                }}
              >
                <Text style={styles.title2}>{playerName}</Text>
              </TouchableOpacity>
              {expandedPlayerId === playerId && (
                <>
                  <View style={styles.cay}>
                    <View style={styles.view2list}>
                      <Text style={styles.columnHeader}>1</Text>
                      <Text style={styles.columnHeader}>2</Text>
                      <Text style={styles.columnHeader}>3</Text>
                      <Text style={styles.columnHeader}>4</Text>
                      <Text style={styles.columnHeader}>5</Text>
                      <Text style={styles.columnHeader}>6</Text>
                      <Text style={styles.endColumn}>end</Text>
                      <Text style={styles.totalColumn}>total</Text>
                    </View>
                  </View>
                  <View style={styles.cay2}>
                    <Text style={{ paddingRight: 20 }}>10</Text>
                    <View style={styles.view3list}>
                      <Text style={styles.column2Header}>10</Text>
                      <Text style={styles.column2Header}>20</Text>
                      <Text style={styles.column2Header}>30</Text>
                      <Text style={styles.column2Header}>40</Text>
                      <Text style={styles.column2Header}>50</Text>
                      <Text style={styles.column2Header}>60</Text>
                      <Text style={styles.endColumn}>70</Text>
                      <Text style={styles.totalColumn}>280</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          ))}
        </View>
      </View>
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
  title2: {
    fontSize: 18,
    padding: 10,
    color: "#020202",
    fontWeight: "bold",
  },
  lkt: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#d9d9d9",
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
  },
  columnHeader: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14,
    width: 10,
  },
  column2Header: {
    flex: 1,
    fontSize: 14,
    width: 8,
    marginRight: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#bfbdbd",
  },
  view1list: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#ffffff",
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  view2list: {
    backgroundColor: "#bfbdbd",
    // textAlign: "center",
    flexDirection: "row",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  view3list: {
    backgroundColor: "#ffffff",
    // textAlign: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "80%",
  },
  cay: {
    backgroundColor: "#bfbdbd",
    // textAlign: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 5,
    width: "100%",
  },
  cay2: {
    backgroundColor: "#ffffff",
    // textAlign: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 5,
    width: "100%",
    paddingBottom: 10,
  },

  View3list: {
    backgroundColor: "#ffffff",
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text1: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
    paddingLeft: 15,
  },
  input: {
    margin: 5,
    backgroundColor: "#ffffff",
  },
  player: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  list: {
    marginTop: 10,
    paddingRight: 12,
    gap: 15,
    paddingLeft: 12,
  },
  endColumn: {
    flex: 1.5,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  totalColumn: {
    flex: 1.5,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ListPlayers;
