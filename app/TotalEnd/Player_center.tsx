// Player_center.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomKeyboard from "@/components/CustomKeyboard";
import { Player } from "../ListPlayers";
import {
  IPlayerScore,
  IScore,
  useChamDiemMutation,
  usePlayersQuery,
} from "../LoginApi";
import { useAppSelector } from "@/store";
import { router } from "expo-router";
import { Button, MD3Colors, ProgressBar } from "react-native-paper";
import { CompetitionType } from "@/constants";
import { FlashList } from "@shopify/flash-list";
import ScoreRow from "@/components/ScoreRow";
import { getEnd } from "@/utils";

const initScore = {
  time1: [0, 0, 0, 0, 0, 0],
  time2: [0, 0, 0, 0, 0, 0],
  time3: [0, 0, 0, 0, 0, 0],
  time4: [0, 0, 0, 0, 0, 0],
  time5: [0, 0, 0, 0, 0, 0],
  time6: [0, 0, 0, 0, 0, 0],
  time7: [0, 0, 0, 0, 0, 0],
  time8: [0, 0, 0, 0, 0, 0],
  time9: [0, 0, 0, 0, 0, 0],
  time10: [0, 0, 0, 0, 0, 0],
  time11: [0, 0, 0, 0, 0, 0],
  time12: [0, 0, 0, 0, 0, 0],
};

