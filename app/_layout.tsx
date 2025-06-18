import { Slot, useRouter, useSegments, Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View, Platform } from "react-native";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // segments[0]가 준비되지 않았으면 아무것도 하지 않음
    if (!segments?.[0]) return;

    const checkLogin = async () => {
      let token = null;
      if (Platform.OS === "web") {
        token = localStorage.getItem("token");
      } else {
        token = await SecureStore.getItemAsync("token");
      }
      // (auth) 경로가 아니고, 토큰이 없으면 로그인으로 이동
      // if (!token && segments[0] !== "(auth)") {
      //   router.replace("/(auth)/login");
      // }
      // 토큰이 있는데 (auth) 경로에 있으면 홈으로 이동
      if (token && segments[0] === "(auth)") {
        router.replace("/");
      }
      setIsLoading(false);
    };
    checkLogin();
  }, [segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // 오른쪽 -> 왼쪽 슬라이드 애니메이션
        headerShown: false, // 상단 헤더 숨김
      }}
    />
  );
}
