import { astro } from 'iztro';
import { TU_HOA_BY_YEAR_MOD } from './tuHoa';

// Offset minutes translation table for Tý hour by Lunar Month (1 to 12)
// This value is the offset in minutes relative to the standard start of Tý (23:00)
// Month 1: 23:30 (offset +30)
// Month 2: 23:40 (offset +40)
// Month 3: 23:50 (offset +50)
// Month 4: 00:00 (offset +60)
// Month 5: 00:10 (offset +70)
// Month 6: 00:00 (offset +60)
// Month 7: 23:50 (offset +50)
// Month 8: 23:40 (offset +40)
// Month 9: 23:30 (offset +30)
// Month 10: 23:20 (offset +20)
// Month 11: 23:10 (offset +10)
// Month 12: 23:20 (offset +20)
export const TUVI_GLOBAL_OFFSETS: Record<number, number> = {
  1: 30,
  2: 40,
  3: 50,
  4: 60,
  5: 70,
  6: 60,
  7: 50,
  8: 40,
  9: 30,
  10: 20,
  11: 10,
  12: 20,
};

export const EARTHLY_BRANCHES = [
  "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"
];

/**
 * Thư viện iztro đánh số index của 12 cung bắt đầu từ cung DẦN (palace.index 0 = Dần).
 * Hàm này chuyển index cung của iztro về index địa chi chuẩn (0 = Tý, 1 = Sửu, ..., 11 = Hợi)
 * để dùng thống nhất trong toàn bộ phép tính vận hạn và lưới hiển thị lá số.
 */
export function palaceIndexToBranchIndex(palaceIndex: number): number {
  return ((palaceIndex + 2) % 12 + 12) % 12;
}

export interface TimezoneAdjustment {
  originalTime: string;
  originalDate: string;
  birthplace: string;
  normalizedDate: Date;
  timezoneLabel: string;
  note: string;
}

