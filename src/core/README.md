# `src/core/` — Lõi hợp nhất Tử Vi + Bát Tự (v1)

Một lõi lịch, hai lá số. Đặt toàn bộ file vào `src/core/` của repo.

## 1. Cài thêm dependency
```bash
npm i tyme4ts@^1.3.4 cantian-tymext@^0.0.21
# iztro đã có sẵn trong repo
```
- `tyme4ts` = lõi **Tyme** của 6tail → **nguồn chuẩn cho Tứ Trụ** (chính xác tới phút theo tiết khí).
- `cantian-tymext` = mở rộng của cantian trên tyme4ts → **Thần Sát** + quan hệ Can/Chi.
- `iztro` = chỉ dùng để **an sao Tử Vi**.

## 2. Cách dùng
```ts
import { buildSongBan } from './core';

const r = buildSongBan({
  year: 1995, month: 8, day: 13, hour: 23, minute: 30,
  gender: 'male',
  lonE: 105.85, useTrueSolar: true, // hiệu chỉnh Giờ Chân Dương theo kinh độ
  ziHourMode: 'late',               // 晚子时 (mặc định)
});

r.bazi.pillars;          // { year:'乙亥', month:'甲申', day:'丁丑', hour:'庚子' }
r.bazi.dayMaster;        // '丁'  (Nhật Chủ)
r.bazi.tenGods;          // Thập Thần
r.bazi.shenSha;          // Thần Sát theo trụ
r.bazi.decadeFortunes;   // Đại Vận
r.tuvi.menhPalace;       // Cung Mệnh + chính tinh
r.crossCheck;            // đối chiếu chéo dụng thần ↔ cách cục
```

## 3. Hai sai số kinh điển đã xử lý
| Vấn đề | Cách giải |
|---|---|
| **True Solar Time** | dịch phút theo `(kinh độ − 120) × 4` trong `solarTime.ts` |
| **Giờ Tý sớm/muộn (子时分日)** | `ziHourMode`; `late` → 23:xx cuộn sang ngày sau, feed **cùng** ngày/giờ cho cả 2 engine |

## 4. Phát hiện quan trọng (đã kiểm chứng bằng test)
Ở **ca sinh sát biên tiết khí/giờ Tý**, iztro và tyme4ts cho tứ trụ **khác nhau** vì:
- iztro (`lunar-lite`) nhảy mốc theo **ngày**.
- tyme4ts chính xác theo **thời điểm tiết khí (tới phút)**.

Ví dụ 1990-02-04 06:00: Lập Xuân rơi ~11:14 → còn năm 己巳/tháng 丑 (tyme đúng); iztro đã sang 庚午/寅 (sai).

➡️ **Quy tắc:** luôn lấy **tyme4ts làm chuẩn cho Bát Tự**, iztro chỉ an sao Tử Vi. `crossCheck.pillarsConsistent === false` = ca sát biên → nên cho người dùng xác nhận lại giờ sinh.

## 5. File
```
src/core/
  types.ts         # kiểu dữ liệu chung
  solarTime.ts     # chuẩn hóa true solar + giờ Tý (1 lần)
  baziAdapter.ts   # tyme4ts + cantian-tymext -> Tứ Trụ, Thập Thần, Đại Vận, Thần Sát
  tuviAdapter.ts   # iztro -> an sao Tử Vi (nhận cùng thời gian)
  songBan.ts       # hợp nhất + đối chiếu chéo dụng thần ↔ cách cục
  index.ts         # public API
  bazi.test.ts     # 10 test parity/consistency (vitest)
```

## 6. Test
```bash
npx vitest run src/core/bazi.test.ts   # 10 passed
```

## 7. Bước tiếp theo (gợi ý)
- Mở rộng Tứ Hóa **phi tinh động** trong `tuHoa.ts` cho đại hạn/lưu niên/lưu nguyệt.
- `suggestYongShen` hiện chỉ là heuristic phù-ức sơ bộ → nâng cấp bằng tính vượng-suy theo tiết lệnh + thông căn.
- Nối `crossCheck` vào prompt AI (kèm RAG Vương Đình Chi) để luận "song bàn".
