import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button, TextInput, Text, Dialog, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginMutation } from "./LoginApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Login = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isNamePopupVisible, setIsNamePopupVisible] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const router = useRouter();

  const handleCodeSubmit = () => {
    if (code.trim()) {
      setIsNamePopupVisible(true);
    } else {
      console.log("Code không được để trống");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await login({ code, name });
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
      setIsNamePopupVisible(false);
    }
  };

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
        />
        {error && (
          <Text style={{ color: "red" }}>
            Login failed. {String((error as any)?.data?.message) || "Please try again."}
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
          onPress={() => router.push({ pathname: "/barCode" })}
          loading={isLoading}
        >
          Quét QR Code
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={isNamePopupVisible}
          onDismiss={() => setIsNamePopupVisible(false)}
        >
          <Dialog.Title>Nhập tên giám khảo</Dialog.Title>
          <Dialog.Content>
            <TextInput
              placeholder="Nhập tên của giám khảo"
              mode="outlined"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={styles.button_popup}
              labelStyle={styles.text}
              onPress={handleLogin}
            >
              Xác nhận
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
