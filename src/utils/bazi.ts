// ============================================================================
// Module BÁT TỰ / TỨ TRỤ (八字 / 四柱) — chạy SONG SONG với lá số Tử Vi.
//
// Mục tiêu: từ CÙNG MỘT thời điểm sinh đã chuẩn hoá về GMT+7 (normalizeToHanoi
// trong tuvi.ts), dựng thêm lá Tứ Trụ + phân tích (thân vượng/nhược, dụng thần,
// quan hệ Can-Chi, thần sát, lưu niên) để AI luận giải CHÉO với Tử Vi:
//   - Chỗ nào Tử Vi và Bát Tự đồng thuận  -> độ tin cậy cao, nhấn mạnh.
//   - Chỗ nào mâu thuẫn                     -> nêu rõ, không cưỡng ép.
//
// NGUỒN TÍNH TOÁN: thư viện `lunar-typescript` (cùng hệ lịch can-chi với `iztro`).
// Phần phân tích bám theo Tử Bình truyền thống (xem src/knowledge/tuBinh.ts).
// ============================================================================

import { Solar } from "lunar-typescript";

// ----------------------------------------------------------------------------
// BẢNG ÁNH XẠ HÁN -> VIỆT
// ----------------------------------------------------------------------------

export const GAN_VI: Record<string, string> = {
  "甲": "Giáp", "乙": "Ất", "丙": "Bính", "丁": "Đinh", "戊": "Mậu",
  "己": "Kỷ", "庚": "Canh", "辛": "Tân", "壬": "Nhâm", "癸": "Quý",
};
export const ZHI_VI: Record<string, string> = {
  "子": "Tý", "丑": "Sửu", "寅": "Dần", "卯": "Mão", "辰": "Thìn", "巳": "Tỵ",
  "午": "Ngọ", "未": "Mùi", "申": "Thân", "酉": "Dậu", "戌": "Tuất", "亥": "Hợi",
};
export const WUXING_VI: Record<string, string> = {
  "金": "Kim", "木": "Mộc", "水": "Thủy", "火": "Hỏa", "土": "Thổ",
};
export const GAN_WUXING: Record<string, string> = {
  "甲": "Mộc", "乙": "Mộc", "丙": "Hỏa", "丁": "Hỏa", "戊": "Thổ",
  "己": "Thổ", "庚": "Kim", "辛": "Kim", "壬": "Thủy", "癸": "Thủy",
};
export const GAN_AMDUONG: Record<string, "Dương" | "Âm"> = {
  "甲": "Dương", "乙": "Âm", "丙": "Dương", "丁": "Âm", "戊": "Dương",
  "己": "Âm", "庚": "Dương", "辛": "Âm", "壬": "Dương", "癸": "Âm",
};
export const ZHI_WUXING: Record<string, string> = {
  "寅": "Mộc", "卯": "Mộc", "巳": "Hỏa", "午": "Hỏa", "申": "Kim", "酉": "Kim",
  "亥": "Thủy", "子": "Thủy", "辰": "Thổ", "戌": "Thổ", "丑": "Thổ", "未": "Thổ",
};
export const SHISHEN_VI: Record<string, string> = {
  "日主": "Nhật Chủ", "比肩": "Tỷ Kiên", "劫财": "Kiếp Tài", "食神": "Thực Thần",
  "伤官": "Thương Quan", "偏财": "Thiên Tài", "正财": "Chính Tài", "七杀": "Thất Sát",
  "正官": "Chính Quan", "偏印": "Thiên Ấn", "正印": "Chính Ấn",
};
export const NAYIN_VI: Record<string, string> = {
  "海中金": "Hải Trung Kim", "炉中火": "Lư Trung Hỏa", "大林木": "Đại Lâm Mộc",
  "路旁土": "Lộ Bàng Thổ", "剑锋金": "Kiếm Phong Kim", "山头火": "Sơn Đầu Hỏa",
  "涧下水": "Giản Hạ Thủy", "城头土": "Thành Đầu Thổ", "白蜡金": "Bạch Lạp Kim",
  "杨柳木": "Dương Liễu Mộc", "泉中水": "Tuyền Trung Thủy", "屋上土": "Ốc Thượng Thổ",
  "霹雳火": "Tích Lịch Hỏa", "松柏木": "Tùng Bách Mộc", "长流水": "Trường Lưu Thủy",
  "沙中金": "Sa Trung Kim", "山下火": "Sơn Hạ Hỏa", "平地木": "Bình Địa Mộc",
  "壁上土": "Bích Thượng Thổ", "金箔金": "Kim Bạc Kim", "覆灯火": "Phú Đăng Hỏa",
  "天河水": "Thiên Hà Thủy", "大驿土": "Đại Dịch Thổ", "钗钏金": "Thoa Xuyến Kim",
  "桑柘木": "Tang Đố Mộc", "大溪水": "Đại Khê Thủy", "沙中土": "Sa Trung Thổ",
  "天上火": "Thiên Thượng Hỏa", "石榴木": "Thạch Lựu Mộc", "大海水": "Đại Hải Thủy",
};