/**
 * Normalizes birth datetime into current Vietnamese timezone GMT+7 using historical rules
 */
 export function normalizeToHanoi(dateStr: string, timeStr: string, birthplace: string, originalTimezoneOffset?: number): TimezoneAdjustment {
  // Dựng Date từ thành phần số thay vì parse chuỗi ISO: cách parse chuỗi không
  // offset phụ thuộc runtime. Constructor components luôn dùng local TZ, đồng nhất
  // với toàn bộ getHours()/getMonth()... phía sau — giờ/ngày nhập luôn khớp, bất kể
  // TZ máy. Kết quả y hệt hành vi cũ, chỉ bỏ phụ thuộc vào diễn giải chuỗi.
  const [yStr, moStr, dStr] = String(dateStr).split("-");
  const [hStr, miStr] = String(timeStr).split(":");
  const originalDate = new Date(
    Number(yStr),
    Number(moStr) - 1,
    Number(dStr),
    Number(hStr),
    Number(miStr),
    0,
  );
  let adjustedDate = new Date(originalDate.getTime());
  let note = "Giữ nguyên múi giờ GMT+7.";
  let timezoneLabel = "GMT+7";
  if (birthplace === "Nước ngoài (Quy đổi GMT+7)") {
    if (typeof originalTimezoneOffset === "number" && originalTimezoneOffset !== 7) {
      const deltaMinutes = Math.round((7 - originalTimezoneOffset) * 60);
      adjustedDate.setMinutes(adjustedDate.getMinutes() + deltaMinutes);
      const sign = originalTimezoneOffset >= 0 ? "+" : "";
      note = `Quy đổi từ múi giờ gốc nơi sinh GMT${sign}${originalTimezoneOffset} về GMT+7 (chênh lệch ${deltaMinutes > 0 ? "+" : ""}${deltaMinutes} phút).`;
      timezoneLabel = `GMT${sign}${originalTimezoneOffset} -> GMT+7`;
    } else {
      note = "Giờ sinh ở nước ngoài được coi là đã quy đổi sẵn về GMT+7.";
    }
    return { originalTime: timeStr, originalDate: dateStr, birthplace, normalizedDate: adjustedDate, timezoneLabel, note };
  }

  // Helper to compare dates
  const matchesRange = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    return originalDate >= start && originalDate <= end;
  };

  // Rule 1: 01/01/1943 to 31/03/1945 -- GMT+8 (Subtract 1 hour to get to GMT+7)
  if (matchesRange("1943-01-01T00:00:00", "1945-03-31T23:59:59")) {
    adjustedDate.setHours(adjustedDate.getHours() - 1);
    note = "Hiệu chỉnh lùi 1 giờ do thời kỳ này sử dụng múi giờ GMT+8.";
    timezoneLabel = "GMT+8 -> GMT+7";
  }
  // Rule 2: 01/04/1945 to 18/08/1945 -- GMT+9 (Subtract 2 hours to get to GMT+7)
  else if (matchesRange("1945-04-01T00:00:00", "1945-08-18T23:59:59")) {
    adjustedDate.setHours(adjustedDate.getHours() - 2);
    note = "Hiệu chỉnh lùi 2 giờ do thời kỳ chiến tranh thế giới thứ 2 sử dụng múi giờ Nhật Bản GMT+9.";
    timezoneLabel = "GMT+9 -> GMT+7";
  }
  // Rule 3: 01/01/1960 to 30/04/1975 -- Miền Nam Việt Nam & Miền Trung Vĩ tuyến 17 trở vào GMT+8 (Subtract 1 hour)
  else if (
    (birthplace === "Miền Nam VN" || birthplace === "Miền Trung VN (Vĩ tuyến 17 trở vào: Huế, Đà Nẵng, Khánh Hòa...)") && 
    matchesRange("1960-01-01T00:00:00", "1975-04-30T23:59:59")
  ) {
    adjustedDate.setHours(adjustedDate.getHours() - 1);
    note = "Hiệu chỉnh lùi 1 giờ ở Miền Nam / Miền Trung (vĩ tuyến 17 trở vào) từ 1960 đến 1975, do chế độ Sài Gòn quy định múi giờ GMT+8.";
    timezoneLabel = "GMT+8 -> GMT+7";
  }

  return {
    originalTime: timeStr,
    originalDate: dateStr,
    birthplace,
    normalizedDate: adjustedDate,
    timezoneLabel,
    note
  };
}

export interface HourResult {
  branchName: string;
  timeIndex: number; // 0 to 11 (or 12 for late Tý in intermediate states)
  rangeStr: string;
  warning: string | null;
  dateShift: number; // -1, 0, or +1 day shift required
}

/**
 * Computes exact earthly branch hour and warning using the TuviGLOBAL schedule (Hanoi GMT+7)
 */
