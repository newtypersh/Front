import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CalendarList } from "react-native-calendars";
import styles from "../../styles/planner/plannerStyles";

interface PlannerHeaderProps {
  month: number;
  showCalendar: boolean;
  setShowCalendar: (v: (prev: boolean) => boolean) => void;
  selectedDate: string;
  onDaySelect: (day: { dateString: string }) => void;
}

const PlannerHeader = ({
  month,
  showCalendar,
  setShowCalendar,
  selectedDate,
  onDaySelect,
}: PlannerHeaderProps) => {
  const router = useRouter();
  return (
    <View>
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{month}월</Text>
        <TouchableOpacity onPress={() => setShowCalendar((v: boolean) => !v)}>
          <Ionicons
            name={showCalendar ? "chevron-up" : "chevron-down"}
            size={16}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <CalendarList
            current={selectedDate}
            onDayPress={onDaySelect}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "#4CAF50" },
            }}
            theme={{
              todayTextColor: "#4CAF50",
              selectedDayBackgroundColor: "#4CAF50",
              arrowColor: "#4CAF50",
              textDayFontSize: 13,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
              monthTextColor: "#4CAF50",
            }}
            hideExtraDays={false}
            firstDay={0}
            renderArrow={() => null}
            horizontal={false}
            decelerationRate="fast"
            pastScrollRange={12}
            futureScrollRange={12}
            showScrollIndicator={true}
            calendarHeight={328}
          />
        </View>
      )}
    </View>
  );
};

export default PlannerHeader;
