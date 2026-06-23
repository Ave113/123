// src/core/baziAdapter.ts
// Engine Bát Tự: tyme4ts (lõi Tyme của 6tail) + cantian-tymext (Thần Sát/quan hệ)
// Nhận ResolvedTime đã chuẩn hóa từ solarTime.ts để đồng bộ với Tử Vi.

import { SolarTime, ChildLimit, Gender as TymeGender } from 'tyme4ts';
import { getShenFromSizhu } from 'cantian-tymext';
import type { ResolvedTime, Gender, BaziResult, DecadeFortune, FourPillars } from './types';

const STEM_ELEMENT: Record<string, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};
const BRANCH_ELEMENT: Record<string, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};

/** repHour: giờ đại diện cho mỗi hourIndex, tránh để tyme tự cuộn ngày lần nữa */
function repHourFromIndex(hourIndex: number): number {
  // Tý->0:30, Sửu->2:30, Dần->4:30 ... Hợi->22:30 (đều nằm giữa khung 2h)
  return hourIndex * 2;
}

export function buildBazi(rt: ResolvedTime, gender: Gender): BaziResult {
  const st = SolarTime.fromYmdHms(
    rt.chartYear, rt.chartMonth, rt.chartDay,
    repHourFromIndex(rt.hourIndex), 30, 0,
  );
  const ec = st.getLunarHour().getEightChar();

  const yearGZ = ec.getYear().toString();
  const monthGZ = ec.getMonth().toString();
  const dayGZ = ec.getDay().toString();
  const hourGZ = ec.getHour().toString();
  const pillars: FourPillars = { year: yearGZ, month: monthGZ, day: dayGZ, hour: hourGZ };

  const dayStem = ec.getDay().getHeavenStem();
  const dayMaster = dayStem.toString();

  // Thập Thần: Nhật Chủ so với can các trụ khác
  const tenGods = {
    year: dayStem.getTenStar(ec.getYear().getHeavenStem()).getName(),
    month: dayStem.getTenStar(ec.getMonth().getHeavenStem()).getName(),
    hour: dayStem.getTenStar(ec.getHour().getHeavenStem()).getName(),
  };

  // Thần Sát (cantian-tymext)
  const baziStr = yearGZ + monthGZ + dayGZ + hourGZ;
  const ct = getShenFromSizhu(baziStr, gender === 'male' ? '男' : '女');
  const shenSha = {
    year: ct.year ?? [], month: ct.month ?? [], day: ct.day ?? [], hour: ct.time ?? [],
  };

  // Đại Vận (大运) qua ChildLimit
  const tg = gender === 'male' ? TymeGender.MAN : TymeGender.WOMAN;
  const cl = ChildLimit.fromSolarTime(st, tg);
  const startAge = cl.getStartDecadeFortune().getStartAge();
  const decadeFortunes: DecadeFortune[] = [];
  let df = cl.getStartDecadeFortune();
  for (let i = 0; i < 8; i++) {
    decadeFortunes.push({
      index: i,
      ganZhi: df.getSixtyCycle().toString(),
      startAge: df.getStartAge(),
      endAge: df.getEndAge(),
      startYear: df.getStartSixtyCycleYear().getYear(),
    });
    df = df.next(1);
  }

  // Cân bằng ngũ hành (đếm 4 can + 4 chi)
  const fiveElementsCount: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const gz of [yearGZ, monthGZ, dayGZ, hourGZ]) {
    const stem = gz[0], branch = gz[1];
    if (STEM_ELEMENT[stem]) fiveElementsCount[STEM_ELEMENT[stem]]++;
    if (BRANCH_ELEMENT[branch]) fiveElementsCount[BRANCH_ELEMENT[branch]]++;
  }

  return {
    pillars,
    dayMaster,
    dayMasterElement: STEM_ELEMENT[dayMaster] ?? '',
    tenGods,
    shenSha,
    startAge,
    decadeFortunes,
    fiveElementsCount,
  };
}

export { STEM_ELEMENT, BRANCH_ELEMENT };
