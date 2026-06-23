// ============================================================================
// KHO TRI THỨC TỬ BÌNH (BÁT TỰ) — Cấp 2 cho lớp RAG.
//
// Nguồn: tài liệu "Tử Bình hợp nhất" do người dùng cung cấp, biên theo Tử Bình
// Chân Thuyên / Trích Thiên Tủy / Cùng Thông Bảo Giám. Được CHIA THÀNH MẨU có
// gắn THẺ để retrieveKnowledge() (trong chineseKnowledge.ts) truy hồi đúng phần
// liên quan tới lá số, thay vì nhồi cả tài liệu vào prompt.
//
// NGUYÊN TẮC CỐT LÕI (lặp lại để AI luôn nhớ): mọi Thập Thần / Thần Sát / Cách
// cục chỉ tốt-xấu TÙY Hỷ-Kỵ & Vượng-Suy của toàn cục. Mọi câu là "CÓ XU HƯỚNG",
// không phải "CHẮC CHẮN". Đây là tri thức mệnh lý truyền thống, mang tính tham
// khảo/tín ngưỡng, KHÔNG phải kết luận khoa học.
// ============================================================================

import type { KnowledgeEntry } from "./chineseKnowledge";

export const TU_BINH_KNOWLEDGE: KnowledgeEntry[] = [
  // ---------------- PHẦN I — NỀN TẢNG ----------------
  {
    id: "tubinh-tu-tru-cung-vi",
    tags: ["tứ trụ", "trụ năm", "trụ tháng", "trụ ngày", "trụ giờ", "cung vị", "nền tảng", "đại hạn"],
    title: "4 trụ theo đời người",
    source: "Tử Bình — Phần I",
    content:
      "Niên trụ (gốc rễ / 0–15 tuổi / tổ tiên) → Nguyệt trụ (thân cành / 16–30 tuổi / cha mẹ, sự nghiệp) " +
      "→ Nhật trụ (hoa / 31–45 tuổi / bạn đời, bản thân — can ngày là Nhật Chủ) → Thời trụ (quả / 46+ tuổi " +
      "/ con cái, hậu vận). Cùng một Thập Thần đóng ở trụ khác nhau thì luận về giai đoạn/lục thân khác nhau.",
  },
  {
    id: "tubinh-tang-can",
    tags: ["tàng can", "nhân nguyên", "địa chi", "thông căn", "bản khí", "trung khí", "dư khí"],
    title: "Tàng Can — Nhân nguyên trong Địa Chi",
    source: "Tử Bình — Phần I.2",
    content:
      "Mỗi Địa Chi chứa 1–3 Thiên Can ẩn (bản khí / trung khí / dư khí), là gốc để định Thập Thần & thông căn. " +
      "Tý:Quý · Sửu:Kỷ-Quý-Tân · Dần:Giáp-Bính-Mậu · Mão:Ất · Thìn:Mậu-Ất-Quý · Tỵ:Bính-Mậu-Canh · " +
      "Ngọ:Đinh-Kỷ · Mùi:Kỷ-Đinh-Ất · Thân:Canh-Nhâm-Mậu · Dậu:Tân · Tuất:Mậu-Tân-Đinh · Hợi:Nhâm-Giáp. " +
      "Nhật Chủ có gốc (Lộc/Nhận/Trường sinh/Khố) trong tàng can thì 'thông căn' → mạnh.",
  },
  {
    id: "tubinh-vuong-nhuoc",
    tags: ["thân vượng", "thân nhược", "vượng suy", "đắc lệnh", "thông căn", "nhật chủ", "dụng thần", "nền tảng"],
    title: "Xét Vượng/Nhược Nhật Chủ (quyết định ~90% việc chọn Dụng thần)",
    source: "Tử Bình — Phần I.3",
    content:
      "4 tiêu chí: (1) Đắc lệnh — Nhật can được sinh/vượng bởi chi tháng (mạnh nhất, ~40% lực). " +
      "(2) Đắc địa/Thông căn — có gốc trong tàng can (Lộc, Nhận, Trường sinh, Khố). " +
      "(3) Đắc thế — số lượng Ấn (sinh thân) + Tỷ Kiếp (trợ thân). (4) Thấu xuất — can ẩn lộ lên thiên can. " +
      "Đắc lệnh quan trọng nhất; mất lệnh mà nhiều gốc + Ấn/Tỷ vẫn có thể Thân vượng.",
  },
  {
    id: "tubinh-truong-sinh-loc-nhan",
    tags: ["trường sinh", "lộc thần", "dương nhận", "đế vượng", "lâm quan", "12 cung", "thần sát"],
    title: "Vòng Trường Sinh 12 cung (gốc của Lộc, Nhận, Dịch Mã, Đào Hoa)",
    source: "Tử Bình — Phần I.4",
    content:
      "Trường sinh → Mộc dục → Quan đới → Lâm quan (Lộc) → Đế vượng (Nhận) → Suy → Bệnh → Tử → Mộ (Khố) " +
      "→ Tuyệt → Thai → Dưỡng. Lộc Thần = cung Lâm quan của Nhật can; Dương Nhận = cung Đế vượng (chỉ can Dương).",
  },
  {
    id: "tubinh-thien-can-hop",
    tags: ["thiên can", "ngũ hợp", "hợp hóa", "tương khắc", "can hợp", "quan hệ"],
    title: "Thiên Can: Ngũ hợp & Sinh khắc",
    source: "Tử Bình — Phần I.5",
    content:
      "Ngũ hợp (hợp hóa): Giáp+Kỷ→Thổ · Ất+Canh→Kim · Bính+Tân→Thủy · Đinh+Nhâm→Mộc · Mậu+Quý→Hỏa. " +
      "Hợp hóa CHỈ thành khi đắc nguyệt lệnh của hành hóa & không bị xung phá. Hợp mà không hóa → can bị 'trói', " +
      "giảm tác dụng. Tương khắc theo ngũ hành (Giáp khắc Mậu, Bính khắc Canh...).",
  },
  {
    id: "tubinh-dia-chi-hop-hoi",
    tags: ["địa chi", "tam hợp", "tam hội", "lục hợp", "bán hợp", "hợp cục", "quan hệ", "tam phương"],
    title: "Địa Chi: Hợp – Hội – Bán hợp",
    source: "Tử Bình — Phần I.6",
    content:
      "Tam Hợp cục: Thân-Tý-Thìn→Thủy · Hợi-Mão-Mùi→Mộc · Dần-Ngọ-Tuất→Hỏa · Tỵ-Dậu-Sửu→Kim. " +
      "Tam Hội phương (mạnh nhất): Dần-Mão-Thìn→Mộc · Tỵ-Ngọ-Mùi→Hỏa · Thân-Dậu-Tuất→Kim · Hợi-Tý-Sửu→Thủy. " +
      "Lục Hợp: Tý-Sửu · Dần-Hợi · Mão-Tuất · Thìn-Dậu · Tỵ-Thân · Ngọ-Mùi. Bán hợp: 2/3 chi tam hợp có chi giữa " +
      "(Tý/Ngọ/Mão/Dậu). Ưu tiên: Hội > Hợp ≈ Xung > Hình > Hại. Hợp có thể 'giải' Xung; Xung có thể 'phá' Hợp.",
  },

  // ---------------- PHẦN II — THẬP THẦN THEO TRỤ ----------------
  {
    id: "tubinh-thapthan-tai",
    tags: ["chính tài", "thiên tài", "tài tinh", "thập thần", "tiền bạc", "vợ", "kinh doanh", "cha"],
    title: "Chính Tài & Thiên Tài theo từng trụ",
    source: "Tử Bình — Phần II",
    content:
      "Chính Tài (tiền ổn định, vợ chính thức): Niên→nền tảng kinh tế tốt, tổ nghiệp; Nguyệt→thực tế, tiết kiệm, " +
      "giỏi quản lý tài chính; Nhật chi→nam lấy vợ hiền mang tài lộc; Thời→hậu vận giàu, tích lũy tài sản. " +
      "Thiên Tài (tài bất ngờ, kinh doanh, cha, người tình): Niên→cha nắm quyền, duyên tiền từ nhỏ; " +
      "Nguyệt→NHẠY BÉN kinh tế, hào phóng, hợp kinh doanh mạo hiểm; Nhật chi→nam dễ đa tình; Thời→giàu bất ngờ về già. " +
      "Lưu ý: chỉ ứng nghiệm rõ khi là Hỷ thần; nếu Kỵ thì đảo ngược.",
  },
  {
    id: "tubinh-thapthan-quan-sat",
    tags: ["chính quan", "thất sát", "thiên quan", "quan sát", "thập thần", "sự nghiệp", "quyền lực", "chồng", "tai nạn"],
    title: "Chính Quan & Thất Sát theo từng trụ",
    source: "Tử Bình — Phần II",
    content:
      "Chính Quan (danh dự, pháp luật, quản lý; con gái với nam, chồng với nữ): Niên→con trưởng, gia phong nghiêm; " +
      "Nguyệt→chính trực, liêm khiết, thăng quan sớm; Nhật chi→bạn đời có học thức; Thời→con thành đạt, uy tín lớn. " +
      "Thất Sát/Thiên Quan (quyền lực, bạo lực, tai nạn; con trai với nam, tình nhân với nữ): Niên→nhỏ đa bệnh, có sẹo; " +
      "Nguyệt→mạnh mẽ quyết đoán nhưng cực đoan, hợp võ chức (công an/quân đội/y phẫu thuật); Nhật chi→vợ chồng dễ bất hòa; " +
      "Thời→nếu Thất Sát CÓ Thực Thần chế hóa thành công → hậu vận đại phú đại quý, nắm đại quyền. " +
      "Cảnh báo: 'Thất Sát→tai nạn/đoản thọ' CHỈ đúng khi Sát vượng công thân, thân nhược vô chế.",
  },
  {
    id: "tubinh-thapthan-an",
    tags: ["chính ấn", "thiên ấn", "kiêu thần", "ấn tinh", "thập thần", "học vấn", "mẹ", "quý nhân", "tâm linh"],
    title: "Chính Ấn & Thiên Ấn (Kiêu) theo từng trụ",
    source: "Tử Bình — Phần II",
    content:
      "Chính Ấn (học thức, che chở, danh dự, mẹ): Niên→dòng dõi thư hương, thông minh học giỏi; Nguyệt→nhân hậu, tài hoa, " +
      "ít sóng gió, có quý nhân, mẹ ảnh hưởng lớn; Nhật chi→trọng tinh thần, bạn đời chu đáo; Thời→hậu vận an nhàn, con hiếu. " +
      "Thiên Ấn/Kiêu Thần (tâm linh, nghệ thuật độc đáo, cô độc, mẹ kế): Niên→thiếu tình mẹ, sức khỏe niên thiếu kém; " +
      "Nguyệt→cô độc, lập dị, nhạy cảm cao, khiếu triết học/tâm linh/chiêm tinh/nghệ thuật đặc thù; " +
      "Nhật chi→vợ chồng lạnh nhạt, đa nghi; Thời→cuối đời cô quạnh, khó phát nếu theo công chức truyền thống.",
  },
  {
    id: "tubinh-thapthan-thuc-thuong",
    tags: ["thực thần", "thương quan", "thực thương", "thập thần", "tài năng", "sáng tạo", "con cái", "thị phi"],
    title: "Thực Thần & Thương Quan theo từng trụ",
    source: "Tử Bình — Phần II",
    content:
      "Thực Thần (phúc khí, tuổi thọ, tài hoa ôn hòa, con cái với nữ): Niên→hưởng lộc tổ; Nguyệt→ôn hòa bao dung, " +
      "hợp dịch vụ/ẩm thực/nghệ thuật, tiền tự đến; Nhật chi→bạn đời đầy đặn, hiền lành; Thời→phúc lộc dồi dào, sống thọ. " +
      "Thương Quan (kiêu ngạo, sáng tạo đột phá, thị phi, khắc Quan): Niên→khắc tổ nghiệp, ly hương lập nghiệp sớm; " +
      "Nguyệt→tài hoa phát tiết, kiêu ngạo, dễ đắc tội cấp trên → thị phi công sở; Nhật chi→hôn nhân bất ổn lớn; " +
      "Thời→con thông minh nhưng bướng. Cảnh báo: 'Nữ mệnh Nhật chi Thương Quan→ly hôn' CHỈ đúng khi Thương Quan là Kỵ, vô chế; " +
      "nếu được Tài hóa hoặc Ấn chế → ngược lại có thể vượng phu ích tử.",
  },
  {
    id: "tubinh-thapthan-ty-kiep",
    tags: ["tỷ kiên", "kiếp tài", "tỷ kiếp", "thập thần", "anh em", "cạnh tranh", "hợp tác", "hao tài"],
    title: "Tỷ Kiên & Kiếp Tài theo từng trụ",
    source: "Tử Bình — Phần II",
    content:
      "Tỷ Kiên (tự tin, tự lập, bạn bè, anh em đồng giới): Niên→anh em đông/cạnh tranh từ nhỏ, phải tự lực; " +
      "Nguyệt→độc lập tự chủ, chi tiêu lớn, hợp tự khởi nghiệp; Nhật chi→khắc bạn đời, dễ bị người thứ ba chen; " +
      "Thời→cuối đời độc lập, không dựa con. " +
      "Kiếp Tài (cướp đoạt, liều lĩnh, hao tài, anh em khác giới): Niên→gia đạo dễ biến cố hao tài; " +
      "Nguyệt→cực khó tụ tài, tiền vào tay trái ra tay phải, dễ bị bạn bè lừa; Nhật chi→tranh cãi với bạn đời; " +
      "Thời→dễ bị con phá tài hoặc đầu tư mạo hiểm trắng tay. " +
      "Cảnh báo: khi THÂN NHƯỢC, Tỷ Kiếp/Kiếp Tài lại là CỨU TINH (trợ thân), không phải xấu.",
  },

  // ---------------- PHẦN III — DỤNG THẦN ----------------
  {
    id: "tubinh-dung-than",
    tags: ["dụng thần", "phù ức", "điều hậu", "thông quan", "chuyên vượng", "hỷ kỵ", "thân vượng", "thân nhược"],
    title: "Quy tắc luận Dụng thần (4 phép)",
    source: "Tử Bình — Phần III",
    content:
      "Dụng thần = ngũ hành sửa khuyết điểm toàn cục. (1) Phù ức: Thân nhược → dùng Ấn (sinh) hoặc Tỷ Kiếp (trợ); " +
      "Thân vượng → dùng Thực Thương (tiết), Tài (hao), hoặc Quan Sát (khắc). " +
      "(2) Điều hậu (ưu tiên hàng đầu khi sinh mùa quá lạnh/nóng): mùa Đông (Hợi/Tý/Sửu) → lấy Hỏa sưởi; " +
      "mùa Hè (Tỵ/Ngọ/Mùi) → lấy Thủy điều hòa. (3) Thông quan: hai thế lực ngang ngửa → dùng hành trung gian " +
      "(Kim chiến Mộc → dùng Thủy; Mộc chiến Thổ → dùng Hỏa). (4) Chuyên vượng: một hành chiếm ~80% → TUYỆT ĐỐI không " +
      "dùng hành khắc (phạm 'vách tường' → sụp), phải thuận thế (lấy chính hành đó hoặc hành sinh ra nó).",
  },

  // ---------------- PHẦN IV — THẦN SÁT ----------------
  {
    id: "tubinh-than-sat",
    tags: ["thần sát", "thiên ất quý nhân", "đào hoa", "dịch mã", "dương nhận", "lộc thần", "tuần không", "không vong"],
    title: "6 Thần Sát cốt lõi",
    source: "Tử Bình — Phần IV",
    content:
      "Thiên Ất Quý Nhân: đệ nhất cát thần — hoạn nạn có người cứu, hóa nguy thành an, thông minh tướng mạo uy nghi. " +
      "Đào Hoa: sức hút giới tính, duyên ăn nói, nghệ thuật — Hỷ: nổi tiếng; Kỵ: phong lưu, ngoại tình, tai tiếng sắc dục. " +
      "Dịch Mã: dịch chuyển, biến động, xuất ngoại, đổi việc — thân vượng mang Mã: đi xa phát tài; gặp Xung: bôn ba vất vả. " +
      "Dương Nhận: dao hai lưỡi — can trường dũng cảm nhưng bạo lực; thân nhược: hộ thân tốt; thân vượng: tai nạn máu me, " +
      "phẫu thuật, hình khắc bạn đời. Lộc Thần: bổng lộc, tài lộc tự thân, sức khỏe ổn; Kỵ bị Xung (Phá Lộc): đột ngột tán tài. " +
      "Tuần Không/Không Vong: làm trống rỗng vị trí — cát thần lâm Không giảm cát, hung thần lâm Không giảm hung; " +
      "Tài lâm Không: khó tụ tài; Quan lâm Không: quan lộ trắc trở, hư danh. " +
      "QUAN TRỌNG: luận Thần Sát SAU khi đã định Hỷ-Kỵ; Thần Sát chỉ 'gia/giảm màu sắc', cốt lõi là Vượng-Nhược + Dụng thần.",
  },

  // ---------------- PHẦN V — CÁCH CỤC ----------------
  {
    id: "tubinh-cach-cuc",
    tags: ["cách cục", "chính quan cách", "thất sát cách", "thực thần cách", "tài cách", "ấn cách", "tòng cách", "định cách"],
    title: "Cách cục Tứ Trụ phổ biến",
    source: "Tử Bình — Phần V",
    content:
      "Định cách: bản khí chi tháng thấu lên thiên can. Chính Quan cách: chính trực, coi trọng quy chế, cần Tài sinh Quan + Ấn hộ; " +
      "kỵ Thương Quan (chỉ khi Quan là Dụng). Thất Sát cách: chí lớn dũng cảm, BẮT BUỘC có Thực Thần chế Sát hoặc Ấn hóa Sát; " +
      "Sát vượng thân nhược vô chế → nghèo khổ, thương tật. Thực Thần cách: ôn hòa an nhàn, phúc lộc, cần Tài thông phát; " +
      "kỵ Thiên Ấn (Kiêu đoạt thực). Tài cách: nhạy bén kinh tế, THÂN PHẢI VƯỢNG mới gánh được Tài (thân vượng tài vượng→đại phú); " +
      "thân nhược gặp Tài cách = 'Phú ốc bần nhân'. Ấn cách: thích học hành nghiên cứu nhưng dễ thụ động, cần Quan Sát sinh trợ; " +
      "kỵ Tài quá mạnh phá Ấn (Tài hoại Ấn). Tòng cách (biến cách): Nhật chủ hoàn toàn không gốc → 'tòng' theo thế lực mạnh nhất; " +
      "gặp vận sinh trợ Nhật chủ lại hóa đại hung.",
  },

  // ---------------- PHẦN VI — QUAN HỆ CAN-CHI ----------------
  {
    id: "tubinh-xung-hinh-hai",
    tags: ["xung", "hình", "hại", "hợp", "lục xung", "tam hình", "tự hình", "lục hại", "quan hệ", "xung chiếu", "sự kiện"],
    title: "Quan hệ Can-Chi: biểu hiện hành vi & sự kiện",
    source: "Tử Bình — Phần VI",
    content:
      "Hợp: kết nối, thỏa hiệp, nhân duyên tốt; hợp hóa Dụng thần→cát, hợp hóa Kỵ→bị trói/sa ngã; hợp quá nhiều→nhu nhược. " +
      "Xung: Tý-Ngọ/Mão-Dậu (xung Khí: cảm xúc bồn chồn, thị phi tình ái); Dần-Thân/Tỵ-Hợi (xung Chiến: tai nạn xe cộ, đổi chỗ ở, " +
      "bôn ba); Thìn-Tuất/Sửu-Mùi (xung Thổ: đất đai, BĐS, tiêu hóa — đôi khi LẠI TỐT vì 'mở kho'). " +
      "Hình: Dần-Tỵ-Thân (vô ơn: bị phản bội, tai nạn giao thông, tranh chấp pháp lý do tin người); Sửu-Tuất-Mùi (cậy thế: " +
      "quá tự tin→thất bại, tranh chấp đất, kiện tụng); Tý-Mão (vô lễ: scandal tình dục, tổn thương tình cảm gia đình); " +
      "Tự hình (Thìn-Thìn/Ngọ-Ngọ/Dậu-Dậu/Hợi-Hợi): tự làm khổ mình, trầm cảm, tự hủy cơ hội. " +
      "Hại: không tai nạn trực diện như Xung nhưng mệt mỏi âm ỉ — phản bội sau lưng, tiểu nhân, rạn nứt tình cảm khó hàn gắn.",
  },

  // ---------------- PHẦN VII — NẠP ÂM & ĐẮC/THẤT THẾ ----------------
  {
    id: "tubinh-nap-am-dac-that",
    tags: ["nạp âm", "đắc thế", "thất thế", "hỷ kỵ", "thập thần", "kiếp tài", "thương quan", "kiêu thần"],
    title: "Nạp Âm & Thập Thần Đắc/Thất thế (Hỷ/Kỵ)",
    source: "Tử Bình — Phần VII",
    content:
      "Nạp Âm bổ túc bản chất cốt lõi của cặp Can-Chi (vd Kiếm Phong Kim mang tính sát phạt cần Hỏa luyện; Hải Trung Kim ẩn " +
      "tàng cần Thủy thanh lọc, kỵ Hỏa). NGUYÊN TẮC XUYÊN SUỐT — một Thập Thần tốt-xấu PHỤ THUỘC HOÀN TOÀN vào Hỷ hay Kỵ: " +
      "Kiếp Tài đắc thế (Hỷ): dũng cảm, khí phách, đoạt tài từ đối thủ tạo đại nghiệp; thất thế (Kỵ): bạo lực, phá sản, nợ nần. " +
      "Thương Quan đắc thế (Hỷ): sáng tạo vượt bậc, thiên tài công nghệ/nghệ thuật, hùng biện; thất thế (Kỵ): ngạo mạn vô lễ, " +
      "lời cay độc gây họa, kiện tụng, nữ khắc chồng. (Suy rộng cho mọi Thập Thần khác cùng nguyên tắc.)",
  },

  // ---------------- PHẦN VIII — ĐẠI VẬN & LƯU NIÊN ----------------
  {
    id: "tubinh-dai-van-luu-nien",
    tags: ["đại vận", "lưu niên", "vận hạn", "thời gian", "hỷ dụng", "kỵ thần", "tuế vận"],
    title: "Đại Vận & Lưu Niên (luận động theo thời gian)",
    source: "Tử Bình — Phần VIII",
    content:
      "Đại vận: mỗi 10 năm một trụ. Nam dương niên/nữ âm niên → đi thuận; Nam âm niên/nữ dương niên → đi nghịch, tính từ Nguyệt trụ. " +
      "NGUYÊN TẮC VÀNG: Bản mệnh định 'giàu nghèo sang hèn' (tiềm năng); Đại vận + Lưu niên định 'lúc nào phát, lúc nào họa'. " +
      "Vận vào Hỷ-Dụng → phát; vào Kỵ thần → trắc trở. Lưu niên: xét tương tác Lưu niên ↔ Đại vận ↔ Bản mệnh, " +
      "đặc biệt Tuế-Vận xung/hợp với Nhật chủ và Dụng thần.",
  },

  // ---------------- PHẦN IX–X — TRÌNH TỰ & NGUYÊN TẮC ----------------
  {
    id: "tubinh-trinh-tu-nguyen-tac",
    tags: ["trình tự luận", "nguyên tắc", "phương pháp", "hỷ kỵ", "thân vượng", "tài đa thân nhược", "thương quan kiến quan", "điều hậu"],
    title: "Trình tự luận giải & Nguyên tắc kinh nghiệm",
    source: "Tử Bình — Phần IX & X",
    content:
      "Trình tự 7 bước: (1) Lập tứ trụ + tàng can + thập thần; (2) Xét Vượng-Nhược; (3) Định Cách cục; (4) Chọn Dụng thần " +
      "(Điều hậu ưu tiên nếu mùa quá nóng/lạnh, rồi mới Phù ức); (5) Định Hỷ-Kỵ thần → TỪ ĐÂY mới biết Thập Thần/Thần Sát cát hay hung; " +
      "(6) Xét quan hệ Can-Chi; (7) Lồng Đại vận + Lưu niên. SAI LẦM phổ biến: luận Thần Sát TRƯỚC khi định Hỷ-Kỵ. " +
      "Kim chỉ nam: 'Thân vượng hỷ Tài-Quan-Thực Thương; Thân nhược hỷ Ấn-Tỷ Kiếp.' " +
      "'Thương Quan kiến Quan' chỉ là họa khi Quan là Dụng. 'Tài đa thân nhược' = Phú ốc bần nhân → cần Tỷ Kiếp/Ấn trợ thân. " +
      "Khố/Mộ (Thìn-Tuất-Sửu-Mùi) cần xung/hình mới 'mở khố' → xung Thổ đôi khi tốt. Điều hậu thắng Phù ức trong cục cực đoan.",
  },
];
