// enabledTarget 타입 정의
export interface EnabledTarget {
  target: string;
  startTime: string;
  endTime: string;
}

export function calculateStatistics(enabledTarget: EnabledTarget[]) {
  let total = 0;
  let hourly = Array(24).fill(0);
  let media: { [target: string]: number } = {};

  enabledTarget.forEach((item) => {
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);
    const diffMin = Math.floor((end.getTime() - start.getTime()) / 60000);
    if (diffMin > 0) {
      total += diffMin;
      if (!media[item.target]) media[item.target] = 0;
      media[item.target] += diffMin;

      let cur = new Date(start);
      while (cur < end) {
        const hour = cur.getUTCHours();
        hourly[hour]++;
        cur.setUTCMinutes(cur.getUTCMinutes() + 1);
      }
    }
  });

  return {
    totalMinutes: total,
    hourlyData: hourly,
    mediaUsage: media,
  };
}
