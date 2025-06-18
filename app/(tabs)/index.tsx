import * as React from "react";
import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import { calculateStatistics } from "../../src/utils/statistics";
import DailyStatistics from "../../src/components/statistics/DailyStatistics";
import {
  days,
  getTodayIdx,
  getBarChartData,
  mediaColors,
} from "../../src/utils/homeLogic";
import { createStatusWebSocket } from "../../src/utils/websocket";
import ScheduleSection, {
  ScheduleItem,
} from "../../src/components/schedule/ScheduleSection";
import styles from "../../src/styles/HomeScreen.styles";
import { useFocusEffect } from "@react-navigation/native";

const backendURL = process.env.EXPO_PUBLIC_BACKEND_URL;
const WS_URL = "ws://your-server-url/status"; // 실제 웹소켓 주소로 변경 필요

const RECONNECT_INTERVAL = 3000; // 3초 후 재연결

const getTodayString = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  return `${month}월 ${date}일`;
};

// 백엔드 요일 인덱스(0=일, 1=월, ..., 6=토) → 프론트 요일 인덱스(0=일, ..., 6=토)로 변환
function convertBackendDailyTotalTime(backend: { [key: string]: number }) {
  // 백엔드: 0=일, 1=월, ..., 6=토
  // 프론트: 0=일, 1=월, ..., 6=토
  const result: { [key: number]: number } = {};
  for (let i = 0; i < 7; i++) {
    result[i] = backend[i] || 0;
  }
  return result;
}

const HomeScreen: React.FC = () => {
  const router = useRouter();

  // 임시 영상 촬영용 타이머/상태
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("책 읽기");
  const [timer, setTimer] = useState("00:00:00");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [dailyTotalTime, setDailyTotalTime] = useState<{
    [key: string]: number;
  }>({});
  const [enabledTarget, setEnabledTarget] = useState<any[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [hourlyData, setHourlyData] = useState<number[]>(Array(24).fill(0));
  const [mediaUsage, setMediaUsage] = useState<{ [target: string]: number }>(
    {}
  );

  // 매체별 아이콘 매핑
  const deviceIconMap: { [key: string]: { name: string; color: string } } = {
    "책 읽기": { name: "book", color: "#2196F3" },
    "PC 보기": { name: "laptop", color: "#FFC107" },
    핸드폰: { name: "phone-portrait", color: "#4CAF50" },
    // 필요시 추가
  };

  useFocusEffect(
    React.useCallback(() => {
      setCount(0);
      setStatus("책 읽기");
      setTimer("00:00:00");
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCount((prev) => {
          if (prev < 32) {
            return prev + 1;
          } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
        });
      }, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [])
  );

  useEffect(() => {
    // 타이머 포맷팅
    const h = String(Math.floor(count / 3600)).padStart(2, "0");
    const m = String(Math.floor((count % 3600) / 60)).padStart(2, "0");
    const s = String(count % 60).padStart(2, "0");
    setTimer(`${h}:${m}:${s}`);
    if (count >= 32) {
      setStatus("핸드폰");
    } else {
      setStatus("책 읽기");
    }
  }, [count]);

  useEffect(() => {
    axios
      .get(`${backendURL}/focusTarget/statistics/daily`)
      .then((res) => {
        const data = res.data.success;
        setDailyTotalTime(convertBackendDailyTotalTime(data.dailyTotalTime));
        setEnabledTarget(data.today.enabledTarget);

        // 분리된 유틸 함수로 통계 계산
        const { totalMinutes, hourlyData, mediaUsage } = calculateStatistics(
          data.today.enabledTarget
        );
        setTotalMinutes(totalMinutes);
        setHourlyData(hourlyData);
        setMediaUsage(mediaUsage);
      })
      .catch((err) => {
        // 에러 처리
        console.error(err);
      });
  }, []);

  // 웹 환경에서 body minHeight를 동적으로 조정
  useEffect(() => {
    if (Platform.OS === "web") {
      const prev = document.body.style.minHeight;
      document.body.style.minHeight = "100vh";
      return () => {
        document.body.style.minHeight = prev;
      };
    }
  }, []);

  // 오늘 요일 인덱스 구하기
  const todayIdx = getTodayIdx();

  // dailyTotalTime에서 요일별로 데이터 추출 및 변환 (오늘은 stacked)
  const barChartData = getBarChartData(dailyTotalTime, todayIdx, enabledTarget);

  // 오늘 요일만 stacked, 색상도 다중 색상 적용
  const barDeviceColors = (idx: number) =>
    idx === todayIdx ? mediaColors : ["#2196F3"];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* 상단 날짜 및 상태 */}
        <View style={styles.header}>
          <Text style={styles.date}>{getTodayString()}</Text>
          <Text style={styles.status}>{status}</Text>
        </View>
        {/* 프로필/타이머 */}
        <View style={styles.profileTimerRow}>
          <View style={styles.profileCircle}>
            <Image
              source={require("../../assets/profile.png")}
              style={{ width: 64, height: 64, borderRadius: 32 }}
            />
          </View>
          <Text style={styles.timer}>{timer}</Text>
        </View>
        {/* 일정 섹션 */}
        <ScheduleSection
          upcoming={[
            {
              title: "모의고사 풀기",
              time: "오후 5시 ~ 오후 7시",
              duration: "1h 30m",
              progress: 0.6,
            },
          ]}
          ongoing={[
            {
              title: "영단어 공부",
              time: "오후 8시 ~ 오후 9시",
              duration: "30m",
              progress: 0.8,
              active: true,
            },
          ]}
          completed={[
            {
              title: "물리 복습",
              time: "오후 10시 30분 ~ 오후 11시 15분",
              duration: "20m",
              progress: 0.2,
            },
          ]}
        />
        {/* 플래너 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>플래너</Text>
          <TouchableOpacity
            style={styles.plannerBtn}
            onPress={() => router.push("/planner")}
          >
            <Text style={styles.plannerBtnText}>플래너 편집하기</Text>
          </TouchableOpacity>
        </View>
        {/* 일간 통계 요약 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>일간 통계</Text>
          <DailyStatistics
            getTodayString={getTodayString}
            totalMinutes={totalMinutes}
            barChartData={barChartData}
            chartHeight={72}
            days={days}
            todayIdx={todayIdx}
            hourlyData={hourlyData}
            mediaUsage={mediaUsage}
            deviceIconMap={deviceIconMap}
            barDeviceColors={barDeviceColors}
            dailyTotalTime={dailyTotalTime}
            enabledTarget={enabledTarget}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
