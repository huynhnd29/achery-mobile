import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Image, StyleSheet, StatusBar, Text } from "react-native"; // Đảm bảo Text được import
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const router = useRouter();
  const [tkdemo, setTkDemo] = useState("");
  const acountDM = "ngp123";
  const handleLogin = () => {
    if (tkdemo === acountDM) {
      router.push({ pathname: "/Competition_Content" });
    } else {
      alert("Sai mã đăng nhập");
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
          onChangeText={(text) => setTkDemo(text)}
        />
        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.text}
          onPress={handleLogin}
        >
          Đăng nhập
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.text}
          onPress={() => router.push({ pathname: "/barCode" })}
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
    borderRadius: 20,
  },
  button: {
    marginTop: 20,
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#FFA500",
  },
  text: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default Login;
