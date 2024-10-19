import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { BarCodeScanningResult } from "expo-camera/build/legacy/Camera.types";
import { Button } from "react-native-paper";
import { useLoginMutation } from "./LoginApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { setToken, useAppDispatch } from "@/store";

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) {
        dispatch(setToken(token));
        router.push({ pathname: "/ListPlayers" });
      }
    });
  }, []);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = async ({ data }: BarCodeScanningResult) => {
    setScanned(true);

    try {
      const response = await login({ code: data });
      if (response.data) {
        dispatch(setToken(response.data.token));

        AsyncStorage.setItem("token", response.data.token);
      } else {
        console.log(
          "🚀 ~ file: index.tsx:26 ~ handleLogin ~ response:",
          response
        );
      }
      router.push({ pathname: "/ListPlayers" });
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setScanned(false);
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
