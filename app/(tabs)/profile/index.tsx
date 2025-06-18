import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Stack } from "expo-router";

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청 (세션 쿠키 만료)
      await axios.get("http://18.208.62.86:3000/logout", {
        withCredentials: true,
      });
    } catch (e) {}
    setModalVisible(false);
    router.replace("/(auth)/login");
  };

  return (
    <>
      <Stack.Screen options={{ animation: "slide_from_left" }} />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Text style={styles.title}>설정</Text>
        <View style={styles.menuList}>
          <TouchableOpacity onPress={() => router.push("/profile/edit")}>
            <Text style={styles.menuItem}>프로필 수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/profile/allowed-actions")}
          >
            <Text style={styles.menuItem}>허용할 동작</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.menuItem}>로그아웃</Text>
          </TouchableOpacity>
        </View>
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>로그아웃 하시겠습니까?</Text>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={styles.confirmText}>확인</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    left: "5%",
    width: "90%",
  },
  menuList: {
    left: "5%",
    width: "90%",
  },
  menuItem: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
    height: 150,
  },
  modalText: {
    fontSize: 20,
    marginTop: 50,
    marginBottom: 30,
    textAlign: "center",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  confirmText: {
    color: "red",
    fontSize: 16,
  },
  cancelText: {
    color: "blue",
    fontSize: 16,
  },
});

export default ProfileScreen;
