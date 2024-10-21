// Player_center.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FlashList } from "@shopify/flash-list";
import { Button, MD3Colors, ProgressBar } from "react-native-paper";
import debounce from "lodash.debounce";
import CustomKeyboard from "@/components/CustomKeyboard";
import { Player } from "../ListPlayers";
import {
  IPlayerScore,
  IScore,
  useChamDiemMutation,
  usePlayersQuery,
} from "../LoginApi";
import { useAppSelector } from "@/store";
import { CompetitionType } from "@/constants";
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
  const [currentPlayer, setCurrentPlayer] = useState({
    Id: Id,
    playerId: playerId,
    FirstName: FirstName,
    LastName: LastName,
  });

  const token = useAppSelector((state) => state.app.token);
  const res = usePlayersQuery(token, { skip: !token });

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

  const [chamDiem, { isLoading }] = useChamDiemMutation();
  const players = useMemo(
    () => (res.data?.data?.players || []) as Player[],
    [res.data]
  );

  const playersScores = (res.data?.data?.scores || []) as IPlayerScore[];

  const [scores, setScores] = useState<IScore>({
    ...initScore,
  });

  const scoresKeys = useMemo(
    () => Object.keys(scores),
    [JSON.stringify(scores)]
  );

  useEffect(() => {
    const playerScore = playersScores.find(
      (playerScore) =>
        Number(playerScore.comPlayerId) === Number(currentPlayer.Id) &&
        Number(playerScore.playerId) === Number(currentPlayer.playerId)
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
    const nullInput = Object.keys(newScores).find((s) =>
      newScores[s as keyof IScore].some((v) => v === 0)
    ) as keyof IScore;
    setActiveInput({
      row: nullInput,
      colIndex: newScores[nullInput].indexOf(0),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify(playersScores),
    currentPlayer.playerId,
    currentPlayer.Id,
    COL_NUM,
  ]);

  const handleInputChange = useCallback(
    (value: string, row: keyof IScore, colIndex: number) => {
      setScores((prevScores) => {
        prevScores[row][colIndex] = value;
        return prevScores;
      });
    },
    []
  );

  const currentIndex = useMemo(
    () =>
      players.findIndex(
        (player) =>
          Number(player.Id) === Number(currentPlayer.Id) &&
          Number(player.playerId) === Number(currentPlayer.playerId)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(players), currentPlayer.Id, currentPlayer.playerId]
  );

  const nextPlayer = useCallback(
    debounce(async () => {
      await chamDiem({
        scores,
        id: Number(currentPlayer.Id),
        playerId: Number(currentPlayer.playerId),
        token: token,
      });
      if (currentIndex < players.length - 1) {
        const nextPlayer = players[currentIndex + 1];
        if (nextPlayer) {
          setCurrentPlayer({
            Id: nextPlayer.Id,
            playerId: nextPlayer.playerId,
            FirstName: nextPlayer.FirstName,
            LastName: nextPlayer.LastName,
          });
        }
      } else {
        const firstPlayer = players[0];
        if (firstPlayer) {
          setCurrentPlayer({
            Id: firstPlayer.Id,
            playerId: firstPlayer.playerId,
            FirstName: firstPlayer.FirstName,
            LastName: firstPlayer.LastName,
          });
        }
      }
    }, 500),
    [
      chamDiem,
      scores,
      currentPlayer.Id,
      currentPlayer.playerId,
      token,
      currentIndex,
      players,
    ]
  );

  const handleKeyPress = useCallback(
    debounce(async (key: string) => {
      if (activeInput) {
        const { row, colIndex } = activeInput;

        handleInputChange(key, row as keyof IScore, colIndex);
        if (colIndex < COL_NUM - 1) {
          setActiveInput((pre) => ({ ...pre, colIndex: pre.colIndex + 1 }));
        } else {
          await nextPlayer();
        }
      }
    }, 300),
    [COL_NUM, handleInputChange, nextPlayer, scores, activeInput]
  );

  const prevPlayer = useCallback(
    debounce(async () => {
      await chamDiem({
        scores,
        id: Number(currentPlayer.Id),
        playerId: Number(currentPlayer.playerId),
        token: token,
      });
      if (currentIndex > 0) {
        const prevPlayer = players[currentIndex - 1];
        if (prevPlayer) {
          setCurrentPlayer({
            Id: prevPlayer.Id,
            playerId: prevPlayer.playerId,
            FirstName: prevPlayer.FirstName,
            LastName: prevPlayer.LastName,
          });
        }
      }
    }, 500),
    [
      currentPlayer.Id,
      chamDiem,
      currentIndex,
      currentPlayer.playerId,
      players,
      scores,
      token,
    ]
  );

  const totals = useMemo(
    () =>
      scoresKeys.reduce((pre = [], cur) => {
        const rowTotal = getEnd(scores[cur as keyof IScore]);
        const a = rowTotal ? rowTotal + (pre[pre.length - 1] || 0) : 0;
        return [...pre, a];
      }, [] as number[]),
    [scores, scoresKeys]
  );

  const isPageLoading = useMemo(
    () => isLoading || res.isLoading || res.isFetching,
    [isLoading, res.isLoading, res.isFetching]
  );

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Button
            icon={() => <AntDesign name="left" size={24} color="black" />}
            onPress={prevPlayer}
            disabled={currentIndex <= 0 || isPageLoading}
          >
            Trước
          </Button>
          <Text style={styles.title}>
            {currentPlayer.LastName + " " + currentPlayer.FirstName}
          </Text>
          <Button
            onPress={nextPlayer}
            icon={() => <AntDesign name="right" size={24} color="black" />}
            disabled={currentIndex >= players.length - 1 || isPageLoading}
            contentStyle={{ flexDirection: "row-reverse" }}
          >
            Sau
          </Button>
        </View>
        <ProgressBar indeterminate={isPageLoading} color={MD3Colors.error50} />

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
              data={scoresKeys.slice(0, ROW_NUM)}
              estimatedItemSize={ROW_NUM}
              renderItem={({ item: row, index: rowIndex }) => {
                return (
                  <ScoreRow
                    activeColIdx={activeInput.colIndex}
                    isActiveRow={row === activeInput.row}
                    idx={rowIndex}
                    total={totals[rowIndex]}
                    values={scores[row as keyof IScore]}
                    onItemPress={(itemIdx) => {
                      if (!isLoading && !res.isLoading && !res.isFetching) {
                        setActiveInput({ row, colIndex: itemIdx });
                      }
                    }}
                  />
                );
              }}
            />
          </View>
        </View>
      </View>
      <CustomKeyboard
        hidden={isPageLoading}
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
