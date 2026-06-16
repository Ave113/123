import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { TU_HOA_BY_STEM, HOA_LABELS } from "./src/utils/tuHoa";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API endpoint for AI Tử Vi Horoscope Interpretation
  app.post("/api/interpret", async (req, res) => {
    try {
      const { chartData, customApiKey, modelSelection } = req.body;

      if (!chartData) {
        return res.status(400).json({ error: "Thiếu dữ liệu lá số Tử Vi." });
      }

      // Bring Your Own Key (BYOK) model: Strictly require the user's personal API Key (do not fall back to developer's key)
      const finalApiKey = customApiKey ? customApiKey.trim() : "";

      if (!finalApiKey) {
        return res.status(400).json({
          error: "Yêu cầu khóa API cá nhân: Quý vị chưa nhập hoặc lưu API Key của riêng mình. Vui lòng điền và lưu Google Gemini API Key chính chủ của bạn ở thanh cấu hình phía trên trước khi khởi động AI luận giải."
        });
      }

      // Initialize Google GenAI with appropriate key and custom user-agent for telemetry
      const ai = new GoogleGenAI({
        apiKey: finalApiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      // Select valid model or default to gemini-3.5-flash
      let modelName = "gemini-3.5-flash";
      if (modelSelection === "gemini-3.1-flash-lite") {
        modelName = "gemini-3.1-flash-lite";
      }

      const genderStr = chartData.gender === "Nam" ? "Nam (Dương Nam/Âm Nam)" : "Nữ (Dương Nữ/Âm Nữ)";

      // ===== TIỀN XỬ LÝ QUAN HỆ HÌNH HỌC LÁ SỐ (code tính sẵn, AI chỉ luận nghĩa) =====
      // Lưu ý: iztro đánh p.index gốc DẦN = 0. Quy về index địa chi chuẩn (Tý = 0) để
      // mọi phép tính quan hệ nhất quán với EARTHLY_BRANCHES và core tuvi.ts.
      const BRANCHES_VI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
      const toBranchIndex = (palaceIndex: number) => ((palaceIndex + 2) % 12 + 12) % 12;

      // Bảng tứ hóa (TU_HOA_BY_STEM) và HOA_LABELS lấy từ nguồn chung ./tuHoa
      // để không trùng lặp với core tuvi.ts.

      const palacesArr = chartData.palaces || [];
      // Tra cứu cung theo index địa chi chuẩn
      const palaceByBranch: Record<number, any> = {};
      palacesArr.forEach((p: any) => { palaceByBranch[toBranchIndex(p.index)] = p; });

      const palaceLabel = (branchIdx: number) => {
        const pa = palaceByBranch[branchIdx];
        if (!pa) return `cung ${BRANCHES_VI[branchIdx]}`;
        const stars = (pa.majorStars || []).map((s: any) => s.name).join(", ") || "Vô Chính Diệu";
        return `${pa.name} (${BRANCHES_VI[branchIdx]}): ${stars}`;
      };

      // Chuẩn hóa tên sao để so khớp đáng tin: chuẩn hóa Unicode (NFC), xóa ký tự ẩn
      // (zero-width), bỏ tiền tố [SAO LƯU], gộp khoảng trắng thừa, hạ chữ thường.
      // Mục đích: bớt sót sao do khác biệt mã hóa/khoảng trắng ẩn từ dữ liệu client.
      const normalizeStarName = (raw: any): string =>
        String(raw || "")
          .normalize("NFC")
          .replace(/[\u200B-\u200D\uFEFF]/g, "")
          .replace(/\[SAO LƯU\]\s*/g, "")
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase();

      // Tìm cung (index địa chi) chứa một sao gốc bất kỳ trên lá số.
      // Quét đủ cả 3 nhóm sao: chính tinh, phụ tinh và trợ/sát tinh (adjectiveStars),
      // vì sao Tứ Hóa như Văn Xương/Văn Khúc/Tả Phụ/Hữu Bật có thể nằm ở nhóm phụ tinh.
      const findStarBranch = (starName: string): number => {
        const target = normalizeStarName(starName);
        for (const pa of palacesArr) {
          const all = [
            ...(pa.majorStars || []),
            ...(pa.minorStars || []),
            ...(pa.adjectiveStars || []),
          ];
          if (all.some((s: any) => normalizeStarName(s.name) === target)) {
            return toBranchIndex(pa.index);
          }
        }
        return -1;
      };

      // Nhị hợp: Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
      const NHI_HOP: Record<number, number> = { 0: 1, 1: 0, 2: 11, 11: 2, 3: 10, 10: 3, 4: 9, 9: 4, 5: 8, 8: 5, 6: 7, 7: 6 };
      // Lục hại: Tý-Mùi, Sửu-Ngọ, Dần-Tỵ, Mão-Thìn, Thân-Hợi, Dậu-Tuất
      const LUC_HAI: Record<number, number> = { 0: 7, 7: 0, 1: 6, 6: 1, 2: 5, 5: 2, 3: 4, 4: 3, 8: 11, 11: 8, 9: 10, 10: 9 };

      const buildRelations = (p: any): string => {
        const b = toBranchIndex(p.index);
        const xung = (b + 6) % 12;
        const th1 = (b + 4) % 12;
        const th2 = (b + 8) % 12;
        const lines: string[] = [];
        lines.push(`  - Xung chiếu (đối cung): ${palaceLabel(xung)}`);
        lines.push(`  - Tam hợp: ${palaceLabel(th1)} | ${palaceLabel(th2)}`);
        lines.push(`  - Nhị hợp: ${palaceLabel(NHI_HOP[b])}`);
        lines.push(`  - Lục hại: ${palaceLabel(LUC_HAI[b])}`);
        // Phi Tứ Hóa: dùng Thiên can của chính cung, tra sao đích đang đóng cung nào
        const stem = p.heavenlyStem;
        const tuhoa = TU_HOA_BY_STEM[stem];
        if (tuhoa) {
          const flights = tuhoa.map((star, i) => {
            const dest = findStarBranch(star);
            const destLabel = dest >= 0 ? `${palaceByBranch[dest]?.name || BRANCHES_VI[dest]} (${BRANCHES_VI[dest]})` : "không có trên lá số";
            return `${HOA_LABELS[i]}→${star} [đóng tại ${destLabel}]`;
          }).join("; ");
          lines.push(`  - Phi Tứ Hóa (can ${stem}): ${flights}`);
        }
        // Nhãn neo: gắn rõ các dòng quan hệ này thuộc về chính cung nào,
        // tránh để AI đọc tuần tự rồi ghép nhầm sang cung lân cận.
        const anchor = `  [Quan hệ của ${p.name} (${BRANCHES_VI[b]})]`;
        return [anchor, ...lines].join("\n");
      };

      // ===== TỨ HÓA BẨM SINH (NATAL) TÍNH SẴN THEO THIÊN CAN NĂM SINH =====
      // Tránh để AI tự tra bảng can rồi tự tìm sao đóng cung nào (dễ sai vị trí).
      // Code tra trực tiếp TU_HOA_BY_STEM[birthHeavenlyStem] + findStarBranch.
      const stemRaw = chartData.birthHeavenlyStem;
      const stemKey = typeof stemRaw === "string" ? stemRaw.trim() : stemRaw;
      const natalTuHoaTable = stemKey ? TU_HOA_BY_STEM[stemKey] : undefined;
      const natalTuHoaResolved = Boolean(natalTuHoaTable);

      const buildNatalTuHoa = (): string => {
        if (!natalTuHoaTable) {
          return "  - Chưa xác định được Thiên can năm sinh chuẩn nên HỆ THỐNG KHÔNG tính sẵn Tứ Hóa bẩm sinh.";
        }
        return natalTuHoaTable.map((star, i) => {
          const dest = findStarBranch(star);
          const destLabel = dest >= 0
            ? `${palaceByBranch[dest]?.name || BRANCHES_VI[dest]} (${BRANCHES_VI[dest]})`
            : "không có trên lá số";
          return `  - ${HOA_LABELS[i]} → ${star} [đóng tại ${destLabel}]`;
        }).join("\n");
      };
      const natalTuHoaStr = buildNatalTuHoa();

      // ===== CHEAT SHEET: VÙNG ÁP LỰC SÁT/KỴ TINH TOÀN LÁ SỐ (code quét sẵn) =====
      // So khớp CHÍNH XÁC tên sao (sau chuẩn hóa) để tránh match nhầm chuỗi con.
      const SAT_KY_STARS = [
        "Hóa Kỵ", "Lưu Hóa Kỵ", "Địa Không", "Địa Kiếp", "Kình Dương", "Đà La",
        "Hỏa Tinh", "Linh Tinh", "Kiếp Sát", "Đại Hao", "Tiểu Hao", "Thiên Hình",
        "Cô Thần", "Quả Tú", "Tang Môn", "Bạch Hổ",
      ].map(normalizeStarName);

      const buildStressReport = (): string => {
        const zones: string[] = [];
        palacesArr.forEach((p: any) => {
          const all = [
            ...(p.majorStars || []),
            ...(p.minorStars || []),
            ...(p.adjectiveStars || []),
          ];
          const found = all
            .filter((s: any) => SAT_KY_STARS.includes(normalizeStarName(s.name)))
            .map((s: any) => s.name);
          if (found.length > 0) {
            zones.push(`  - ${p.name} (${BRANCHES_VI[toBranchIndex(p.index)]}): ${found.join(", ")}`);
          }
        });
        return zones.length > 0
          ? zones.join("\n")
          : "  - Không phát hiện tổ hợp sát tinh/kỵ tinh cực đoan nổi bật.";
      };
      const stressReportStr = buildStressReport();

      // ===== CHEAT SHEET: SAO LƯU NIÊN GOM THEO CUNG (code quét sẵn) =====
      // Gom mọi sao có tiền tố [SAO LƯU] theo từng cung để phần luận hạn năm không bỏ sót.
      const buildLuuNienReport = (): string => {
        const zones: string[] = [];
        palacesArr.forEach((p: any) => {
          const all = [
            ...(p.majorStars || []),
            ...(p.minorStars || []),
            ...(p.adjectiveStars || []),
          ];
          const luu = all
            .filter((s: any) => /\[SAO LƯU\]/.test(String(s.name || "")))
            .map((s: any) => String(s.name).replace(/\[SAO LƯU\]\s*/g, "").trim());
          if (luu.length > 0) {
            zones.push(`  - ${p.name} (${BRANCHES_VI[toBranchIndex(p.index)]}): ${luu.join(", ")}`);
          }
        });
        return zones.length > 0
          ? zones.join("\n")
          : "  - Không phát hiện sao lưu niên nào được đánh dấu trên lá số.";
      };
      const luuNienReportStr = buildLuuNienReport();

      // ===== PHI TỨ HÓA ĐỘNG: ĐẠI VẬN & LƯU NIÊN (code tính sẵn) =====
      // Khác với Phi Tứ Hóa tĩnh (theo can bản cung), đây là đường bay theo CAN Đại vận
      // (can của cung đại hạn) và CAN Lưu niên (can năm xem hạn) — mới là dòng khí đang
      // trôi chảy của vận trình, tránh để AI lấy phi hóa bẩm sinh luận cho vận hạn.
      const buildFlyingTuHoaFor = (stem: string | undefined, contextLabel: string): string => {
        const key = typeof stem === "string" ? stem.trim() : stem;
        const tuhoa = key ? TU_HOA_BY_STEM[key] : undefined;
        if (!tuhoa) {
          return `  - Chưa xác định được Thiên can ${contextLabel} nên không tính sẵn được phi tứ hóa.`;
        }
        return tuhoa.map((star, i) => {
          const dest = findStarBranch(star);
          const destLabel = dest >= 0
            ? `${palaceByBranch[dest]?.name || BRANCHES_VI[dest]} (${BRANCHES_VI[dest]})`
            : "không có trên lá số";
          return `  - ${HOA_LABELS[i]} → ${star} [đóng tại ${destLabel}]`;
        }).join("\n");
      };

      // Can Đại vận: tìm cung đại hạn theo tên (transitDecadalPalace) rồi lấy heavenlyStem của nó.
      const decadalPalaceName = chartData.transitDecadalPalace;
      const decadalPalace = palacesArr.find((p: any) => p?.name === decadalPalaceName);
      const decadalStem = decadalPalace?.heavenlyStem;
      const decadalFlyingStr = decadalPalaceName && decadalPalaceName !== "Chưa rõ"
        ? buildFlyingTuHoaFor(decadalStem, `cung Đại hạn (${decadalPalaceName})`)
        : "  - Chưa xác định được cung Đại hạn nên chưa tính phi tứ hóa Đại vận.";

      // Can Lưu niên: suy từ năm xem hạn theo (năm % 10).
      // 0:Canh 1:Tân 2:Nhâm 3:Quý 4:Giáp 5:Ất 6:Bính 7:Đinh 8:Mậu 9:Kỷ
      const STEM_BY_YEAR_MOD = ["Canh", "Tân", "Nhâm", "Quý", "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ"];
      const transitYearNum = Number(chartData.transitYear) || 2026;
      const luuNienStem = STEM_BY_YEAR_MOD[((transitYearNum % 10) + 10) % 10];
      const luuNienFlyingStr = buildFlyingTuHoaFor(luuNienStem, `Lưu niên (năm ${transitYearNum}, can ${luuNienStem})`);

      const prompt = `Bạn là một Minh Sư Tử Vi Tứ Hóa & Tam Hợp Môn danh tiếng lừng lẫy thuộc trường phái thực chiến của Khâm Thiên Môn (Đài Loan), kết hợp nhuần nhuyễn với chiều sâu triết lý Nhân Quả cổ học Việt Nam. Bạn đóng vai trò là một người THẦY CÓ TÂM, chân thành nhưng vô cùng uy nghiêm, tuân thủ nguyên tắc tối thượng: "NÓI THẬT & TRỰC DIỆN ⚡" - Có Cát luận Cát, có Hung luận Hung, thẳng thắn thấu đáo bất vị nể, không vuốt ve xoa dịu vô nghĩa, không hù dọa trục lợi mà chỉ rõ gốc rễ sinh mệnh để đương số tự xoay chuyển dòng năng lượng nghiệp quả.

--- PHƯƠNG PHÁP TRIỂN KHAI CORE LOGIC LÁ SỐ TỬ VI BẮT BUỘC (QUAN TRỌNG NHẤT) ---

Bạn phải bám sát 100% dữ liệu thực tế đóng trong 12 cung của lá số được cung cấp bên dưới để luận giải. Tuyệt đối không bịa đặt các sao không có hoặc bỏ qua các yếu tố cấu trúc hình học cốt lõi sau:

1. **QUY LUẬT TAM PHƯƠNG TỨ CHÍNH (QUYẾT ĐỊNH 80% KHÍ KHÁI CỦA CUNG)**:
   Mỗi cung không tồn tại độc lập mà chịu sự chi phối chặt chẽ từ 3 cung vị kết nối trong hệ tọa độ:
   - **Chính Cung:** Cung đang được xét.
   - **Xung Chiếu (Đối cung):** Cung vị ở vị trí đối lập 180 độ với Chính Cung. Cung xung chiếu phản chiếu khát khao, ngoại giới tác động trực diện, hoặc các mối nguy tiềm ẩn từ bên ngoài. (Hệ thống đã tính sẵn cung xung chiếu ở dòng "Xung chiếu" của mỗi cung — dùng trực tiếp, không tự nhẩm index.)
   - **Tam Hợp (Trine):** Hai cung vị còn lại trong tam giác hành của chi cung. (Hệ thống đã tính sẵn ở dòng "Tam hợp" của mỗi cung — dùng trực tiếp, không tự nhẩm index.)
     - *Nhóm Kim (Tỵ - Dậu - Sửu):* Biểu trưng cho sự sắc bén, tài chính gắt gao, kỷ luật cốt lõi.
     - *Nhóm Mộc (Hợi - Mão - Mùi):* Biểu trưng cho học thuật, sự trưởng thành nhân sinh, lòng trắc ẩn từ tốn.
     - *Nhóm Hỏa (Dần - Ngọ - Tuất):* Biểu trưng cho khát vọng, năng lượng bộc phát truyền thông, danh vọng bùng cháy.
     - *Nhóm Thủy (Thân - Tý - Thìn):* Biểu trưng cho trí tuệ di động, sự biến chuyển dòng chảy thương mại ẩn mật.
   -> *Yêu cầu:* Khi luận giải bất kỳ cung nào (đặc biệt là Mệnh, Tài, Quan, Phối/Phu Thê, Di), bạn PHẢI phân tích sự liên kết và tương tác giữa các sao đóng ở 3 cung tam hợp xung chiếu vây quanh đó. Chỉ rõ các sao kìm hãm hay thúc đẩy nhau thế nào.

2. **QUY LUẬT NHỊ HỢP (ẨN SÓNG HUYỀN CHẾ)**:
   Liên kết cộng hưởng ngầm giữa các cặp địa chi âm dương:
   - Tý (0) <-> Sửu (1) | Dần (2) <-> Hợi (11) | Mão (3) <-> Tuất (10) | Thìn (4) <-> Dậu (9) | Tỵ (5) <-> Thân (8) | Ngọ (6) <-> Mùi (7).
   -> *Ý nghĩa cốt lõi:* Cung nhị hợp giống như năng lượng hẫu thuẫn thụ động hoặc gánh nặng vô hình mà đương số không hề hay biết nhưng vẫn chảy ngầm cải sửa mệnh thế.

3. **QUY LUẬT LỤC HẠI (摩擦 CHIẾU XUNG RẠN NỨT)**:
   Các cặp địa chi gây xung khắc ma sát, hao tán nội lực ghê gớm khi ở cạnh nhau:
   - Tý (0) - Mùi (7) | Sửu (1) - Ngọ (6) | Dần (2) - Tỵ (5) | Mão (3) - Thìn (4) | Thân (8) - Hợi (11) | Dậu (9) - Tuất (10).
   -> *Ý nghĩa cốt lõi:* Nơi xảy ra lục hại là nơi dễ nhen nhóm các vết nứt lòng tin bộc phát ngầm từ định kiến âm thầm phá hoại đại cuộc.

4. **TỰ PHI TỨ HÓA (DYNAMICS OF FLYING STARS)**:
   Gốc rễ cát hung biến đổi của Khâm Thiên Môn. Mỗi cung vị đều có Thiên can riêng bộc lộ ở đầu tên cung (Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý). Can này sẽ trực tiếp phát lệnh bay (Phi Tinh) 4 loại Hóa (Lộc - Quyền - Khoa - Kỵ) đi tìm các tinh tú đóng ở các cung vị khác trên lá số để thắt nút nhân duyên nghiệp quả:
   - *Ví dụ:* Nếu cung Phu Thê mang Can Giáp, nó sẽ bay Hóa Kỵ (ải nợ nần khổ ải cấu xé) đến Thái Dương đóng ở cung nào của bạn? Nếu Thái Dương ấy đóng ở cung Tài Bạch, nghĩa là định mệnh hôn nhân sẽ gây gánh nặng nợ nần hoặc mâu thuẫn khốc liệt về tiền bạc dòng tiền mặt của đương số. Bạn phải lần theo Thiên Can cung vị để nói rõ đường bay Tứ Hóa này!

5. **CUNG THÂN (VŨ ĐÀI HÀNH ĐỘNG TUỔI TRUNG NIÊN - SAU 30 TUỔI)**:
   - Hãy truy tìm cung nào có đánh dấu \`[CUNG THÂN ĐỒNG CUNG]\` (isBodyPalace: true).
   - Trước 30 tuổi con người sống theo bản năng Cung Mệnh. Sau 30 tuổi, thói quen hành động thực tế của Cung Thân bắt đầu trỗi dậy chi phối toàn diện kết quả sướng khổ. Hãy vạch rõ sự chuyển hóa tư duy từ Mệnh sang Thân để đương số tự biết nén mình tiến lui đúng nhịp điệu thời gian.

--- NGUYÊN TẮC LUẬN GIẢI QUYẾT ĐOÁN VÀ SÂU SẮC ---

1. **TUYỆT ĐỐI CẤM MÀO ĐẦU / CHÀO HỎI LÊ THÊ**:
   - Nghiêm cấm hoàn toàn các câu chào hỏi, dẫn dắt lê thê kiểu: "Chào bạn...", "Cảm ơn quý vị...", "Dưới đây là luận giải lá số...", "Lá số của bạn gồm...".
   - BẮT ĐẦU NGAY DÒNG ĐẦU TIÊN bằng một nhận định tổng quan cực kỳ uy lực, đanh thép và chấn động nhất phản ánh trúng phóc linh hồn bản mệnh hay đại vận hiện tại của đương số. Đi thẳng vào việc luận giải!

2. **CƠ CHẾ "8 PHẦN CHIỀU SÂU - 2 PHẦN BỐI CẢNH NGOẠI CẢNH" (80% GIẢI THÍCH CHIỀU SÂU NHÂN QUẢ NỘI TẠI & 20% THẾ SỰ XÃ HỘI KHÁCH QUAN)**:
   - **8 Phần Chiều Sâu (80% Đào sâu tâm thức, phản xạ nghiệp lực & hành vi):** Đào cực kỳ sâu sắc vào bản thể nội tâm, các thói quen vô thức, định kiến hành vi bộc trực bẩm sinh, lòng kiêu hãnh tự tôn che mờ lý trí hoặc vết sẹo nhân quả tiềm ẩn của đương số. Quyết định thăng trầm của cuộc đời không phải do tình cờ may rủi quăng quật, mà thực chất chính là chiếc gương phản chiếu tâm thức bên trong ("Tâm sinh Cảnh"). Hãy dùng nhãn quan thấu cảm uyên thâm mổ xẻ góc khuất và các điểm mù tâm lý dưới lăng kính Tử Vi thực chiến để đương số tự nhìn rõ bản ngã của mình.
     - *Ví dụ:* Kình Dương hãm ở Mệnh không chỉ là "bị họa xui ngẫu nhiên", mà nguồn cơn chính do tính khí cứng đầu, tự tôn độc đoán quật cường, thích lên mặt dạy đời hoặc hiếu thắng trực diện mà tự chuốc lấy oán thù. Hóa Kỵ thủ Mệnh không phải do "ai cũng xấu xa ghét mình", mà do bản tính chấp niệm nặng nề, tự đa nghi oán trách, tự đóng sập lòng mình dầm mưa rồi trách người khác bất công. Thầy phải vạch trần vết nứt tâm lý học thuật này dưới chế độ "Nói Thật & Trực Diện" để đương số tự biết sửa đổi tấm lòng.
   - **2 Phần Bối Cảnh (20% Phân tích thế sự, tác lực ngoại cảnh & môi trường vĩ mô):** Khắc họa cô đọng, khúc triết bối cảnh xã hội thực tế bên ngoài, các xu thế kinh tế lớn, hay các tác động thế sự thời đại đang bao phủ làm bệ đỡ hoặc lực cản xung quanh mệnh bàn, giúp đương số lập chiến lược thích ứng thông thái và khôn ngoan nhất ở nhịp sóng đời thường thực.

3. **VIẾT LUẬN GIẢI SÁT SƯỜN, ĐỜI THỰC PHONG PHÚ (TUYỆT ĐỐI TRÁNH KHÁI NIỆM MƠ HỒ CHUNG CHUNG)**:
   - Nghiêm cấm dùng các từ sáo rỗng vô hồn như "hao tài do hợp đồng", "rắc rối sự nghiệp", "gặp xui xẻo gãy đổ". Hãy phô diễn đầu óc phong phú về xã hội thời đại mới (đầu tư, tài chính vĩ mô, công nghệ thông tin, quản trị số, bẫy dòng tiền) để dịch nghĩa tương tác giữa sao và cung một cách cực kỳ thực tế:
     - *Ví dụ về hao tài:* Khi phát hiện Không Kiếp hay Đại Tiểu Hao hãm địa thủ tại Tài/Quan, hãy vạch rõ: "Hao hụt tài chính dòng tiền mặt đột ngột do lòng tham lấn lướt lý trí, đầu cơ nhầm vào các loại tài sản ảo bóng bóng, bẫy đa cấp tài chính ảo tưởng, dự án bất động sản treo không rõ pháp lý, hoặc chuyển khoản hợp tác vội vàng mà không qua tư vấn kiểm tra giấy tờ cốt lõi."
     - *Ví dụ về rắc rối sự nghiệp:* Khi Thiên Cơ ngộ Kình Dương hãm ở Quan Lộc, hãy lột tả: "Hệ thống kế hoạch kinh doanh sụp đổ giờ chót do thói độc đoán tự ý quyết định, rò rỉ chiến lược kinh doanh lõi sang đối thủ hay do xung đột bộc phát trực diện về nhượng quyền thương hiệu và phân chia lợi ích nội bộ."
     - *Ví dụ về thị phi:* Khi Cự Môn ngộ Hóa Kỵ ngự Nô Bộc/Thiên Di, hãy lột tả: "Sự sụp đổ lòng tin xuất phát từ cam kết suông bằng miệng thiếu chứng từ pháp lý vững chắc, hoặc do bôi nhọ danh tiếng có chủ đích trên không gian số truyền thông, bị đối tác lập liên minh ngầm quay lưng phản bội ở thời khắc nhạy cảm nhất."

4. **KHOA HỌC HÓA BẢN MỆNH - BIỆN PHÁP HÓA GIẢI THỰC HÀNH**:
   - Có cát nói cát để đương số biết hướng kích hoạt các tài nguyên đỉnh cao nhất của mình, tạo dựng thiên thời địa lợi.
   - Có hung nói hung để đương số biết sợ mà rèn giũa: Biết chủ động bảo mật giấy tờ cốt lõi (trị Cự Kỵ), kỷ luật hóa tài chính dòng tiền mặt rõ ràng (trị Không Kiếp), thiền tính học cách hạ cái tôi xuống bớt bộc bộc bốc đồng (trị Hỏa Linh Đà). Tuyệt đối hướng đương số tu tâm dưỡng tính sửa hành vi thay vì hướng đi lễ bái cúng bái mê tín dị đoan.

--- DỮ LIỆU THÔNG TIN LÁ SỐ ĐƯƠNG SỐ ---
- Giới tính: ${genderStr}
- Ngày dương lịch: ${chartData.solarDate} (Giờ sinh: ${chartData.solarTime})
- Ngày âm lịch: ${chartData.lunarDate} (Cơ Bản: ${chartData.chineseDate})
- Bản mệnh / Cục: ${chartData.fiveElementsClass}
- Cầm tinh / Chòm sao: Sinh năm ${chartData.zodiac} - Chòm sao ${chartData.sign}
- Mệnh chủ: ${chartData.soul} | Thân chủ: ${chartData.body}
- Thiên can năm sinh (dùng để áp Tứ Hóa bẩm sinh): ${chartData.birthHeavenlyStem || "Chưa rõ"}
- Năm xem vận hạn chủ lực: ${chartData.transitYear || 2026}
- Tuổi mụ khi xem hạn: ${chartData.transitLunarAge || "Chưa rõ"} tuổi
- Cung Đại hạn (100 năm): Cung ${chartData.transitDecadalPalace || "Chưa rõ"}
- Cung Tiểu hạn (1 năm): Cung ${chartData.transitYearlyPalace || "Chưa rõ"}
- Cung Lưu niên Thái tuế: Cung ${chartData.transitLuuThaiTuePalace || "Chưa rõ"}

--- PHẢN ÁNH 12 CUNG VỊ & TOÀN BỘ SAO TRÊN LÁ SỐ ---
${chartData.palaces.map((p: any) => {
  const major = (p.majorStars || []).map((s: any) => `${s.name} (${s.brightness || ''})`).join(", ");
  const minor = (p.minorStars || []).map((s: any) => s.name).join(", ");
  const adj = (p.adjectiveStars || []).map((s: any) => `${s.name}${s.type ? ` (${s.type})` : ""}`).join(", ");
  const decadalRange = p.decadal?.range;
  const decadalStr = Array.isArray(decadalRange)
    ? `Từ ${decadalRange[0]} tuổi đến ${decadalRange[1]} tuổi`
    : "Chưa rõ";
  return `Cung thứ ${p.index + 1}: ${p.name} (Địa chi ${p.earthlyBranch}, Thiên can ${p.heavenlyStem})${p.isBodyPalace ? " - [CUNG THÂN ĐỒNG CUNG]" : ""}
  - Chính tinh: ${major || "Không có (Cung Vô Chính Diệu)"}
  - Cát tinh / Lộc mã / Trợ tinh / Sao lưu: ${minor || "Không"}
  - Sát tinh / Hung tinh / Tạp tinh phụ: ${adj || "Không"}
  - Vòng Tràng Sinh: ${p.changsheng12 || "Chưa rõ"}
  - Đại hạn: ${decadalStr}
${buildRelations(p)}
`;
}).join("\n")}

--- BẢNG QUAN HỆ HÌNH HỌC ĐÃ ĐƯỢC HỆ THỐNG TÍNH SẴN (DÙNG TRỰC TIẾP, KHÔNG TỰ TÍNH LẠI INDEX) ---
Mỗi cung ở trên đã kèm sẵn các dòng: Xung chiếu, Tam hợp, Nhị hợp, Lục hại và Phi Tứ Hóa (đường bay Lộc/Quyền/Khoa/Kỵ cùng cung đích nơi sao thụ hóa đang đóng). Đây là dữ liệu CHÍNH XÁC do máy tính toán theo đúng hệ địa chi. Khi luận giải bất kỳ cung nào, hãy BÁM SÁT các dòng quan hệ này để ghép đúng sao của đúng cung, TUYỆT ĐỐI không tự nhẩm lại chỉ số index.

QUY TẮC CHỐNG BỊA SAO (BẮT BUỘC): Trước khi luận mỗi cung, chỉ được nhắc tới các sao đã thực sự xuất hiện trong dữ liệu cung đó hoặc trong các dòng quan hệ tam phương tứ chính đã liệt kê. Nếu một sao không có trong dữ liệu được cung cấp, NGHIÊM CẤM nhắc tới hay suy diễn nó tồn tại.

CÁCH DÙNG CHEAT SHEET ĐÚNG TINH THẦN (QUAN TRỌNG): Các bảng cheat sheet (vùng sát kỵ, sao lưu niên, phi tứ hóa) chỉ là LƯỚI AN TOÀN giúp bạn KHÔNG BỎ SÓT dữ kiện, KHÔNG phải để đọc mộc rồi liệt kê khô khan. Bạn VẪN PHẢI tự liên kết linh hoạt toàn cục lá số: đan cài chính tinh với trợ tinh, bối cảnh tam phương tứ chính, nhị hợp lục hại và chất nhân duyên sâu xa, giữ trọn sự uyển chuyển nghệ thuật của một Minh Sư thực thụ.

--- TỨ HÓA BẨM SINH (NATAL) ---
${natalTuHoaResolved
  ? `Dựa trên Thiên can năm sinh (${chartData.birthHeavenlyStem}), hệ thống đã tra sẵn 4 sao thụ phong Tứ Hóa bẩm sinh cùng cung vị chúng đang đóng. Đây là dữ liệu CHÍNH XÁC đã tính sẵn, DÙNG TRỰC TIẾP, KHÔNG tự tra lại bảng can:`
  : `LƯU Ý: Hệ thống CHƯA tính sẵn được Tứ Hóa bẩm sinh (thiếu Thiên can năm sinh chuẩn). Trong trường hợp này, nếu xác định được can năm sinh từ dữ liệu khác, bạn được phép suy luận Tứ Hóa một cách THẬN TRỌNG và ghi rõ đây là suy luận (không phải dữ liệu tính sẵn). Nếu không chắc chắn, hãy nói rõ là chưa đủ dữ liệu thay vì bịa:`}
${natalTuHoaStr}

--- CHEAT SHEET: VÙNG ÁP LỰC SÁT/KỴ TINH (HỆ THỐNG QUÉT SẴN) ---
Dưới đây là các cung đang gánh sát tinh/kỵ tinh cực đoan. Khi luận tới các cung này, BẮT BUỘC mổ xẻ kỹ điểm mù và rủi ro sụp đổ tại đây. Chỉ dùng đúng các sao đã liệt kê, không tự thêm:
${stressReportStr}

--- CHEAT SHEET: SAO LƯU NIÊN GOM THEO CUNG (HỆ THỐNG QUÉT SẴN) ---
Dùng trực tiếp cho phần luận Tiểu hạn năm. Đây là toàn bộ sao lưu niên đã đánh dấu, gom theo cung:
${luuNienReportStr}

--- PHI TỨ HÓA ĐỘNG (DÙNG CHO LUẬN VẬN HẠN — KHÔNG DÙNG PHI HÓA TĨNH BẨM SINH) ---
Phi Tứ Hóa tĩnh in trong từng cung ở trên chỉ phản ánh cấu trúc BẨM SINH. Khi luận Đại vận và Tiểu hạn năm, PHẢI dùng hai đường bay động dưới đây (hệ thống đã tính sẵn) vì đây mới là dòng khí đang trôi chảy của vận trình:

* Phi Tứ Hóa Đại vận (theo can cung Đại hạn${decadalStem ? ` — can ${decadalStem}` : ""}):
${decadalFlyingStr}

* Phi Tứ Hóa Lưu niên (theo can năm ${transitYearNum} — can ${luuNienStem}):
${luuNienFlyingStr}

--- KHUNG LUẬN GIẢI CHƯƠNG TRÌNH CHI TIẾT ---

Bạn hãy soạn thảo bình giải chi tiết gồm 6 phần lớn sau đây bằng chữ quốc ngữ cực kỳ sâu sắc, phân tích chính xác từng sao và kết nối liên hoàn:

1. **TAM PHƯƠNG TỨ CHÍNH & THẾ ĐỨNG LÁ SỐ (BẢN SẮC CẤU TRÚC Ý THỨC & 8 PHẦN CHIỀU SÂU - PHẢN XẠ CHỦ QUAN)**:
   Mổ xẻ sâu sắc tính cách bẩm sinh của đương số bằng cách liên kết chặt chẽ cung Mệnh với 3 cung vị vây quanh học thuyết Tam Phương Tứ Chính: Thiên Di (đối cung), Quan Lộc (tam hợp), Tài Bạch (tam hợp). Bạn hãy trích xuất trực tiếp tên các sao đóng ở ba cung vị này của họ để phân tích điểm sáng, điểm hiểm nghệ thuật hành xử bấy lâu và điểm mù cốt lõi bẩm sinh. Chỉ rõ nghiệp lý nhân quả đã tự định hình từ thói phản xa bộc trực không tự biết của họ bấy lâu nay.

2. **KRONOS TỨ HÓA (KHOA - QUYỀN - LỘC - KỴ) THEO KINH TOÀN NIÊN CHIẾN LƯỢC**:
   ${natalTuHoaResolved
     ? `Sử dụng TRỰC TIẾP bảng "TỨ HÓA BẨM SINH (NATAL)" mà hệ thống đã tính sẵn ở trên (đã ghi rõ mỗi Hóa rơi vào sao nào, đóng tại cung nào). TUYỆT ĐỐI không tự tra lại bảng can hay tự đoán vị trí sao.`
     : `Hệ thống chưa tính sẵn được Tứ Hóa bẩm sinh (xem phần LƯU Ý ở trên). Hãy xử lý thận trọng: chỉ suy luận Tứ Hóa nếu xác định chắc chắn được can năm sinh và phải ghi rõ đó là suy luận; nếu không, nói rõ thiếu dữ liệu thay vì bịa vị trí sao.`}
   Hãy luận giải sướng khổ tương ứng tại các cung vị đó. Đặc biệt xới sâu Hóa Lộc (kho tài nguyên vũ trụ ban tặng) và Hóa Kỵ (ải nợ nần, ám ảnh sợ hãi, vết sẹo dằn vặt thẳm sâu).
   Đồng thời phân tích tối thiểu 02 đường phóng Tự Phi Tứ Hóa của các cung then chốt (Cung Mệnh, Cung Tài, Cung Quan) dựa vào dòng "Phi Tứ Hóa" đã tính sẵn trong từng cung, xem chúng tự phi Lộc hay phi Kỵ đi đâu để thấy hành trình luân chuyển dòng khí đời người.

3. **ẢNH HƯỞNG CỦA CÁC ĐỒNG CUNG & SÁT TINH TƯƠNG TÁC CHIẾN LƯỢC**:
   Phát giác và cô lột sự tàn phá của các Sát Tinh hiểm yếu (Địa Không, Địa Kiếp, Kình Dương, Đà La, Hỏa Tinh, Linh Tinh) đóng trên mệnh bàn đương số. Xét mối liên kết Nhị Hợp hoặc Lục Hại của cung bị ám để xem các cơn sóng dữ ngầm rạn nứt phát triển thế nào. Chỉ ra bí quyết tự nén mình cải tâm sửa nết để hóa hung thành cát một cách khoa học thực hành.

4. **VẬN TRÌNH ĐẠI VẬN 10 NĂM & LUẬN TIỂU HẠN NĂM NĂM ĐƯƠNG KIM ${chartData.transitYear || 2026}**:
   Luận đoán Đại vận đương đi dựa vào sự thịnh suy can chi của cung vị Đại hạn đó. 
   Sau đó đi phân tích sâu sắc năm xem vận hạn ${chartData.transitYear || 2026}. Bạn PHẢI tìm kiếm chính xác các Sao Lưu niên (đã được đánh dấu có tiền tố \`[SAO LƯU]\` trong mảng dữ liệu star chi tiết của cung vị như: Lưu Thái Tuế, Lưu Lộc Tồn, Lưu Tang Môn, Lưu Bạch Hổ, Lưu Thiên Mã, Lưu Kình, Lưu Đà, Lưu Khốc, Lưu Hư, cùng nhóm Lưu Tứ Hóa gồm Lưu Hóa Lộc, Lưu Hóa Quyền, Lưu Hóa Khoa, Lưu Hóa Kỵ - mỗi sao đã ghi kèm tên chính tinh thụ hóa trong ngoặc) để chỉ rõ: Năm nay súng đạn biến thiên sẽ nổ ra ở cung vị nào? Thị phi, dời nhà cửa thăng trầm hay lộc tiền mặt, hỷ tín tang gia hiển lộ cụ thể ra sao cực kỳ đời thực.

5. **CUNG PHU THÊ & THẾ THIÊN SÁT GIA ĐẠO: ĐỐI THOẠI KHẮC-HỢP**:
   Sử dụng Cung Phu Thê làm trục chính kết hợp Tam Phương Tứ Chính (cung đối Quan Lộc, và các cung tam hợp vây quanh) để vạch trần mong đợi bẩm sinh của đương số về bạn đời hay xu thế áp đặt, khuyết tật ứng xử làm rạn vỡ gia đạo. Chỉ vẽ con đường đôi bên cùng thấu hiểu, nương tựa dịu hiền.

6. **SỨC KHỎE TẬT ÁCH & THIÊN DI PHỊ HẠN CHỦ ĐỘNG PHÒNG NGỪA**:
   Phân tích Cung Tật Ách song chiếu cùng Thiên Di và quan hệ Nhị Hợp, Lục hại rình rập để khuyên bảo đương số phòng ngừa hao tổn sinh căn lực lượng, dịch chuyển xuất ngoại chủ động phòng trừ nguy biến pháp lý tai ương.

Văn phong trình bày bằng Markdown gọn gàng, súc mộc nhưng đanh thép học thuật tột bậc. Mở đầu bằng một câu nói trực diện đầy uy lực xoáy sâu thẳng thắn nhân tính, từ ngữ thấu tỏ hiện đại và tâm can thực thụ của một danh sư hữu tâm!`;

      let response;
      let fallbackUsed = false;
      let finalModelName = modelName;

      try {
        console.log(`[Attempt] Initiating Gemini analysis with ${finalModelName}...`);
        response = await ai.models.generateContent({
          model: finalModelName,
          contents: prompt,
        });
      } catch (firstError: any) {
        const rawMsg = firstError.message || (typeof firstError === "string" ? firstError : JSON.stringify(firstError)) || "";
        const isUnavailableOrBusy = 
          rawMsg.includes("503") || 
          rawMsg.toLowerCase().includes("unavailable") || 
          rawMsg.toLowerCase().includes("high demand") || 
          rawMsg.toLowerCase().includes("busy") ||
          rawMsg.toLowerCase().includes("spikes in demand");

        if (isUnavailableOrBusy && finalModelName !== "gemini-3.1-flash-lite") {
          console.warn(`[Fallback Activator] Gemini 3.5 Flash reported 503/Busy. Dynamically routing to gemini-3.1-flash-lite fallback...`);
          finalModelName = "gemini-3.1-flash-lite";
          fallbackUsed = true;
          response = await ai.models.generateContent({
            model: finalModelName,
            contents: prompt,
          });
        } else {
          throw firstError;
        }
      }

      const responseText = (response.text || "").trim();

      // Hậu kiểm MỀM: chỉ chặn khi phản hồi rỗng hoặc cụt bất thường (model trả lời lỗi),
      // KHÔNG phân tích nội dung nên không bao giờ chặn nhầm một luận giải hợp lệ.
      const MIN_VALID_LENGTH = 200;
      if (responseText.length < MIN_VALID_LENGTH) {
        return res.status(502).json({
          error: "Mô hình AI trả về phản hồi quá ngắn hoặc rỗng (có thể do nghẽn mạng tạm thời). " +
            "Vui lòng bấm 'Khởi động AI Luận Giải Tử Vi' để thử lại, hoặc chuyển sang mô hình Gemini 3.1 Flash Lite.",
          rateLimited: true,
          retryAfter: 10,
        });
      }

      res.json({ interpretation: responseText, modelUsed: finalModelName, fallbackUsed });
    } catch (error: any) {
      console.error("Lỗi luận giải Tử Vi:", error);
      const rawMsg = error.message || (typeof error === "string" ? error : JSON.stringify(error)) || "Lỗi xử lý luận giải trên máy chủ.";
      let errMsg = rawMsg;
      let isRateLimit = false;
      let retryAfter = 30;

      // Detect Google API 503 / Service Unavailable / High demand / Busy spikes
      const isUnavailableOrBusy = 
        rawMsg.includes("503") || 
        rawMsg.toLowerCase().includes("unavailable") || 
        rawMsg.toLowerCase().includes("high demand") || 
        rawMsg.toLowerCase().includes("busy") ||
        rawMsg.toLowerCase().includes("spikes in demand");

      if (isUnavailableOrBusy) {
        isRateLimit = true;
        retryAfter = 15; // Recommend user to wait 15 seconds
        errMsg = `Hệ thống Google Gemini API (Phía Máy Chủ Google) hiện đang bị quá tải tạm thời (Trạng thái 503 — High Demand).\n\n` +
          `🔴 **LƯU Ý QUAN TRỌNG:** Đây hoàn toàn KHÔNG PHẢI lỗi do website hay ứng dụng này bị đơ/hỏng, mà do hàng triệu người trên thế giới đang cùng truy cập vào máy chủ miễn phí của Google dẫn tới nghẽn mạng cục bộ.\n\n` +
          `👉 **3 BƯỚC KHẮC PHỤC NGAY LẬP TỨC:**\n` +
          `1. **Lách nghẽn nhanh nhất:** Hãy nhấp chọn mô hình **Gemini 3.1 Lite 🚀** ở khung lựa chọn bên dưới rồi bấm gửi lại (Mô hình này có hàng chờ riêng của Google, tải trọng nhẹ hơn nên phản hồi cực kỳ nhanh!).\n` +
          `2. **Thử lại tạm thời:** Đợi khoảng 15 giây (bộ đếm giây hiển thị ngay trên màn hình) rồi bấm 'Khởi động AI Luận Giải Tử Vi' một lần nữa để thử lại.\n` +
          `3. **Giải phóng băng thông riêng:** Hãy đăng ký một **Google Gemini API Key** riêng hoàn toàn MIỄN PHÍ chỉ mất 30 giây tại nền tảng Google AI Studio, sau đó dán vào khung dán API Key cá nhân ở thanh màu tối trên cùng rồi bấm nút "LƯU". Bản mệnh của bạn sẽ được kết nối bằng đường truyền riêng độc bản chính chủ, không bao giờ lo bị nghẽn mạng chung nữa!`;
      } else if (
        rawMsg.includes("RESOURCE_EXHAUSTED") || 
        rawMsg.includes("quota") || 
        rawMsg.includes("429") || 
        rawMsg.toLowerCase().includes("limit")
      ) {
        isRateLimit = true;
        const secondsMatch = rawMsg.match(/retry in\s+([0-9.]+)\s*s/i);
        const delayMatch = rawMsg.match(/retryDelay:\s*"(\d+)/i);
        if (secondsMatch) {
          retryAfter = Math.ceil(parseFloat(secondsMatch[1]));
        } else if (delayMatch) {
          retryAfter = parseInt(delayMatch[1], 10);
        }

        errMsg = `Hệ thống nhận thấy số lượng yêu cầu của quý vị hoặc máy chủ đang vượt quá hạn mức lượt dùng (Quota / Rate Limit) tạm thời.\n\n` +
          `👉 **GIẢI PHÁP LẬP TỨC:**\n` +
          `1. Hãy đợi khoảng ${retryAfter} giây rồi bấm nút 'Khởi động AI Luận Giải Tử Vi' để gửi lại một lần nữa (bộ đếm giây tự động hiển thị trên màn hình).\n` +
          `2. **Lách nghẽn mượt mà:** Chuyển sang mô hình khác như **Gemini 3.1 Flash Lite** bên dưới (thường có hạn mức miễn phí riêng biệt ít bị nghẽn hơn).\n` +
          `3. **Tối ưu nhất:** Hãy điền khóa API Gemini chính chủ của riêng bạn vào hộp **Nhập API Key cá nhân (BYOK)** ở thanh màu sẫm trên cùng. Cách tạo khóa hoàn toàn miễn phí, nhanh chóng tại Google AI Studio. Khi điền khóa cá nhân, quý vị sẽ có luồng gọi trực tiếp độc lập tuyệt đối và tránh được cảnh báo nghẽn mạng chung.`;
      }
      
      res.status(500).json({ 
        error: errMsg, 
        rateLimited: isRateLimit, 
        retryAfter: retryAfter,
        rawMessage: rawMsg 
      });
    }
  });

  // Serve static assets in production, and run Vite devserver in dev mode
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on port ${PORT}`);
  });
}

startServer();
