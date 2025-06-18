import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import axios from "axios";
import styles from "../../styles/planner/plannerStyles";

// 기존 12AM~11PM, 23칸 방식
const hours = [
  ...Array.from({ length: 12 }, (_, i) => `${i + 1} AM`),
  ...Array.from({ length: 11 }, (_, i) => `${i + 1} PM`),
];

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const HOUR_HEIGHT = 40; // 한 시간당 그리드 높이(px)
const DAY_WIDTH = 48; // 한 요일당 그리드 너비(px)
const START_HOUR = 0; // 0시부터 시작

const PlannerGrid = () => {
  const [weekly, setWeekly] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeekly = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/schedule/weekly`, {
          headers: { Accept: "application/json" },
        });
        setWeekly(res.data.success?.schedules || {});
        console.log(res.data.success?.schedules);
      } catch (e) {
        setWeekly({});
      } finally {
        setLoading(false);
      }
    };
    fetchWeekly();
  }, []);

  if (loading) return <Text>로딩중...</Text>;

  return (
    <View style={styles.gridContainer}>
      {/* 시간 라벨 */}
      <View style={styles.timeCol}>
        {hours.map((h, i) => (
          <React.Fragment key={h}>
            <Text style={styles.timeText}>{h}</Text>
          </React.Fragment>
        ))}
      </View>
      {/* 그리드와 일정 */}
      <View style={styles.gridContent}>
        {/* 요일별 일정 렌더링 */}
        {Object.keys(weekly).map((day, dayIdx) => {
          const daySchedules = Array.isArray(weekly[day]) ? weekly[day] : [];
          return (
            <React.Fragment key={day}>
              {daySchedules.map((item: any, idx: number) => {
                const start = new Date(item.startDate);
                const end = new Date(item.endDate);
                const startHour = start.getHours();
                const startMin = start.getMinutes();
                // top: 시작 시간 + 분 단위 보정 + 2칸 아래로 이동
                const top =
                  (startHour - START_HOUR + startMin / 60) * HOUR_HEIGHT +
                  2 * HOUR_HEIGHT;
                // height: (종료 - 시작) 시간 + 분 단위 보정
                const duration =
                  (end.getTime() - start.getTime()) / (1000 * 60 * 60); // 시간 단위
                const height = Math.max(duration * HOUR_HEIGHT, 20); // 최소 높이 20
                // left: 요일별 위치 (day * DAY_WIDTH)
                const left = parseInt(day) * DAY_WIDTH;
                return (
                  <React.Fragment key={item.id ?? idx}>
                    <View
                      style={[
                        styles.eventBlock,
                        { top, left, height, position: "absolute", zIndex: 2 },
                      ]}
                    >
                      <Text style={styles.eventText}>{item.title}</Text>
                    </View>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}
        {/* 그리드 라인 */}
        {[...Array(23)].map((_, row) => (
          <React.Fragment key={row}>
            <View
              style={[styles.gridRow, { top: HOUR_HEIGHT * row, zIndex: 1 }]}
            />
          </React.Fragment>
        ))}
        {[...Array(7)].map((_, col) => (
          <React.Fragment key={col}>
            <View
              style={[styles.gridCol, { left: DAY_WIDTH * col, zIndex: 1 }]}
            />
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

export default PlannerGrid;
