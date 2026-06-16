// Nguồn Tứ Hóa DUY NHẤT cho toàn dự án (bản đồ [Lộc, Quyền, Khoa, Kỵ] theo Thiên can).
// Trước đây bảng này bị trùng ở cả server.ts (TU_HOA_BY_STEM) và tuvi.ts
// (LUU_TU_HOA_BY_STEM). Gom về đây để chỉ có một nguồn sự thật, sửa một chỗ.
//
// Thứ tự 4 sao trong mỗi mảng luôn là: [Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ].

export type TuHoaQuartet = [string, string, string, string];

// Tra theo tên Thiên can (dùng ở server.ts: can của từng cung / can năm sinh).
export const TU_HOA_BY_STEM: Record<string, TuHoaQuartet> = {
  "Giáp": ["Liêm Trinh", "Phá Quân", "Vũ Khúc", "Thái Dương"],
  "Ất": ["Thiên Cơ", "Thiên Lương", "Tử Vi", "Thái Âm"],
  "Bính": ["Thiên Đồng", "Thiên Cơ", "Văn Xương", "Liêm Trinh"],
  "Đinh": ["Thái Âm", "Thiên Đồng", "Thiên Cơ", "Cự Môn"],
  "Mậu": ["Tham Lang", "Thái Âm", "Hữu Bật", "Thiên Cơ"],
  "Kỷ": ["Vũ Khúc", "Tham Lang", "Thiên Lương", "Văn Khúc"],
  "Canh": ["Thái Dương", "Vũ Khúc", "Thái Âm", "Thiên Đồng"],
  "Tân": ["Cự Môn", "Thái Dương", "Văn Khúc", "Văn Xương"],
  "Nhâm": ["Thiên Lương", "Tử Vi", "Tả Phụ", "Vũ Khúc"],
  "Quý": ["Phá Quân", "Cự Môn", "Thái Âm", "Tham Lang"],
};

// Nhãn Hóa chuẩn cho tứ hóa nguyên cục / phi hóa.
export const HOA_LABELS: TuHoaQuartet = ["Hóa Lộc", "Hóa Quyền", "Hóa Khoa", "Hóa Kỵ"];

// Quy ước index Thiên can theo (năm % 10) mà core tuvi.ts dùng cho transitStemIndex:
// 0:Canh, 1:Tân, 2:Nhâm, 3:Quý, 4:Giáp, 5:Ất, 6:Bính, 7:Đinh, 8:Mậu, 9:Kỷ
export const STEM_NAME_BY_YEAR_MOD: string[] = [
  "Canh", "Tân", "Nhâm", "Quý", "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ",
];

// Tra theo index (năm % 10) — tiện cho tuvi.ts (Lưu Tứ Hóa theo can năm hạn).
export const TU_HOA_BY_YEAR_MOD: Record<number, TuHoaQuartet> = STEM_NAME_BY_YEAR_MOD.reduce(
  (acc, stemName, idx) => {
    acc[idx] = TU_HOA_BY_STEM[stemName];
    return acc;
  },
  {} as Record<number, TuHoaQuartet>,
);