export function getTuviGlobalTime(lunarMonth: number, date: Date): HourResult {
  const hour = date.getHours();
  const min = date.getMinutes();
  const timeMin = hour * 60 + min;

  // Siết lunarMonth về [1,12]: tránh trường hợp ngoài miền khiến offset rơi về 0
  // (lệch toàn bộ khung giờ) mà không báo. Input hợp lệ (1..12 từ iztro) không đổi.
  const safeMonth = Math.min(12, Math.max(1, Math.floor(Number(lunarMonth) || 1)));
  if (safeMonth !== lunarMonth) {
    console.warn(`[tuvi] lunarMonth ngoài miền 1..12: ${lunarMonth} -> dùng ${safeMonth}`);
  }
  const offset = TUVI_GLOBAL_OFFSETS[safeMonth];
  let branchIndex = 0;
  let dateShift = 0;
  let rangeStr = "";
  let warning: string | null = null;

  // Let's find the boundaries of the hour slots
  if (offset < 60) {
    // Tý starts BEFORE midnight, e.g. at 23:30 (for M=1, offset=30)
    const lateTýStart = 1380 + offset; // e.g. 1410
    const earlyTýEnd = 60 + offset;    // e.g. 90

    if (timeMin >= lateTýStart) {
      // Born in late Tý, belongs to early hours of tomorrow
      branchIndex = 0; // Tý
      dateShift = 1;
      const prev = getFormattedTime(lateTýStart);
      const next = getFormattedTime(earlyTýEnd);
      rangeStr = `${prev} – ${next} (vắt sang ngày hôm sau)`;
      
      const dist = Math.abs(timeMin - lateTýStart);
      if (dist <= 15) {
        // Khung giờ Hợi thực tế phụ thuộc offset của tháng âm lịch, không hard-code
        const hoiStart = getFormattedTime(1260 + offset);
        warning = `Sinh sáp giới mốc chuyển giờ Hợi sang Tý (${prev}). Hãy kiểm định với giờ Hợi (${hoiStart} - ${prev}).`;
      }
    } else if (timeMin < earlyTýEnd) {
      branchIndex = 0; // Tý
      dateShift = 0;
      const prev = getFormattedTime(lateTýStart);
      const next = getFormattedTime(earlyTýEnd);
      rangeStr = `${prev} – ${next} (vắt sang ngày hôm sau)`;

      const dist = Math.abs(timeMin - earlyTýEnd);
      if (dist <= 15) {
        warning = `Sinh sáp giới mốc chuyển giờ Tý sang Sửu (${next}). Hãy kiểm định với giờ Sửu (${next} - ${getFormattedTime(earlyTýEnd + 120)}).`;
      }
    } else {
      // Normal intervals (Sửu to Hợi)
      // i is slot index 1 to 11
      for (let i = 1; i <= 11; i++) {
        const start = (2 * i - 1) * 60 + offset;
        const end = (2 * i + 1) * 60 + offset;
        if (timeMin >= start && timeMin < end) {
          branchIndex = i;
          dateShift = 0;
          const sStr = getFormattedTime(start);
          const eStr = getFormattedTime(end);
          rangeStr = `${sStr} – ${eStr}`;

          const distStart = Math.abs(timeMin - start);
          const distEnd = Math.abs(timeMin - end);
          if (distStart <= 15) {
            warning = `Sinh sáp giới mốc chuyển giờ ${EARTHLY_BRANCHES[i-1]} sang ${EARTHLY_BRANCHES[i]} (${sStr}). Hãy kiểm định với giờ ${EARTHLY_BRANCHES[i-1]}.`;
          } else if (distEnd <= 15) {
            const nextBranch = EARTHLY_BRANCHES[(i + 1) % 12];
            warning = `Sinh sáp giới mốc chuyển giờ ${EARTHLY_BRANCHES[i]} sang ${nextBranch} (${eStr}). Hãy kiểm định với giờ ${nextBranch}.`;
          }
          break;
        }
      }
    }
  } else {
    // Tý starts AFTER midnight, e.g. at 00:10 (for M=5, offset=70)
    const earlyHợiEnd = offset - 60; // e.g. 10
    const earlyTýEnd = offset + 60;   // e.g. 130

    if (timeMin < earlyHợiEnd) {
      // Standard midnight but hasn't entered Tý yet, meaning it is still Hợi hour of PREVIOUS day!
      branchIndex = 11; // Hợi
      dateShift = -1;
      const prev = getFormattedTime(1380 + (offset - 60)); // 22:10 of previous day
      const next = getFormattedTime(earlyHợiEnd);          // 00:10 of current day
      rangeStr = `${prev} – ${next} (kéo dài qua 00h)`;

      const dist = Math.abs(timeMin - earlyHợiEnd);
      if (dist <= 15) {
        warning = `Sinh sáp giới mốc chuyển giờ Hợi sang Tý (${next}). Hãy kiểm định với giờ Tý (${next} - ${getFormattedTime(earlyTýEnd)}).`;
      }
    } else {
      // Normal intervals from Tý (starts at offset - 60)
      const startOfTý = offset - 60;
      if (timeMin >= startOfTý && timeMin < startOfTý + 120) {
        branchIndex = 0; // Tý
        dateShift = 0;
        const sStr = getFormattedTime(startOfTý);
        const eStr = getFormattedTime(startOfTý + 120);
        rangeStr = `${sStr} – ${eStr}`;

        const distStart = Math.abs(timeMin - startOfTý);
        const distEnd = Math.abs(timeMin - (startOfTý + 120));
        if (distStart <= 15) {
          const prevBranch = EARTHLY_BRANCHES[11];
          warning = `Sinh sáp giới mốc chuyển giờ ${prevBranch} sang Tý (${sStr}). Hãy kiểm định với giờ ${prevBranch}.`;
        } else if (distEnd <= 15) {
          const nextBranch = EARTHLY_BRANCHES[1];
          warning = `Sinh sáp giới mốc chuyển giờ Tý sang ${nextBranch} (${eStr}). Hãy kiểm định với giờ ${nextBranch}.`;
        }
      } else {
        // Other slots (1 to 11)
        for (let i = 1; i <= 11; i++) {
          const start = (2 * i - 1) * 60 + offset;
          const end = (2 * i + 1) * 60 + offset;
          if (timeMin >= start && timeMin < end) {
            branchIndex = i;
            dateShift = 0;
            const sStr = getFormattedTime(start);
            const eStr = getFormattedTime(end);
            rangeStr = `${sStr} – ${eStr}`;

            const distStart = Math.abs(timeMin - start);
            const distEnd = Math.abs(timeMin - end);
            if (distStart <= 15) {
              warning = `Sinh sáp giới mốc chuyển giờ ${EARTHLY_BRANCHES[i-1]} sang ${EARTHLY_BRANCHES[i]} (${sStr}). Hãy kiểm định với giờ ${EARTHLY_BRANCHES[i-1]}.`;
            } else if (distEnd <= 15) {
              const nextBranch = EARTHLY_BRANCHES[(i + 1) % 12];
              warning = `Sinh sáp giới mốc chuyển giờ ${EARTHLY_BRANCHES[i]} sang ${nextBranch} (${eStr}). Hãy kiểm định với giờ ${nextBranch}.`;
            }
            break;
          }
        }
      }
    }
  }

  return {
    branchName: EARTHLY_BRANCHES[branchIndex],
    timeIndex: branchIndex,
    rangeStr,
    warning,
    dateShift
  };
}

