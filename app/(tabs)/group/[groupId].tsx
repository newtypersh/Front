import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// 더미 데이터 예시 (이미지와 유사하게)
const dummyMembers = [
  { id: 1, name: "안성진", todayStudy: 1845, status: "오프라인" },
  { id: 2, name: "유승환", todayStudy: 1000, status: "오프라인" },
  { id: 3, name: "하대훈", todayStudy: 621, status: "오프라인" },
];

function formatTime(seconds: number) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const GroupDetailScreen: React.FC = () => {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();
  const [members, setMembers] = useState(dummyMembers);
  const groupName = "📚 갓생스터디"; // 예시 그룹명(이모지 포함)

  // 순차적으로 상태 변경 및 todayStudy 증가
  React.useEffect(() => {
    let interval1: NodeJS.Timeout | null = null;
    let interval2: NodeJS.Timeout | null = null;
    let interval3: NodeJS.Timeout | null = null;
    // 3초 뒤 id:1 활성화
    const timeout1 = setTimeout(() => {
      setMembers((prev) =>
        prev.map((m) => (m.id === 1 ? { ...m, status: "책 읽기" } : m))
      );
      interval1 = setInterval(() => {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === 1 ? { ...m, todayStudy: m.todayStudy + 1 } : m
          )
        );
      }, 1000);
      // 3초 뒤 id:2 활성화
      const timeout2 = setTimeout(() => {
        setMembers((prev) =>
          prev.map((m) => (m.id === 2 ? { ...m, status: "PC 보기" } : m))
        );
        interval2 = setInterval(() => {
          setMembers((prev) =>
            prev.map((m) =>
              m.id === 2 ? { ...m, todayStudy: m.todayStudy + 1 } : m
            )
          );
        }, 1000);
        // 3초 뒤 id:3 활성화
        const timeout3 = setTimeout(() => {
          setMembers((prev) =>
            prev.map((m) => (m.id === 3 ? { ...m, status: "핸드폰" } : m))
          );
          interval3 = setInterval(() => {
            setMembers((prev) =>
              prev.map((m) =>
                m.id === 3 ? { ...m, todayStudy: m.todayStudy + 1 } : m
              )
            );
          }, 1000);
        }, 3000);
        // timeout3 클리너
        return () => clearTimeout(timeout3);
      }, 3000);
      // timeout2 클리너
      return () => clearTimeout(timeout2);
    }, 3000);
    // cleanup
    return () => {
      clearTimeout(timeout1);
      if (interval1) clearInterval(interval1);
      if (interval2) clearInterval(interval2);
      if (interval3) clearInterval(interval3);
    };
  }, []);

  // 실제로는 useEffect에서 groupId로 API 호출하여 멤버 정보 fetch

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/group")}>
          <Ionicons
            name="chevron-back"
            size={24}
            color="#222"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.groupName}>{groupName}</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            <View style={styles.cardRow}>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberStatus}>{item.status}</Text>
            </View>
            <View style={styles.cardRowBottom}>
              <Text style={styles.memberTime}>
                {formatTime(item.todayStudy)}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingTop: 12 }}
      />
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
  backArrow: {
    width: 24,
    textAlign: "left",
  },
  groupName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    flex: 1,
  },
  memberCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    minHeight: 100,
    justifyContent: "space-between",
    width: "90%",
    left: "5%",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardRowBottom: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginTop: 18,
  },
  memberName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },
  memberStatus: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
    marginLeft: 8,
  },
  memberTime: {
    fontSize: 24,
    color: "#222",
    letterSpacing: 1,
  },
});

export default GroupDetailScreen;
