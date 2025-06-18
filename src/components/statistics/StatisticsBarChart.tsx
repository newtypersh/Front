import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BarChartProps {
  data: any[];
  deviceColors: (idx: number) => string[];
  yLabels: string[];
  height?: number;
  stacked?: boolean;
  labelKey?: string;
  valueKey?: string;
  barWidth?: number;
  highlightDay?: string | string[];
  todayIdx?: number;
}

const StatisticsBarChart: React.FC<BarChartProps> = ({
  data,
  deviceColors,
  yLabels,
  height = 106,
  stacked = true,
  labelKey = "day",
  valueKey = "values",
  barWidth = 18,
  highlightDay,
  todayIdx,
}: BarChartProps) => {
  const maxHour = 8; // 8시간 기준만 사용
  // highlightDay를 배열로 변환
  const highlightDays =
    highlightDay === undefined
      ? []
      : Array.isArray(highlightDay)
      ? highlightDay
      : [highlightDay];
  return (
    <View style={styles.barChartRow}>
      {data.map((item: any, idx: number) => {
        // 오늘 요일만 stacked, 나머지는 단일 bar
        const isStacked =
          todayIdx !== undefined
            ? idx === todayIdx
            : highlightDays.length === 0
            ? stacked
            : highlightDays.includes(item[labelKey])
            ? true
            : false;
        const totalHour =
          item.total ??
          (isStacked
            ? item[valueKey].reduce((a: number, b: number) => a + b, 0)
            : item[valueKey]);
        const barHeight = (totalHour / maxHour) * height;
        // 오늘이 아닌 경우 색상 #D9D9D9, 오늘(혹은 highlightDay)이면 deviceColors(idx)
        const barColor = isStacked
          ? deviceColors(idx)[0]
          : highlightDays.includes(item[labelKey])
          ? deviceColors(idx)[0]
          : "#D9D9D9";
        return (
          <React.Fragment key={item[labelKey] || idx}>
            <View style={styles.barCol}>
              <View
                style={[styles.barBg, { width: barWidth, height: barHeight }]}
              >
                {isStacked ? (
                  item[valueKey].map((v: number, i: number) => (
                    <React.Fragment key={i}>
                      <View
                        style={{
                          height: (v / maxHour) * height,
                          backgroundColor: deviceColors(idx)[i],
                          width: barWidth,
                        }}
                      />
                    </React.Fragment>
                  ))
                ) : (
                  <View
                    style={{
                      height: (item[valueKey] / maxHour) * height,
                      backgroundColor: barColor,
                      width: barWidth,
                      position: "absolute",
                      bottom: 0,
                    }}
                  />
                )}
              </View>
              <Text style={styles.barLabel}>{item[labelKey]}</Text>
            </View>
          </React.Fragment>
        );
      })}
      {/* y축 라벨 */}
      <View style={[styles.yAxis, { height: height + 20 }]}>
        {yLabels.map((l: string, i: number) => (
          <React.Fragment key={i}>
            <Text style={styles.yLabel}>{l}</Text>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barChartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  barCol: {
    alignItems: "center",
    marginLeft: 7,
    marginHorizontal: 14,
  },
  barBg: {
    backgroundColor: "#e0e0e0",
    justifyContent: "flex-end",
    marginBottom: 2,
    overflow: "hidden",
  },
  barLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  yAxis: {
    justifyContent: "space-between",
    marginLeft: 10,
    paddingBottom: 20,
  },
  yLabel: {
    fontSize: 12,
    color: "#bbb",
  },
});

export default StatisticsBarChart;
