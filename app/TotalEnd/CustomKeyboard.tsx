import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface CustomKeyboardProps {
  onKeyPress: (key: string) => void;
}

const CustomKeyboard: React.FC<CustomKeyboardProps> = ({ onKeyPress }) => {
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["M", "10", "10X"],
    ["DEL"],
  ];

  return (
    <View style={styles.keyboardContainer}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, keyIndex) =>
            key === "DEL" ? (
              <TouchableOpacity
                key={keyIndex}
                onPress={() => {
                  Vibration.vibrate();
                  onKeyPress(key);
                }}
                style={[styles.key, styles.delKey]}
              >
                <Feather name="delete" size={24} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={keyIndex}
                onPress={() => {
                  Vibration.vibrate();
                  onKeyPress(key);
                }}
                style={styles.key}
              >
                <Text style={[styles.keyText, KeyColor(key)]}>{key}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      ))}
    </View>
  );
};

const KeyColor = (key: string) => {
  if (key === "M") {
    return styles.redText;
  }
  if (key === "9" || key === "10") {
    return styles.blueText;
  }
  if (key === "10X") {
    return styles.xText;
  }
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
    width: "100%",
  },
  key: {
    flex: 1,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 2,
    marginHorizontal: 6,
  },
  keyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  delKey: {
    flex: 3,
    backgroundColor: "#4dbef3",
  },
  redText: {
    color: "red",
  },
  blueText: {
    color: "blue",
  },
  xText: {
    color: "green",
  },
});

export default CustomKeyboard;