const GAN_LIST = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const ZHI_LIST = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const viGan = (h: string) => GAN_VI[h] ?? h;
const viZhi = (h: string) => ZHI_VI[h] ?? h;
const viShiShen = (h: string) => SHISHEN_VI[h] ?? h;
const viNaYin = (h: string) => NAYIN_VI[h] ?? h;
const viGanChi = (gan: string, zhi: string) => `${viGan(gan)} ${viZhi(zhi)}`;
const viGanChiStr = (s: string) => (s && s.length === 2 ? viGanChi(s[0], s[1]) : s);

// ----------------------------------------------------------------------------
// BẢNG QUAN HỆ CAN-CHI & THẦN SÁT (Tử Bình)
// ----------------------------------------------------------------------------

const SHENG: Record<string, string> = { Mộc: "Hỏa", Hỏa: "Thổ", Thổ: "Kim", Kim: "Thủy", Thủy: "Mộc" };
const KHAC: Record<string, string> = { Mộc: "Thổ", Thổ: "Thủy", Thủy: "Hỏa", Hỏa: "Kim", Kim: "Mộc" };
const sinhRa = (wx: string) => Object.keys(SHENG).find((k) => SHENG[k] === wx)!; // hành sinh ra wx
const khacRa = (wx: string) => Object.keys(KHAC).find((k) => KHAC[k] === wx)!;   // hành khắc wx

const LUC_HOP: Record<string, string> = { 子: "丑", 丑: "子", 寅: "亥", 亥: "寅", 卯: "戌", 戌: "卯", 辰: "酉", 酉: "辰", 巳: "申", 申: "巳", 午: "未", 未: "午" };
const LUC_XUNG: Record<string, string> = { 子: "午", 午: "子", 丑: "未", 未: "丑", 寅: "申", 申: "寅", 卯: "酉", 酉: "卯", 辰: "戌", 戌: "辰", 巳: "亥", 亥: "巳" };
const LUC_HAI: Record<string, string> = { 子: "未", 未: "子", 丑: "午", 午: "丑", 寅: "巳", 巳: "寅", 卯: "辰", 辰: "卯", 申: "亥", 亥: "申", 酉: "戌", 戌: "酉" };
const TAM_HOP: string[][] = [["申", "子", "辰"], ["寅", "午", "戌"], ["亥", "卯", "未"], ["巳", "酉", "丑"]];
const NGU_HOP_GAN: Record<string, string> = { 甲: "己", 己: "甲", 乙: "庚", 庚: "乙", 丙: "辛", 辛: "丙", 丁: "壬", 壬: "丁", 戊: "癸", 癸: "戊" };

// Thần sát tra theo Nhật can / chi mốc (năm + ngày)
const QUY_NHAN: Record<string, string[]> = { 甲: ["丑", "未"], 戊: ["丑", "未"], 庚: ["丑", "未"], 乙: ["子", "申"], 己: ["子", "申"], 丙: ["亥", "酉"], 丁: ["亥", "酉"], 壬: ["卯", "巳"], 癸: ["卯", "巳"], 辛: ["午", "寅"] };
const DAO_HOA: Record<string, string> = { 申: "酉", 子: "酉", 辰: "酉", 寅: "卯", 午: "卯", 戌: "卯", 亥: "子", 卯: "子", 未: "子", 巳: "午", 酉: "午", 丑: "午" };
const DICH_MA: Record<string, string> = { 申: "寅", 子: "寅", 辰: "寅", 寅: "申", 午: "申", 戌: "申", 亥: "巳", 卯: "巳", 未: "巳", 巳: "亥", 酉: "亥", 丑: "亥" };
const DUONG_NHAN: Record<string, string> = { 甲: "卯", 丙: "午", 戊: "午", 庚: "酉", 壬: "子" };
const LOC: Record<string, string> = { 甲: "寅", 乙: "卯", 丙: "巳", 丁: "午", 戊: "巳", 己: "午", 庚: "申", 辛: "酉", 壬: "亥", 癸: "子" };

