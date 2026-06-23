// src/core/bazi.test.ts — parity & consistency test (vitest)
import { describe, it, expect } from 'vitest';
import { resolveTime } from './solarTime';
import { buildBazi } from './baziAdapter';
import { buildSongBan } from './songBan';
import type { BirthInput } from './types';

describe('solarTime — giờ Tý & true solar', () => {
  it('late-zi: 23:xx cuộn sang ngày hôm sau', () => {
    const rt = resolveTime({ year: 1995, month: 8, day: 13, hour: 23, minute: 30, gender: 'male', ziHourMode: 'late' });
    expect([rt.chartYear, rt.chartMonth, rt.chartDay]).toEqual([1995, 8, 14]);
    expect(rt.hourIndex).toBe(0); // Tý
  });

  it('early-zi: 23:xx giữ nguyên ngày', () => {
    const rt = resolveTime({ year: 1995, month: 8, day: 13, hour: 23, minute: 30, gender: 'male', ziHourMode: 'early' });
    expect([rt.chartYear, rt.chartMonth, rt.chartDay]).toEqual([1995, 8, 13]);
    expect(rt.hourIndex).toBe(0);
  });

  it('true solar time dịch phút theo kinh độ (HN ~105.85°E → ~ -57 phút)', () => {
    const rt = resolveTime({ year: 2000, month: 6, day: 1, hour: 12, minute: 0, gender: 'male', lonE: 105.85, useTrueSolar: true });
    expect(rt.trueSolarDeltaMin).toBe(Math.round((105.85 - 120) * 4)); // -57
    expect(rt.solarHour).toBe(11);
    expect(rt.solarMinute).toBe(3);
  });
});

describe('buildBazi — tứ trụ chuẩn (tyme4ts)', () => {
  const input: BirthInput = { year: 1995, month: 8, day: 13, hour: 23, minute: 30, gender: 'male', ziHourMode: 'late' };
  const b = buildBazi(resolveTime(input), 'male');

  it('Tứ Trụ đúng', () => {
    expect(b.pillars).toEqual({ year: '乙亥', month: '甲申', day: '丁丑', hour: '庚子' });
  });
  it('Nhật Chủ = 丁 (Hỏa)', () => {
    expect(b.dayMaster).toBe('丁');
    expect(b.dayMasterElement).toBe('火');
  });
  it('Thập Thần đúng', () => {
    expect(b.tenGods).toEqual({ year: '偏印', month: '正印', hour: '正财' });
  });
  it('Đại Vận khởi vận tuổi 3, vận đầu 癸未', () => {
    expect(b.startAge).toBe(3);
    expect(b.decadeFortunes[0].ganZhi).toBe('癸未');
    expect(b.decadeFortunes.length).toBe(8);
  });
  it('Đếm ngũ hành = 8 (4 can + 4 chi)', () => {
    const total = Object.values(b.fiveElementsCount).reduce((a, c) => a + c, 0);
    expect(total).toBe(8);
  });
});

describe('songBan — hợp nhất & cross-check', () => {
  it('ca thường: Tử Vi & Bát Tự khớp tứ trụ', () => {
    const r = buildSongBan({ year: 1995, month: 8, day: 13, hour: 23, minute: 30, gender: 'male', ziHourMode: 'late' });
    expect(r.crossCheck.pillarsConsistent).toBe(true);
  });

  it('ca sát biên tiết khí (1990-02-04 06:00) bị flag để rà soát', () => {
    const r = buildSongBan({ year: 1990, month: 2, day: 4, hour: 6, minute: 0, gender: 'male' });
    // tyme4ts chuẩn tới phút; iztro nhảy theo ngày -> lệch -> phải bị flag
    expect(r.crossCheck.pillarsConsistent).toBe(false);
    expect(r.bazi.pillars.month).toBe('丁丑'); // trước Lập Xuân 11:14 -> còn tháng Sửu
  });
});
