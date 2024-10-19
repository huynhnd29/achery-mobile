// Player_center.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomKeyboard from "./CustomKeyboard";
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

  const COL_NUM = useMemo(() => {
    if (
      type === CompetitionType.GROUP &&
      competitionName.includes("Đấu loại")
    ) {
      return 3;
    }
    return 6;
  }, [type]);

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
  }, [type]);

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
  }, [JSON.stringify(playersScores), playerId, Id]);

  const scrollViewRef = useRef<ScrollView>(null);

  const [activeInput, setActiveInput] = useState<{
    row: string;
    colIndex: number;
  } | null>(null);

  useEffect(() => {
    // Focus vào ô trống đầu tiên khi trang vừa được mở
    const firstEmptyCell = findFirstEmptyCell();
    if (firstEmptyCell) {
      const { row, colIndex } = firstEmptyCell;
      setActiveInput({ row, colIndex });
      focusInput(row, colIndex);
    }
  }, []);

  // Hàm tìm ô trống đầu tiên trong bảng
  const findFirstEmptyCell = () => {
    for (let rowIndex = 0; rowIndex < Object.keys(scores).length; rowIndex++) {
      const rowKey = Object.keys(scores)[rowIndex] as keyof IScore;
      for (let colIndex = 0; colIndex < scores[rowKey].length; colIndex++) {
        if (scores[rowKey][colIndex] === 0) {
          return { row: rowKey, colIndex };
        }
      }
    }
    return null;
  };

  // Hàm focus vào ô tương ứng nếu tồn tại ref
  const focusInput = (row: keyof IScore, colIndex: number) => {
    const index = Object.keys(scores).findIndex((key) => key === row);
    if (index) {
      scrollToRow(index);
    }
  };

  const scrollToRow = (rowIndex: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: rowIndex * 50, // Tính toán vị trí cuộn dựa vào chiều cao dòng
        animated: true,
      });
    }
  };

  const handleInputChange = (
    value: string,
    row: keyof IScore,
    colIndex: number
  ) => {
    if (colIndex <= COL_NUM) {
      const newScores = { ...scores };
      newScores[row][colIndex] = value;
      setScores(newScores);
    }
  };

  const handleKeyPress = (key: string) => {
    if (activeInput) {
      const { row, colIndex } = activeInput;

      if (key === "DEL") {
        handleInputChange("", row as keyof IScore, colIndex);
      } else {
        handleInputChange(key, row as keyof IScore, colIndex);
      }

      if (key !== "DEL") {
        if (colIndex < COL_NUM - 1) {
          setActiveInput({ row, colIndex: colIndex + 1 });
        } else {
          nextPlayer();
          const nextRow =
            Object.keys(scores)[
              Object.keys(scores).findIndex((key) => key === row) + 1
            ];
          setActiveInput({ row: nextRow, colIndex: 0 });
        }
      }
    }
  };

  const calculateTotalForRow = (rowIndex: number, rowsData: any[]): number => {
    const currentEnd = rowsData[rowIndex].end;

    if (rowIndex === 0) {
      return currentEnd;
    }

    const previousTotal = calculateTotalForRow(rowIndex - 1, rowsData);
    return currentEnd + previousTotal;
  };
  const currentIndex = useMemo(
    () =>
      players.findIndex(
        (player) =>
          Number(player.Id) === Number(Id) &&
          Number(player.playerId) === Number(playerId)
      ),
    [JSON.stringify(players), Id, playerId]
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
  const nextPlayer = async () => {
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
    }
  };

  const getEnd = (key: keyof IScore): number => {
    return scores[key].reduce((acc: number, curr) => {
      const c = curr === "M" ? 0 : curr === "10X" ? 10 : curr;
      return Number(acc) + Number(c);
    }, 0 as number);
  };

  const getCurrentRowTotalFromStart = (index: number) => {
    let total = 0;

    Object.keys(scores).forEach((k, i) => {
      if (i <= index) {
        total += getEnd(k as keyof IScore);
      }
    });
    return total;
  };

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
        <ProgressBar indeterminate={isLoading} color={MD3Colors.error50} />

        <ScrollView ref={scrollViewRef} style={styles.scrollView}>
          <View style={styles.player}>
            <View style={styles.view1list}>
              {Array.from({ length: COL_NUM }).map((_, i) => (
                <Text key={i} style={styles.columnHeader}>
                  {i + 1}
                </Text>
              ))}
              <Text style={styles.columnHeader}>End</Text>
              <Text style={styles.columnHeader}>Total</Text>
            </View>

            {Object.keys(scores).map((key, rowIndex) => {
              const row = key as keyof IScore;
              const end = getEnd(row);
              const total = end ? getCurrentRowTotalFromStart(rowIndex) : 0;
              if (rowIndex >= ROW_NUM) return null;
              return (
                <View key={rowIndex} style={styles.table}>
                  <Text style={styles.columnHeader}>{rowIndex + 1}</Text>
                  {scores[row].map((inputValue, colIndex) => (
                    <TouchableOpacity
                      key={colIndex}
                      onPress={() => setActiveInput({ row, colIndex })}
                      style={styles.touchable}
                    >
                      <TextInput
                        value={String(inputValue)}
                        onChangeText={(value) =>
                          handleInputChange(value, row, colIndex)
                        }
                        onFocus={() => setActiveInput({ row, colIndex })}
                        showSoftInputOnFocus={false}
                        cursorColor={"transparent"}
                        style={[
                          styles.input,
                          activeInput?.row === row &&
                          activeInput?.colIndex === colIndex
                            ? styles.activeInput
                            : {},
                          inputValue ? { backgroundColor: "#db91c5" } : {},
                        ]}
                      />
                    </TouchableOpacity>
                  ))}

                  <Text style={styles.endText}>{end}</Text>
                  <Text style={styles.totalText}>{total}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <CustomKeyboard
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
    backgroundColor: "#e8e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 20,
  },
  input: {
    width: 34,
    height: 34,
    textAlign: "center",
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    borderColor: "#7c7b7b",
    borderRadius: 5,
    borderWidth: 3,
  },
  activeInput: {
    borderColor: "#f07b15",
  },
  table: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    paddingLeft: 12,
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
  view1list: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#b1afaf",
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  columnHeader: {
    fontWeight: "bold",
    fontSize: 16,
    width: 40,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  title2: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#020202",
    paddingTop: 10,
    paddingLeft: 10,
  },
  totalText: {
    textAlign: "center",
    width: 30,
  },
  endText: {
    textAlign: "center",
    width: 30,
  },
  touchable: {
    width: 30,
    height: 30,
  },
});
