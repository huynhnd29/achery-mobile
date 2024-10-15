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
    ["M", "10", "DEL"],
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
                style={styles.key}
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
                <Text style={KeyColor(key)}>{key}</Text>
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
  return styles.keyText;
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    width: "100%",
  },
  key: {
    width: 85,
    height: 60,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  keyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  redText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
  },
  blueText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "blue",
  },
});

export default CustomKeyboard;
