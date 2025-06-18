import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

const AllowedActionsScreen: React.FC = () => {
  const router = useRouter();
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const fetchAllowedActions = async () => {
      try {
        const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

        const response = await axios.get(`${apiUrl}/focusTarget`, {
          headers: { "Content-Type": "application/json" },
        });
        const targets = response.data.success?.targets || [];
        setActions(targets);
        const initialStates: { [key: string]: boolean } = {};
        targets.forEach((item: any) => {
          const statusNum =
            typeof item.status === "string"
              ? parseInt(item.status, 10)
              : item.status;
          initialStates[item.id] = statusNum === 1;
        });
        setSwitchStates(initialStates);
      } catch (error) {
        console.error("허용 동작 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllowedActions();
  }, []);

  const handleSwitch = async (id: string, value: boolean) => {
    setSwitchStates((prev) => ({ ...prev, [id]: value }));
    try {
      const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
      let axiosConfig: any = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      if (Platform.OS === "web") {
        axiosConfig.withCredentials = true;
      }

      if (value) {
        await axios.patch(
          `${apiUrl}/focusTarget/enable/${id}`,
          {},
          axiosConfig
        );
      } else {
        await axios.patch(
          `${apiUrl}/focusTarget/disable/${id}`,
          {},
          axiosConfig
        );
      }
    } catch (error) {
      // 실패 시 스위치 상태 롤백
      setSwitchStates((prev) => ({ ...prev, [id]: !value }));
      alert("상태 변경에 실패했습니다.");
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>허용할 동작</Text>
        <View style={{ width: 24 }} />
      </View>
      {/* 스위치 리스트 */}
      <View style={styles.switchList}>
        {actions.map((item) => (
          <React.Fragment key={item.id}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>{item.target}</Text>
              <Switch
                value={switchStates[item.id] || false}
                onValueChange={(value) => handleSwitch(item.id, value)}
              />
            </View>
          </React.Fragment>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
    width: "90%",
    left: "5%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  switchList: {
    left: "5%",
    width: "90%",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 18,
  },
});

export default AllowedActionsScreen;
