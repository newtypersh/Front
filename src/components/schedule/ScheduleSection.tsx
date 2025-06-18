import React from "react";
import { View, Text } from "react-native";
import Card from "../../components/common/Card";

export interface ScheduleItem {
  title: string;
  time: string;
  duration: string;
  progress: number;
  active?: boolean;
}

interface ScheduleSectionProps {
  upcoming: ScheduleItem[];
  ongoing: ScheduleItem[];
  completed: ScheduleItem[];
}

const ScheduleSection = ({
  upcoming,
  ongoing,
  completed,
}: ScheduleSectionProps) => (
  <View style={{ width: "90%", left: "5%" }}>
    <View style={{ marginBottom: 40 }}>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>예정된 일정</Text>
      {upcoming.map((item: ScheduleItem, idx: number) => (
        <Card key={idx} {...item} />
      ))}
    </View>
    <View style={{ marginBottom: 40 }}>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>진행 중인 일정</Text>
      {ongoing.map((item: ScheduleItem, idx: number) => (
        <Card key={idx} {...item} active />
      ))}
    </View>
    <View style={{ marginBottom: 40 }}>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>완료된 일정</Text>
      {completed.map((item: ScheduleItem, idx: number) => (
        <Card key={idx} {...item} />
      ))}
    </View>
  </View>
);

export default ScheduleSection;
