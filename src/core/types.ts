// src/core/types.ts
// Kiểu dữ liệu dùng chung cho lõi Tử Vi + Bát Tự (single source of truth)

export type Gender = 'male' | 'female';
export type ZiHourMode = 'late' | 'early'; // 晚子时 (sang ngày sau) | 早子时 (giữ ngày)

/** Input thô từ người dùng */
export interface BirthInput {
  /** Ngày dương lịch: year, month(1-12), day(1-31) */
  year: number;
  month: number;
  day: number;
  /** Giờ đồng hồ (theo múi giờ địa phương người dùng nhập) */
  hour: number;   // 0-23
  minute: number; // 0-59
  gender: Gender;
  /** Kinh độ Đông (vd Hà Nội ~105.85). Bỏ qua nếu không hiệu chỉnh true solar time */
  lonE?: number;
  /** Có hiệu chỉnh Giờ Chân Dương theo kinh độ không (chuẩn TQ lấy 120°E làm mốc) */
  useTrueSolar?: boolean;
  /** Quy ước giờ Tý. Mặc định 'late' (晚子时) — phổ biến nhất */
  ziHourMode?: ZiHourMode;
}

/** Thời gian đã chuẩn hóa, là "nguồn sự thật" feed cho cả hai engine */
export interface ResolvedTime {
  /** Ngày dùng để lập lá số (đã xử lý true solar + giờ Tý sang ngày) */
  chartYear: number;
  chartMonth: number;
  chartDay: number;
  /** Chỉ số giờ 0-11 theo địa chi (0 = Tý 23:00-01:00 ... 11 = Hợi) — khớp iztro */
  hourIndex: number;
  /** Giờ/phút đã hiệu chỉnh true solar (để debug/hiển thị) */
  solarHour: number;
  solarMinute: number;
  /** Số phút đã dịch do true solar (âm/dương) */
  trueSolarDeltaMin: number;
  ziHourMode: ZiHourMode;
}

export interface FourPillars {
  year: string;   // vd "乙亥"
  month: string;  // "甲申"
  day: string;    // "丁丑"
  hour: string;   // "庚子"
}

export interface DecadeFortune {
  index: number;
  ganZhi: string;
  startAge: number;
  endAge: number;
  startYear: number;
}

export interface BaziResult {
  pillars: FourPillars;
  dayMaster: string;             // Nhật Chủ (天干 của trụ ngày)
  dayMasterElement: string;      // ngũ hành Nhật Chủ
  tenGods: {                     // Thập Thần (so với Nhật Chủ)
    year: string; month: string; hour: string;
  };
  shenSha: {                     // Thần Sát theo từng trụ (từ cantian-tymext)
    year: string[]; month: string[]; day: string[]; hour: string[];
  };
  startAge: number;              // tuổi khởi vận (大运起运)
  decadeFortunes: DecadeFortune[]; // Đại Vận
  fiveElementsCount: Record<string, number>; // cân bằng ngũ hành (đếm)
}

export interface TuviStar { name: string; }
export interface TuviPalace {
  name: string;
  heavenlyStem: string;
  earthlyBranch: string;
  majorStars: string[];
  minorStars: string[];
}
export interface TuviResult {
  soul: string;   // Mệnh chủ
  body: string;   // Thân chủ
  fiveElementsClass: string; // Cục (vd Thủy nhị cục)
  chineseDate: string;       // tứ trụ theo iztro (để đối chiếu)
  palaces: TuviPalace[];
  menhPalace: TuviPalace;
}

export interface SongBanResult {
  resolved: ResolvedTime;
  bazi: BaziResult;
  tuvi: TuviResult;
  /** Đối chiếu chéo dụng thần Bát Tự <-> cách cục Tử Vi */
  crossCheck: {
    pillarsConsistent: boolean; // tứ trụ hai engine có khớp không
    dayMasterElement: string;
    dominantElement: string;    // hành vượng nhất
    weakestElement: string;     // hành nhược nhất
    suggestedYongShen: string;  // gợi ý dụng thần (heuristic)
    menhPalaceBranch: string;
    notes: string[];
  };
}
