import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { useAppSelector } from "@/store";
import { usePlayersQuery } from "./LoginApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Player {
  Id: number;
  FirstName: string;
  LastName: string;
  playerId: number;
}

const ListPlayers = () => {
  const token = useAppSelector((state) => state.app.token);
  const res = usePlayersQuery(token, { skip: !token });

  const players = (res.data?.data?.players || []) as Player[];

  const [expandedPlayerId, setExpandedPlayerId] = useState<number | null>(
    players[0]?.Id || null
  );

  useEffect(() => {
    if (players.length > 0) {
      setExpandedPlayerId(players[0].Id);
    }
  }, [JSON.stringify(players)]);

  const toggleExpand = (id: number) => {
    setExpandedPlayerId(id);
  };
  const handleClick = (id: number, playerId: number) => {
    const player = players.find(
      (player) => player.Id === id && player.playerId === playerId
    );

    if (player) {
      router.push({
        pathname: "/TotalEnd/Player_center",
        params: { ...player },
      });
    }
  };
  return (
    <SafeAreaView>
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>Danh sách thí sinh</Text>
          <Button
            onPress={() => {
              AsyncStorage.clear();
              router.push({ pathname: "/" });
            }}
          >
            Đăng xuất
          </Button>
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
          {players.map((player) => (
            <TouchableOpacity
              key={player.playerId}
              onPress={() => handleClick(player.Id, player.playerId)}
            >
              <View style={styles.player}>
                <TouchableOpacity
                  style={styles.view1list}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleExpand(player.Id);
                  }}
                >
                  <Text style={styles.title2}>
                    {player.LastName + " " + player.FirstName}
                  </Text>
                </TouchableOpacity>
                {expandedPlayerId === player.Id && (
                  <>
                    <View style={styles.cay}>
                      <View style={styles.view2list}>
                        <Text style={styles.columnHeader}>1</Text>
                        <Text style={styles.columnHeader}>2</Text>
                        <Text style={styles.columnHeader}>3</Text>
                        <Text style={styles.columnHeader}>4</Text>
                        <Text style={styles.columnHeader}>5</Text>
                        <Text style={styles.columnHeader}>6</Text>
                        <Text style={styles.endColumn}>End</Text>
                        <Text style={styles.totalColumn}>Total</Text>
                      </View>
                    </View>
                    <View style={styles.cay2}>
                      <Text style={{ paddingRight: 20 }}>0</Text>
                      <View style={styles.view3list}>
                        <Text style={styles.column2Header}>0</Text>
                        <Text style={styles.column2Header}>0</Text>
                        <Text style={styles.column2Header}>0</Text>
                        <Text style={styles.column2Header}>0</Text>
                        <Text style={styles.column2Header}>0</Text>
                        <Text style={styles.column2Header}>0</Text>
                        <Text style={styles.endColumn}>0</Text>
                        <Text style={styles.totalColumn}>0</Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
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
    backgroundColor: "#ddd",
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
    paddingLeft: 2,
    borderRadius: 4,
  },
  column2Header: {
    flex: 1,
    fontSize: 14,
    width: 8,
    marginRight: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ddd",
    paddingLeft: 2,
    borderRadius: 4,
  },
  view1list: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#ffffff",
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
  },
  view2list: {
    backgroundColor: "#ddd",
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
    backgroundColor: "#ddd",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 5,
    width: "100%",
    borderRadius: 4,
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
