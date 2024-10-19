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
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomKeyboard from "./CustomKeyboard";
import { Player } from "../ListPlayers";
import { usePlayersQuery } from "../LoginApi";
import { useAppSelector } from "@/store";
import { router } from "expo-router";
import { Button } from "react-native-paper";

const Player_center = () => {
  const token = useAppSelector((state) => state.app.token);

  const res = usePlayersQuery(token, { skip: !token });
  const players = (res.data?.data?.players || []) as Player[];
  const route = useRoute<RouteProp<{ params: Player }>>();
  const { Id, playerId, FirstName, LastName } = route.params;
  const [ArrayScoreNew, setArrayScoreNew] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRefs = useRef<(TextInput | null)[][]>([]);

  const [rows, setRows] = useState(
    Array.from({ length: 12 }, (_, k) => ({
      inputs: Array(6).fill(""),
      name: `Time${k + 1}`,
      end: 0,
      total: 0,
    }))
  );
  const [activeInput, setActiveInput] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);
  useEffect(() => {
    // Focus vào ô trống đầu tiên khi trang vừa được mở
    const firstEmptyCell = findFirstEmptyCell();
    if (firstEmptyCell) {
      const { rowIndex, colIndex } = firstEmptyCell;
      setActiveInput({ rowIndex, colIndex });
      focusInput(rowIndex, colIndex);
    }
  }, []);

  // Hàm tìm ô trống đầu tiên trong bảng
  const findFirstEmptyCell = () => {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      for (
        let colIndex = 0;
        colIndex < rows[rowIndex].inputs.length;
        colIndex++
      ) {
        if (rows[rowIndex].inputs[colIndex] === "") {
          return { rowIndex, colIndex };
        }
      }
    }
    return null;
  };

  // Hàm focus vào ô tương ứng nếu tồn tại ref
  const focusInput = (rowIndex: number, colIndex: number) => {
    const input = inputRefs.current[rowIndex]?.[colIndex];
    if (input) {
      input.focus(); // Đảm bảo ô đó có ref trước khi gọi focus
      scrollToRow(rowIndex);
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
    rowIndex: number,
    colIndex: number
  ) => {
    const newRows = [...rows];
    newRows[rowIndex].inputs[colIndex] = value;

    // Tính toán giá trị End cho hàng hiện tại
    newRows[rowIndex].end = calculateEndForRow(newRows[rowIndex].inputs);

    // Tính toán giá trị Total cho hàng hiện tại
    newRows[rowIndex].total = calculateTotalForRow(rowIndex, newRows);

    setRows(newRows);
    const updatedRow = newRows[rowIndex];
    if (updatedRow.inputs.some((val) => val !== "")) {
      setArrayScoreNew(updatedRow.inputs);
      console.log(`Updated row ${rowIndex}:`, updatedRow);
    }

    if (value !== "" && colIndex < 5) {
      setActiveInput({ rowIndex, colIndex: colIndex + 1 });
    } else if (value !== "" && colIndex === 5 && rowIndex < 3) {
      setActiveInput({ rowIndex: rowIndex + 1, colIndex: 0 });
    }
  };

  const handleKeyPress = (key: string) => {
    if (activeInput) {
      const { rowIndex, colIndex } = activeInput;

      if (key === "DEL") {
        handleInputChange("", rowIndex, colIndex);
      } else {
        handleInputChange(key, rowIndex, colIndex);
      }

      if (key !== "DEL") {
        if (colIndex < 5) {
          setActiveInput({ rowIndex, colIndex: colIndex + 1 });
        } else if (rowIndex < 11) {
          setActiveInput({ rowIndex: rowIndex + 1, colIndex: 0 });
        } else {
          setActiveInput(null);
        }
      }
    }
  };

  const calculateEndForRow = (inputs: string[]) => {
    return inputs.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
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

  const prevPlayer = () => {
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
  const nextPlayer = () => {
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
          <Text style={styles.title}>
            {LastName + " " + FirstName} {currentIndex}
          </Text>
          <Button
            onPress={nextPlayer}
            icon={() => <AntDesign name="right" size={24} color="black" />}
            disabled={currentIndex >= players.length - 1}
            contentStyle={{ flexDirection: "row-reverse" }}
          >
            Sau
          </Button>
        </View>
        <ScrollView ref={scrollViewRef} style={styles.scrollView}>
          <View style={styles.player}>
            <View style={styles.view1list}>
              <Text style={styles.columnHeader}></Text>
              <Text style={styles.columnHeader}>1</Text>
              <Text style={styles.columnHeader}>2</Text>
              <Text style={styles.columnHeader}>3</Text>
              <Text style={styles.columnHeader}>4</Text>
              <Text style={styles.columnHeader}>5</Text>
              <Text style={styles.columnHeader}>6</Text>
              <Text style={styles.columnHeader}>End</Text>
              <Text style={styles.columnHeader}>Total</Text>
            </View>

            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.table}>
                <Text style={styles.columnHeader}>{rowIndex + 1}</Text>
                {row.inputs.map((inputValue, colIndex) => (
                  <TouchableOpacity
                    key={colIndex}
                    onPress={() => setActiveInput({ rowIndex, colIndex })}
                    style={styles.touchable}
                  >
                    <TextInput
                      keyboardType="numeric"
                      value={inputValue}
                      onChangeText={(value) =>
                        handleInputChange(value, rowIndex, colIndex)
                      }
                      onFocus={() => setActiveInput({ rowIndex, colIndex })}
                      showSoftInputOnFocus={false}
                      editable={true}
                      style={[
                        styles.input,
                        activeInput?.rowIndex === rowIndex &&
                        activeInput?.colIndex === colIndex
                          ? styles.activeInput
                          : {},
                      ]}
                    />
                  </TouchableOpacity>
                ))}
                <Text style={styles.endText}>{row.end.toString()}</Text>
                <Text style={styles.totalText}>{row.total.toString()}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <CustomKeyboard onKeyPress={handleKeyPress} />
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
    width: 30,
    height: 30,
    textAlign: "center",
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    backgroundColor: "#db91c5",
    borderColor: "#7c7b7b",
    borderRadius: 5,
    borderWidth: 2,
  },
  activeInput: {
    borderColor: "#ff0000",
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
