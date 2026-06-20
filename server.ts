import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { TU_HOA_BY_STEM, HOA_LABELS, STEM_NAME_BY_YEAR_MOD } from "./src/utils/tuHoa";
import { getDamTinhForStars, getDamTinhForAuxStars, getDamTinhTuHoa, getDamTinhTuHoaDetail } from "./src/knowledge/damTinh";
import {
  buildChartIndex,
  buildRelationsBlock,
  buildNatalTuHoaLines,
  buildFlyingTuHoaLines,
  satKyStarsInPalace,
  buildCrossLinks,
  BRANCHES_VI,
  toBranchIndex,
  NHI_HOP,
  LUC_HAI,
  normalizeStarName,
  allStarsOf,
  findStarBranch as findStarBranchOf,
  palaceLabel as palaceLabelOf,
} from "./src/utils/chartRelations";

dotenv.config();

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

      // Guard: lá số Tử Vi bắt buộc đủ 12 cung. Thiếu cung thì mọi quan hệ hình học
      // (tam phương, xung chiếu, phi tứ hóa) đều không đáng tin — chặn sớm thay vì
      // để AI luận trên dữ liệu khuyết mà không cảnh báo.
      if (!Array.isArray(chartData.palaces) || chartData.palaces.length < 12) {
        return res.status(400).json({
          error: "Dữ liệu lá số không hợp lệ: thiếu thông tin 12 cung. Vui lòng an lại lá số đầy đủ trước khi yêu cầu AI luận giải."
        });
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

      // ===== TRI THỨC TĨNH (KHÔNG ĐỔI THEO LÁ SỐ) -> systemInstruction =====
      // Vai trò + PHƯƠNG PHÁP CORE LOGIC + NGUYÊN TẮC LUẬN GIẢI là khối cố định,
      // tách khỏi prompt động để không lặp token mỗi request và tận dụng cache phía model.
      const SYSTEM_INSTRUCTION = `Bạn là một Minh Sư Tử Vi Tứ Hóa & Tam Hợp Môn danh tiếng lừng lẫy thuộc trường phái thực chiến của Khâm Thiên Môn (Đài Loan), kết hợp nhuần nhuyễn với chiều sâu triết lý Nhân Quả cổ học Việt Nam. Bạn đóng vai trò là một người THẦY CÓ TÂM, chân thành nhưng vô cùng uy nghiêm, tuân thủ nguyên tắc tối thượng: "NÓI THẬT & TRỰC DIỆN ⚡" - Có Cát luận Cát, có Hung luận Hung, thẳng thắn thấu đáo bất vị nể, không vuốt ve xoa dịu vô nghĩa, không hù dọa trục lợi mà chỉ rõ gốc rễ sinh mệnh để đương số tự xoay chuyển dòng năng lượng nghiệp quả.

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
   - Có cát luận cát để đương số nắm bắt thiên thời địa lợi, phát huy tối đa sở trường của mình.
   - Có hung luận hung sòng phẳng, nhưng tuyệt đối tuân theo quy tắc phân cấp mức độ: chỉ tập trung phân tích sâu sắc các nguy cơ thực sự nghiêm trọng, ảnh hưởng trực tiếp đến đại cuộc (như bảo mật giấy tờ cốt lõi khi gặp Cự Kỵ hãm; quản lý và kỷ luật hóa tài chính dòng tiền khi gặp Không Kiếp; hạ cái tôi bốc đồng, hạn chế sân si hay bốc đồng khi gặp Hỏa Linh Đà). 
   - Với các hung tinh/sao xấu ít nghiêm trọng, bình thường khác đóng ở cung vị không trực xung, hãy chỉ rõ rằng chúng "không đáng lo ngại" hoặc "tỉ lệ xảy ra biến cố tiêu cực là rất thấp", tránh cường điệu hóa hoặc thổi phồng gây hoang mang lo lắng vô căn cứ cho đương số. Định hướng hành động thực tiễn bằng sự tu tâm dưỡng tính, tuyệt đối tránh các nghi thức cúng bái mê tín dị đoan.

5. **LỜI KHUYÊN PHẢI MAY ĐO THEO ĐẶC ĐIỂM THỰC CỦA LÁ SỐ (NGHIÊM CẤM KHUYÊN RẬkP KHUÔN)**:
   - Trước khi đưa BẤT KỲ lời khuyên / biện pháp hóa giải / định hướng nào, BẮT BUỘC căn cứ vào TỔ HỢP SAO, CÁCH CỤC, TỨ HÓA và THẾ CUNG THỰC CÓ trên lá số được gửi xuống. Tuyệt đối KHÔNG áp một công thức khuyên chung cho mọi người; hai lá số khác nhau phải nhận lời khuyên khác nhau. Lời khuyên phải đi ĐÚNG theo sở trường/sở đoản bẩm sinh, KHÔNG bắt đương số chống lại bản chất cốt lõi của họ.
   - Các hướng may đo (VÍ DỤ MINH HỌA — bám sát sao thực có, tự suy rộng cho các tổ hợp khác):
     - *Lá số thiên đầu cơ/mạo hiểm* (vd Tham Lang, Phá Quân, Vũ Tham, Sát Phá Tham, Hỏa/Linh ở Mệnh-Tài): KHÔNG khuyên “an phận giữ tiền, gửi tiết kiệm cho lành” (trái bản chất, họ sẽ không nghe). Hãy khuyên theo hướng KỶ LUẬT HÓA bản lĩnh: đặt quy tắc cắt lỗ/chốt lời rõ ràng, phân bổ vốn (chỉ dùng phần vốn dám mất cho cơ hội rủi ro cao), tránh dùng đòn bẩy vượt sức, chống hóa Kỵ/Không Kiếp bằng quy trình thay vì bằng cảm hứng.
     - *Lá số có duyên xuất ngoại/di động* (vd Thiên Mã, Mã ngộ Lộc, Thiên Di vượng, Mệnh-Di sáng): khuyên hướng PHÁT TRIỂN XA NHÀ — làm đối ngoại, xuất khẩu, công ty đa quốc gia, nghề phải di chuyển; tránh khuyên bám trụ một chỗ an phận (sẽ bức bối, phí vận). Nếu Mã ngộ sát (Mã kiếp/chiến Mã) thì nhắc giữ an toàn khi đi lại, cẩn trọng giao thông/hợp tác phương xa.
     - *Lá số chuyên môn/ổn định* (vd Cơ Nguyệt Đồng Lương, Phủ Tướng): khuyên đi sâu CHUYÊN MÔN, làm công ăn lương bậc cao/tham mưu/quản trị; TRÁNH xúi bỏ việc lao ra khởi nghiệp mạo hiểm hay đầu cơ (không hợp tạng, dễ vỡ nợ).
     - *Lá số kiếm giỏi nhưng giữ kém* (trục Sinh Tài mạnh mà trục Thủ Tài Phúc-Tài-Điền yếu/gặp sát): KHÔNG chỉ khuyên “kiếm nhiều hơn”, mà khuyên cơ chế GIỮ TIỀN tự động (trích lập tài sản dài hạn, bất động sản/vàng/quỹ định kỳ), tách tài khoản chi tiêu và tích sản.
     - *Lá số đào hoa nặng* (vd Tham Lang đào hoa, Hồng Loan/Thiên Hỉ, Mộc Dục, Tham ngộ Xương Khúc ở Phu Thê/Mệnh): khuyên quản trị ranh giới tình cảm, cẩn trọng quan hệ ngoài luồng làm đổ vỡ gia đạo; nếu làm nghề giao tiếp/nghệ thuật thì hướng đào hoa thành duyên khách hàng/thương hiệu cá nhân.
     - *Lá số sát/kỵ ở Tật Ách* (vd Kình Đà Hỏa Linh, Hóa Kỵ tụ Tật Ách): khuyên phòng bệnh đúng bộ phận theo tính chất sao (vd Kình Dương — dao kéo/phẫu thuật/tai nạn; Hỏa Linh — viêm nhiệt/huyết áp), khám định kỳ, tránh tham việc bào mòn sức.
     - *Lá số thiên khẩu thiệt/thị phi* (vd Cự Môn, Cự Kỵ, Thái Tuế-Quan Phù): khuyên lưu chứng từ bằng văn bản, giữ lời, tránh cam kết miệng; nếu làm nghề dùng miệng (luật sư, giảng dạy, bán hàng, content) thì hướng Cự Môn thành thế mạnh nghề nghiệp.
     - *Lá số cô khắc* (vd Cô Thần/Quả Tú, Thiên Đồng-Thái Âm hãm, Mệnh không chính diệu cô đơn): khuyên chủ động mở lòng kết nối, nuôi quan hệ bền thay vì tự cô lập; hướng nghề nghiên cứu/chuyên sâu hợp tạng trầm mặc.
   - QUY TẮC AN TOÀN: chỉ áp hướng khuyên khi sao/cách cục tương ứng THỰC SỰ xuất hiện trên lá số; nếu không có đặc điểm nổi bật nào thì khuyên theo tổ hợp chính tinh thực tế, TUYỆT ĐỐI không gán đặc điểm không căn cứ để khuyên cho “kêu”.`;

      // ===== TIỀN XỬ LÝ QUAN HỆ HÌNH HỌC LÁ SỐ (code tính sẵn, AI chỉ luận nghĩa) =====
      // Lưu ý: iztro đánh p.index gốc DẦN = 0. Quy về index địa chi chuẩn (Tý = 0) để
      // mọi phép tính quan hệ nhất quán với EARTHLY_BRANCHES và core tuvi.ts.
      // ===== NGUỒN SỰ THẬT DÙNG CHUNG =====
      // toBranchIndex, NHI_HOP, LUC_HAI, normalizeStarName, allStarsOf, BRANCHES_VI,
      // buildRelationsBlock... đều import từ chartRelations.ts (xem đầu file) để
      // /api/interpret và /api/chat dùng CHUNG một bộ công thức — sửa một chỗ, đồng
      // bộ cả hai. Bảng TU_HOA_BY_STEM/HOA_LABELS lấy từ ./tuHoa (nguồn chung).

      const palacesArr = chartData.palaces || [];
      // Dựng chỉ mục cung theo index địa chi chuẩn MỘT lần, truyền lại cho các hàm
      // dùng chung (findStarBranch/buildRelationsBlock) thay vì quét lại mảng cung.
      const idx = buildChartIndex(palacesArr);
      const palaceByBranch = idx.palaceByBranch;

      // palaceLabel local mỏng wrap quanh idx: giữ chữ ký 1 tham số để mọi call site
      // cũ trong endpoint (Phúc Đức, các cheat sheet) không phải đổi.
      const palaceLabel = (branchIdx: number) => palaceLabelOf(idx, branchIdx);

      // findStarBranch local mỏng (chữ ký 1 tham số) wrap quanh idx, giữ nguyên
      // mọi call site cũ findStarBranch(star) trong endpoint khỏi phải sửa.
      const findStarBranch = (starName: string): number => findStarBranchOf(idx, starName);

      const buildRelations = (p: any): string => buildRelationsBlock(idx, p);

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
          const all = allStarsOf(p);
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
          const all = allStarsOf(p);
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

      // ===== TỰ HÓA 自化 (code phát hiện sẵn — tinh thần Trung Châu Phái) =====
      // Tự Hóa xảy ra khi Thiên can của CHÍNH cung phi một trong tứ hóa, mà sao thụ hóa
      // lại đóng NGAY TRONG cung đó (sao bay về chính mình). Đây là kết cấu khách quan,
      // không phải quan điểm riêng của trường phái nào, nên tính bằng code là chính xác.
      // Ý nghĩa cổ điển: tự hóa = năng lượng tự tiêu hao/tự phát lộ ngay tại cung, không
      // chờ phi sang cung khác. Code chỉ phát hiện & gắn nhãn; AI luận nghĩa.
      const buildTuHoaReport = (): string => {
        const lines: string[] = [];
        palacesArr.forEach((p: any) => {
          const b = toBranchIndex(p.index);
          const stem = p.heavenlyStem;
          const tuhoa = stem ? TU_HOA_BY_STEM[String(stem).trim()] : undefined;
          if (!tuhoa) return;
          // Tập tên sao đang đóng trong CHÍNH cung này (đủ 3 nhóm)
          const inThisPalace = new Set(
            allStarsOf(p).map((s: any) => normalizeStarName(s.name))
          );
          const selfHits = tuhoa
            .map((star, i) => ({ star, label: HOA_LABELS[i] }))
            .filter(({ star }) => inThisPalace.has(normalizeStarName(star)));
          if (selfHits.length > 0) {
            const detail = selfHits.map(({ label, star }) => `${label}→${star}`).join("; ");
            lines.push(`  - ${p.name} (${BRANCHES_VI[b]}, can ${stem}): TỰ HÓA ${detail}`);
          }
        });
        return lines.length > 0
          ? lines.join("\n")
          : "  - Lá số không có cung nào phát Tự Hóa (自化) theo can bản cung.";
      };
      const tuHoaReportStr = buildTuHoaReport();

      // ===== CÁCH CỤC CHÍNH TINH (code nhận diện sẵn — kết cấu khách quan) =====
      // Chỉ nhận diện các cách cục dựa trên TỔ HỢP CHÍNH TINH chuẩn (khách quan, mọi phái
      // đồng thuận). KHÔNG suy luận cát/hung ở đây — chỉ gắn nhãn để AI luận nghĩa, tránh
      // để AI tự nhận diện sai cách cục.
      const buildCachCucReport = (): string => {
        const menh = palacesArr.find((p: any) => String(p.name || "").includes("Mệnh"));
        if (!menh) return "  - Không xác định được cung Mệnh nên chưa nhận diện cách cục.";
        const bMenh = toBranchIndex(menh.index);
        // Gom chính tinh ở Mệnh + tam phương (tam hợp) + xung chiếu — phạm vi quyết định cách cục
        const th1 = (bMenh + 4) % 12;
        const th2 = (bMenh + 8) % 12;
        const xung = (bMenh + 6) % 12;
        const collectMajors = (branchIdx: number): string[] =>
          (palaceByBranch[branchIdx]?.majorStars || []).map((s: any) => normalizeStarName(s.name));
        const triangleStars = new Set<string>([
          ...collectMajors(bMenh),
          ...collectMajors(th1),
          ...collectMajors(th2),
          ...collectMajors(xung),
        ]);
        const has = (name: string) => triangleStars.has(normalizeStarName(name));
        const found: string[] = [];
        // Sát Phá Tham
        if (has("Thất Sát") && has("Phá Quân") && has("Tham Lang")) {
          found.push("Sát Phá Tham (biến động, khai phá, thăng trầm mạnh)");
        }
        // Cơ Nguyệt Đồng Lương
        if (has("Thiên Cơ") && has("Thái Âm") && has("Thiên Đồng") && has("Thiên Lương")) {
          found.push("Cơ Nguyệt Đồng Lương (tham mưu, ổn định, chuyên môn/hành chính)");
        }
        // Tử Phủ đồng/hội
        if (has("Tử Vi") && has("Thiên Phủ")) {
          found.push("Tử Phủ (uy quyền, thủ thành, quản trị)");
        }
        // Phủ Tướng triều viên
        if (has("Thiên Phủ") && has("Thiên Tướng")) {
          found.push("Phủ Tướng triều viên (ổn định, hỗ tá, phúc khí thủ thành)");
        }
        // Cự Nhật
        if (has("Cự Môn") && has("Thái Dương")) {
          found.push("Cự Nhật (ngôn luận, danh tiếng, thị phi)");
        }
        // Tử Tham
        if (has("Tử Vi") && has("Tham Lang")) {
          found.push("Tử Tham (đào hoa quyền lực, dục vọng và biến hóa)");
        }
        // Liêm Trinh + Thiên Tướng
        if (has("Liêm Trinh") && has("Thiên Tướng")) {
          found.push("Liêm Tướng (kỷ luật, pháp độ, chính trực)");
        }
        // Vũ Khúc + Tham Lang
        if (has("Vũ Khúc") && has("Tham Lang")) {
          found.push("Vũ Tham (tài lộc phát muộn, thực dụng quyết liệt)");
        }
        if (found.length === 0) {
          // Vô chính diệu tại Mệnh
          if (collectMajors(bMenh).length === 0) {
            return "  - Mệnh Vô Chính Diệu: cần mượn sao xung chiếu (đối cung) và tam phương để định cách. Luận theo các chính tinh hội chiếu, không gán tên cách cục cố định.";
          }
          return "  - Chưa khớp một cách cục chính tinh điển hình nào; hãy luận theo tổ hợp chính tinh thực tế tại Mệnh và tam phương, KHÔNG gán tên cách cục.";
        }
        return found.map((c) => `  - ${c}`).join("\n");
      };
      const cachCucReportStr = buildCachCucReport();

      // ===== ĐÀM TINH (Trung Châu Phái - Vương Đình Chi) =====
      // Gom TÊN chính tinh thực có trên lá số, rồi CHỈ lấy phần Đàm Tinh của những
      // sao đó (getDamTinhForStars đã lọc sẵn). KHÔNG nhồi toàn bộ file tri thức.
      const allMajorStarNames: string[] = [];
      palacesArr.forEach((p: any) => {
        (p.majorStars || []).forEach((s: any) => {
          allMajorStarNames.push(String(s.name || "").trim());
        });
      });
      const damTinhStr = getDamTinhForStars(allMajorStarNames);

      // ===== ĐÀM TINH: PHỤ/TẠP TINH (trần ngân sách mềm chống phình prompt) =====
      // Gom TÊN phụ/tá/sát/tạp diệu thực có (minor + adjective) toàn lá số, rồi CHỈ lấy
      // phần Đàm Tinh của chúng. getDamTinhForAuxStars tự giới hạn số entry (mặc định 18,
      // rộng rãi) và ghi chú nhẹ khi vượt, KHÔNG nhồi toàn bộ file tri thức.
      const allAuxStarNames: string[] = [];
      palacesArr.forEach((p: any) => {
        [...(p.minorStars || []), ...(p.adjectiveStars || [])].forEach((s: any) => {
          allAuxStarNames.push(String(s.name || "").trim());
        });
      });
      const damTinhAuxStr = getDamTinhForAuxStars(allAuxStarNames);

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
      // Dùng bảng can chung STEM_NAME_BY_YEAR_MOD từ ./src/utils/tuHoa (một nguồn sự
      // thật duy nhất), tránh khai báo trùng bảng có thể lệch với core tuvi.ts.
      // 0:Canh 1:Tân 2:Nhâm 3:Quý 4:Giáp 5:Ất 6:Bính 7:Đinh 8:Mậu 9:Kỷ
      const transitYearNum = Number(chartData.transitYear) || 2026;
      const luuNienStem = STEM_NAME_BY_YEAR_MOD[((transitYearNum % 10) + 10) % 10];
      const luuNienFlyingStr = buildFlyingTuHoaFor(luuNienStem, `Lưu niên (năm ${transitYearNum}, can ${luuNienStem})`);

      // ===== ĐÀM TINH: TỨ HÓA CHI TIẾT THEO CẶP (chính tinh thụ hóa × loại Hóa) =====
      // ĐẶT SAU khi decadalStem/luuNienStem đã khai báo (tránh lỗi temporal dead zone).
      // CHỈ ĐỌC LẠI dữ liệu tứ hóa ĐÃ TÍNH SẴN (natal + can Đại vận + can Lưu niên),
      // KHÔNG tính mới, KHÔNG đổi công thức. TU_HOA_BY_STEM[can] = [Lộc, Quyền, Khoa, Kỵ]
      // theo đúng thứ tự HOA_LABELS, nên ghép star[i] với HOA_LABELS[i] để ra đúng cặp.
      const collectTuHoaPairs = (table?: string[]) =>
        (table || []).map((star, i) => ({ star, hoa: HOA_LABELS[i] }));
      const decadalTuHoaTable = decadalStem ? TU_HOA_BY_STEM[String(decadalStem).trim()] : undefined;
      const luuNienTuHoaTable = luuNienStem ? TU_HOA_BY_STEM[String(luuNienStem).trim()] : undefined;
      // Gồm Tứ Hóa NATAL + phi hóa Đại vận + phi hóa Lưu niên. Đường bay động vốn là
      // dòng khí chi phối vận hạn thời gian thực, nên phải có tinh tình chi tiết tương
      // ứng (không chỉ vị trí ở block "Phi Tứ Hóa động"), tránh để AI luận vận hạn nông
      // hơn hẳn bản mệnh. getDamTinhTuHoaDetail tự khử trùng cặp (star|hoa) qua Set nên
      // các cặp trùng giữa natal/đại vận/lưu niên chỉ in một lần — KHÔNG làm phình prompt.
      const damTinhTuHoaPairs = [
        ...collectTuHoaPairs(natalTuHoaTable),
        ...collectTuHoaPairs(decadalTuHoaTable),
        ...collectTuHoaPairs(luuNienTuHoaTable),
      ];
      const damTinhTuHoaDetailStr = getDamTinhTuHoaDetail(damTinhTuHoaPairs);

      // Tinh tình Tứ Hóa TỔNG QUÁT (bản chất chung của Lộc/Quyền/Khoa/Kỵ), làm nền
      // khái niệm trước khi vào tinh tình chi tiết theo cặp. Chỉ lấy đúng các loại Hóa
      // thực xuất hiện trên lá số (natal + đại vận + lưu niên); getDamTinhTuHoa tự khử trùng.
      const damTinhTuHoaGeneralStr = getDamTinhTuHoa(damTinhTuHoaPairs.map((p) => p.hoa));

      // ===== CUNG THÂN: NEO TRỌNG TÂM RIÊNG (làm nổi bật ngoài mảng 12 cung) =====
      // SYSTEM_INSTRUCTION yêu cầu cực kỳ lưu tâm Cung Thân, nhưng trong mảng 12 cung
      // nó dễ chìm. Tách 1 dòng tóm tắt riêng để AI bám trục Mệnh (tư duy, trước 30)
      // vs Thân (hành động, sau 30). Chỉ tóm tắt từ dữ liệu cung đã có, KHÔNG tính mới.
      const bodyPalace = palacesArr.find((p: any) => p?.isBodyPalace);
      const bodyPalaceStr = bodyPalace
        ? (() => {
            const major = (bodyPalace.majorStars || []).map((s: any) => s.name).join(", ") || "Vô Chính Diệu";
            const branch = BRANCHES_VI[toBranchIndex(bodyPalace.index)];
            return `Cung Thân an tại cung ${bodyPalace.name} (Địa chi ${branch}, Thiên can ${bodyPalace.heavenlyStem}). Chính tinh thủ Thân: ${major}. Khi luận, hãy đối chiếu trục Mệnh (xu hướng tư duy bẩm sinh, chủ đạo nửa đầu đời ~trước 30) với Thân (xu hướng hành động/hậu vận, chủ đạo nửa sau ~sau 30) để thấy sự dịch chuyển nội tâm → hành vi của đương số.`;
          })()
        : "Lá số không đánh dấu Cung Thân đồng cung riêng (Thân đồng cung Mệnh hoặc dữ liệu chưa gắn cờ); luận Thân theo cung Mệnh.";

      // ===== LAI NHÂN CUNG (code phát hiện sẵn — kết cấu khách quan) =====
      // Lai Nhân Cung là cung mang Thiên can TRÙNG với can năm sinh — nơi được coi là
      // "nguồn cơn" phát ra toàn bộ tứ hóa bẩm sinh, gốc nghiệp quả cốt lõi. Code chỉ
      // dò cung có heavenlyStem === can năm sinh; AI luận nghĩa. KHÔNG đổi công thức.
      const buildLaiNhanReport = (): string => {
        if (!stemKey) return "  - Chưa xác định được Thiên can năm sinh nên chưa xác định được Lai Nhân Cung.";
        const target = String(stemKey).trim();
        const hits = palacesArr.filter((p: any) => String(p.heavenlyStem || "").trim() === target);
        if (hits.length === 0) {
          return "  - Không cung nào trùng can năm sinh trên dữ liệu (hiếm); không định Lai Nhân Cung.";
        }
        return hits.map((p: any) => {
          const major = (p.majorStars || []).map((s: any) => s.name).join(", ") || "Vô Chính Diệu";
          return `  - Lai Nhân Cung: ${p.name} (${BRANCHES_VI[toBranchIndex(p.index)]}, can ${p.heavenlyStem}) — chính tinh: ${major}`;
        }).join("\n");
      };
      const laiNhanReportStr = buildLaiNhanReport();

      // ===== HAI TRỤC TÀI LỘC (code gom sẵn — kết cấu khách quan) =====
      // Trục SINH TÀI (Mệnh - Tài Bạch - Quan Lộc): cách kiếm tiền, năng lực tạo dòng tiền.
      // Trục THỦ TÀI (Phúc Đức - Tài Bạch - Điền Trạch): cách GIỮ/TÍCH sản, phúc khí.
      // Chỉ liệt kê sao thực có ở từng cung để AI phân biệt người kiếm giỏi vs giữ giỏi.
      const palaceByName = (kw: string) =>
        palacesArr.find((p: any) => String(p.name || "").includes(kw));
      const starsOf = (p: any): string => {
        if (!p) return "(không xác định được cung)";
        const major = (p.majorStars || []).map((s: any) => s.name).join(", ") || "Vô Chính Diệu";
        return `${p.name} (${BRANCHES_VI[toBranchIndex(p.index)]}): ${major}`;
      };
      const buildHaiTrucTaiLoc = (): string => {
        const menh = palaceByName("Mệnh");
        const tai = palaceByName("Tài Bạch") || palaceByName("Tài");
        const quan = palaceByName("Quan Lộc") || palaceByName("Quan") || palaceByName("Sự Nghiệp");
        const phuc = palaceByName("Phúc");
        const dien = palaceByName("Điền");
        return [
          `  * Trục SINH TÀI (cách kiếm tiền / tạo dòng tiền) — Mệnh × Tài Bạch × Quan Lộc:`,
          `     - ${starsOf(menh)}`,
          `     - ${starsOf(tai)}`,
          `     - ${starsOf(quan)}`,
          `  * Trục THỦ TÀI (cách giữ của / tích sản / phúc khí) — Phúc Đức × Tài Bạch × Điền Trạch:`,
          `     - ${starsOf(phuc)}`,
          `     - ${starsOf(tai)}`,
          `     - ${starsOf(dien)}`,
        ].join("\n");
      };
      const haiTrucTaiLocStr = buildHaiTrucTaiLoc();

      // ===== LƯU NGUYỆT: AN 12 CUNG THÁNG ÂM LỊCH (code tính sẵn — KHỐI MỚI) =====
      // Phép an Đẩu Quân (cung tháng Giêng lưu niên): từ cung Lưu Thái Tuế, đếm NGHỊCH
      // (tháng sinh âm - 1) cung, rồi đếm THUẬN (index giờ sinh) cung. Mỗi tháng sau tiến
      // THUẬN 1 cung. Can mỗi tháng suy theo Ngũ Hổ Độn (cặp can năm-tháng cổ truyền).
      // Đây là khối TÍNH MỚI hoàn toàn, KHÔNG động vào bất kỳ công thức core cũ nào.
      const luuThaiTueIdxRaw = chartData.transitLuuThaiTueIndex;
      const birthLunarMonth = Number(chartData.birthLunarMonth) || 0;
      const birthHourIdx = Number(chartData.birthHourIndex);
      // luuThaiTueIdxRaw PHẢI là index địa chi chuẩn (Tý=0 … Hợi=11) để khớp palaceByBranch.
      // Siết miền [0,11]: nếu client gửi index sai hệ (vd index gốc iztro Dần=0 chưa quy đổi)
      // hoặc ngoài miền, phép %12 vẫn chạy nhưng cung Đẩu Quân sẽ lệch -> chặn sớm, báo thiếu.
      const birthHourIdxValid = Number.isInteger(birthHourIdx) && birthHourIdx >= 0 && birthHourIdx <= 11;
      const hasLuuNguyetData =
        Number.isInteger(luuThaiTueIdxRaw) && luuThaiTueIdxRaw >= 0 && luuThaiTueIdxRaw <= 11 &&
        birthLunarMonth >= 1 && birthLunarMonth <= 12 &&
        birthHourIdxValid;

      // Ngũ Hổ Độn: can tháng Giêng theo can năm. Giáp/Kỷ->Bính, Ất/Canh->Mậu,
      // Bính/Tân->Canh, Đinh/Nhâm->Nhâm, Mậu/Quý->Giáp. Tháng sau tiến 1 can.
      const STEMS_VI = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
      const monthStemStartByYearStem: Record<number, number> = {
        0: 2, 5: 2,
        1: 4, 6: 4,
        2: 6, 7: 6,
        3: 8, 8: 8,
        4: 0, 9: 0,
      };

      const buildLuuNguyetReport = (): string => {
        if (!hasLuuNguyetData) {
          return "  - Thiếu dữ liệu (tháng sinh âm / giờ sinh / cung Lưu Thái Tuế) nên HỆ THỐNG KHÔNG an được 12 cung Lưu Nguyệt. Khi thiếu, KHÔNG tự đoán tháng — hãy nói rõ thiếu dữ liệu.";
        }
        const dauQuan = (((luuThaiTueIdxRaw - (birthLunarMonth - 1) + birthHourIdx) % 12) + 12) % 12;
        // Đưa year%10 (4=Giáp) về index can chuẩn (0=Giáp) để tra Ngũ Hổ Độn.
        const yearStemIdx = (((transitYearNum % 10) - 4) % 10 + 10) % 10;
        const monthStemStart = monthStemStartByYearStem[yearStemIdx] ?? 0;
        const lines: string[] = [];
        for (let m = 1; m <= 12; m++) {
          const branchIdx = (dauQuan + (m - 1)) % 12;
          const pa = palaceByBranch[branchIdx];
          const palaceName = pa ? pa.name : `cung ${BRANCHES_VI[branchIdx]}`;
          const monthStemIdx = (monthStemStart + (m - 1)) % 10;
          const monthStem = STEMS_VI[monthStemIdx];
          const tuhoa = TU_HOA_BY_STEM[monthStem];
          let flightStr = "";
          if (tuhoa) {
            flightStr = tuhoa.map((star, i) => {
              const dest = findStarBranch(star);
              const destLabel = dest >= 0
                ? `${palaceByBranch[dest]?.name || BRANCHES_VI[dest]}`
                : "không có";
              return `${HOA_LABELS[i]}→${star}[${destLabel}]`;
            }).join("; ");
          }
          lines.push(
            `  - Tháng ${m} âm: cung ${palaceName} (${BRANCHES_VI[branchIdx]}, can tháng ${monthStem})` +
            (flightStr ? ` | Lưu Nguyệt Tứ Hóa: ${flightStr}` : "")
          );
        }
        return lines.join("\n");
      };
      const luuNguyetReportStr = buildLuuNguyetReport();

      // ===== CUNG PHÚC ĐỨC: NEO TRỌNG TÂM RIÊNG (code tóm sẵn) =====
      // Trục phúc báo / chất lượng tinh thần / hưởng thụ, cực trọng theo Trung Châu Phái.
      // Chỉ tóm tắt từ dữ liệu cung đã có + tam phương; KHÔNG tính mới.
      const buildPhucDucReport = (): string => {
        const phuc = palaceByName("Phúc");
        if (!phuc) return "  - Không xác định được cung Phúc Đức trên dữ liệu.";
        const b = toBranchIndex(phuc.index);
        const major = (phuc.majorStars || []).map((s: any) => s.name).join(", ") || "Vô Chính Diệu";
        const minor = (phuc.minorStars || []).map((s: any) => String(s.name).replace(/\[SAO LƯU\]\s*/g, "").trim()).join(", ") || "Không";
        const adj = (phuc.adjectiveStars || []).map((s: any) => s.name).join(", ") || "Không";
        return [
          `  - Cụm sao Phúc Đức (${phuc.name}, ${BRANCHES_VI[b]}, can ${phuc.heavenlyStem}):`,
          `     Chính tinh: ${major} | Trợ/cát tinh: ${minor} | Sát/tạp tinh: ${adj}`,
          `     Xung chiếu: ${palaceLabel((b + 6) % 12)}`,
          `     Tam hợp: ${palaceLabel((b + 4) % 12)} | ${palaceLabel((b + 8) % 12)}`,
          `     Nhị hợp: ${palaceLabel(NHI_HOP[b])} | Lục hại: ${palaceLabel(LUC_HAI[b])}`,
        ].join("\n");
      };
      const phucDucReportStr = buildPhucDucReport();

      // ===== VÒNG TRƯỜNG SINH 12 (code gom sẵn từ changsheng12) =====
      // Thế đất của mỗi cung trọng yếu: sao dù tốt nhưng đóng cung suy/tử/tuyệt thì
      // giảm lực (hữu danh vô thực); đóng trường sinh/đế vượng thì phát huy trọn vẹn.
      // Chỉ đọc lại changsheng12 đã có, KHÔNG tính mới. AI luận nghĩa mạnh/yếu.
      const TRUONG_SINH_MANH = ["Trường Sinh", "Đế Vượng", "Lâm Quan", "Quan Đới"].map((s) => s.toLowerCase());
      const TRUONG_SINH_YEU = ["Tử", "Tuyệt", "Mộ", "Bệnh", "Suy", "Thai"].map((s) => s.toLowerCase());
      const classifyTheDat = (cs: string): string => {
        const v = String(cs || "").trim().toLowerCase();
        if (!v) return "chưa rõ";
        if (TRUONG_SINH_MANH.includes(v)) return "MẠNH (sao phát huy trọn lực)";
        if (TRUONG_SINH_YEU.includes(v)) return "YẾU (dễ hữu danh vô thực, lực suy giảm)";
        return "TRUNG BÌNH";
      };
      const buildTruongSinhReport = (): string => {
        const targets = ["Mệnh", "Tài Bạch", "Quan Lộc", "Phúc", "Thân", "Phu Thê", "Tật Ách"];
        const lines: string[] = [];
        const seen = new Set<string>();
        targets.forEach((kw) => {
          const p = palaceByName(kw);
          if (!p || seen.has(p.name)) return;
          seen.add(p.name);
          const cs = p.changsheng12 || "";
          lines.push(`  - ${p.name} (${BRANCHES_VI[toBranchIndex(p.index)]}): vòng Tràng Sinh = ${cs || "chưa rõ"} → ${classifyTheDat(cs)}`);
        });
        return lines.length > 0
          ? lines.join("\n")
          : "  - Dữ liệu vòng Tràng Sinh chưa đầy đủ trên lá số.";
      };
      const truongSinhReportStr = buildTruongSinhReport();

      // ===== ĐẾM CÁT/HUNG ĐỂ ĐỊNH CÁCH PHÚ QUÝ (code đếm khách quan) =====
      // Đếm số cát tinh phúc lộc vs hung sát ở tam phương trục cốt (Mệnh-Tài-Quan-Phúc),
      // làm cơ sở để AI chấm "tầng phúc lộc" tổng thể. CODE KHÔNG tự phán giàu/nghèo —
      // chỉ đếm & liệt kê sao thực có; AI mới luận kết.
      const CAT_PHUC_STARS = [
        "Lộc Tồn", "Hóa Lộc", "Hóa Quyền", "Hóa Khoa", "Tả Phụ", "Hữu Bật",
        "Văn Xương", "Văn Khúc", "Thiên Khôi", "Thiên Việt", "Thiên Mã", "Thiên Quan", "Thiên Phúc",
      ].map(normalizeStarName);
      const HUNG_SAT_STARS = [
        "Hóa Kỵ", "Địa Không", "Địa Kiếp", "Kình Dương", "Đà La", "Hỏa Tinh", "Linh Tinh",
        "Kiếp Sát", "Đại Hao", "Tiểu Hao", "Thiên Hình",
      ].map(normalizeStarName);
      const buildPhucLocReport = (): string => {
        const menh = palaceByName("Mệnh");
        if (!menh) return "  - Không xác định được cung Mệnh nên chưa đếm được cát/hung.";
        const bMenh = toBranchIndex(menh.index);
        // Tam phương Mệnh-Tài-Quan + xung chiếu + Phúc Đức
        const idxs = new Set<number>([bMenh, (bMenh + 4) % 12, (bMenh + 8) % 12, (bMenh + 6) % 12]);
        const phuc = palaceByName("Phúc");
        if (phuc) idxs.add(toBranchIndex(phuc.index));
        const catFound: string[] = [];
        const hungFound: string[] = [];
        idxs.forEach((bi) => {
          const pa = palaceByBranch[bi];
          if (!pa) return;
          allStarsOf(pa).forEach((s: any) => {
            const n = normalizeStarName(s.name);
            if (CAT_PHUC_STARS.includes(n)) catFound.push(s.name);
            else if (HUNG_SAT_STARS.includes(n)) hungFound.push(s.name);
          });
        });
        return [
          `  - Phạm vi đếm: tam phương Mệnh-Tài-Quan + xung chiếu + Phúc Đức.`,
          `  - Cát tinh phúc lộc (${catFound.length}): ${catFound.length ? catFound.join(", ") : "không đáng kể"}`,
          `  - Hung sát tinh (${hungFound.length}): ${hungFound.length ? hungFound.join(", ") : "không đáng kể"}`,
        ].join("\n");
      };
      const phucLocReportStr = buildPhucLocReport();

      const prompt = `--- DỮ LIỆU THÔNG TIN LÁ SỐ ĐƯƠNG SỐ ---
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

--- CUNG THÂN (TRỌNG TÂM — ĐỐI CHIẾU VỚI CUNG MỆNH) ---
${bodyPalaceStr}

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

--- CHEAT SHEET: TỰ HÓA 自化 (HỆ THỐNG PHÁT HIỆN SẴN — TINH THẦN TRUNG CHÂU PHÁI) ---
Tự Hóa là khi can của CHÍNH cung phi hóa mà sao thụ hóa đóng ngay TRONG cung đó (sao tự hóa về mình), khác với phi hóa sang cung khác. Cổ nhân Trung Châu Phái coi Tự Hóa là điểm năng lượng tự phát lộ / tự tiêu hao ngay tại cung: Tự Hóa Lộc Quyền Khoa dễ phát nhưng dễ tản, Tự Hóa Kỵ là tự chuốc hao tổn/chấp niệm từ bên trong. Khi luận cung có Tự Hóa, hãy nhấn mạnh sắc thái "tự thân sinh ra" này. Dữ liệu đã tính sẵn:
${tuHoaReportStr}

--- CHEAT SHEET: CÁCH CỤC CHÍNH TINH (HỆ THỐNG NHẬN DIỆN SẴN — KẾT CẤU KHÁCH QUAN) ---
Đây là cách cục dựa trên tổ hợp chính tinh tại Mệnh và tam phương tứ chính, do hệ thống nhận diện theo kết cấu khách quan (mọi trường phái đồng thuận). DÙNG TRỰC TIẾP, KHÔNG tự nhận diện lại. QUY TẮC BẮT BUỘC: chỉ được gọi tên một cách cục khi đủ các chính tinh cấu thành nó đã xuất hiện trong dữ liệu; nếu hệ thống ghi "chưa khớp" hoặc "Vô Chính Diệu", TUYỆT ĐỐI không tự gán tên cách cục, mà mô tả theo tổ hợp sao thực tế:
${cachCucReportStr}

--- CHEAT SHEET: LAI NHÂN CUNG (HỆ THỐNG PHÁT HIỆN SẴN — GỐC NGHIỆP) ---
Lai Nhân Cung là cung mang Thiên can trùng với can năm sinh — cổ nhân coi đây là nguồn cơn phát ra toàn bộ tứ hóa bẩm sinh, phản ánh gốc rễ nghiệp quả và động cơ sâu xa nhất của đương số. Khi luận bản sắc (Phần 1), hãy soi cung này để chỉ ra căn nguyên mọi lựa chọn và ám ảnh của đương số bắt rễ từ đâu. Dữ liệu tính sẵn:
${laiNhanReportStr}

--- CHEAT SHEET: HAI TRỤC TÀI LỘC (HỆ THỐNG GOM SẴN) ---
Tách bạch hai năng lực khác nhau: trục SINH TÀI (Mệnh-Tài-Quan) là cách KIẾM tiền/tạo dòng tiền; trục THỦ TÀI (Phúc-Tài-Điền) là cách GIỮ của/tích sản. Khi luận tiền tài, BẮT BUỘC phân biệt rõ: đương số kiếm giỏi mà không giữ được, hay giữ chắc mà khó bứt phá, căn cứ vào sao thực ở từng trục:
${haiTrucTaiLocStr}

--- CHEAT SHEET: CỤM SAO PHÚC ĐỨC (HỆ THỐNG TÓM SẴN) ---
Phúc Đức là trục phúc báo, chất lượng tinh thần, mức độ an/bất an nội tại và khả năng hưởng thụ của đương số — cực trọng theo Trung Châu Phái. Dùng cho Phần 8:
${phucDucReportStr}

--- CHEAT SHEET: LƯU NGUYỆT — 12 CUNG THÁNG ÂM LỊCH (HỆ THỐNG AN SẴN) ---
Hệ thống đã an sẵn cung an trú của từng tháng âm lịch trong năm xem hạn (theo Đẩu Quân) cùng can tháng và đường phi Lưu Nguyệt Tứ Hóa (Lộc/Quyền/Khoa/Kỵ của tháng đó đáp vào sao nào, cung nào). Dùng cho Phần 7. Dữ liệu tính sẵn:
${luuNguyetReportStr}

--- CHEAT SHEET: VÒNG TRƯỜNG SINH (THẾ ĐẤT SAO MẠNH/YẾU — HỆ THỐNG GOM SẴN) ---
Mỗi cung trọng yếu đứng ở một thế đất của vòng Tràng Sinh 12. Nguyên tắc: sao dù tốt nhưng đóng cung YẾU (Tử/Tuyệt/Mộ/Bệnh/Suy/Thai) thì giảm lực, dễ HỮU DANH VÔ THỰC; đóng cung MẠNH (Trường Sinh/Đế Vượng/Lâm Quan/Quan Đới) thì phát huy trọn vẹn. Dùng để hiệu chỉnh mức độ mạnh/yếu khi luận sao ở Phần 1, Phần 2 và Phần 9 (định cách phú quý) — tránh khen quá lời sao tốt đang ở thế đất suy:
${truongSinhReportStr}

--- CHEAT SHEET: ĐẾM CÁT/HUNG ĐỊNH CÁCH PHÚ QUÝ (HỆ THỐNG ĐẾM SẴN) ---
Hệ thống đã đếm số cát tinh phúc lộc và hung sát tinh ở tam phương trục cốt (Mệnh-Tài-Quan + xung chiếu + Phúc Đức). Đây là cơ sở KHÁCH QUAN để chấm tầng phúc lộc tổng thể ở Phần 9 (định cách phú quý); con số chỉ là gợi ý, phải đặt trong bối cảnh miếu/hãm, cách cục và thế đất Tràng Sinh để luận cho đúng, KHÔNG chỉ đếm số rồi kết luận máy móc:
${phucLocReportStr}

--- TINH TÌNH CHÍNH TINH THEO ĐÀM TINH (TRUNG CHÂU PHÁI — VƯƠNG ĐÌNH CHI) ---
Dưới đây là tính chất (tinh tình) của các CHÍNH TINH thực sự có trên lá số này, trích từ bộ 《王亭之談星》. Đây là tài liệu tham khảo để luận SÂU bản chất sao theo tinh thần trọng tinh tình của Trung Châu Phái, KHÔNG phải để chép lại khô khan. Hãy đan cài tinh tình này với vị trí cung, miếu/hãm, tứ hóa và tam phương tứ chính đã tính sẵn. VẪN PHẢI bám đúng các sao thực có trên lá số; không vì tài liệu này mà nhắc đến sao không tồn tại:
${damTinhStr}

--- TINH TÌNH PHỤ/TẠP TINH THEO ĐÀM TINH (TRUNG CHÂU PHÁI) ---
Dưới đây là tinh tình của các phụ/tá/sát/tạp diệu thực có trên lá số (đã lọc sẵn, ưu tiên theo mức ảnh hưởng và có trần ngân sách để prompt không phình). Đây là NGUYÊN LIỆU NỀN: hãy đan cài với chính tinh đồng cung, miếu/hãm và tam phương tứ chính để ra kết luận động, KHÔNG chép khô khan từng sao:
${damTinhAuxStr}

--- TINH TÌNH TỨ HÓA TỔNG QUÁT (TRUNG CHÂU PHÁI — BẢN CHẤT CHUNG CỦA 4 HÓA) ---
Dưới đây là bản chất chung của các loại Hóa (Lộc/Quyền/Khoa/Kỵ) thực sự xuất hiện trên lá số này, cô đọng từ Đàm Tinh. Đây là NỀN KHÁI NIỆM (mỗi loại Hóa mang năng lượng gì) để luận Phần 2 cho vững gốc; PHẢI kết hợp với tinh tình chi tiết theo cặp (ngay bên dưới) và cung vị sao thụ hóa đang đóng để ra kết luận động, KHÔNG chép khô khan:
${damTinhTuHoaGeneralStr}

--- TINH TÌNH TỨ HÓA CHI TIẾT THEO CẶP (CHÍNH TINH THỤ HÓA × LOẠI HÓA) ---
Dưới đây là tinh tình của ĐÚNG các cặp (chính tinh × Hóa) thực sự xuất hiện trên lá số này, gồm Tứ Hóa bẩm sinh và phi hóa Đại vận/Lưu niên (đã tính sẵn ở các phần trên). Dùng để luận SÂU sắc thái riêng của từng sao khi thụ Hóa theo từng can, KHÔNG chép khô khan: hãy ghép với cung vị nơi sao thụ hóa đang đóng (đã có ở bảng Tứ Hóa) và tam phương tứ chính để ra kết luận động về đương số:
${damTinhTuHoaDetailStr}

--- KHUNG LUẬN GIẢI CHƯƠNG TRÌNH CHI TIẾT ---

Bạn hãy soạn thảo bình giải chi tiết gồm 10 phần lớn sau đây bằng chữ quốc ngữ cực kỳ sâu sắc, phân tích chính xác từng sao và kết nối liên hoàn:

1. **TAM PHƯƠNG TỨ CHÍNH & THẾ ĐỨNG LÁ SỐ (BẢN SẮC CẤU TRÚC Ý THỨC & 8 PHẦN CHIỀU SÂU - PHẢN XẠ CHỦ QUAN)**:
   Mổ xẻ sâu sắc tính cách bẩm sinh của đương số bằng cách liên kết chặt chẽ cung Mệnh với 3 cung vị vây quanh học thuyết Tam Phương Tứ Chính: Thiên Di (đối cung), Quan Lộc (tam hợp), Tài Bạch (tam hợp). Bạn hãy trích xuất trực tiếp tên các sao đóng ở ba cung vị này của họ để phân tích điểm sáng, điểm hiểm nghệ thuật hành xử bấy lâu và điểm mù cốt lõi bẩm sinh. Chỉ rõ nghiệp lý nhân quả đã tự định hình từ thói phản xa bộc trực không tự biết của họ bấy lâu nay.
   Theo tinh thần Trung Châu Phái (trọng tinh tình & cách cục): hãy dùng phần "CÁCH CỤC CHÍNH TINH" đã nhận diện sẵn ở trên làm xương sống định cốt cách bản mệnh, rồi đọc sâu tinh tình (bản chất) của từng chính tinh trong tổ hợp đó thay vì chỉ liệt kê tên sao. Đồng thời soi phần "TỰ HÓA" để chỉ ra các điểm mà năng lượng tự phát lộ hoặc tự hao tổn ngay trong nội tâm đương số.
   Bắt buộc lồng thêm hai lớp chiều sâu đã được hệ thống tính sẵn: (a) Dựa vào cheat sheet "LAI NHÂN CUNG" để truy về căn nguyên (來因) bẩm sinh — chỉ rõ nguồn cơn sâu xa nhất chi phối mọi lựa chọn và ám ảnh của đương số bắt rễ từ lĩnh vực nào; (b) Đối chiếu trục Mệnh (tư duy bẩm sinh, chủ đạo nửa đầu đời ~trước 30) với Cung Thân (đã neo riêng ở phần "CUNG THÂN" phía trên — hành động/hậu vận, chủ đạo ~sau 30) để vạch trần khúc ngoặt chuyển hóa nội tâm → hành vi mà đương số phải tự biết để tiến lui đúng nhịp.

2. **KRONOS TỨ HÓA (KHOA - QUYỀN - LỘC - KỴ) THEO KINH TOÀN NIÊN CHIẾN LƯỢC**:
   ${natalTuHoaResolved
     ? `Sử dụng TRỰC TIẾP bảng "TỨ HÓA BẨM SINH (NATAL)" mà hệ thống đã tính sẵn ở trên (đã ghi rõ mỗi Hóa rơi vào sao nào, đóng tại cung nào). TUYỆT ĐỐI không tự tra lại bảng can hay tự đoán vị trí sao.`
     : `Hệ thống chưa tính sẵn được Tứ Hóa bẩm sinh (xem phần LƯU Ý ở trên). Hãy xử lý thận trọng: chỉ suy luận Tứ Hóa nếu xác định chắc chắn được can năm sinh và phải ghi rõ đó là suy luận; nếu không, nói rõ thiếu dữ liệu thay vì bịa vị trí sao.`}
   Hãy luận giải sướng khổ tương ứng tại các cung vị đó. Đặc biệt xới sâu Hóa Lộc (kho tài nguyên vũ trụ ban tặng) và Hóa Kỵ (ải nợ nần, ám ảnh sợ hãi, vết sẹo dằn vặt thẳm sâu).
   Đồng thời phân tích tối thiểu 02 đường phóng Tự Phi Tứ Hóa của các cung then chốt (Cung Mệnh, Cung Tài, Cung Quan) dựa vào dòng "Phi Tứ Hóa" đã tính sẵn trong từng cung, xem chúng tự phi Lộc hay phi Kỵ đi đâu để thấy hành trình luân chuyển dòng khí đời người.
   Khi luận tiền tài, BẮT BUỘC dùng cheat sheet "HAI TRỤC TÀI LỘC" để tách bạch rõ hai năng lực: trục SINH TÀI (Mệnh-Tài-Quan = cách KIẾM tiền, tạo dòng tiền) và trục THỦ TÀI (Phúc-Tài-Điền = cách GIỮ của, tích sản). Phải chỉ thẳng đương số thuộc kiểu nào: kiếm giỏi mà giữ không nổi (tiền vào tiền ra), hay thủ chắc mà khó bứt phá, căn cứ vào sao thực ở từng trục.

3. **ẢNH HƯỞNG CỦA CÁC ĐỒNG CUNG & SÁT TINH TƯƠNG TÁC CHIẾN LƯỢC**:
   Phát giác và cô lột sự tàn phá của các Sát Tinh hiểm yếu (Địa Không, Địa Kiếp, Kình Dương, Đà La, Hỏa Tinh, Linh Tinh) đóng trên mệnh bàn đương số. Xét mối liên kết Nhị Hợp hoặc Lục Hại của cung bị ám để xem các cơn sóng dữ ngầm rạn nứt phát triển thế nào. Chỉ ra bí quyết tự nén mình cải tâm sửa nết để hóa hung thành cát một cách khoa học thực hành.

4. **VẬN TRÌNH ĐẠI VẬN 10 NĂM & LUẬN TIỂU HẠN NĂM NĂM ĐƯƠNG KIM ${chartData.transitYear || 2026}**:
   Luận đoán Đại vận đương đi dựa vào sự thịnh suy can chi của cung vị Đại hạn đó. 
   Sau đó đi phân tích sâu sắc năm xem vận hạn ${chartData.transitYear || 2026}. Bạn PHẢI tìm kiếm chính xác các Sao Lưu niên (đã được đánh dấu có tiền tố \`[SAO LƯU]\` trong mảng dữ liệu star chi tiết của cung vị như: Lưu Thái Tuế, Lưu Lộc Tồn, Lưu Tang Môn, Lưu Bạch Hổ, Lưu Thiên Mã, Lưu Kình, Lưu Đà, Lưu Khốc, Lưu Hư, cùng nhóm Lưu Tứ Hóa gồm Lưu Hóa Lộc, Lưu Hóa Quyền, Lưu Hóa Khoa, Lưu Hóa Kỵ - mỗi sao đã ghi kèm tên chính tinh thụ hóa trong ngoặc) để chỉ rõ: Năm nay súng đạn biến thiên sẽ nổ ra ở cung vị nào? Thị phi, dời nhà cửa thăng trầm hay lộc tiền mặt, hỷ tín tang gia hiển lộ cụ thể ra sao cực kỳ đời thực.

5. **CUNG PHU THÊ & THẾ THIÊN SÁT GIA ĐẠO: ĐỐI THOẠI KHẮC-HỢP**:
   Sử dụng Cung Phu Thê làm trục chính kết hợp Tam Phương Tứ Chính (cung đối Quan Lộc, và các cung tam hợp vây quanh) để vạch trần mong đợi bẩm sinh của đương số về bạn đời hay xu thế áp đặt, khuyết tật ứng xử làm rạn vỡ gia đạo. Chỉ vẽ con đường đôi bên cùng thấu hiểu, nương tựa dịu hiền.

6. **SỨC KHỎE TẬT ÁCH & THIÊN DI PHỊ HẠN CHỦ ĐỘNG PHÒNG NGỪA**:
   Phân tích Cung Tật Ách song chiếu cùng Thiên Di và quan hệ Nhị Hợp, Lục hại rình rập để khuyên bảo đương số phòng ngừa hao tổn sinh căn lực lượng, dịch chuyển xuất ngoại chủ động phòng trừ nguy biến pháp lý tai ương.

7. **THÁNG TRỌNG TÂM TRONG NĂM ${chartData.transitYear || 2026}: TIỀN BẠC, SỨC KHỎE, CÔNG VIỆC, TÌNH CẢM**:
   Dựa TRỰC TIẾP vào cheat sheet "LƯU NGUYỆT — 12 CUNG THÁNG ÂM LỊCH" đã được hệ thống an sẵn (mỗi tháng âm đáp vào cung nào, can tháng nào, và Lưu Nguyệt Tứ Hóa Lộc/Quyền/Khoa/Kỵ của tháng đó bay vào sao/cung nào). TUYỆT ĐỐI không tự nhẩm lại cung tháng hay can tháng; nếu hệ thống báo thiếu dữ liệu thì nói rõ thiếu, không bịa.
   CÁCH TRÌNH BÀY (bắt buộc): TUYỆT ĐỐI KHÔNG liệt kê đều cả 12 tháng. Hãy QUÉT qua 12 tháng đã tính sẵn, RÚT RA các tháng trọng tâm rồi GOM theo CHỦ ĐỀ, chỉ nói những tháng thật sự đáng chú ý (có Lưu Lộc/Quyền/Khoa hoặc Lưu Kỵ đáp vào cung quan trọng). Trình bày theo các mục nhỏ, mỗi mục nêu tháng + chuyện cụ thể:
     - **TIỀN BẠC** (khi Tứ Hóa tháng đáp Tài Bạch/Điền Trạch/Quan Lộc): tháng nào dễ vào tiền (Lộc/Quyền), tháng nào hao tài/siết chi (Kỵ).
     - **SỨC KHỎE** (khi đáp Tật Ách/Thiên Di): tháng nào cần giữ gìn sức khỏe, coi chừng ốm đau/tai nạn nhỏ (Kỵ), tháng nào thể trạng sảng khoái.
     - **CÔNG VIỆC / HỌC HÀNH** (khi đáp Quan Lộc/Phụ Mẫu/Nô Bộc): tháng thuận thăng tiến/thi cử, tháng dễ thị phi va chạm.
     - **TÌNH CẢM / GIA ĐẠO** (khi đáp Phu Thê/Tử Tức/Huynh Đệ): tháng có tin vui tình cảm, tháng dễ lục đục.
   Nếu một chủ đề trong năm không có tháng nào nổi bật thì nói ngắn gọn "năm nay ít biến động về [chủ đề]", KHÔNG cố bịa tháng cho đủ mục.
   Nêu sự việc cực kỳ ĐỜI THỰC, RÕ được hay mất CÁI GÌ — TUYỆT ĐỐI KHÔNG dùng ngôn ngữ chung chung kiểu "tháng tiến công / tháng phòng thủ".
   NGUYÊN TẮC SUY SỰ VIỆC (bắt buộc): KHÔNG dùng câu mẫu cố định cho mọi người. Với MỖI tháng, hãy nhìn CHÍNH CUNG và sao mà Lưu Nguyệt Tứ Hóa của tháng đó đáp vào để suy ra ĐÚNG lĩnh vực đời sống bị động:
     - Tài Bạch → tiền bạc (lương thưởng, thu nhập, chi tiêu, hao hụt)
     - Quan Lộc → công việc, học hành, thi cử, công danh
     - Phu Thê → quan hệ đôi lứa/bạn đời (XEM TUỔI bên dưới)
     - Tật Ách → sức khỏe, đau ốm, tai nạn nhỏ
     - Nô Bộc → bạn bè, đồng nghiệp, cộng sự, mạng xã hội
     - Phụ Mẫu → cha mẹ, cấp trên, thầy cô
     - Tử Tức → con cái, đầu tư/dự án tâm huyết (XEM TUỔI)
     - Điền Trạch → nhà cửa, chỗ ở, tài sản lớn
     - Huynh Đệ → anh chị em, cộng tác gần gũi
     - Thiên Di → đi lại, di chuyển, ra ngoài, môi trường mới
   Tính chất Hóa: Lưu Lộc/Quyền/Khoa → được, thuận, có tin vui ở lĩnh vực đó; Lưu Kỵ → mất, trắc trở, hao tổn, lo lắng ở lĩnh vực đó.
   ĐIỀU CHỈNH THEO TUỔI (bắt buộc, căn cứ Tuổi mụ = ${chartData.transitLunarAge || "chưa rõ"}): ngôn từ phải khớp vòng đời thật của đương số. Nếu còn nhỏ/vị thành niên (dưới ~18): Phu Thê luận thành rung động đầu đời, tình cảm bạn bè khác giới, KHÔNG nói vợ chồng/cưới hỏi/ly hôn; Quan Lộc luận thành học hành thi cử; Tử Tức KHÔNG nói con cái. Nếu đã trưởng thành mà chưa lập gia đình: Phu Thê luận thành chuyện yêu đương, hẹn hò, người đang tìm hiểu. Chỉ nói vợ chồng/con cái/ly hôn khi độ tuổi và bối cảnh hợp lý. Tương tự, người lớn tuổi thì Quan Lộc thiên về công việc/hưu trí thay vì thi cử.
   VĂN PHONG: dùng ngôn ngữ đời sống hiện đại, gần gũi với ai cũng gặp (lương thưởng, ốm đau, cãi vã, mua sắm, đi lại, học hành, yêu đương); chỉ nhắc đến hợp đồng/giấy tờ/pháp lý KHI bối cảnh lá số cho thấy đương số là người kinh doanh/đầu tư/làm ăn lớn. MỤC TIÊU cuối cùng: để đương số NHỚ NHANH được "năm nay tháng nào lo tiền, tháng nào lo sức khỏe, tháng nào thuận việc, tháng nào vui chuyện tình cảm" — gọn, trọng tâm, không dàn trải.

8. **CUNG PHÚC ĐỨC: GỐC AN - BẤT AN & PHÚC BÁO HƯỞNG THỤ**:
   Dùng TRỰC TIẾP cheat sheet "CỤM SAO PHÚC ĐỨC" hệ thống đã tính sẵn làm trục chính: chỉ được luận trên đúng các sao (chính tinh, trợ/cát tinh, sát/tạp tinh) và đúng các cung Xung chiếu / Tam hợp / Nhị hợp / Lục hại đã liệt kê sẵn trong cheat sheet. TUYỆT ĐỐI không tự nhẩm lại index cung, không thêm sao không có trong dữ liệu. Từ đó mổ xẻ chất lượng đời sống tinh thần, mức độ an hay bất an tự thân, phúc báo thừa hưởng và năng lực hưởng thụ thành quả của đương số.
   NGÔN TỪ LINH HOẠT THEO ĐÚNG LOGIC SAO (bắt buộc, không dùng câu mẫu chung): nếu Phúc Đức có cát tinh/Hóa Lộc-Quyền-Khoa đời vào (theo đúng dữ liệu) thì luận gốc phúc dày, dù vất vả vẫn thấy đáng và lòng thanh thản; nếu có sát tinh/Hóa Kỵ (đối chiếu cheat sheet vùng sát kỵ) thì luận dễ tự dằn vặt, suy nghĩ tiêu cực, hưởng phúc không trọn dù tiền tài có dư; nếu Vô Chính Diệu thì mượn sao xung chiếu/tam hợp đã liệt kê để luận, KHÔNG gán sắc thái không căn cứ. Chỉ rõ đương số cần tu dưỡng nội tâm điểm nào để gốc phúc dày thêm thay vì tự bào mòn an lạc.

9. **ĐỊNH CÁCH PHÚ QUÝ BẦN TIỆN — CÂU KẾT TỔNG LỰC MỆNH**:
   Đây là PHẦN CHỐT HẠ cuối bài. Dùng cheat sheet "ĐẾM CÁT/HUNG ĐỊNH CÁCH PHÚ QUÝ" kết hợp cách cục chính tinh, miếu/hãm và thế đất Tràng Sinh ở trên để ĐÚC KẾT một nhận định tổng về tầng phúc lộc của đương số: cốt cách thuộc tầng nào (phúc hậu / trung bình khá / lao tâm vất vả / thăng trầm lớn), điểm sáng nhất để nương vào và điểm hiểm nhất phải cảnh chừng cả đời. TUYỆT ĐỐI không phán máy móc theo số đếm (vd "5 cát 2 hung nên giàu") — con số chỉ là gợi ý, phải luận bằng cả chất lượng sao, miếu hãm và thế đất. Viết câu kết bằng giọng đanh thép, thật lòng của một danh sư — vừa thẳng thắn chỉ ra vận mệnh, vừa mở cho đương số con đường đức năng thắng số, tự cải vận bằng tu tâm sửa nết.

Văn phong trình bày bằng Markdown gọn gàng, súc mộc nhưng đanh thép học thuật tột bậc. Mở đầu bằng một câu nói trực diện đầy uy lực xoáy sâu thẳng thắn nhân tính, từ ngữ thấu tỏ hiện đại và tâm can thực thụ của một danh sư hữu tâm!`;

      let response;
      let fallbackUsed = false;
      let finalModelName = modelName;

      try {
        console.log(`[Attempt] Initiating Gemini analysis with ${finalModelName}...`);
        response = await ai.models.generateContent({
          model: finalModelName,
          contents: prompt,
          config: { systemInstruction: SYSTEM_INSTRUCTION },
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
            config: { systemInstruction: SYSTEM_INSTRUCTION },
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

  // ===== HELPER dùng chung cho route AI phụ: BYOK + chọn model + fallback 503 =====
  const resolveKeyAndModel = (customApiKey: any, modelSelection: any) => {
    const finalApiKey = customApiKey ? String(customApiKey).trim() : "";
    let modelName = "gemini-3.5-flash";
    if (modelSelection === "gemini-3.1-flash-lite") modelName = "gemini-3.1-flash-lite";
    return { finalApiKey, modelName };
  };

  const isBusyError = (rawMsg: string): boolean =>
    rawMsg.includes("503") ||
    rawMsg.toLowerCase().includes("unavailable") ||
    rawMsg.toLowerCase().includes("high demand") ||
    rawMsg.toLowerCase().includes("busy") ||
    rawMsg.toLowerCase().includes("spikes in demand");

  const generateWithFallback = async (
    ai: any, modelName: string, contents: string, systemInstruction: string
  ): Promise<{ response: any; finalModelName: string; fallbackUsed: boolean }> => {
    let finalModelName = modelName;
    let fallbackUsed = false;
    try {
      const response = await ai.models.generateContent({ model: finalModelName, contents, config: { systemInstruction } });
      return { response, finalModelName, fallbackUsed };
    } catch (firstError: any) {
      const rawMsg = firstError?.message || (typeof firstError === "string" ? firstError : JSON.stringify(firstError)) || "";
      if (isBusyError(rawMsg) && finalModelName !== "gemini-3.1-flash-lite") {
        finalModelName = "gemini-3.1-flash-lite";
        fallbackUsed = true;
        const response = await ai.models.generateContent({ model: finalModelName, contents, config: { systemInstruction } });
        return { response, finalModelName, fallbackUsed };
      }
      throw firstError;
    }
  };

  const sendAiError = (res: any, error: any) => {
    const rawMsg = error?.message || (typeof error === "string" ? error : JSON.stringify(error)) || "Lỗi xử lý trên máy chủ.";
    let errMsg = rawMsg;
    let isRateLimit = false;
    let retryAfter = 30;
    if (isBusyError(rawMsg)) {
      isRateLimit = true;
      retryAfter = 15;
      errMsg = "Hệ thống Google Gemini API đang quá tải tạm thời (503). Vui lòng đợi ~15 giây rồi gửi lại, hoặc chuyển sang Gemini 3.1 Flash Lite, hoặc dùng API Key cá nhân (BYOK).";
    } else if (rawMsg.includes("RESOURCE_EXHAUSTED") || rawMsg.includes("quota") || rawMsg.includes("429") || rawMsg.toLowerCase().includes("limit")) {
      isRateLimit = true;
      const secondsMatch = rawMsg.match(/retry in\s+([0-9.]+)\s*s/i);
      const delayMatch = rawMsg.match(/retryDelay:\s*"(\d+)/i);
      if (secondsMatch) retryAfter = Math.ceil(parseFloat(secondsMatch[1]));
      else if (delayMatch) retryAfter = parseInt(delayMatch[1], 10);
      errMsg = `Đã vượt hạn mức lượt dùng (Quota / Rate Limit) tạm thời. Hãy đợi ~${retryAfter} giây rồi thử lại, hoặc dùng API Key cá nhân (BYOK).`;
    }
    res.status(500).json({ error: errMsg, rateLimited: isRateLimit, retryAfter, rawMessage: rawMsg });
  };

  // ===== API: HỎI ĐÁP FOLLOW-UP trên lá số đã luận giải =====
  app.post("/api/chat", async (req, res) => {
    try {
      const { baseInterpretation, chartData, history, question, customApiKey, modelSelection } = req.body;
      if (!question || !String(question).trim()) return res.status(400).json({ error: "Thiếu câu hỏi." });
      // Guard: cần đủ 12 cung để tra cứu sao/cung đáng tin. Thiếu cung thì các quan hệ
      // hình học (tam phương, xung chiếu) không đáng tin — chặn sớm thay vì để AI luận khuyết.
      if (!Array.isArray(chartData?.palaces) || chartData.palaces.length < 12) {
        return res.status(400).json({ error: "Dữ liệu lá số không hợp lệ: thiếu thông tin 12 cung. Vui lòng an lại lá số đầy đủ trước khi hỏi đáp." });
      }
      const { finalApiKey, modelName } = resolveKeyAndModel(customApiKey, modelSelection);
      if (!finalApiKey) return res.status(400).json({ error: "Yêu cầu khóa API cá nhân: vui lòng nhập và lưu Google Gemini API Key trước khi hỏi đáp." });
      const ai = new GoogleGenAI({ apiKey: finalApiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });

      const CHAT_SYSTEM_INSTRUCTION = `Bạn là một Minh Sư Tử Vi đang tiếp tục tư vấn cho đương số DỰA TRÊN ĐÚNG dữ liệu lá số và bản luận giải đã cung cấp bên dưới. Nguyên tắc:\n- CHỈ dựa vào DỮ LIỆU LÁ SỐ (12 cung, sao thực có, vận hạn) và bản luận giải gốc; TUYỆT ĐỐI không bịa sao không có trong dữ liệu.\n- CHỐNG BỊA ĐẶT Ở TẦNG DỮ LIỆU (BẮT BUỘC): hệ thống đã TÍNH SẴN cho bạn các khối "QUAN HỆ HÌNH HỌC TÍNH SẴN", "TỨ HÓA BẨM SINH" và "PHI TỨ HÓA LƯU NIÊN" (xung chiếu/tam hợp/nhị hợp/lục hại/đường bay Lộc-Quyền-Khoa-Kỵ cùng cung đích). Hãy DÙNG TRỰC TIẾP các dòng này; TUYỆT ĐỐI không tự nhẩm lại chỉ số index cung, không tự đoán sao bầu trời nào chiếu cung nào.\n- LUẬN CHÉO ĐA CHIỀU (BẮT BUỘC): hệ thống đã nối sẵn khối "LIÊN KẾT ĐA CHIỀU" (mỗi đường tứ hóa bẩm sinh/lưu niên bay vào cung nào → tác động tới lĩnh vực đời sống nào). Hãy ƯU TIÊN dùng các đường dây này để luận CHÉO giữa các chiều (vd câu hỏi về tiền nhưng có Hóa Kỵ từ cung Phu Thê bay vào Tài Bạch thì phải chỉ ra mối liên hệ hôn nhân ↔ tiền bạc), thay vì luận từng cung rời rạc. Sắc thái được/mất trong khối này CHỈ là gợi hướng; cát/hung cuối cùng vẫn phải căn miếu/hãm và tổ hợp sao thực.\n- Khi trả lời, hãy TRA ĐÚNG cung/sao liên quan câu hỏi: hỏi tình duyên soi cung Phu Thê, hỏi tiền soi Tài Bạch/Quan Lộc, hỏi sức khỏe soi Tật Ách... dựa vào sao thực đóng ở cung đó và khối quan hệ tính sẵn của cung đó. Khi cần, liên kết tam phương tứ chính (xung chiếu, tam hợp), nhị hợp/lục hại và tứ hóa để luận cho có chiều sâu, KHÔNG luận sao đứng đơn lẻ.\n- LUÔN NHẤT QUÁN với bản luận giải gốc và các lượt hỏi đáp trước: không được trả lời mâu thuẫn với chính mình đã nói; nếu cần điều chỉnh, nói rõ lý do dựa trên sao/cung nào.\n- Nếu bản văn luận giải không nêu chi tiết, ưu tiên tra trực tiếp DỮ LIỆU LÁ SỐ; nếu cả hai đều không đủ, nói rõ thiếu dữ kiện thay vì bịa.\n- Giữ giọng "Nói Thật & Trực Diện": có cát nói cát, có hung nói hung, hướng đương số tự điều chỉnh hành vi.\n- NGÔN TỪ ĐỜI THỰC, ĐA DẠNG, CHÍNH XÁC: tuyệt đối tránh từ sáo rỗng mơ hồ kiểu "hao tài", "gặp xui", "rắc rối sự nghiệp"; phải dịch nghĩa sao/cung ra tình huống đời sống hiện đại cụ thể (lương thưởng, dòng tiền, đầu tư, công việc, học hành, yêu đương, sức khỏe, đi lại) hợp với bối cảnh đương số.\n- LỜI KHUYÊN MAY ĐO (không rập khuôn): bám đúng tổ hợp sao/cách cục thực có và độ tuổi của đương số; không áp công thức chung, không bắt đương số chống lại bản chất bẩm sinh.\n- Nếu câu hỏi không liên quan Tử Vi/lá số, lịch sự từ chối và kéo về chủ đề mệnh lý.\n\nCÁCH TRẢ LỜI (BẮT BUỘC — GỌN, TRỌNG TÂM, BÁM SÁT LÁ SỐ):\n- ĐI THẲNG vào đáp án ngay câu đầu; CẤM mào đầu/chào hỏi/dẫn dắt ("Chào bạn", "Về câu hỏi của bạn...", "Theo lá số...").\n- CẤM lặp lại/tóm tắt lại bài luận giải gốc; chỉ trả lời ĐÚNG điều được hỏi, KHÔNG lan sang ý không được hỏi.\n- ĐỘ DÀI (mặc định gọn): 3-5 câu, hoặc tối đa 3 gạch đầu dòng ngắn; CHỈ dài hơn khi đương số yêu cầu rõ "phân tích kỹ/chi tiết".\n- CÔNG THỨC: 1 câu KẾT LUẬN trước, rồi lý do ngắn nêu ĐÚNG sao/cung thực có làm căn cứ (để thấy đáp án bám lá số). Ưu tiên chính xác với sao/cung hơn là diễn giải dài dòng.\n- TRÁNH liệt kê nhiều sao, tránh văn hoa sáo rỗng; chỉ nêu sao/cung trọng yếu nhất quyết định câu trả lời.\n- Nếu hợp, kết bằng 1 lời khuyên hành động cụ thể, ngắn (1 câu).`;

      // Dựng phần dữ liệu lá số: 12 cung + sao thực + vận hạn, KÈM lưới quan hệ
      // hình học (tam phương / xung chiếu / nhị hợp / lục hại / phi tứ hóa) ĐÃ
      // TÍNH SẴN cho TRỌN 12 cung. Mục đích: chat bám sát đúng 12 cung + sao +
      // logic toán đồng bộ với /api/interpret, không để AI tự nhẩm index khi user
      // hỏi đáp nhiều lần (chống bịa/mơ hồ). Nhúng đủ 12 cung để AI tự chọn đúng
      // cung theo câu hỏi mà không trượt (linh hoạt hơn matching từ khóa); lá số
      // chỉ có 12 cung text thuần nên không phình prompt đáng kể.
      const buildChartContext = (cd: any): string => {
        if (!cd || !Array.isArray(cd.palaces)) return "(Không có dữ liệu lá số kèm theo — chỉ dựa vào bản văn luận giải.)";
        const idx = buildChartIndex(cd.palaces);
        const head = [
          `- Giới tính: ${cd.gender || "?"} | Cầm tinh: ${cd.zodiac || "?"} | Cục: ${cd.fiveElementsClass || "?"}`,
          `- Can chi: ${cd.chineseDate || "?"} | Thiên can năm sinh: ${cd.birthHeavenlyStem || "?"}`,
          `- Năm xem hạn: ${cd.transitYear || "?"} (tuổi mụ ${cd.transitLunarAge || "?"}) | Đại hạn: ${cd.transitDecadalPalace || "?"} | Tiểu hạn: ${cd.transitYearlyPalace || "?"} | Lưu Thái Tuế: ${cd.transitLuuThaiTuePalace || "?"}`,
        ].join("\n");
        const palaceLines = cd.palaces.map((p: any) => {
          const major = (p.majorStars || []).map((s: any) => s.name).join(", ") || "Vô Chính Diệu";
          const minor = (p.minorStars || []).map((s: any) => s.name).join(", ") || "";
          const adj = (p.adjectiveStars || []).map((s: any) => s.name).join(", ") || "";
          const extras = [minor && `Trợ/Lưu: ${minor}`, adj && `Sát/Tạp: ${adj}`].filter(Boolean).join(" | ");
          return `  - ${p.name} (${p.earthlyBranch || "?"}, can ${p.heavenlyStem || "?"})${p.isBodyPalace ? " [THÂN]" : ""}: ${major}${extras ? " | " + extras : ""}`;
        }).join("\n");

        // Tứ Hóa bẩm sinh (natal) — nền gốc, luôn kèm vì câu hỏi nào cũng có thể chạm.
        const natalLines = buildNatalTuHoaLines(idx, cd.birthHeavenlyStem);
        const natalStr = natalLines
          ? natalLines.map((l) => `  - ${l}`).join("\n")
          : "  - Chưa xác định được Thiên can năm sinh nên KHÔNG tính sẵn Tứ Hóa bẩm sinh (đừng tự suy đoán vị trí sao).";

        // Nhúng sẵn quan hệ hình học + phi tứ hóa + sát/kỵ cho TRỌN 12 cung.
        // Bỏ matching từ khóa (giòn, không phủ hết cách diễn đạt của user): khi
        // mọi cung đều có sẵn dữ liệu tính sẵn, AI tự chọn đúng cung theo câu hỏi
        // mà không bao giờ trượt cung, không phải tự nhẩm index. Đây là text thuần
        // nên không phải gánh nặng đáng kể với model.
        const relationBlocks = cd.palaces.map((p: any) => {
          const rel = buildRelationsBlock(idx, p);
          const sat = satKyStarsInPalace(p);
          const satLine = sat.length > 0
            ? `  - Sát/kỵ tinh thực có tại cung này: ${sat.join(", ")}`
            : "  - Cung này không gánh sát/kỵ tinh cực đoan.";
          return `${rel}\n${satLine}`;
        }).join("\n\n");

        // Phi tứ hóa Lưu niên (theo can năm xem hạn) — dùng khi hỏi vận hạn năm.
        const luuStem = STEM_NAME_BY_YEAR_MOD[(((Number(cd.transitYear) || 2026) % 10) + 10) % 10];
        const luuFlying = buildFlyingTuHoaLines(idx, luuStem);
        const luuStr = luuFlying.length > 0
          ? luuFlying.map((l) => `  - ${l}`).join("\n")
          : "  - Chưa xác định được can Lưu niên.";

        // LIÊN KẾT ĐA CHIỀU: nối sẵn tứ hóa bẩm sinh + lưu niên với cung đích và
        // lĩnh vực đời sống (giao điểm giữa các chiều), để AI thấy ngay "đường dây"
        // giữa động lực và lĩnh vực thay vì tự xâu chuỗi. Code chỉ ghi giao điểm
        // trung tính; cát/hung cụ thể vẫn để AI luận theo miếu hãm/tổ hợp sao.
        const crossLinkStr = buildCrossLinks(idx, cd.birthHeavenlyStem, luuStem, cd.transitYear || 2026);

        return [
          head,
          `12 CUNG (sao thực có):\n${palaceLines}`,
          `TỨ HÓA BẨM SINH (đã tính sẵn — DÙNG TRỰC TIẾP, không tự tra bảng can):\n${natalStr}`,
          `PHI TỨ HÓA LƯU NIÊN ${cd.transitYear || 2026} (can ${luuStem}, đã tính sẵn — dùng khi hỏi vận hạn năm):\n${luuStr}`,
          `QUAN HỆ HÌNH HỌC TÍNH SẴN — TRỌN 12 CUNG (xung chiếu/tam hợp/nhị hợp/lục hại/phi tứ hóa — DÙNG TRỰC TIẾP đúng cung liên quan câu hỏi, TUYỆT ĐỐI không tự nhẩm lại index):\n${relationBlocks}`,
          `LIÊN KẾT ĐA CHIỀU (giao điểm động lực tứ hóa × cung đích × lĩnh vực đời sống — đã nối sẵn; dùng để luận chéo, nhưng sắc thái chỉ là gợi hướng — vẫn phải đối chiếu miếu/hãm & tổ hợp sao thực để kết cát/hung):\n${crossLinkStr}`,
        ].join("\n\n");
      };
      const chartContext = buildChartContext(chartData);

      const historyArr = Array.isArray(history) ? history : [];
      const historyStr = historyArr.map((t: any) => `${t.role === "user" ? "Đương số" : "Minh Sư"}: ${String(t.content || "").trim()}`).join("\n\n");

      const prompt = `--- DỮ LIỆU LÁ SỐ (sao THỰC CÓ — tra cứu trực tiếp ở đây) ---\n${chartContext}\n\n--- BẢN LUẬN GIẢI LÁ SỐ GỐC (diễn giải đã có) ---\n${String(baseInterpretation || "(chưa có bản luận giải gốc — hãy luận dựa trên dữ liệu lá số ở trên)").trim()}\n\n${historyStr ? `--- CÁC LƯỢT HỎI ĐÁP TRƯỚC ĐÓ ---\n${historyStr}\n\n` : ""}--- CÂU HỎI MỚI CỦA ĐƯƠNG SỐ ---\n${String(question).trim()}\n\nHãy tra đúng cung/sao liên quan rồi trả lời trực diện, bám đúng lá số.`;

      const { response, finalModelName, fallbackUsed } = await generateWithFallback(ai, modelName, prompt, CHAT_SYSTEM_INSTRUCTION);
      const answer = (response.text || "").trim();
      if (answer.length < 10) return res.status(502).json({ error: "Mô hình AI trả về phản hồi rỗng hoặc quá ngắn (có thể do nghẽn mạng tạm thời). Vui lòng thử lại.", rateLimited: true, retryAfter: 10 });
      res.json({ answer, modelUsed: finalModelName, fallbackUsed });
    } catch (error: any) {
      console.error("Lỗi hỏi đáp follow-up:", error);
      sendAiError(res, error);
    }
  });

  // ===== API: SO HỢP TUỔI GIỮA 2 LÁ SỐ =====
  app.post("/api/compat", async (req, res) => {
    try {
      const { chartA, chartB, customApiKey, modelSelection } = req.body;
      if (!chartA || !chartB) return res.status(400).json({ error: "Cần đủ dữ liệu hai lá số để so hợp tuổi." });
      // Guard: mỗi lá số cần đủ 12 cung để xác định quan hệ can chi / Mệnh / Phu Thê đáng tin.
      if (!Array.isArray(chartA?.palaces) || chartA.palaces.length < 12 ||
          !Array.isArray(chartB?.palaces) || chartB.palaces.length < 12) {
        return res.status(400).json({ error: "Dữ liệu lá số không hợp lệ: một trong hai lá số thiếu thông tin 12 cung. Vui lòng an lại lá số đầy đủ trước khi so hợp tuổi." });
      }
      const { finalApiKey, modelName } = resolveKeyAndModel(customApiKey, modelSelection);
      if (!finalApiKey) return res.status(400).json({ error: "Yêu cầu khóa API cá nhân: vui lòng nhập và lưu Google Gemini API Key trước khi so hợp tuổi." });
      const ai = new GoogleGenAI({ apiKey: finalApiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });

      const COMPAT_SYSTEM_INSTRUCTION = `Bạn là Minh Sư Tử Vi luận SỰ TƯƠNG HỢP giữa hai đương số (hợp hôn nhân hoặc hợp tác làm ăn) dựa trên dữ liệu hai lá số được cung cấp. Nguyên tắc:\n- CHỈ dùng sao/cung THỰC CÓ trên hai lá số; TUYỆT ĐỐI không bịa sao không có trong dữ liệu, không gán cách cục khi chưa đủ chính tinh cấu thành.\n- LUẬN CHẶT CHẼ, SẮC BÉN theo các trục:\n   1) Quan hệ can chi năm sinh: xác định CHÍNH XÁC tam hợp (Thân-Tý-Thìn, Dần-Ngọ-Tuất, Hợi-Mão-Mùi, Tỵ-Dậu-Sửu), lục hợp/nhị hợp (Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi), lục xung (đối chi 180°) và lục hại (Tý-Mùi, Sửu-Ngọ, Dần-Tỵ, Mão-Thìn, Thân-Hợi, Dậu-Tuất). Nói rõ cặp này rơi vào quan hệ nào và hệ quả.\n   2) Tương quan Mệnh A × Mệnh B: tổ hợp chính tinh hai bên bổ trợ hay kèn cựa; ngũ hành Cục bổ khuyết hay tương khắc.\n   3) Cung Phu Thê mỗi người (cho hợp hôn nhân) hoặc trục Quan Lộc/Tài Bạch (cho hợp tác làm ăn): kỳ vọng bạn đời, cách phối hợp tiền bạc/công việc.\n   4) Phúc Đức hai bên: nền tảng an/bất an, mức bao dung, có dễ cùng hưởng phúc hay hay dằn vặt nhau.\n- NGÔN TỪ ĐỜI THỰC, ĐA DẠNG, CHÍNH XÁC: tránh sáo rỗng kiểu "hợp thì tốt, khắc thì xấu"; mô tả cụ thể họ hợp/khắc Ở ĐIỂM NÀO trong đời sống chung (tiền bạc, quyết định lớn, cái tôi, giao tiếp, gia đạo, cách làm việc).\n- "Nói Thật & Trực Diện": chỉ rõ điểm hợp (nương nhau, bổ trợ) và điểm khắc (dễ va chạm, ai nên nhường ai), kèm cách hoá giải THỰC HÀNH may đo theo đúng sao/cách cục thực có — KHÔNG khuyên rập khuôn.\n- Kết bằng một đánh giá tổng mức độ tương hợp (vd: rất hợp / hợp có điều kiện / cần nỗ lực dung hòa), tránh phán cứng nhắc "không hợp" bỏ nhau.\nBắt đầu thẳng vào luận giải, CẤM chào hỏi/mào đầu lê thê. Trình bày Markdown gọn.`;

      const summarize = (c: any, label: string): string => {
        const palaces = Array.isArray(c?.palaces) ? c.palaces : [];
        const findPalace = (kw: string) => palaces.find((p: any) => String(p?.name || "").includes(kw));
        const menh = findPalace("Mệnh");
        const phu = findPalace("Phu Thê");
        const phuc = findPalace("Phúc");
        const tai = findPalace("Tài Bạch") || findPalace("Tài");
        const quan = findPalace("Quan Lộc") || findPalace("Quan") || findPalace("Sự Nghiệp");
        const di = findPalace("Thiên Di") || findPalace("Di");
        // Gộp đủ 3 nhóm sao để luận chặt hơn, kèm địa chi để xác định quan hệ can chi.
        const starsOf = (p: any) => {
          if (!p) return "?";
          const major = (p.majorStars || []).map((s: any) => s.name).join(", ") || "Vô Chính Diệu";
          const minor = (p.minorStars || []).map((s: any) => s.name).join(", ");
          const adj = (p.adjectiveStars || []).map((s: any) => s.name).join(", ");
          const extras = [minor, adj].filter(Boolean).join(", ");
          const branch = p.earthlyBranch ? ` @${p.earthlyBranch}` : "";
          return `${major}${extras ? ` | phụ/sát: ${extras}` : ""}${branch}`;
        };
        return [
          `# LÁ SỐ ${label}: ${c?.name || "(không tên)"}`,
          `- Giới tính: ${c?.gender || "?"} | Cầm tinh: ${c?.zodiac || "?"} | Cục: ${c?.fiveElementsClass || "?"}`,
          `- Can chi năm sinh: ${c?.chineseDate || "?"} | Thiên can năm sinh: ${c?.birthHeavenlyStem || "?"}`,
          `- Mệnh: ${starsOf(menh)}`,
          `- Phu Thê: ${starsOf(phu)}`,
          `- Phúc Đức: ${starsOf(phuc)}`,
          `- Tài Bạch: ${starsOf(tai)}`,
          `- Quan Lộc: ${starsOf(quan)}`,
          `- Thiên Di: ${starsOf(di)}`,
        ].join("\n");
      };

      const prompt = `${summarize(chartA, "A")}\n\n${summarize(chartB, "B")}\n\nHãy luận sự tương hợp giữa hai lá số trên.`;
      const { response, finalModelName, fallbackUsed } = await generateWithFallback(ai, modelName, prompt, COMPAT_SYSTEM_INSTRUCTION);
      const result = (response.text || "").trim();
      if (result.length < 50) return res.status(502).json({ error: "Mô hình AI trả về phản hồi quá ngắn. Vui lòng thử lại.", rateLimited: true, retryAfter: 10 });
      res.json({ result, modelUsed: finalModelName, fallbackUsed });
    } catch (error: any) {
      console.error("Lỗi so hợp tuổi:", error);
      sendAiError(res, error);
    }
  });

  // Serve static assets in production, and run Vite devserver in dev mode
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in development mode with Vite middleware...");
    (async () => {
      try {
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: "spa",
        });
        app.use(vite.middlewares);
        if (!process.env.VERCEL) {
          app.listen(PORT, "0.0.0.0", () => {
            console.log(`Express server running on port ${PORT}`);
          });
        }
      } catch (err) {
        console.error("Failed to start development server:", err);
      }
    })();
  } else {
    console.log("Starting in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });

    // Only start listening if we are not running on serverless Vercel
    if (!process.env.VERCEL) {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Express server running on port ${PORT}`);
      });
    }
  }

export default app;
