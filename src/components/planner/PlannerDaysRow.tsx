import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles/planner/plannerStyles";

interface PlannerDaysRowProps {
  dates: number[];
}

const days = ["일", "월", "화", "수", "목", "금", "토"];
const todayIdx = new Date().getDay();

const PlannerDaysRow: React.FC<PlannerDaysRowProps> = ({
  dates,
}: {
  dates: number[];
}) => {
  return (
    <View style={styles.daysRow}>
      {dates.map((date: number, idx: number) => (
        <React.Fragment key={idx}>
          <View style={styles.dayCol}>
            <Text style={styles.dayText}>{days[idx]}</Text>
            <Text style={idx === todayIdx ? styles.todayText : styles.dateText}>
              {date}
            </Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};

export default PlannerDaysRow;