/** Thập Thần chính xác (có phân Chính/Thiên theo âm-dương) của `otherGan` so với Nhật Chủ. */
function tenGod(dmHan: string, otherHan: string): string {
  const dmWx = GAN_WUXING[dmHan];
  const oWx = GAN_WUXING[otherHan];
  const same = GAN_AMDUONG[dmHan] === GAN_AMDUONG[otherHan];
  if (oWx === dmWx) return same ? "Tỷ Kiên" : "Kiếp Tài";
  if (SHENG[dmWx] === oWx) return same ? "Thực Thần" : "Thương Quan"; // ta sinh
  if (KHAC[dmWx] === oWx) return same ? "Thiên Tài" : "Chính Tài";   // ta khắc
  if (KHAC[oWx] === dmWx) return same ? "Thất Sát" : "Chính Quan";   // khắc ta
  if (SHENG[oWx] === dmWx) return same ? "Thiên Ấn" : "Chính Ấn";    // sinh ta
  return "";
}

/** Quan hệ ngũ hành thô (để chấm thân vượng/nhược). */
function relCoarse(dmWx: string, otherWx: string): "đồng" | "sinh-ta" | "ta-sinh" | "ta-khac" | "khac-ta" {
  if (otherWx === dmWx) return "đồng";
  if (SHENG[otherWx] === dmWx) return "sinh-ta";
  if (SHENG[dmWx] === otherWx) return "ta-sinh";
  if (KHAC[dmWx] === otherWx) return "ta-khac";
  return "khac-ta";
}

// ----------------------------------------------------------------------------
// KIỂU DỮ LIỆU
// ----------------------------------------------------------------------------

export interface BaZiPillar {
  label: string;
  ganVi: string;
  zhiVi: string;
  ganChiVi: string;
  naYinVi: string;
  ganElement: string;
  zhiElement: string;
  hiddenStemsVi: string[];
  shiShenGanVi: string;
  shiShenZhiVi: string[];
}

export interface DaYunItem {
  startAge: number;
  startYear: number;
  ganChiVi: string;
}

export interface LuuNienInfo {
  year: number;
  ganChiVi: string;
  thapThan: string;   // Thập Thần của can năm so với Nhật Chủ
  element: string;    // ngũ hành của can năm
  role: string;       // "Hỷ/Dụng (thuận)" | "Kỵ (thận trọng)" | "Trung tính"
}

export interface BaZiAnalysis {
  than: "Thân vượng" | "Thân nhược" | "Trung hòa";
  thanScore: number;
  dacLenh: string;        // mô tả đắc lệnh tháng
  dungThan: string[];     // ngũ hành nên dùng (Hỷ-Dụng)
  kyThan: string[];       // ngũ hành kỵ
  relations: string[];    // quan hệ Can-Chi nổi bật (hợp/xung/hình/hại)
  shenSat: string[];      // thần sát
  menhCungVi: string;
  thanCungVi: string;
  thaiNguyenVi: string;
  tuanKhongVi: string;    // Tuần Không (Không Vong) của trụ ngày
  luuNien: LuuNienInfo | null;
}

export interface BaZiChart {
  dayMasterVi: string;
  dayMasterElement: string;
  dayMasterPolarity: "Dương" | "Âm";
  pillars: { year: BaZiPillar; month: BaZiPillar; day: BaZiPillar; hour: BaZiPillar };
  wuXingVisible: Record<string, number>;
  wuXingWithHidden: Record<string, number>;
  daYun: DaYunItem[];
  yunForward: boolean;
  yunStartSolarYmd: string;
  lunarText: string;
  analysis: BaZiAnalysis;
}

function emptyWuXing(): Record<string, number> {
  return { Kim: 0, Mộc: 0, Thủy: 0, Hỏa: 0, Thổ: 0 };
}

// ----------------------------------------------------------------------------
// PHÂN TÍCH (Cấp 1)
// ----------------------------------------------------------------------------

