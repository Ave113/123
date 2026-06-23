// src/core/solarTime.ts
// Chuẩn hóa thời gian MỘT LẦN -> feed cho cả iztro (Tử Vi) và tyme4ts (Bát Tự)
// Giải quyết 2 sai số kinh điển: True Solar Time (kinh độ) + Giờ Tý sớm/muộn (子时分日)

import type { BirthInput, ResolvedTime, ZiHourMode } from './types';

const CHINA_STD_LON = 120; // mốc múi giờ GMT+8 chuẩn lịch pháp Trung Hoa

/** Đổi (year,month,day) +/- số ngày, an toàn qua mốc tháng/năm */
function addDays(y: number, m: number, d: number, delta: number) {
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

/** hourIndex theo địa chi: 0=Tý(23-1),1=Sửu(1-3)...11=Hợi(21-23) — khớp iztro */
export function toHourIndex(hour: number): number {
  // 23 và 0 đều là giờ Tý (index 0)
  return Math.floor(((hour + 1) % 24) / 2);
}

/**
 * Chuẩn hóa thời gian sinh.
 * - useTrueSolar: dịch phút theo (lonE - 120) * 4
 * - ziHourMode 'late' (晚子时): nếu rơi vào 23:xx -> ngày lập số = ngày hôm sau
 * - ziHourMode 'early' (早子时): giữ nguyên ngày
 * Kết quả {chartDate, hourIndex} dùng CHUNG cho cả hai engine để không lệch ngày.
 */
export function resolveTime(input: BirthInput): ResolvedTime {
  const ziHourMode: ZiHourMode = input.ziHourMode ?? 'late';
  let { year, month, day, hour, minute } = input;
  let deltaMin = 0;

  if (input.useTrueSolar && typeof input.lonE === 'number') {
    deltaMin = Math.round((input.lonE - CHINA_STD_LON) * 4); // 1° = 4 phút
    const total = hour * 60 + minute + deltaMin;
    const dayShift = Math.floor(total / (24 * 60));
    let norm = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
    hour = Math.floor(norm / 60);
    minute = norm % 60;
    if (dayShift !== 0) {
      const s = addDays(year, month, day, dayShift);
      year = s.y; month = s.m; day = s.d;
    }
  }

  const solarHour = hour;
  const solarMinute = minute;

  // Xử lý giờ Tý muộn: 23:00-23:59 thuộc trụ ngày hôm sau
  let chartYear = year, chartMonth = month, chartDay = day;
  if (ziHourMode === 'late' && hour === 23) {
    const s = addDays(year, month, day, 1);
    chartYear = s.y; chartMonth = s.m; chartDay = s.d;
  }

  return {
    chartYear, chartMonth, chartDay,
    hourIndex: toHourIndex(hour),
    solarHour, solarMinute,
    trueSolarDeltaMin: deltaMin,
    ziHourMode,
  };
}
