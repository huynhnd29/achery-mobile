import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { setType, useAppDispatch, useAppSelector } from "@/store";
import { IPlayerScore, IScore, usePlayersQuery } from "./LoginApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CompetitionType } from "@/constants";
import { FlashList } from "@shopify/flash-list";
import { getEnd } from "@/utils";

export interface Player {
  Id: number;
  FirstName: string;
  LastName: string;
  playerId: number;
  CompetitionId: number;
  Bia?: string;
}

const ListPlayers = () => {
  const token = useAppSelector((state) => state.app.token);
  const competitionName = useAppSelector((state) => state.app.competitionName);

  const type = useAppSelector((state) => state.app.type);

  const res = usePlayersQuery(token, { skip: !token });

  const dispatch = useAppDispatch();
  const players = useMemo(
    () => (res.data?.data?.players || []) as Player[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(res.data?.data?.players)]
  );

  const playersScores = (res.data?.data?.scores || []) as IPlayerScore[];

  useEffect(() => {
    const type =
      res.data?.data?.competition?.CompetitionStandard?.CompetitionTypeId;
    if (type) {
      dispatch(setType(type));
    }
  }, [
    dispatch,
    res.data?.data?.competition?.CompetitionStandard?.CompetitionTypeId,
  ]);

  const handleClick = useCallback(
    (id: number, playerId: number) => {
      const player = players.find(
        (player) => player.Id === id && player.playerId === playerId
      );

      if (player) {
        router.push({
          pathname: "/TotalEnd/Player_center",
          params: { ...player },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(players)]
  );

  const findFinalRowScoreOfPlayer = (comPlayerId: number, playerId: number) => {
    const playerScore = playersScores.find(
      (playerScore) =>
        Number(playerScore.comPlayerId) === Number(comPlayerId) &&
        Number(playerScore.playerId) === Number(playerId)
    );

    let time = 0;
    let score: Array<number | string> = [];
    playerScore?.scores
      ? Object.entries(playerScore.scores).reduce(
          (acc, [key, value], index) => {
            if (Array.isArray(value) && value.some((v) => v !== 0)) {
              time = index + 1;
              score = value;
              return { [key]: value };
            }
            return acc;
          },
          {}
        )
      : {};

    const end = getEnd(score);

    let total = 0;

    if (playerScore?.scores) {
      Object.keys(playerScore?.scores || []).forEach((k, i) => {
        if (i <= time - 1) {
          total += getEnd(playerScore?.scores[k as keyof IScore]);
        }
      });
    }

    return {
      time: time,
      score,
      end,
      total,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách thí sinh</Text>
        <Button
          onPress={() => {
            AsyncStorage.clear().then(() => {
              router.push({ pathname: "/" });
            });
          }}
        >
          Đăng xuất
        </Button>
      </View>

      <View style={styles.lkt}>
        <Text style={styles.text1}>
          {res?.data?.data?.competition?.Tournaments?.Name}
        </Text>
        <Text style={{ paddingLeft: 15, fontSize: 12 }}>
          {res?.data?.data?.competition?.CompetitionStandard?.Name}
        </Text>
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        <FlashList
          data={players}
          estimatedItemSize={10}
          keyExtractor={(item) =>
            String(item.playerId + item.Id + item.CompetitionId)
          }
          renderItem={(item) => {
            const player = item.item;
            const COL_NUM =
              type === CompetitionType.GROUP &&
              competitionName.includes("Đấu loại")
                ? 3
                : 6;
            const row = findFinalRowScoreOfPlayer(player.Id, player.playerId);

            return (
              <TouchableOpacity
                onPress={() => handleClick(player.Id, player.playerId)}
              >
                <View style={styles.player}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.title2}>
                      {player.LastName + " " + player.FirstName}
                    </Text>
                    <Text style={styles.title2}>{player.Bia || ""}</Text>
                  </View>

                  <View style={styles.cay}>
                    <View style={styles.view2list}>
                      <Text style={styles.columnHeader}></Text>
                      {Array.from({ length: COL_NUM }).map((_, i) => (
                        <Text key={i} style={styles.columnHeader}>
                          {i + 1}
                        </Text>
                      ))}
                      <Text style={styles.endColumn}>End</Text>
                      <Text style={styles.totalColumn}>Total</Text>
                    </View>
                  </View>
                  <View style={styles.cay2}>
                    <Text style={{ paddingRight: 20 }}>{row.time}</Text>
                    <View style={styles.view3list}>
                      {Array.from({ length: COL_NUM }).map((_, i) => (
                        <Text key={i} style={styles.column2Header}>
                          {String(row.score[i] || 0).replace("10X", "X")}
                        </Text>
                      ))}

                      <Text style={styles.endColumn}>{row.end}</Text>
                      <Text style={styles.totalColumn}>{row.total}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
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
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  view3list: {
    backgroundColor: "#ffffff",
    // textAlign: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "90%",
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
    fontSize: 12,
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
    height: "70%",
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
