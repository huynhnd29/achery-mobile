import { getEnd } from "@/utils";
import React, { memo, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ScoreRowNode = ({
  isActiveRow,
  activeColIdx,
  idx,
  values,
  total,
}: {
  isActiveRow: boolean;
  activeColIdx: number;
  idx: number;
  values: (number | string)[];
  total: number;
}) => {
  const end = useMemo(() => getEnd(values), [values]);
  return (
    <View
      style={[
        styles.colList,
        {
          marginVertical: 2,
        },
        isActiveRow
          ? {
              backgroundColor: "#f8b042",
              paddingVertical: 4,
            }
          : {},
      ]}
    >
      <Text style={styles.columnCell}>{idx + 1}|</Text>
      {values.map((inputValue, colIndex) => (
        <TouchableOpacity
          key={colIndex}
          style={[
            styles.columnCell,
            styles.columnCellInput,
            isActiveRow && colIndex === activeColIdx ? styles.active : {},
          ]}
        >
          <Text style={{ fontWeight: "bold", color: "#555" }}>
            {String(inputValue).replace("10X", "X")}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.columnCell}>{end}</Text>
      <Text style={styles.columnCell}>{total}</Text>
    </View>
  );
};

const ScoreRow = memo(ScoreRowNode);
export default ScoreRow;

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
