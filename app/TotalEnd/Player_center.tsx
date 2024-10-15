// Player_center.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEvent } from "../eventContext";
import CustomKeyboard from "./CustomKeyboard";

type RouteParams = {
  playerName: string;
  eventName: string;
};

const Player_center = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }>>();
  const { eventName } = useEvent();
  const { playerName } = route.params;
  const [ArrayScoreNew, setArrayScoreNew] = useState<string[]>([]);

  const [rows, setRows] = useState(
    Array.from({ length: 6 }, () => ({
      inputs: Array(6).fill(""),
      end: 0,
      total: 0,
    }))
  );
  const [activeInput, setActiveInput] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);

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
        } else if (rowIndex < 3) {
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

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>{playerName}</Text>
        </View>
        <View>
          <Text style={styles.title2}>{eventName}</Text>
        </View>
        <View style={styles.player}>
          <View style={styles.view1list}>
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
      </View>
      <CustomKeyboard onKeyPress={handleKeyPress} />
    </SafeAreaView>
  );
};

export default Player_center;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  header: {
    width: "100%",
    backgroundColor: "#f7f7f7",
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    alignItems: "center",
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