function analyze(
  gans: string[], zhis: string[], hidden: string[][], dmHan: string,
  ec: any, transitYear?: number,
): BaZiAnalysis {
  const dmWx = GAN_WUXING[dmHan];
  const monthZhi = zhis[1];

  // --- Thân vượng/nhược (heuristic) ---
  let score = 0;
  const monthRel = relCoarse(dmWx, ZHI_WUXING[monthZhi]);
  if (monthRel === "đồng") score += 3;
  else if (monthRel === "sinh-ta") score += 2;
  else if (monthRel === "ta-sinh") score -= 1;
  else score -= 2;
  const allElems = [
    ...gans.map((g) => GAN_WUXING[g]),
    ...zhis.map((z) => ZHI_WUXING[z]),
    ...hidden.flat().map((g) => GAN_WUXING[g]),
  ];
  let help = 0, drain = 0;
  for (const e of allElems) {
    const r = relCoarse(dmWx, e);
    if (r === "đồng" || r === "sinh-ta") help++; else drain++;
  }
  score += (help - drain) * 0.6;
  const than: BaZiAnalysis["than"] =
    score >= 1.5 ? "Thân vượng" : score <= -1.5 ? "Thân nhược" : "Trung hòa";

  // --- Dụng / Kỵ thần (phù ức) ---
  let dungThan: string[] = [];
  let kyThan: string[] = [];
  if (than === "Thân vượng") {
    dungThan = [KHAC[dmWx], SHENG[dmWx], khacRa(dmWx)]; // Quan Sát / Thực Thương / Tài
    kyThan = [dmWx, sinhRa(dmWx)];                      // Tỷ Kiếp / Ấn
  } else if (than === "Thân nhược") {
    dungThan = [dmWx, sinhRa(dmWx)];                    // Tỷ Kiếp / Ấn
    kyThan = [KHAC[dmWx], khacRa(dmWx)];                // Quan Sát / Tài
  } else {
    dungThan = ["(cân bằng — ưu tiên Điều hậu/Thông quan)"];
  }
  dungThan = [...new Set(dungThan)];
  kyThan = [...new Set(kyThan)];

  // --- Quan hệ Can-Chi ---
  const rel: string[] = [];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
    const a = zhis[i], b = zhis[j];
    if (LUC_XUNG[a] === b) rel.push(`Lục xung ${viZhi(a)}-${viZhi(b)}`);
    if (LUC_HOP[a] === b) rel.push(`Lục hợp ${viZhi(a)}-${viZhi(b)}`);
    if (LUC_HAI[a] === b) rel.push(`Lục hại ${viZhi(a)}-${viZhi(b)}`);
    if (NGU_HOP_GAN[gans[i]] === gans[j]) rel.push(`Thiên can hợp ${viGan(gans[i])}-${viGan(gans[j])}`);
  }
  for (const t of TAM_HOP) {
    const has = t.filter((x) => zhis.includes(x));
    if (has.length === 3) rel.push(`Tam hợp ${has.map(viZhi).join("-")}`);
    else if (has.length === 2 && (has.includes("子") || has.includes("午") || has.includes("卯") || has.includes("酉")))
      rel.push(`Bán hợp ${has.map(viZhi).join("-")}`);
  }

  // --- Thần sát ---
  const ss: string[] = [];
  const refZhi = [zhis[0], zhis[2]];
  if (QUY_NHAN[dmHan]) for (const z of zhis) if (QUY_NHAN[dmHan].includes(z)) ss.push(`Thiên Ất Quý Nhân (${viZhi(z)})`);
  for (const r of refZhi) for (const z of zhis) {
    if (DAO_HOA[r] === z) ss.push(`Đào Hoa (${viZhi(z)})`);
    if (DICH_MA[r] === z) ss.push(`Dịch Mã (${viZhi(z)})`);
  }
  if (DUONG_NHAN[dmHan]) for (const z of zhis) if (DUONG_NHAN[dmHan] === z) ss.push(`Dương Nhận (${viZhi(z)})`);
  for (const z of zhis) if (LOC[dmHan] === z) ss.push(`Lộc Thần (${viZhi(z)})`);

  // --- Lưu niên (năm đang xem) ---
  let luuNien: LuuNienInfo | null = null;
  if (typeof transitYear === "number" && transitYear > 0) {
    const sGan = GAN_LIST[((transitYear - 4) % 10 + 10) % 10];
    const sZhi = ZHI_LIST[((transitYear - 4) % 12 + 12) % 12];
    const el = GAN_WUXING[sGan];
    const role = dungThan.includes(el) ? "Hỷ/Dụng (thuận lợi)"
      : kyThan.includes(el) ? "Kỵ (thận trọng)" : "Trung tính";
    luuNien = { year: transitYear, ganChiVi: viGanChi(sGan, sZhi), thapThan: tenGod(dmHan, sGan), element: el, role };
  }

  return {
    than, thanScore: Number(score.toFixed(1)),
    dacLenh: `chi tháng ${viZhi(monthZhi)} (${monthRel})`,
    dungThan, kyThan, relations: [...new Set(rel)], shenSat: [...new Set(ss)],
    menhCungVi: viGanChiStr(ec.getMingGong()),
    thanCungVi: viGanChiStr(ec.getShenGong()),
    thaiNguyenVi: viGanChiStr(ec.getTaiYuan()),
    tuanKhongVi: (ec.getDayXunKong() || "").split("").map(viZhi).join(" "),
    luuNien,
  };
}

