import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const mockGroups = [
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

const GroupSearchScreen: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof mockGroups>([]);
  const [selected, setSelected] = useState<(typeof mockGroups)[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = () => {
    if (!query) {
      setResults([]);
      return;
    }
    setResults(mockGroups.filter((g) => g.name.includes(query)));
  };

  const handleSelect = (item: (typeof mockGroups)[0]) => {
    setSelected(item);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 상단 검색바 */}
      <View style={styles.searchBar}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/group/group-add",
              params: { from: "search" },
            })
          }
        >
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="검색어를 입력하세요"
          placeholderTextColor="#bbb"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={24} />
        </TouchableOpacity>
      </View>
      {/* 검색 결과 */}
      <FlatList
        style={styles.list}
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)}>
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.memberCount}>인원 {item.members}명</Text>
              </View>
              <Text style={styles.groupDesc}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<View />}
        showsVerticalScrollIndicator={false}
      />
      {/* 상세 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selected && (
              <>
                <View>
                  <View style={styles.modalTitleRow}>
                    <Text style={styles.groupName}>{selected.name}</Text>
                  </View>
                  <View style={styles.modalMemberRow}>
                    <Text style={styles.memberCount}>
                      인원 {selected.members}명
                    </Text>
                  </View>
                  <View style={styles.modalDescRow}>
                    <Text style={styles.groupDesc}>{selected.desc}</Text>
                  </View>
                </View>
                <View>
                  <View style={styles.modalBtnRow}>
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalBtnText}>그룹 가입</Text>
                    </TouchableOpacity>
                    <View style={{ width: 20 }} />
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalBtnText}>취소</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "90%",
    left: "5%",
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 32,
    backgroundColor: "#fff",
    boxShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.25)",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  list: {
    width: "90%",
    left: "5%",
  },
  card: {
    justifyContent: "space-between",
    height: 60,
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
  separator: {
    height: 1,
    backgroundColor: "#B4B4B4",
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    height: 250,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "space-between",
  },
  modalTitleRow: {
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalMemberRow: {
    width: "90%",
    marginLeft: "5%",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalDescRow: {
    width: "90%",
    marginLeft: "5%",
    paddingTop: 10,
  },
  modalBtnRow: {
    width: "90%",
    marginLeft: "5%",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalBtn: {},
  modalBtnText: {
    fontSize: 16,
  },
});

export default GroupSearchScreen;
