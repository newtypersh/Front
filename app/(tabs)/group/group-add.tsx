import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const groups = [
  {
    id: "1",
    name: "갓생살기 프로젝트 😎",
    desc: "갓생살기 프로젝트",
    members: 3,
  },
  {
    id: "2",
    name: "갓생살기 프로젝트 😎",
    desc: "갓생살기 프로젝트",
    members: 3,
  },
];

const GroupAddScreen: React.FC = () => {
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const params = useLocalSearchParams();
  const from = params.from;
  const animation = from ? "slide_from_left" : "slide_from_right";

  // 버튼 이외 영역 클릭 시 +버튼으로 복귀
  const handleBackgroundPress = () => {
    if (isEdit) setIsEdit(false);
  };

  // 플로팅 버튼 클릭 시 동작
  const handleFabPress = () => {
    if (isEdit) {
      setIsEdit(false);
      router.push("/group/group-create");
    } else {
      setIsEdit(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Stack.Screen options={{ animation }} />
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/group")}>
              <Ionicons name="chevron-back" size={24} color="#222" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>스터디 그룹</Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/group/group-search",
                  params: { from: "add" },
                })
              }
            >
              <Ionicons name="search" size={24} color="#222" />
            </TouchableOpacity>
          </View>
          {/* 그룹 카드 리스트 */}
          <FlatList
            style={styles.list}
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardRow}>
                  <Text style={styles.groupName}>{item.name}</Text>
                  <Text style={styles.memberCount}>인원 {item.members}명</Text>
                </View>
                <Text style={styles.groupDesc}>{item.desc}</Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
          {/* 플로팅 버튼 */}
          <TouchableOpacity
            style={[styles.fab, isEdit && styles.fabEdit]}
            activeOpacity={0.7}
            onPress={handleFabPress}
          >
            {isEdit ? (
              <Ionicons name="pencil" size={28} color="#fff" />
            ) : (
              <Ionicons name="add" size={36} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    color: "#222",
  },
  list: {
    width: "90%",
    left: "5%",
  },
  card: {
    width: "100%",
    height: 100,
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  memberCount: {
    fontSize: 16,
    color: "#999",
  },
  groupDesc: {
    fontSize: 16,
    color: "#999",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 36,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  fabEdit: {
    backgroundColor: "#000",
  },
});

export default GroupAddScreen;