// ----------------------------------------------------------------------------
// TÍNH TOÁN CHÍNH
// ----------------------------------------------------------------------------

/**
 * Dựng lá Tứ Trụ + phân tích từ thời điểm đã chuẩn hoá GMT+7 (normalizedDate).
 * @param normalizedDate Date local đã quy về GMT+7 (dùng chung với Tử Vi).
 * @param gender "Nam" | "Nữ" (cho Đại Vận thuận/nghịch).
 * @param transitYear (tùy chọn) năm đang xem hạn -> tính Lưu niên Bát Tự.
 */
export function computeBaZi(
  normalizedDate: Date, gender: "Nam" | "Nữ", transitYear?: number,
): BaZiChart {
  const solar = Solar.fromYmdHms(
    normalizedDate.getFullYear(), normalizedDate.getMonth() + 1, normalizedDate.getDate(),
    normalizedDate.getHours(), normalizedDate.getMinutes(), 0,
  );
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  const buildPillar = (
    label: string, gan: string, zhi: string, naYin: string,
    hidden: string[], shiShenGan: string, shiShenZhi: string[],
  ): BaZiPillar => ({
    label, ganVi: viGan(gan), zhiVi: viZhi(zhi), ganChiVi: viGanChi(gan, zhi),
    naYinVi: viNaYin(naYin), ganElement: GAN_WUXING[gan] ?? "", zhiElement: ZHI_WUXING[zhi] ?? "",
    hiddenStemsVi: hidden.map(viGan), shiShenGanVi: viShiShen(shiShenGan),
    shiShenZhiVi: shiShenZhi.map(viShiShen),
  });

  const pillars = {
    year: buildPillar("Năm", ec.getYearGan(), ec.getYearZhi(), ec.getYearNaYin(), ec.getYearHideGan(), ec.getYearShiShenGan(), ec.getYearShiShenZhi()),
    month: buildPillar("Tháng", ec.getMonthGan(), ec.getMonthZhi(), ec.getMonthNaYin(), ec.getMonthHideGan(), ec.getMonthShiShenGan(), ec.getMonthShiShenZhi()),
    day: buildPillar("Ngày", ec.getDayGan(), ec.getDayZhi(), ec.getDayNaYin(), ec.getDayHideGan(), ec.getDayShiShenGan(), ec.getDayShiShenZhi()),
    hour: buildPillar("Giờ", ec.getTimeGan(), ec.getTimeZhi(), ec.getTimeNaYin(), ec.getTimeHideGan(), ec.getTimeShiShenGan(), ec.getTimeShiShenZhi()),
  };

  const gans = [ec.getYearGan(), ec.getMonthGan(), ec.getDayGan(), ec.getTimeGan()];
  const zhis = [ec.getYearZhi(), ec.getMonthZhi(), ec.getDayZhi(), ec.getTimeZhi()];
  const hidden = [ec.getYearHideGan(), ec.getMonthHideGan(), ec.getDayHideGan(), ec.getTimeHideGan()];

  const wuXingVisible = emptyWuXing();
  const wuXingWithHidden = emptyWuXing();
  for (const g of gans) { const e = GAN_WUXING[g]; if (e) { wuXingVisible[e]++; wuXingWithHidden[e]++; } }
  for (const z of zhis) { const e = ZHI_WUXING[z]; if (e) wuXingVisible[e]++; }
  for (const hg of hidden) for (const g of hg) { const e = GAN_WUXING[g]; if (e) wuXingWithHidden[e]++; }

  const yun = ec.getYun(gender === "Nam" ? 1 : 0);
  const daYun: DaYunItem[] = yun.getDaYun()
    .map((d: any) => {
      const gz: string = d.getGanZhi();
      return { startAge: d.getStartAge(), startYear: d.getStartYear(), ganChiVi: gz && gz.length === 2 ? viGanChi(gz[0], gz[1]) : "(chưa nhập vận)" };
    })
    .filter((d: DaYunItem) => d.ganChiVi !== "(chưa nhập vận)");

  return {
    dayMasterVi: viGan(ec.getDayGan()),
    dayMasterElement: GAN_WUXING[ec.getDayGan()] ?? "",
    dayMasterPolarity: GAN_AMDUONG[ec.getDayGan()] ?? "Dương",
    pillars, wuXingVisible, wuXingWithHidden, daYun,
    yunForward: yun.isForward(), yunStartSolarYmd: yun.getStartSolar().toYmd(),
    lunarText: lunar.toString(),
    analysis: analyze(gans, zhis, hidden, ec.getDayGan(), ec, transitYear),
  };
}

