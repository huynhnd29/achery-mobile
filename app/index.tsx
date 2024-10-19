import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button, TextInput, Text, Dialog, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginMutation } from "./LoginApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setToken, useAppDispatch } from "@/store";
const Login = () => {
  const [code, setCode] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleCodeSubmit = async () => {
    if (code.trim()) {
      try {
        const response = await login({ code: code.trim() });
        if (response.data) {
          dispatch(setToken(response.data.token));
          AsyncStorage.setItem("token", response.data.token);
        } else {
          console.log(
            "🚀 ~ file: index.tsx:26 ~ handleLogin ~ response:",
            response
          );
        }

        router.push("/ListPlayers");
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      console.log("Code không được để trống");
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) {
        dispatch(setToken(token));
        router.push("/ListPlayers");
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          source={require("../assets/images/avt.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Mã nội dung thi đấu"
          mode="outlined"
          style={styles.input}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />
        {error && (
          <Text style={{ color: "red" }}>
            Login failed.{" "}
            {String((error as any)?.data?.message) || "Please try again."}
          </Text>
        )}
        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.text}
          onPress={handleCodeSubmit}
          disabled={isLoading}
          loading={isLoading}
        >
          {isLoading ? "Đang kiểm tra..." : "Đăng nhập"}
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.text}
          onPress={() => router.push("/barCode")}
          loading={isLoading}
        >
          Quét QR Code
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f6f6",
  },
  image: {
    height: 200,
    alignSelf: "center",
    marginBottom: 40,
    marginTop: 40,
  },
  inputContainer: {
    justifyContent: "flex-end",
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  input: {
    marginTop: 2,
    padding: 4,
    borderRadius: 2,
  },
  button: {
    marginTop: 20,
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#FFA500",
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

export default Login;
