import { EnabledTarget } from "./statistics";

export const days = ["일", "월", "화", "수", "목", "금", "토"];
export const maxMinutes = 480;
export const maxHours = 8;

// 매체별 색상 순서와 매핑
export const mediaOrder = ["책 읽기", "PC 보기", "핸드폰"];
export const mediaColors = ["#0000FF", "#66FFFF", "#FFBF01"];

export function getTodayIdx(): number {
  return new Date().getDay();
}

export function getBarChartData(
  dailyTotalTime: { [key: string]: number },
  todayIdx?: number,
  enabledTarget?: EnabledTarget[]
) {
  // 오늘 매체별 사용시간 계산
  let todayMediaUsage: { [target: string]: number } = {};
  if (enabledTarget && todayIdx !== undefined) {
    enabledTarget.forEach((item) => {
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);
      const diffMin = Math.floor((end.getTime() - start.getTime()) / 60000);
      if (diffMin > 0) {
        if (!todayMediaUsage[item.target]) todayMediaUsage[item.target] = 0;
        todayMediaUsage[item.target] += diffMin;
      }
    });
  }
  return days.map((day, idx) => {
    if (todayIdx !== undefined && idx === todayIdx && enabledTarget) {
      // 오늘: 매체별 stacked bar
      const values = mediaOrder.map((target) =>
        Math.min((todayMediaUsage[target] || 0) / 60, maxHours)
      );
      const total = values.reduce((a, b) => a + b, 0);
      return { day, values, total };
    } else {
      // 나머지 요일: 단일값 bar
      let min = dailyTotalTime[idx] || 0;
      if (min < 0) min = 0;
      const hours = Math.min(min / 60, maxHours);
      return {
        day,
        values: [hours],
        total: hours,
      };
    }
  });
}