// ----------------------------------------------------------------------------
// XUẤT VĂN BẢN CHO AI
// ----------------------------------------------------------------------------

export function baZiToPromptText(b: BaZiChart): string {
  const row = (p: BaZiPillar) =>
    `- Trụ ${p.label}: ${p.ganChiVi} ` +
    `(Can ${p.ganElement}/Thập Thần ${p.shiShenGanVi}; Chi ${p.zhiElement}; ` +
    `Tàng Can: ${p.hiddenStemsVi.join(", ") || "—"}; ` +
    `Thập Thần tàng: ${p.shiShenZhiVi.join(", ") || "—"}; Nạp Âm: ${p.naYinVi})`;
  const wx = (o: Record<string, number>) => Object.entries(o).map(([k, v]) => `${k}:${v}`).join("  ");
  const dy = b.daYun.slice(0, 8).map((d) => `${d.startAge}t/${d.startYear} ${d.ganChiVi}`).join("  |  ");
  const a = b.analysis;

  const lines = [
    `=== LÁ SỐ BÁT TỰ / TỨ TRỤ (đối chiếu với Tử Vi) ===`,
    `Âm lịch: ${b.lunarText}`,
    `NHẬT CHỦ (bản thân): ${b.dayMasterVi} — ${b.dayMasterPolarity} ${b.dayMasterElement}.`,
    row(b.pillars.year), row(b.pillars.month), row(b.pillars.day), row(b.pillars.hour),
    `Ngũ hành (8 chữ hiện): ${wx(b.wuXingVisible)}`,
    `Ngũ hành (tính cả Tàng Can): ${wx(b.wuXingWithHidden)}`,
    `Đại Vận (${b.yunForward ? "thuận" : "nghịch"}, khởi ${b.yunStartSolarYmd}): ${dy}`,
    ``,
    `--- PHÂN TÍCH TỬ BÌNH (hệ thống tính sẵn — dùng để KIỂM CHỨNG luận Tử Vi) ---`,
    `Thân: ${a.than} (điểm ${a.thanScore}; đắc lệnh: ${a.dacLenh}).`,
    `Dụng thần (Hỷ): ${a.dungThan.join(", ")} | Kỵ thần: ${a.kyThan.join(", ") || "—"}.`,
    `Quan hệ Can-Chi: ${a.relations.length ? a.relations.join("; ") : "không nổi bật"}.`,
    `Thần sát: ${a.shenSat.length ? a.shenSat.join("; ") : "không đáng kể"}.`,
    `Mệnh cung: ${a.menhCungVi} | Thân cung: ${a.thanCungVi} | Thai Nguyên: ${a.thaiNguyenVi} | Tuần Không (ngày): ${a.tuanKhongVi}.`,
  ];
  if (a.luuNien) {
    lines.push(
      `Lưu niên Bát Tự ${a.luuNien.year}: ${a.luuNien.ganChiVi} — can năm là ${a.luuNien.thapThan} ` +
      `(hành ${a.luuNien.element}) -> ${a.luuNien.role}. Đối chiếu với lưu niên Tử Vi cùng năm.`,
    );
  }
  return lines.join("\n");
}
