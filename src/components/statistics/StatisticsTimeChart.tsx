import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TimeChartProps {
  data: { label: string; values: number[]; target?: string }[];
  deviceColors: string[];
  yLabels?: string[];
  height?: number;
  barWidth?: number;
  maxMinute?: number;
}

// 매체별 색상 매핑
const targetColorMap: { [key: string]: string } = {
  "책 읽기": "#0000FF",
  "PC 보기": "#66FFFF",
  핸드폰: "#FFBF01",
};

const chunkArray = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const StatisticsTimeChart: React.FC<TimeChartProps> = ({
  data,
  deviceColors,
  yLabels = ["60분", "30분", "0"],
  height = 60,
  barWidth = 16,
  maxMinute,
}: TimeChartProps) => {
  // 최대값(분 단위) 기준. 동적으로 계산
  const dynamicMax =
    maxMinute ||
    Math.max(1, ...data.map((d) => d.values.reduce((a, b) => a + b, 0)));

  const showLabels = ["오전 12시", "오전 6시", "오후 12시", "오후 6시"];
  const groupedData = chunkArray(data, 6);
  return (
    <>
      <View style={styles.row}>
        {groupedData.map((group, groupIdx) => (
          <React.Fragment key={`group-${groupIdx}`}>
            <View style={styles.barLabel}>
              <View style={styles.barGroup}>
                {group.map((item, idx) => (
                  <React.Fragment key={item.label || idx}>
                    <View style={styles.col}>
                      <View style={[styles.barBg, { height, width: barWidth }]}>
                        {item.values.map((v: number, i: number) => (
                          <React.Fragment key={i}>
                            <View
                              style={{
                                height: (v / dynamicMax) * height,
                                backgroundColor:
                                  targetColorMap[item.target || ""] ||
                                  (deviceColors && deviceColors[i]) ||
                                  "#FF0000",
                                width: barWidth,
                              }}
                            />
                          </React.Fragment>
                        ))}
                      </View>
                    </View>
                  </React.Fragment>
                ))}
              </View>
              <Text style={styles.showLabel}>{showLabels[groupIdx]}</Text>
            </View>
          </React.Fragment>
        ))}
        {/* y축 라벨 */}
        <View style={[styles.yAxis, { height: height }]}>
          {yLabels.map((l, i) => (
            <React.Fragment key={i}>
              <Text style={styles.yLabel}>{l}</Text>
            </React.Fragment>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  col: {
    alignItems: "center",
    marginHorizontal: 2,
  },
  barBg: {
    justifyContent: "flex-end",
    marginBottom: 2,
    overflow: "hidden",
  },
  barLabel: {
    flexDirection: "column",
  },
  barGroup: {
    flexDirection: "row",
    marginHorizontal: 2,
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  showLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    paddingLeft: 4,
  },
  yAxis: {
    justifyContent: "space-between",
    marginLeft: 10,
    marginBottom: 20,
  },
  yLabel: {
    fontSize: 12,
    color: "#bbb",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    paddingBottom: 20,
  },
});

export default StatisticsTimeChart;
