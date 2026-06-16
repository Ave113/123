// Module tri thức ĐÀM TINH — cô đọng tính chất 14 chính tinh.
//
// NGUỒN: trích & tóm lược trung thực từ bộ 《王亭之談星》 (Vương Đình Chi - Đàm Tinh),
// thuộc Trung Châu Phái (中州派). Nội dung được cô đọng từ nguyên văn tiếng Trung trong
// file `vuongdinhchidamtinh.txt`, KHÔNG dịch máy thô, giữ đúng thuật ngữ Tử Vi.
//
// LƯU Ý: đây là tài liệu tham khảo TÍNH CHẤT (tinh tình) của sao, dùng để luận SÂU,
// KHÔNG phải để liệt kê khô khan. Luận vẫn phải bám đúng các sao thực có trên lá số.
// Phạm vi: 14 chính tinh (giai đoạn 1). Phụ/tá/sát/hóa diệu sẽ bổ sung sau.

export interface DamTinhEntry {
  star: string; // Tên sao chuẩn tiếng Việt (khớp dữ liệu iztro vi-VN)
  han: string;  // Tên chữ Hán để truy nguồn
  tinhTinh: string; // Tóm lược tính chất trung thực từ Đàm Tinh
}

export const DAM_TINH: Record<string, DamTinhEntry> = {
  "Tử Vi": {
    star: "Tử Vi", han: "紫微",
    tinhTinh: "Âm thổ, chủ tinh Bắc Đẩu, khí chất đế tọa. Cốt lõi: phải có bách quan triều củng (Tả Hữu, Xương Khúc, Khôi Việt, Phủ Tướng hội chiếu) mới thành cách quý; thiếu phụ tá thì thành cô quân (in dã, tiểu nhân tại vị), việc khó thành. Tử Vi tại Tý/Ngọ được Phủ Tướng triều viên, riêng Ngọ là cách Cực hướng ly minh rất đẹp. Nhược điểm lớn nhất là chủ quan và ân oán quá rõ ràng; Tử Vi+Phá Quân thể hiện rõ tính này, dễ phản nghịch, dễ bất hòa. Gặp Kình/Hỏa/Linh mà không có cát diệu thì tầm thường, hạ cách. Tử Vi chế được Hỏa Linh, hóa được Thất Sát thành quyền."
  },
  "Thiên Cơ": {
    star: "Thiên Cơ", han: "天機",
    tinhTinh: "Hóa khí là thiện, là sao mưu lược (thiện toán), trí biến linh hoạt — dùng vào chính đạo thì hay, vào tà đạo thành mưu mô xảo trá. Rất nhạy với phụ/tá/sát/hóa: gặp cát thì thiện, gặp sát thì ác. Thiên Cơ là mưu thần, thiếu sức lãnh đạo, hợp làm tham mưu/kế hoạch hơn là cầm đầu. Cách Cơ Nguyệt Đồng Lương: giỏi mưu lược, khéo ngoại giao, hợp việc hành chính/kế hoạch trong tổ chức, không hợp tự kinh doanh; mặt xấu là hay so đo, thích loạng quyền trong phạm vi quyền lực của mình. Cơ+Thái Âm: bản chất phiêu động, hợp kế hoạch tài chính; hóa Lộc dễ lao tâm bất an, tình cảm không chuyên nhất."
  },
  "Thái Dương": {
    star: "Thái Dương", han: "太陽",
    tinhTinh: "Bản chất thi nhi bất thụ (cho đi mà không nhận lại), từ đó sinh từ ái lượng khoán đại. Chủ quý hơn chủ phú — luận Thái Dương thủ mệnh phải nhìn địa vị xã hội, tài vật đi theo địa vị. Hợp nghề phục vụ: bác sĩ, luật sư, công tác xã hội, truyền thông. Hai nguyên tắc đọc: (1) miếu/hãm theo cung — Dần Mão Thìn Tỵ Ngọ Mùi là có ánh sáng, Thân Dậu Tuất Hợi Tý Sửu là mất ánh sáng; (2) sinh ban ngày hay đêm. Thái Dương tại Mão = Nhật chiếu lôi môn rất đẹp. Kỵ nhất Hóa Kỵ: nữ mệnh bất lợi nam thân, hay bị bỏ dở tình cảm, không nên kết hôn sớm. Đương số có Thái Dương sáng thường vất vả vì người (động là phục vụ, khác Thái Âm động là cầu tư lợi)."
  },
  "Vũ Khúc": {
    star: "Vũ Khúc", han: "武曲",
    tinhTinh: "Tài tinh thuộc Kim, là hành động cầu tài (khác Thái Âm là ý niệm cầu tài, Thiên Phủ là năng lực quản tài). Tính cương, quyết đoán, không do dự; tâm trực vô độc. Cổ nhân gọi là quả tú vì tính quá cương, nữ mệnh dễ cô khắc/lấn chồng (quan niệm cổ, nay không còn đúng hoàn toàn). Rất sợ Hỏa/Linh đồng cung: nhân tài bị kiếp / nhân tài họa — vì tiền mà sinh tai. Không nên Hóa Kỵ (gặp sát thêm thì tai bệnh, ý ngoại). Vũ Khúc+Thiên Phủ tại Tý/Ngọ: cách phú kinh doanh nếu có cát. Vũ+Tham (Sửu/Mùi): phát muộn (vũ tham bất phát thiếu niên), gặp Hỏa/Linh có thể phú quý nhưng trước khổ sau sướng. Cảnh giác cách Linh Xương Đà Vũ tại Thìn/Tuất — chủ tổn thất/ý ngoại lớn."
  },
  "Thiên Đồng": {
    star: "Thiên Đồng", han: "天同",
    tinhTinh: "Phúc tinh, chủ chuyển họa thành phúc — phải có bất lợi ban đầu rồi hóa thành cát mới gọi là phúc. Chủ tình cảm và ý chí. Thích cát nhưng trong hoàn cảnh phù hợp lại thích một chút sát để kích phát (Thiên Đồng được kích phát thành tựu lớn hơn) — ví dụ cách Mã đầu đới tiễn (Đồng+Kình tại Ngọ) và Tuất cung phản bội. Rất thích đồng/điệp Lộc. Nhưng về tình cảm, Đồng được Lộc quá nặng lại dễ sinh phiền não ái tình; Đồng+Cự Môn dễ có tình yêu đau khổ trong lòng. Ý chí dễ bạc nhược khi gặp Thái Âm, cần cẩn thận Hỏa/Linh kích động."
  },
  "Liêm Trinh": {
    star: "Liêm Trinh", han: "廉貞",
    tinhTinh: "Cát hung vô định: gặp cát thì địa vị cao (lợi chính giới), gặp hung sát thì chủ tai họa dây dưa, đặc biệt nông huyết chi tai (máu me). Hóa khí là tù. Bản chất cốt lõi là TÌNH CẢM (thứ đào hoa) — tốt thì tình cảm hòa hợp, xấu thì tình cảm đổ vỡ; nữ mệnh biến động lớn hơn nam. Rất thích Hóa Lộc (phú quý), rất kỵ Hóa Kỵ (huyết quang chi tai; nữ chửa đẻ trong năm đó có thể hóa giải). Có Liêm Trinh thanh bạch (hợp Lộc) chủ thủy chung. Liêm+Thất Sát thành Hùng túc càn nguyên — đại khí vãn thành. Liêm+Thiên Phủ (Thìn/Tuất) thì nội tâm khoáng hậu; Liêm+Thiên Tướng được Tướng chế bớt cái ác. Cảnh giác Liêm hãm+Hóa Kỵ: tai giao thông, bệnh."
  },
  "Thiên Phủ": {
    star: "Thiên Phủ", han: "天府",
    tinhTinh: "Chủ tinh Nam Đẩu, có tài lãnh đạo nhưng chỉ phát huy trong cục diện có sẵn (không khai sáng như Tử Vi), bù lại ít chủ quan, dễ nghe ý người. Là kho tài (tài khố) — bản chất TÀNG (cất giữ), cẩn thận trọng, ôn hòa khiêm cung. PHẢI có Lộc kho mới đầy; thiếu Lộc gặp sát/Không Kiếp thành kho trống hoặc kho lộ — không tốt. Gặp Hỏa Linh Đà Kình dễ hiềm trá (kho thiếu nên phải xảo quyệt). Thích Tả Hữu Xương Khúc; Trung Châu Phái cho Thiên Phủ hóa Khoa (chủ tín dụng/danh dự tài chính), không hóa Lộc/Quyền/Kỵ. Nguyên tắc: phùng Phủ xem Tướng — phải xem Thiên Tướng đi kèm tốt/xấu mới đoán đúng Thiên Phủ."
  },
  "Thái Âm": {
    star: "Thái Âm", han: "太陰",
    tinhTinh: "Đánh giá phải xét 3 mặt: miếu/hãm theo cung; sinh ban ngày hay đêm; sinh thượng huyền (mồng 1-15, trăng tỏ dần, cát) hay hạ huyền (16-30, trăng khuyết dần, kém). Miếu nhất tại Hợi (Nguyệt lãng thiên môn), tốt ở Hợi Tý Sửu, hãm ở Tỵ Ngọ Mùi. Chủ tình cảm, thông minh tuấn tú, nữ mệnh dung nhan đẹp; nhưng dễ cảm tính, bị tình cảm chi phối. Nguyên tắc phùng Nguyệt xem Nhật: Thái Âm vô quang, phải nhờ Thái Dương chiếu; Thái Dương xấu thì phản chiếu cái xấu sang Thái Âm. Cách Minh châu xuất hải (mệnh Mùi vô chính diệu, hội Thái Âm Hợi + Thái Dương Thiên Lương Mão) chủ khoa giáp hiển đạt. Phá cách khi Nhật hoặc Nguyệt Hóa Kỵ gặp sát: nhiều thị phi, tình cảm lỡ dở."
  },
  "Tham Lang": {
    star: "Tham Lang", han: "貪狼",
    tinhTinh: "Được gọi Bắc Đẩu giải ách chi thần — giải ách nhờ tài giao tế ứng xử (bát diện linh lung), và chủ trường thọ, thích tu luyện/tôn giáo. Bản chất: vật dục & tình dục mạnh (hóa khí đào hoa). Thích ở tứ mộ (Thìn Tuất Sửu Mùi), KHÔNG thích tứ vượng (Tý Ngọ Mão Dậu) vì vật dục càng nặng. Tham+Vũ Khúc/Liêm Trinh đồng độ hoặc hội thì là điều kiện cơ bản của xảo nghệ (tài khéo tay/kỹ thuật). Rất kỵ đồng Văn Xương Văn Khúc (đa hư thiếu thực, nữ thông minh mà bạc mệnh). Tham+Kình/Đà: phiếm thủy đào hoa (Tý Hợi) hay phong lưu thái trượng (Dần) — chủ vì sắc sinh họa. Tham+Hỏa/Linh = Hỏa Tham/Linh Tham chủ đột phát phú quý. Hóa Lộc chủ phú, Hóa Quyền chủ quý, tốt nhất khi có Hỏa Linh."
  },
  "Cự Môn": {
    star: "Cự Môn", han: "巨門",
    tinhTinh: "Ám diệu — không phải bản thân vô quang, mà giỏi che lấp ánh sáng sao khác, hiểu như vật cản lớn. Chỉ Thái Dương miếu vượng mới không sợ Cự Môn. Mặt xấu nhất là nhân tế: diện thị bối phi, lục thân quả hợp; giao nhân sơ thiện chung ác; sao cô độc, khắc bóc. Hóa Lộc/Quyền/Kỵ nhưng KHÔNG hóa Khoa. Hóa Kỵ: thị phi khẩu thiệt, nỗi khổ khó nói, kiện tụng. Hóa Lộc: lấy miệng sinh tài (truyền thông), nhưng dễ miệng ngọt thiếu thực tâm. Hóa Quyền: việc thoạt nhìn như hung mà thành cát. Cách Thạch trung ẩn ngọc (Cự Môn Tý/Ngọ, gặp Lộc Quyền Khoa) chủ phú quý nhưng nên ẩn không nên lộ. Cơ Cự (Mão/Dậu): động động, đa hứng thú, thiếu kiên trì; rất kỵ Hỏa Linh."
  },
  "Thiên Tướng": {
    star: "Thiên Tướng", han: "天相",
    tinhTinh: "Ví như quan nắm ấn (chưởng ấn), thiếu sức lãnh đạo nhưng có sức phò tá, hợp làm chủ quản hành chính. Bản thân thiện/ác không cố định, TÙY sao hội hợp mà định: hội cát thì thiện, hội hung thì ác (không được cô lập một mình Thiên Tướng để luận tính cách). Quan hệ mật thiết với Tử Vi/Vũ Khúc/Liêm Trinh. Nguyên tắc Trung Châu: xem Tử Vi hội để đoán cái QUÝ của Tướng, xem Thiên Phủ hội để đoán cái PHÚ của Tướng (phùng Tướng xem Phủ). Hai cách tối quan trọng: Tài Ấm giáp ấn (Cự Môn Hóa Lộc + Thiên Lương giáp) chủ được trợ lực/ấm sủng mà phú quý; và Hình Kỵ giáp ấn (Cự Môn Hóa Kỵ giáp, hoặc Kình Đà giáp) chủ chịu áp lực, hình thương khắc hại. Kỵ Hỏa Linh."
  },
  "Thiên Lương": {
    star: "Thiên Lương", han: "天梁",
    tinhTinh: "Nam Đẩu tư thọ chi tinh, chủ phùng hung hóa cát, tiêu tai giải ách (ấm tinh). Nhưng muốn thấy khả năng giải ách thì phải CÓ tai ách trước — nên Thiên Lương thủ mệnh đời nhiều tai nạn (nhất là thơ ấu), rồi mới nguy mà hóa an. Không thích ở Tỵ Ngọ Mùi (Thái Dương hội bị hãm, không giải được tính cô khắc hình kỵ). Có phong thái danh sĩ, hiện đại là chuyên gia, hợp chức giám sát/quản lý/kế hoạch. Gặp Xương Khúc Khôi Việt Tả Hữu thì thanh quý. Gặp sát kỵ hình hao thì hóa phong lưu lãng đãng. Thiên Lương+Âm Sát/Linh có thể chủ nhạy cảm tâm linh. Cơ Lương (Thìn/Tuất) — sở thích rộng, thích khoe tài, nói hay mà ít làm. Thiên Lương cũng chủ truyền thông khi mang sắc văn diệu."
  },
  "Thất Sát": {
    star: "Thất Sát", han: "七殺",
    tinhTinh: "Ác diệu: mệnh Thất Sát dù cách tốt đến đâu, đời vẫn từng trải một giai đoạn hung nguy (nhị cung phùng chi định lịch gian tân). Cần xem kỹ tốt xấu từng đại vận; vận tốt đến sớm quá thì phòng giữa/cuối đời trắc trở. Rất kỵ ở Mão/Dậu (Vũ Khúc Thất Sát — sát hãm chấn đoài), dễ hung tai, hợp là tha hương. Rất thích Tử Vi (hóa sát vi quyền), hoặc đối Tử Phủ (Thất Sát triều đẩu) chủ uy quyền. Đã hóa quyền thì KHÔNG thích Xương Khúc Long Trì Phượng Các (văn võ bất đầu). Cách cao thường ở Dần Thân Ngọ Mùi, cần có Lộc mới quý; chủ QUÝ hơn PHÚ (địa vị quyết định tài sản). Phúc đức cung có văn diệu thì bớt lận đận. Nữ mệnh cương, cần xem sát/đào hoa."
  },
  "Phá Quân": {
    star: "Phá Quân", han: "破軍",
    tinhTinh: "Cổ nhân nhiều lời chê (bạo, xảo trá, quả hợp, hại lục thân) nhưng đó chỉ là một mặt. Bản chất là khử cũ đổi mới, phá hoại đi kèm khai sáng. Rất thích được Lộc (Lộc Tồn hoặc Hóa Lộc) hoặc Hóa Quyền thì bù khuyết điểm, thành thượng cách (Giáp sinh Phá Quân hóa Quyền, Quý sinh hóa Lộc). Nhưng cẩn thận Phá Quân gặp Tham Lang Hóa Lộc + Thiên Mã thành bại cục (nam đa lãng đãng nữ đa dâm), vì bản thân đã thiên biến động cộng thêm Mã càng bất an — hóa giải là mưu định nhi hậu động. Kỵ hãm (Mão/Dậu — Liêm Phá, Dậu hung hơn; Dần/Thân đối Vũ Tướng). Tử Phá (Sửu/Mùi) hoặc đối Tử Tướng thì phá hoại mạnh, phát rồi dễ bại, cần biết dừng đúng lúc. KHÔNG thích Văn Xương Văn Khúc (nhất sinh bần sĩ), trừ Phá ở Mão gặp Xương Hóa Khoa là phản cách. Phá+Văn Khúc Hóa Kỵ tại Hợi Tý Sửu (thủy vực) chủ tai — ám diệu thực chỉ Văn Khúc hóa kỵ."
  }
};

/**
 * Lọc tri thức Đàm Tinh cho ĐÚNG các sao xuất hiện trên lá số.
 * Trả về chuỗi đã định dạng để chèn vào prompt; KHÔNG nhồi toàn bộ file.
 */
export function getDamTinhForStars(starNames: string[]): string {
  const seen = new Set<string>();
  const blocks: string[] = [];
  for (const raw of starNames) {
    const name = String(raw || "").trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const entry = DAM_TINH[name];
    if (entry) {
      blocks.push("  - " + entry.star + " (" + entry.han + "): " + entry.tinhTinh);
    }
  }
  return blocks.length > 0
    ? blocks.join("\n")
    : "  - Khong co chinh tinh nao khop du lieu Dam Tinh hien co.";
}
