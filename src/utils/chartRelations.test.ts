import { describe, it, expect } from "vitest";
import {
  toBranchIndex,
  NHI_HOP,
  LUC_HAI,
  normalizeStarName,
  buildChartIndex,
  findStarBranch,
  buildFlyingTuHoaLines,
  buildNatalTuHoaLines,
  buildRelationsBlock,
  satKyStarsInPalace,
} from "./chartRelations";

// Lá số giả tối thiểu theo quy ước iztro (palace.index 0 = Dần).
// Gán một số sao + thiên can để kiểm tra phi tứ hóa và quan hệ.
function buildPalaces() {
  const branchName = ["Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu"];
  return Array.from({ length: 12 }, (_, i) => ({
    index: i,
    name:
      i === 10 ? "Cung Mệnh" :
      i === 0 ? "Cung Phu Thê" :
      i === 1 ? "Cung Tài Bạch" :
      `Cung ${branchName[i]}`,
    earthlyBranch: branchName[i],
    heavenlyStem: i === 10 ? "Giáp" : "Ất",
    majorStars:
      i === 0 ? [{ name: "Liêm Trinh" }] :    // đích Hóa Lộc của can Giáp
      i === 4 ? [{ name: "Thái Dương" }] :    // đích Hóa Kỵ của can Giáp
      [],
    minorStars: i === 1 ? [{ name: "Kình Dương" }] : [],
    adjectiveStars: [],
  }));
}

describe("toBranchIndex", () => {
  it("quy index iztro (Dần=0) về index địa chi (Tý=0)", () => {
    expect(toBranchIndex(0)).toBe(2); // Dần
    expect(toBranchIndex(10)).toBe(0); // Tý
    expect(toBranchIndex(11)).toBe(1); // Sửu
  });
});

describe("bảng quan hệ nhị hợp / lục hại đối xứng", () => {
  it("nhị hợp đối xứng", () => {
    Object.entries(NHI_HOP).forEach(([a, b]) => {
      expect(NHI_HOP[b]).toBe(Number(a));
    });
  });
  it("lục hại đối xứng", () => {
    Object.entries(LUC_HAI).forEach(([a, b]) => {
      expect(LUC_HAI[b]).toBe(Number(a));
    });
  });
});

describe("normalizeStarName", () => {
  it("bỏ tiền tố [SAO LƯU], ký tự ẩn và chuẩn hóa", () => {
    expect(normalizeStarName("[SAO LƯU] Hóa Kỵ")).toBe(normalizeStarName("Hóa Kỵ"));
    expect(normalizeStarName("  Thái  Dương ")).toBe("thái dương");
  });
});

describe("findStarBranch + phi tứ hóa (can Giáp)", () => {
  const idx = buildChartIndex(buildPalaces());
  it("tìm đúng cung chứa sao gốc (quét đủ 3 nhóm)", () => {
    expect(findStarBranch(idx, "Liêm Trinh")).toBe(toBranchIndex(0)); // Dần=2
    expect(findStarBranch(idx, "Kình Dương")).toBe(toBranchIndex(1)); // phụ tinh vẫn tìm được
    expect(findStarBranch(idx, "Sao Không Tồn Tại")).toBe(-1);
  });
  it("can Giáp: Hóa Lộc→Liêm Trinh, Hóa Kỵ→Thái Dương đúng cung đích", () => {
    const lines = buildFlyingTuHoaLines(idx, "Giáp");
    expect(lines[0]).toContain("Liêm Trinh");
    expect(lines[3]).toContain("Thái Dương");
  });
  it("can không hợp lệ -> mảng rỗng, không crash", () => {
    expect(buildFlyingTuHoaLines(idx, undefined)).toEqual([]);
  });
});

describe("buildNatalTuHoaLines", () => {
  const idx = buildChartIndex(buildPalaces());
  it("trả null khi thiếu can năm sinh", () => {
    expect(buildNatalTuHoaLines(idx, undefined)).toBeNull();
  });
  it("trả đủ 4 dòng khi có can", () => {
    expect(buildNatalTuHoaLines(idx, "Giáp")).toHaveLength(4);
  });
});

describe("buildRelationsBlock", () => {
  it("có đủ các dòng quan hệ + nhãn neo cung", () => {
    const idx = buildChartIndex(buildPalaces());
    const menh = idx.palacesArr.find((p: any) => p.name === "Cung Mệnh");
    const block = buildRelationsBlock(idx, menh);
    expect(block).toContain("Quan hệ của Cung Mệnh");
    expect(block).toContain("Xung chiếu");
    expect(block).toContain("Tam hợp");
    expect(block).toContain("Nhị hợp");
    expect(block).toContain("Lục hại");
    expect(block).toContain("Phi Tứ Hóa (can Giáp)");
  });
});

describe("satKyStarsInPalace", () => {
  it("phát hiện Kình Dương là sát tinh", () => {
    const idx = buildChartIndex(buildPalaces());
    const tai = idx.palacesArr.find((p: any) => p.name === "Cung Tài Bạch");
    expect(satKyStarsInPalace(tai)).toContain("Kình Dương");
  });
});
