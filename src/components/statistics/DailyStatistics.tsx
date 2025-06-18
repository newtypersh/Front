import * as React from "react";
import { View, Text } from "react-native";
import StatisticsBarChart from "./StatisticsBarChart";
import StatisticsTimeChart from "./StatisticsTimeChart";
import { Ionicons } from "@expo/vector-icons";
import { mediaOrder } from "../../utils/homeLogic";

interface DeviceIconMap {
  [key: string]: { name: string; color: string };
}

interface DailyStatisticsProps {
  getTodayString: () => string;
  totalMinutes: number;
  barChartData: any[];
  chartHeight: number;
  days: string[];
  todayIdx: number;
  hourlyData: number[];
  mediaUsage: { [target: string]: number };
  deviceIconMap: DeviceIconMap;
  barDeviceColors: (idx: number) => string[];
  dailyTotalTime: { [key: string]: number };
  enabledTarget: any[];
}

const mediaColorMap: { [target: string]: string } = {
  "책 읽기": "#0000FF",
  "PC 보기": "#66FFFF",
  핸드폰: "#FFBF01",
};

const DailyStatistics = ({
  getTodayString,
  totalMinutes,
  barChartData,
  chartHeight,
  days,
  todayIdx,
  hourlyData,
  mediaUsage,
  deviceIconMap,
  barDeviceColors,
  dailyTotalTime,
  enabledTarget,
}: DailyStatisticsProps) => {
  const todayTotal =
    dailyTotalTime && dailyTotalTime[todayIdx] ? dailyTotalTime[todayIdx] : 0;
  // 시간대별 target별 사용량 누적 (stacked bar용)
  const hourTargetMatrix = Array.from({ length: 24 }, () =>
    mediaOrder.map(() => 0)
  );
  if (enabledTarget) {
    enabledTarget.forEach((item) => {
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);
      let cur = new Date(start);
      while (cur < end) {
        const hour = cur.getUTCHours();
        const idx = mediaOrder.indexOf(item.target);
        if (idx !== -1) hourTargetMatrix[hour][idx]++;
        cur.setUTCMinutes(cur.getUTCMinutes() + 1);
      }
    });
  }
  const timeChartData = hourTargetMatrix.map((arr, i) => ({
    label: `${i}시`,
    values: arr,
  }));

  return (
    <View
      style={{
        backgroundColor: "#F5F5F5",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "400",
          marginBottom: 8,
          color: "#222",
        }}
      >
        {getTodayString()}
      </Text>
      <Text style={{ fontSize: 18, fontWeight: "400", marginBottom: 12 }}>
        {Math.floor(todayTotal / 60)}시간 {Math.floor(todayTotal % 60)}분
      </Text>
      <StatisticsBarChart
        data={barChartData}
        deviceColors={barDeviceColors}
        yLabels={["8시간", "4시간", "0"]}
        height={chartHeight}
        stacked={false}
        labelKey="day"
        valueKey="values"
        barWidth={18}
        highlightDay={days[todayIdx]}
        todayIdx={todayIdx}
      />
      <StatisticsTimeChart
        data={timeChartData}
        deviceColors={barDeviceColors(todayIdx)}
        yLabels={["60분", "30분", "0"]}
        height={40}
        barWidth={6}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginTop: 8,
          width: "100%",
        }}
      >
        {Object.entries(mediaUsage).map(([target, min]) => (
          <React.Fragment key={target}>
            <View style={{ alignItems: "center", width: "33%" }}>
              <Ionicons
                name={deviceIconMap[target]?.name || "help-circle-outline"}
                size={18}
                color={
                  mediaColorMap[target] ||
                  deviceIconMap[target]?.color ||
                  "#888"
                }
                style={{ marginBottom: 2 }}
              />
              <Text style={{ fontSize: 12, color: "#222", marginBottom: 2 }}>
                {target}
              </Text>
              <Text style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>
                {Math.floor(min / 60)}시간 {min % 60}분
              </Text>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

export default DailyStatistics;
