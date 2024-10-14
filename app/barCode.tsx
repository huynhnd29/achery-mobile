import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { BarCodeScanningResult } from "expo-camera/build/legacy/Camera.types";
import { Dialog, TextInput, Button } from "react-native-paper";
import { useLoginMutation } from "./LoginApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [qrData, setQrData] = useState("");
  const [login] = useLoginMutation();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }: BarCodeScanningResult) => {
    setScanned(true);
    setQrData(data);
    setModalVisible(true); // Show the popup to input the name
  };
  const handleApiCall = async () => {
    if (qrData && name) {
      // Call your API with the qrData and name
      console.log("Calling API with QR data:", qrData, "and name:", name);

      try {
        const response = await login({ code: qrData, name });
        if (response.data) {
          AsyncStorage.setItem("token", response.data.token);
        } else {
          console.log(
            "🚀 ~ file: index.tsx:26 ~ handleLogin ~ response:",
            response
          );
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        // Reset
        setModalVisible(false);
        setScanned(false);
        setName("");
        setQrData("");
      }
    } else {
      Alert.alert("Error", "Please enter a valid name.");
    }
  };

  if (hasPermission === null) {
    return <Text>Yêu cầu cấp phép sử dụng máy ảnh</Text>;
  }
  if (hasPermission === false) {
    return <Text>Không được phép sử dụng máy ảnh</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button onPress={() => setScanned(false)}>Quét lại QR</Button>
      )}
      <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <Dialog.Title>Nhập tên giám khảo</Dialog.Title>

        <Dialog.Content>
          <TextInput
            placeholder="Nhập tên"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={handleApiCall}
            style={styles.button_popup}
            labelStyle={styles.text}
          >
            Xác nhận
          </Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  input: {
    marginTop: 2,
    padding: 4,
    borderRadius: 2,
  },
  button_popup: {
    marginTop: 20,
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#FFA500",
  },
  text: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#f3ecec",
  },
});