function getFormattedTime(totalMinutes: number): string {
  // Safe bounds
  const relativeMin = (totalMinutes + 1440) % 1440;
  const h = Math.floor(relativeMin / 60);
  const m = relativeMin % 60;
  return `${h.toString().padStart(2, '0')}h${m.toString().padStart(2, '0')}`;
}

/**
 * Executes a dual-pass birth astrolabe generation resolving both solar/lunar month alignment
 * and exact astronomical hours correct under TuviGLOBAL standards.
 */
export function generateTuviAstrolabe(
  solarDateStr: string, // "YYYY-MM-DD"
  solarTimeStr: string, // "HH:MM"
  birthplace: string,   // "Miền Nam VN" | "Miền Trung VN..." | "Miền Bắc VN..." | "Nước ngoài..."
  gender: 'Nam' | 'Nữ',
  originalTimezoneOffset?: number
) {
  const norm = normalizeToHanoi(solarDateStr, solarTimeStr, birthplace, originalTimezoneOffset);
  const normDate = norm.normalizedDate;

  const yVal = normDate.getFullYear();
  const mVal = normDate.getMonth() + 1;
  const dVal = normDate.getDate();

  // Step 2: Pass 1 on dummy Ngọ hour (6) to extract approximation of lunar month
  const firstPassDateStr = `${yVal}-${mVal.toString().padStart(2, '0')}-${dVal.toString().padStart(2, '0')}`;
  const firstPass = astro.bySolar(firstPassDateStr, 6, gender === 'Nam' ? 'Nam' : 'Nữ', true, 'vi-VN');
  
  const approxLunarMonth = firstPass.rawDates.lunarDate.lunarMonth;

  let matchedHour = getTuviGlobalTime(approxLunarMonth, normDate);
  let effectiveLunarMonth = approxLunarMonth;

  const applyDateShift = (shift: number): Date => {
    const d = new Date(normDate.getTime());
    if (shift === 1) d.setDate(d.getDate() + 1);
    else if (shift === -1) d.setDate(d.getDate() - 1);
    return d;
  };

  const toSolarStr = (d: Date): string =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

  let finalAstroDate = applyDateShift(matchedHour.dateShift);

  if (matchedHour.dateShift !== 0) {
    const recheckPass = astro.bySolar(toSolarStr(finalAstroDate), 6, gender === 'Nam' ? 'Nam' : 'Nữ', true, 'vi-VN');
    const shiftedLunarMonth = recheckPass.rawDates.lunarDate.lunarMonth;
    if (shiftedLunarMonth !== approxLunarMonth) {
      effectiveLunarMonth = shiftedLunarMonth;
      matchedHour = getTuviGlobalTime(shiftedLunarMonth, normDate);
      finalAstroDate = applyDateShift(matchedHour.dateShift);
    }
  }

  const finalSolarPassStr = toSolarStr(finalAstroDate);


  // Step 4: Final Pass computing full star chart using exact aligned hour index
  const finalChart = astro.bySolar(
    finalSolarPassStr,
    matchedHour.timeIndex,
    gender === 'Nam' ? 'Nam' : 'Nữ',
    true,
    'vi-VN'
  );

  return {
    timezoneNormalization: norm,
    tuviGlobalHourResult: matchedHour,
    finalSolarDateUsed: finalSolarPassStr,
    approxLunarMonth,
    effectiveLunarMonth,
    chart: finalChart
  };
}

