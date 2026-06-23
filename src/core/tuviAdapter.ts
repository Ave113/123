// src/core/tuviAdapter.ts
// Engine Tử Vi: iztro. Nhận CÙNG ResolvedTime với Bát Tự -> không lệch ngày/giờ.

import { astro } from 'iztro';
import type { ResolvedTime, Gender, TuviResult, TuviPalace } from './types';

export function buildTuvi(rt: ResolvedTime, gender: Gender): TuviResult {
  const dateStr = `${rt.chartYear}-${rt.chartMonth}-${rt.chartDay}`;
  const g = gender === 'male' ? '男' : '女';
  // bySolar(date, timeIndex(0-11), gender, fixLeap=true, lang)
  const a: any = astro.bySolar(dateStr, rt.hourIndex, g, true, 'zh-CN');

  const palaces: TuviPalace[] = a.palaces.map((p: any) => ({
    name: p.name,
    heavenlyStem: p.heavenlyStem,
    earthlyBranch: p.earthlyBranch,
    majorStars: (p.majorStars ?? []).map((s: any) => s.name),
    minorStars: (p.minorStars ?? []).map((s: any) => s.name),
  }));

  const menh = palaces.find((p) => p.name === '命宫') ?? palaces[0];

  return {
    soul: a.soul,
    body: a.body,
    fiveElementsClass: a.fiveElementsClass,
    chineseDate: a.chineseDate,
    palaces,
    menhPalace: menh,
  };
}
