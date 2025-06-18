import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ProfileEditScreen: React.FC = () => {
  const router = useRouter();
  const [nickname, setNickname] = useState("갓생살기 프로젝트 😎");
  const [status, setStatus] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 프로필 사진 추가/수정 (임시: 실제 업로드 기능은 미구현)
  const handleProfileImage = () => {
    // 실제로는 이미지 선택/업로드 로직 필요
    setProfileImage("https://cdn-icons-png.flaticon.com/512/147/147144.png");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>프로필 수정</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={handleProfileImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="camera" size={40} color="#bbb" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.profileImageText}>
          {profileImage ? "프로필 사진 수정" : "프로필 사진 추가"}
        </Text>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="닉네임을 입력해주세요.."
          placeholderTextColor="#999"
        />
        <Text style={styles.label}>상태 메시지</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          value={status}
          onChangeText={setStatus}
          placeholder="상세 설명을 입력해주세요.."
          placeholderTextColor="#999"
          multiline
        />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>수정하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    justifyContent: "space-between",
    width: "90%",
    left: "5%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImageText: {
    marginTop: 8,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
    width: "90%",
    left: "5%",
  },
  label: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    width: "90%",
    left: "5%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileEditScreen;
