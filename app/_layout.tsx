import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { Provider as PaperProvider } from "react-native-paper"; // Đổi tên Provider từ react-native-paper để không trùng
import { Provider as ReduxProvider } from "react-redux"; // Provider từ react-redux
import { store } from "@/store";
import { EventProvider } from "./eventContext";

// Import EventProvider từ file EventContext.tsx

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={{ dark: false }}>
        <EventProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="Competition_Content"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="EventDetail" options={{ headerShown: false }} />
            <Stack.Screen name="ListPlayers" options={{ headerShown: false }} />
            <Stack.Screen
              name="TotalEnd/Player_center"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TotalEnd/CustomKeyboard"
              options={{ headerShown: false }}
            />
          </Stack>
        </EventProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}
