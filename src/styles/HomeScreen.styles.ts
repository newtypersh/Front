import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    width: "90%",
    left: "5%",
  },
  date: {
    fontSize: 24,
    fontWeight: "500",
  },
  status: {
    fontSize: 24,
    fontWeight: "500",
  },
  profileTimerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    left: "5%",
    marginBottom: 40,
  },
  profileCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    letterSpacing: 2,
    marginLeft: 10,
  },
  section: {
    width: "90%",
    left: "5%",
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  plannerBtn: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  plannerBtnText: {
    fontSize: 16,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E0DF",
    paddingVertical: 8,
    marginTop: 10,
  },
  tabItem: {
    alignItems: "center",
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: "#BDBDBD",
    marginTop: 2,
  },
});

export default styles;