export interface TransitResult {
  transitYear: number;
  lunarAge: number;
  daiHanPalaceIndex: number; // 0..11
  daiHanPalaceName: string;
  tieuHanPalaceIndex: number; // 0..11
  tieuHanPalaceName: string;
  luuNienThaiTueIndex: number; // 0..11
  luuNienThaiTueName: string;
  saoLuuMap: Record<number, string[]>; // palaceIndex -> list of Sao Luu names e.g. ["Lưu Thái Tuế", "Lưu Lộc Tồn"]
}

export function calculateTransitInfo(
  birthYear: number,
  birthZodiac: string, // e.g. "Tý", "Sửu", ..., matching EARTHLY_BRANCHES
  gender: "Nam" | "Nữ",
  palaces: any[], // 12 palaces
  transitYear: number
): TransitResult {
  const lunarAge = transitYear - birthYear + 1;

  // 1. Find Dai Han (Major 10-year limit)
  let daiHanPalaceIndex = -1;
  let daiHanPalaceName = "";
  palaces.forEach((p) => {
    const range = p.decadal?.range;
    if (range && lunarAge >= range[0] && lunarAge <= range[1]) {
      // Chuyển index cung iztro (Dần=0) về index địa chi (Tý=0)
      daiHanPalaceIndex = palaceIndexToBranchIndex(p.index);
      daiHanPalaceName = p.name;
    }
  });
  if (daiHanPalaceIndex === -1) {
    daiHanPalaceName = "Chưa vào Đại Hạn";
  }

  // 2. Find Luu Nien Thai Tue
  // Luu Nien Thai Tue matches the earthly branch of the transitYear.
  // branchIndex = (transitYear - 4) % 12 (since index 4 is Thìn, which corresponds to (2024 - 4) % 12)
  const luuNienBranchIndex = ((transitYear - 4) % 12 + 12) % 12;
  const luuNienThaiTueIndex = luuNienBranchIndex;
  let luuNienThaiTueName = "";
  palaces.forEach((p) => {
    // So sánh theo index địa chi (iztro p.index có gốc Dần=0)
    if (palaceIndexToBranchIndex(p.index) === luuNienBranchIndex) {
      luuNienThaiTueName = p.name;
    }
  });

  // 3. Find Tieu Han
  // A. Determine Starting Palace index of Tieu Han based on birthZodiac (which is the animal like Tý/Sửu/Dần...)
  // Map standard zoom grouping:
  // Dan - Ngo - Tuat (Dần, Ngọ, Tuất): start is Thin (index 4)
  // Than - Ty - Thin (Thân, Tý, Thìn): start is Tuat (index 10)
  // Ty - Dau - Suu (Tỵ, Dậu, Sửu): start is Mui (index 7)
  // Hoi - Mao - Mui (Hợi, Mão, Mùi): start is Suu (index 1)
  
  const branchNormalized = birthZodiac.trim();
  let startTieuHanIndex = 4; // default
  if (["Dần", "Ngọ", "Tuất"].includes(branchNormalized)) {
    startTieuHanIndex = 4; // Thìn
  } else if (["Thân", "Tý", "Thìn"].includes(branchNormalized)) {
    startTieuHanIndex = 10; // Tuất
  } else if (["Tỵ", "Dậu", "Sửu"].includes(branchNormalized)) {
    startTieuHanIndex = 7; // Mùi
  } else if (["Hợi", "Mão", "Mùi"].includes(branchNormalized)) {
    startTieuHanIndex = 1; // Sửu
  }

  // B. Move based on gender (Nam: clockwise, Nữ: counter-clockwise)
  let tieuHanPalaceIndex = 0;
  if (gender === "Nam") {
    // Clockwise
    tieuHanPalaceIndex = (startTieuHanIndex + (lunarAge - 1)) % 12;
  } else {
    // Counter-clockwise
    tieuHanPalaceIndex = (((startTieuHanIndex - (lunarAge - 1)) % 12) + 12) % 12;
  }

  let tieuHanPalaceName = "";
  palaces.forEach((p) => {
    // So sánh theo index địa chi (iztro p.index có gốc Dần=0)
    if (palaceIndexToBranchIndex(p.index) === tieuHanPalaceIndex) {
      tieuHanPalaceName = p.name;
    }
  });

  // 4. Calculate Sao Luu mapping
  const saoLuuMap: Record<number, string[]> = {};
  for (let i = 0; i < 12; i++) {
    saoLuuMap[i] = [];
  }

  // A. Lưu Thái Tuế: Always in the Luu Nien Thai Tue palace
  saoLuuMap[luuNienBranchIndex].push("Lưu Thái Tuế");

  // B. Lưu Tang Môn & Lưu Bạch Hổ:
  // Lưu Tang Môn = (Lưu Thái Tuế + 2) % 12
  const luuTangMonIndex = (luuNienBranchIndex + 2) % 12;
  saoLuuMap[luuTangMonIndex].push("Lưu Tang Môn");

  // Lưu Bạch Hổ = (Lưu Thái Tuế + 8) % 12 (đối cung với Lưu Tang Môn)
  const luuBachHoIndex = (luuNienBranchIndex + 8) % 12;
  saoLuuMap[luuBachHoIndex].push("Lưu Bạch Hổ");

  // C. Lưu Lộc Tồn, Lưu Kình Dương, Lưu Đà La:
  // Determine Heavenly Stem of transitYear (Y % 10)
  // 0: Canh, 1: Tân, 2: Nhâm, 3: Quý, 4: Giáp, 5: Ất, 6: Bính, 7: Đinh, 8: Mậu, 9: Kỷ
  const transitStemIndex = ((transitYear % 10) + 10) % 10;
  // Lưu Lộc Tồn theo can năm hạn (key = year%10): 0:Canh->Thân, 1:Tân->Dậu,
  // 2:Nhâm->Hợi, 3:Quý->Tý, 4:Giáp->Dần, 5:Ất->Mão, 6:Bính->Tỵ, 7:Đinh->Ngọ,
  // 8:Mậu->Tỵ, 9:Kỷ->Ngọ. Cùng pattern với LUU_VAN_XUONG_BY_STEM bên dưới.
  const LUU_LOC_TON_BY_STEM: Record<number, number> = {
    0: 8, 1: 9, 2: 11, 3: 0, 4: 2, 5: 3, 6: 5, 7: 6, 8: 5, 9: 6,
  };
  const luuLocTonIndex = LUU_LOC_TON_BY_STEM[transitStemIndex] ?? 2;

  saoLuuMap[luuLocTonIndex].push("Lưu Lộc Tồn");

  const luuKinhDuongIndex = (luuLocTonIndex + 1) % 12;
  saoLuuMap[luuKinhDuongIndex].push("Lưu Kình Dương");

  const luuDaLaIndex = (luuLocTonIndex - 1 + 12) % 12;
  saoLuuMap[luuDaLaIndex].push("Lưu Đà La");

  // D. Lưu Thiên Mã:
  // Dần - Ngọ - Tuất (indices 2, 6, 10) -> Thân (8)
  // Thân - Tý - Thìn (indices 8, 0, 4) -> Dần (2)
  // Tỵ - Dậu - Sửu (indices 5, 9, 1) -> Hợi (11)
  // Hợi - Mão - Mùi (indices 11, 3, 7) -> Tỵ (5)
  let luuThienMaIndex = 8;
  if ([2, 6, 10].includes(luuNienBranchIndex)) {
    luuThienMaIndex = 8;
  } else if ([8, 0, 4].includes(luuNienBranchIndex)) {
    luuThienMaIndex = 2;
  } else if ([5, 9, 1].includes(luuNienBranchIndex)) {
    luuThienMaIndex = 11;
  } else if ([11, 3, 7].includes(luuNienBranchIndex)) {
    luuThienMaIndex = 5;
  }
  saoLuuMap[luuThienMaIndex].push("Lưu Thiên Mã");

  // E. Lưu Thiên Khốc & Lưu Thiên Hư:
  // Derived from the Index of Year Branch T where (T = luuNienBranchIndex)
  // Khốc index = (6 - T + 12) % 12
  // Hư index = (6 + T) % 12
  const luuKhocIndex = (6 - luuNienBranchIndex + 12) % 12;
  const luuHuIndex = (6 + luuNienBranchIndex) % 12;
  saoLuuMap[luuKhocIndex].push("Lưu Thiên Khốc");
  saoLuuMap[luuHuIndex].push("Lưu Thiên Hư");

  // F. Lưu Hồng Loan & Lưu Thiên Hỷ (theo CHI năm hạn):
  // Hồng Loan: khởi cung Mão (3), đếm NGHỊCH theo chi năm -> index = (3 - T) % 12
  // Thiên Hỷ: luôn đối cung với Hồng Loan -> index = (Hồng Loan + 6) % 12
  // Kiểm chứng: năm Tý (T=0) -> Hồng Loan ở Mão, Thiên Hỷ ở Dậu (đúng quy tắc cổ truyền)
  const luuHongLoanIndex = ((3 - luuNienBranchIndex) % 12 + 12) % 12;
  const luuThienHyIndex = (luuHongLoanIndex + 6) % 12;
  saoLuuMap[luuHongLoanIndex].push("Lưu Hồng Loan");
  saoLuuMap[luuThienHyIndex].push("Lưu Thiên Hỷ");

  // G. Lưu Văn Xương & Lưu Văn Khúc (theo CAN năm hạn):
  // Phú an Lưu Xương: Giáp->Tỵ, Ất->Ngọ, Bính/Mậu->Thân, Đinh/Kỷ->Dậu, Canh->Hợi, Tân->Tý, Nhâm->Dần, Quý->Mão
  // Lưu Khúc (đối xứng):  Giáp->Dậu, Ất->Thân, Bính/Mậu->Ngọ, Đinh/Kỷ->Tỵ, Canh->Mão, Tân->Dần, Nhâm->Tý, Quý->Hợi
  // Key = transitStemIndex (year % 10): 0:Canh, 1:Tân, 2:Nhâm, 3:Quý, 4:Giáp, 5:Ất, 6:Bính, 7:Đinh, 8:Mậu, 9:Kỷ
  const LUU_VAN_XUONG_BY_STEM: Record<number, number> = {
    0: 11, 1: 0, 2: 2, 3: 3, 4: 5, 5: 6, 6: 8, 7: 9, 8: 8, 9: 9,
  };
  const LUU_VAN_KHUC_BY_STEM: Record<number, number> = {
    0: 3, 1: 2, 2: 0, 3: 11, 4: 9, 5: 8, 6: 6, 7: 5, 8: 6, 9: 5,
  };
  saoLuuMap[LUU_VAN_XUONG_BY_STEM[transitStemIndex]].push("Lưu Văn Xương");
  saoLuuMap[LUU_VAN_KHUC_BY_STEM[transitStemIndex]].push("Lưu Văn Khúc");

  // H. Lưu Tứ Hóa (theo CAN năm hạn):
  // Bảng tứ hóa [Lộc, Quyền, Khoa, Kỵ] khớp với bảng tứ hóa gốc của thư viện iztro
  // để nhất quán với tứ hóa nguyên cục trên lá số.
  // Sao lưu tứ hóa bám theo VỊ TRÍ SAO GỐC trên thiên bàn của từng người
  // (đây là lý do lưu tứ hóa thay đổi theo lá số, khác các sao lưu an cố định theo năm).
  // Bảng lưu tứ hóa lấy từ nguồn chung ./tuHoa (TU_HOA_BY_YEAR_MOD theo năm%10),
  // đồng nhất với tứ hóa nguyên cục dùng ở server.ts.
  const LUU_TU_HOA_BY_STEM = TU_HOA_BY_YEAR_MOD;
  const HOA_LABELS = ["Lưu Hóa Lộc", "Lưu Hóa Quyền", "Lưu Hóa Khoa", "Lưu Hóa Kỵ"];

  // Tìm cung (index địa chi) chứa sao gốc trên lá số, quét cả chính tinh lẫn phụ tinh
  // ⚠️ ĐIỀU KIỆN AN TOÀN (ĐỌC TRƯỚC KHI SỬA): hàm này quét 1-pass, khớp tên trần
  // và trả về cung ĐẦU TIÊN khớp. Nó chính xác CHỈ VÌ được gọi trên `palaces` GỐC
  // từ iztro — tức CHƯA gắn tiền tố [SAO LƯU] (sao lưu do CHÍNH calculateTransitInfo
  // sinh ra SAU đó, còn việc gắn nhãn [SAO LƯU] xảy ra muộn hơn nữa ở App.tsx).
  // Trong bối cảnh đó mỗi sao gốc chỉ xuất hiện MỘT lần nên không khớp nhầm.
  //
  // 🚫 NẾU SAU NÀY truyền vào `palaces` ĐÃ gắn [SAO LƯU] (hoặc dữ liệu có sao trùng
  // tên), 1-pass này có thể neo nhầm vào cung hạn chứa sao lưu mà KHÔNG báo lỗi.
  // Khi đó PHẢI loại trừ [SAO LƯU] trước khi khớp (xem findStarBranch trong
  // chartRelations.ts) để giữ đúng tọa độ sao gốc.
  const findStarBranchIndex = (starName: string): number => {
    const target = starName.trim().toLowerCase();
    for (const p of palaces) {
      // Quét đủ 3 nhóm sao: i ztro đôi khi xếp Văn Xương/Văn Khúc/Tả Phụ/Hữu Bật
      // vào adjectiveStars; nếu thiếu nhóm này thì Lưu Tứ Hóa rơi vào các sao đó sẽ bị mất.
      const allStars = [...(p.majorStars || []), ...(p.minorStars || []), ...(p.adjectiveStars || [])];
      if (allStars.some((s: any) => String(s.name || "").trim().toLowerCase() === target)) {
        return palaceIndexToBranchIndex(p.index);
      }
    }
    return -1;
  };

  const tuHoaStars = LUU_TU_HOA_BY_STEM[transitStemIndex];
  if (tuHoaStars) {
    tuHoaStars.forEach((starName, i) => {
      const branchIdx = findStarBranchIndex(starName);
      if (branchIdx >= 0) {
        saoLuuMap[branchIdx].push(`${HOA_LABELS[i]} (${starName})`);
      }
    });
  }

  return {
    transitYear,
    lunarAge,
    daiHanPalaceIndex,
    daiHanPalaceName,
    tieuHanPalaceIndex,
    tieuHanPalaceName,
    luuNienThaiTueIndex,
    luuNienThaiTueName,
    saoLuuMap,
  };
}