const Player_center = () => {
  const route = useRoute<RouteProp<{ params: Player }>>();

  const { Id, playerId, FirstName, LastName } = route.params;

  const token = useAppSelector((state) => state.app.token);
  const type = useAppSelector((state) => state.app.type);
  const competitionName = useAppSelector((state) => state.app.competitionName);

  const [activeInput, setActiveInput] = useState<{
    row: string;
    colIndex: number;
  }>({ row: "time1", colIndex: 0 });

  const COL_NUM = useMemo(() => {
    if (
      type === CompetitionType.GROUP &&
      competitionName.includes("Đấu loại")
    ) {
      return 3;
    }
    return 6;
  }, [type, competitionName]);

  const ROW_NUM = useMemo(() => {
    if (type === CompetitionType.GROUP) {
      if (competitionName.includes("Đấu loại")) {
        return 5;
      }
      return 4;
    }
    if (
      type === CompetitionType.ALL_ROUND_1 ||
      type === CompetitionType.ALL_ROUND_3
    ) {
      return 12;
    }
    return 6;
  }, [type, competitionName]);

  const res = usePlayersQuery(token, { skip: !token });
  const [chamDiem, { isLoading }] = useChamDiemMutation();
  const players = (res.data?.data?.players || []) as Player[];

  const playersScores = (res.data?.data?.scores || []) as IPlayerScore[];

  const [scores, setScores] = useState<IScore>({
    ...initScore,
  });

  useEffect(() => {
    const playerScore = playersScores.find(
      (playerScore) =>
        Number(playerScore.comPlayerId) === Number(Id) &&
        Number(playerScore.playerId) === Number(playerId)
    );

    const newScores: IScore = {
      ...initScore,
    };
    for (const key in newScores) {
      const k = key as keyof IScore;
      newScores[k] = Array.from({ length: COL_NUM }).map(
        (_, i) => playerScore?.scores[k]?.[i] || 0
      );
    }

    setScores(newScores);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(playersScores), playerId, Id, COL_NUM]);

  const handleInputChange = useCallback(
    (value: string, row: keyof IScore, colIndex: number) => {
      if (colIndex <= COL_NUM) {
        setScores((prevScores) => {
          const newScores = { ...prevScores };
          newScores[row][colIndex] = value;
          return newScores;
        });
      }
    },
    [COL_NUM]
  );

  const currentIndex = useMemo(
    () =>
      players.findIndex(
        (player) =>
          Number(player.Id) === Number(Id) &&
          Number(player.playerId) === Number(playerId)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(players), Id, playerId]
  );

  const nextPlayer = useCallback(async () => {
    await chamDiem({
      scores,
      id: Number(Id),
      playerId: Number(playerId),
      token: token,
    });
    if (currentIndex < players.length - 1) {
      const nextPlayer = players[currentIndex + 1];
      if (nextPlayer) {
        router.push({
          pathname: "/TotalEnd/Player_center",
          params: { ...nextPlayer },
        });
      }
    } else {
      const firstPlayer = players[0];
      if (firstPlayer) {
        router.push({
          pathname: "/TotalEnd/Player_center",
          params: { ...firstPlayer },
        });
      }
    }
  }, [chamDiem, scores, Id, playerId, token, currentIndex, players]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (activeInput) {
        const { row, colIndex } = activeInput;

        handleInputChange(key, row as keyof IScore, colIndex);
        if (colIndex < COL_NUM - 1) {
          setActiveInput({ row, colIndex: colIndex + 1 });
        } else {
          nextPlayer().then(() => {
            const nextRow =
              Object.keys(scores)[
                Object.keys(scores).findIndex((key) => key === row) + 1
              ];
            setActiveInput({ row: nextRow, colIndex: 0 });
          });
        }
      }
    },
    [COL_NUM, activeInput, handleInputChange, nextPlayer, scores]
  );

  const prevPlayer = async () => {
    await chamDiem({
      scores,
      id: Number(Id),
      playerId: Number(playerId),
      token: token,
    });
    if (currentIndex > 0) {
      const prevPlayer = players[currentIndex - 1];
      if (prevPlayer) {
        router.push({
          pathname: "/TotalEnd/Player_center",
          params: { ...prevPlayer },
        });
      }
    }
  };

  const totals = useMemo(
    () => Object.keys(scores).map((row) => getEnd(scores[row as keyof IScore])),
    [scores]
  );

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Button
            icon={() => <AntDesign name="left" size={24} color="black" />}
            onPress={prevPlayer}
            disabled={currentIndex <= 0}
          >
            Trước
          </Button>
          <Text style={styles.title}>{LastName + " " + FirstName}</Text>
          <Button
            onPress={nextPlayer}
            icon={() => <AntDesign name="right" size={24} color="black" />}
            disabled={currentIndex >= players.length - 1}
            contentStyle={{ flexDirection: "row-reverse" }}
          >
            Sau
          </Button>
        </View>
        <ProgressBar
          indeterminate={isLoading || res.isLoading || res.isFetching}
          color={MD3Colors.error50}
        />

        <View style={styles.player}>
          <View style={styles.colList}>
            <Text
              style={[styles.columnHeader, { borderBottomWidth: 0 }]}
            ></Text>
            <Text style={styles.columnHeader}>1</Text>
            <Text style={styles.columnHeader}>2</Text>
            <Text style={styles.columnHeader}>3</Text>
            {COL_NUM >= 4 ? <Text style={styles.columnHeader}>4</Text> : null}
            {COL_NUM >= 5 ? <Text style={styles.columnHeader}>5</Text> : null}
            {COL_NUM >= 6 ? <Text style={styles.columnHeader}>6</Text> : null}
            <Text style={styles.columnHeader}>End</Text>
            <Text style={styles.columnHeader}>Total</Text>
          </View>
          <View style={{ flex: 1 }}>
            <FlashList
              data={Object.keys(scores).slice(0, ROW_NUM)}
              estimatedItemSize={ROW_NUM}
              renderItem={({ item: row, index: rowIndex }) => {
                return (
                  <ScoreRow
                    activeColIdx={activeInput.colIndex}
                    isActiveRow={row === activeInput.row}
                    idx={rowIndex}
                    total={totals[rowIndex]}
                    values={scores[row as keyof IScore]}
                  />
                );
              }}
            />
          </View>
        </View>
      </View>
      <CustomKeyboard
        hidden={isLoading || res.isLoading || res.isFetching}
        onKeyPress={handleKeyPress}
        is3day={competitionName.includes("3 dây")}
      />
    </View>
  );
};

export default Player_center;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "space-sta",
    alignContent: "flex-start",
    padding: 0,
    gap: 10,
  },
  header: {
    width: "100%",
    margin: 0,
    backgroundColor: "#f7f7f7",
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scrollView: {
    width: "100%",
  },
  player: {
    flex: 1,
  },
  colList: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  columnHeader: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    paddingVertical: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
  },
  columnCell: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    paddingVertical: 4,
  },
  columnCellInput: {
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 2,
  },
  active: {
    borderColor: "#ec6a52",
    backgroundColor: "#f3b7ad",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});
