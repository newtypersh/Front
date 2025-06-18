import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const GroupCreateScreen: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // 그룹 생성 함수
  const handleCreateGroup = async () => {
    try {
      const payload = {
        name: name,
        description: desc,
      };
      await axios.post(`${BACKEND_URL}/group`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      router.back(); // 성공 시 이전 페이지로 이동
    } catch (e) {
      alert("그룹 생성에 실패했습니다.");
    }
  };

  const handleFabPress = () => {
    if (isEdit) {
      setIsEdit(false);
      router.push({ pathname: "/group/group-add", params: { from: "create" } });
    } else {
      setIsEdit(true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/group/group-add",
                  params: { from: "create" },
                })
              }
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>스터디 정보를 설정해 주세요</Text>

          <Text style={styles.label}>스터디 이름</Text>
          <TextInput
            style={styles.input}
            placeholder="스터디 이름을 입력해주세요."
            placeholderTextColor="#bbb"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>상세 설명</Text>
          <TextInput
            style={styles.textarea}
            placeholder="상세 설명을 입력해주세요."
            placeholderTextColor="#bbb"
            value={desc}
            onChangeText={setDesc}
            multiline
            numberOfLines={4}
          />

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={styles.createBtn}
            onPress={handleCreateGroup}
          >
            <Text style={styles.createBtnText}>스터디 그룹 생성</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    width: "90%",
    left: "5%",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    width: "90%",
    left: "5%",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    width: "90%",
    left: "5%",
    marginBottom: 20,
  },
  input: {
    position: "relative",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 20,
    color: "#222",
    width: "90%",
    left: "5%",
  },
  textarea: {
    position: "relative",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    minHeight: 90,
    textAlignVertical: "top",
    color: "#222",
    width: "90%",
    left: "5%",
  },
  createBtn: {
    position: "absolute",
    bottom: 24,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 32,
    width: "90%",
    left: "5%",
  },
  createBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default GroupCreateScreen;
