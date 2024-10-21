import React, { memo, useMemo } from "react";
import { View, StyleSheet, Vibration, FlatList } from "react-native";
import { Button } from "react-native-paper";

interface CustomKeyboardProps {
  is3day: boolean;
  onKeyPress: (key: string) => void;
  hidden: boolean;
}

const CustomKeyboardNode: React.FC<CustomKeyboardProps> = ({
  onKeyPress,
  is3day,
  hidden,
}) => {
  const keys = useMemo(
    () =>
      is3day
        ? [
            ["10X", "10", "9"],
            ["8", "7", "6"],
            ["5", "M"],
          ]
        : [
            ["10X", "10", "9"],
            ["8", "7", "6"],
            ["5", "4", "3"],
            ["2", "1", "M"],
          ],
    [is3day]
  );

  const renderColorKeyboard = (key: string, rowIndex: number) => {
    if (rowIndex === 0) return "#FEEC37";
    if (rowIndex === 1) return "#ff3846";
    if (key === "M") return "#313131";
    if (rowIndex === 2) return "#0fb7ff";
    if (rowIndex === 3) return "#0fb7ff";

    return "";
  };

  return (
    <View
      style={[styles.keyboardContainer, { display: hidden ? "none" : "flex" }]}
    >
      <FlatList
        data={keys}
        renderItem={({ item, index }) => {
          const row = item;
          const rowIndex = index;
          return (
            <View key={rowIndex} style={styles.row}>
              {row.map((key, keyIndex) => (
                <Button
                  mode="outlined"
                  key={keyIndex}
                  onPressIn={() => {
                    onKeyPress(key);
                    Vibration.vibrate(100);
                  }}
                  buttonColor={renderColorKeyboard(key, rowIndex)}
                  labelStyle={[
                    styles.keyText,
                    {
                      color: key === "M" ? "white" : "#333",
                    },
                  ]}
                  style={[styles.key]}
                >
                  {key.replace("10X", "X")}
                </Button>
              ))}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    padding: 16,
    width: "100%",
    alignSelf: "stretch",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  key: {
    flex: 1,
    margin: 2,
  },
  keyText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  delKey: {
    flex: 3,
    backgroundColor: "#4dbef3",
  },
});
const CustomKeyboard = memo(CustomKeyboardNode);
export default CustomKeyboard;
