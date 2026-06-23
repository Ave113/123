// src/core/songBan.ts
// Hợp nhất Tử Vi + Bát Tự trên 1 lõi lịch + đối chiếu chéo (song bàn).

import { resolveTime } from './solarTime';
import { buildBazi, STEM_ELEMENT, BRANCH_ELEMENT } from './baziAdapter';
import { buildTuvi } from './tuviAdapter';
import type { BirthInput, SongBanResult } from './types';

/** Ngũ hành tương sinh: cái gì sinh ra X (mẹ của X) */
const GENERATES_INTO: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const GENERATED_BY: Record<string, string> = { 火: '木', 土: '火', 金: '土', 水: '金', 木: '水' };

/**
 * Heuristic dụng thần CỰC ĐƠN GIẢN (phù ức): nếu Nhật Chủ vượng -> dùng hành khắc/tiết;
 * nếu Nhật Chủ nhược -> dùng hành sinh trợ. Đây chỉ là gợi ý sơ bộ, KHÔNG thay thầy.
 */
function suggestYongShen(dayElement: string, counts: Record<string, number>): {
  yong: string; strong: boolean;
} {
  const self = counts[dayElement] ?? 0;
  const helper = counts[GENERATED_BY[dayElement]] ?? 0; // hành sinh ra Nhật Chủ
  const supportScore = self + helper;
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const strong = supportScore / total >= 0.5;
  // vượng -> dụng thần là hành mà Nhật Chủ sinh ra (tiết tú) ; nhược -> hành sinh Nhật Chủ
  const yong = strong ? GENERATES_INTO[dayElement] : GENERATED_BY[dayElement];
  return { yong, strong };
}

export function buildSongBan(input: BirthInput): SongBanResult {
  const resolved = resolveTime(input);
  const bazi = buildBazi(resolved, input.gender);
  const tuvi = buildTuvi(resolved, input.gender);

  // Đối chiếu tứ trụ giữa hai engine (chineseDate của iztro vs pillars tyme4ts)
  const izPillars = (tuvi.chineseDate || '').split(/\s+/);
  const tymePillars = [bazi.pillars.year, bazi.pillars.month, bazi.pillars.day, bazi.pillars.hour];
  const pillarsConsistent =
    izPillars.length === 4 && izPillars.every((p, i) => p === tymePillars[i]);

  const counts = bazi.fiveElementsCount;
  const dominantElement = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  const weakestElement = Object.entries(counts).sort((a, b) => a[1] - b[1])[0][0];
  const { yong, strong } = suggestYongShen(bazi.dayMasterElement, counts);

  const notes: string[] = [];
  if (!pillarsConsistent) {
    notes.push(
      `⚠️ Sinh sát biên tiết khí/giờ Tý: tứ trụ hai engine lệch ` +
      `(iztro: ${tuvi.chineseDate} | tyme4ts: ${tymePillars.join(' ')}). ` +
      `tyme4ts chính xác tới phút theo thời điểm tiết khí → LẤY tyme4ts làm chuẩn cho Bát Tự; ` +
      `iztro chỉ dùng để an sao Tử Vi. Nên cho người dùng xác nhận lại giờ sinh.`,
    );
  } else {
    notes.push('✅ Tứ trụ Tử Vi & Bát Tự khớp nhau (cùng dòng lõi lịch 6tail).');
  }
  notes.push(
    `Nhật Chủ ${bazi.dayMaster} (${bazi.dayMasterElement}) ${strong ? 'thiên vượng' : 'thiên nhược'} ` +
    `→ gợi ý dụng thần: ${yong}. Trên lá số Tử Vi, ưu tiên các đại vận/lưu niên thuộc hành ${yong}, ` +
    `và lưu ý cung Mệnh (${tuvi.menhPalace.earthlyBranch}) cùng các chính tinh: ${tuvi.menhPalace.majorStars.join(', ') || '(không có chính tinh)'}.`,
  );

  return {
    resolved,
    bazi,
    tuvi,
    crossCheck: {
      pillarsConsistent,
      dayMasterElement: bazi.dayMasterElement,
      dominantElement,
      weakestElement,
      suggestedYongShen: yong,
      menhPalaceBranch: tuvi.menhPalace.earthlyBranch,
      notes,
    },
  };
}
