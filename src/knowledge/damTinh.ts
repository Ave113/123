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

// ===== PHỤ/TÁ/SÁT/TẠP DIỆU (Giai đoạn 2) =====
// Tên sao tiếng Việt khớp dữ liệu iztro vi-VN (minorStars / adjectiveStars).
export const DAM_TINH_AUX: Record<string, DamTinhEntry> = {
  "Văn Xương": {
    star: "Văn Xương", han: "文昌",
    tinhTinh: "Chủ khoa giáp, chủ chính đồ xuất thân (đường khoa cử chính quy); chủ văn chương, văn tự. KHÔNG thích ở Dần Ngọ Tuất. Xương Khúc tề hội + Thiên Tài tại mệnh chủ trí tuệ hơn người. Một mình Văn Xương thì chủ thông minh nhưng chưa chắc lợi thi cử. Hợp Thái Dương Thiên Lương Lộc Tồn thành cách Dương Lương Xương Lộc — đại lợi thi cử cạnh tranh, thời nay là nghiên cứu học thuật. Văn Xương cũng có thể hóa đào hoa, nhất là khi đơn thủ không hội Văn Khúc; nữ mệnh kỵ Liêm/Tham (Xương Tham cư mệnh phấn cốt toái thi). Cách xấu nhất là Linh Xương Đà Vũ — hạn đến đầu hà (tai họa/ý ngoại)."
  },
  "Văn Khúc": {
    star: "Văn Khúc", han: "文曲",
    tinhTinh: "Cũng là sao khoa danh nhưng khác Văn Xương: Văn Xương chủ chính đồ, Văn Khúc chủ dị lộ công danh (thời nay là toán lý, kỹ thuật, công trình). Văn Xương chủ văn tự/văn chương, Văn Khúc chủ KHẨU TÀI (tài ăn nói); cũng chủ thuật số (Văn Khúc Thái Âm — cửu lưu thuật sĩ). Rất kỵ Hóa Kỵ — nhiều khi xấu hơn Văn Xương Hóa Kỵ (vd Tử Tham + Văn Khúc Hóa Kỵ tại Mão chủ phá gia vì cờ bạc). Văn Khúc Hóa Kỵ chính là 'ám diệu' mà cổ nhân nói. Cũng mang tính đào hoa khi hội đào hoa chư diệu; gặp Cự/Đồng mà không hội Xương thì hay có tình duyên đau khổ, nữ mệnh kỵ (thủy tính dương hoa)."
  },
  "Tả Phụ": {
    star: "Tả Phụ", han: "左輔",
    tinhTinh: "Sao trợ lực, nam thích Tả Phụ. Phải một sao thủ mệnh, một sao ở tam phương hội mới hiện rõ sức của Tả/Hữu thủ mệnh. Tả Phụ mang tính CHỦ ĐỘNG — mệnh gặp Tả Phụ thường được trợ lực chủ động. Nhưng quý ở tự lập: chính tinh mệnh phải hữu lực thì trợ lực mới là cẩm thượng thiêm hoa; phụ tá KHÔNG chủ tuyết trung tống thán (khác Khôi Việt). Trung Châu Phái: Tả Phụ chủ quý. Tả Hữu đồng cung chủ phi la y tử (đắc công danh). Tốt nhất khi một ở Quan, một ở Tài hội Mệnh; riêng Tử Phá thì THÍCH GIÁP hơn hội. Tả Hữu KHÔNG hóa Khoa (theo Trung Châu)."
  },
  "Hữu Bật": {
    star: "Hữu Bật", han: "右弼",
    tinhTinh: "Cùng tính chất Tả Phụ, nữ thích Hữu Bật. Trung Châu Phái: Hữu Bật chủ phú (Tả Phụ chủ quý); Tả Phụ chủ chính, Hữu Bật chủ phó — như Xương Khúc. Phu thê cung kỵ nhất ĐƠN KIẾN Tả hoặc Hữu (một sao đồng độ mà sao kia không hội tam phương): chủ người thứ ba xen vào, tình tay ba — cổ cho là bất lợi nữ mệnh, nay nam cũng vậy. Nữ mệnh Thiên Tướng + Hữu Bật cổ cho là 'đại bà mệnh' (chồng nạp thiếp). Tả Hữu kỵ Hỏa Linh đồng cung (nữ mệnh/phu thê — thiên phòng). Nếu một ở mệnh một ở phu thê gặp sát kỵ chủ hai lần hôn nhân."
  },
  "Thiên Khôi": {
    star: "Thiên Khôi", han: "天魁",
    tinhTinh: "Thiên Ất quý nhân (trú quý — quý ban ngày). Cổ cho chủ khoa danh, thời nay nên xem là CƠ HỘI, mà cơ hội này gắn với điển chương chế độ. Thiên Khôi chủ chính đồ xuất thân. Có cơ hội cần có trợ lực nên Khôi Việt thích hội Tả Hữu; hội Xương Khúc thì tính chất khác (Xương Khúc chủ thông minh văn chương, Khôi Việt chủ sức nâng đỡ đề bạt trên đường công danh). Thi cử xem Xương Khúc, xuất sĩ/thăng tiến xem Khôi Việt. Phải trùng điệp với lưu Khôi/lưu Việt của đại vận/lưu niên mới phát lực lớn. Khôi Việt giáp mệnh hoặc một ở mệnh một ở thân là cách đẹp. KHÔNG nhập Thìn Tuất (la võng). Sau 40 tuổi Khôi Việt có thể hóa đào hoa."
  },
  "Thiên Việt": {
    star: "Thiên Việt", han: "天鉞",
    tinhTinh: "Ngọc Đường quý nhân (dạ quý — quý ban đêm), cặp với Thiên Khôi. Thiên Khôi chủ chính đồ, Thiên Việt chủ dị lộ công danh. Thiên Việt phải phối hợp đúng độ với Thiên Khôi mới chủ chính đồ; nếu Thiên Việt đơn tinh thì lực không đủ, chỉ chủ cơ hội nhỏ. Khôi Việt một ở mệnh một ở phu thê (phu thê là thân cung) + tổ hợp tốt chủ thiếu niên đăng khoa, được vợ đẹp. Sửu/Mùi chỉ là vượng (không nhập miếu) — sau 40 tuổi gặp lại bị coi là 'quý nhân nhập mộ', dễ thành âm tiểu thương hại; gặp tứ sát chủ bệnh tật triền miên (Khôi Việt trùng phùng kiêm sát thấu, cố tật vưu đa)."
  },
  "Lộc Tồn": {
    star: "Lộc Tồn", han: "祿存",
    tinhTinh: "Nghĩa cơ bản là y lộc/tài phú. Lộc Tồn LUÔN bị Kình Dương và Đà La giáp hai bên — hàm ý: nơi tài phú tất có người nhòm ngó, kiếm tiền tất kèm thị phi và lao lực. Lộc Tồn độc thủ mệnh mà vô cát hóa thì chỉ là 'khán tài nô' (kẻ giữ của), nhỏ nhen, đa nghi, đề phòng tả hữu. Hợp thủ Thiên Di đối chiếu Mệnh hơn (Mệnh khỏi bị Kình Đà giáp), chủ y lộc phong phú, lợi thu nhập cố định (lương, tô, lãi). Mệnh gặp Lộc Mã (Lộc Tồn + Thiên Mã hội) chủ động mà sinh tài, đắc viễn phương chi tài. Thích đồng cung Tử Vi Thiên Tướng (quyền), Nhật Nguyệt (quang huy), Phủ Vũ (tài), Lương Đồng (phúc lộc ấm)."
  },
  "Thiên Mã": {
    star: "Thiên Mã", han: "天馬",
    tinhTinh: "Luôn ở Dần Thân Tỵ Hợi. Lộc Tồn/Hóa Lộc + Thiên Mã = Lộc Mã giao trì, chủ động mà sinh tài (đắc viễn phương chi tài). Rất thích đồng Xương Khúc (bớt lao nhọc), rất kỵ Hỏa Linh (suốt ngày bôn ba khổ cực). Phải xét Thiên Mã đồng cung sao nào: với Tràng Sinh chủ động bất tức (bôn ba không nghỉ); với Tuyệt thì động mà thiếu sinh khí, bị động mệt mỏi; với Thiên Vu gặp cát chủ thành tựu nơi xa. Đà La đồng cung = Chiết Túc Mã (ngựa gãy chân, trở ngại trì hoãn); Không diệu đồng cung = động mà bất thực. Thiên Cơ + Thiên Mã: phù động cực mạnh, bất thủ nhất nghiệp/nhất địa."
  },
  "Hỏa Tinh": {
    star: "Hỏa Tinh", han: "火星",
    tinhTinh: "Một trong lục sát, đi với Linh Tinh. Chủ mang đến BIẾN ĐỘNG — sự việc trước sau khác hẳn. Đặc tính 'hỏa minh linh ám': tai họa của Hỏa Tinh ở mặt nổi, ai cũng thấy/đoán trước được (khác Linh Tinh là ám). Thuộc hỏa, rất thích đồng/đối Tham Lang (Mộc sinh Hỏa phát đạt quang huy) — cách Hỏa Tham chủ ĐỘT PHÁT phú quý (hơn Linh Tham vì là minh hỏa). Hỏa Tinh + Kình Dương đồng/đối chủ kích phát, rèn giũa (như kim tượng nung lò). Hỏa Linh giáp mệnh tối kỵ — đời bôn ba lao lực, vô sự bận rộn. Hỏa Linh dù mang điềm tốt (Hỏa/Linh Tham đột phát) vẫn hàm động đãng."
  },
  "Linh Tinh": {
    star: "Linh Tinh", han: "鈴星",
    tinhTinh: "Cùng Hỏa Tinh chủ biến động, nhưng là 'ám' — tai họa Linh Tinh chỉ đương sự tự biết, biến sinh trước sau khó phòng (vd Hỏa Tinh ở điền trạch là cháy nhà nhìn thấy được, Linh Tinh là bị người phóng hỏa — ám diện). Linh Tham không bằng Hỏa Tham (quan lộc bất ninh — được phú quý giữa lúc nhiều việc, phải đối phó nhiều, trong lòng không yên). Tử nữ cung: Hỏa Tinh độc thủ đối cung cát thì không cô; cùng tình huống mà là Linh Tinh thì chủ thứ thất/ngoại sủng sinh con (ám diện). Linh Tinh hợp Đà La (âm hỏa luyện âm kim) — chuyển hóa nhưng gian khổ kéo dài, chủ ma luyện hơn là kích phát."
  },
  "Kình Dương": {
    star: "Kình Dương", han: "擎羊",
    tinhTinh: "Cặp sát diệu với Đà La, hóa khí là HÌNH (dương kim). Chủ tổn thất, sức phá hoại — việc hay công bại thùy thành, hoặc thành mà kèm thị phi/hậu di chứng. Sức phá của Kình thường ở MẶT NỔI: đương sự thấy rõ nguồn phản đối/phá hoại (như chân tiểu nhân). Kình + Hỏa Tinh đồng/đối chủ kích phát — như Mã Đầu Đới Tiễn (Kình tại Ngọ thuộc hỏa chính nam) chủ trải gian nguy rồi thành công. Nhiều tổ hợp mổ xẻ/khai đao có Kình. Tật ách gặp Kình thường chủ mổ xẻ. Lộc Tồn luôn bị Kình Đà giáp. Kình kỵ đồng/giáp Liêm Sát Phá Tham Cự Vũ; Thiên Tướng bị Kình Đà giáp (Hình Kỵ giáp ấn) thì rất xấu."
  },
  "Đà La": {
    star: "Đà La", han: "陀羅",
    tinhTinh: "Cặp với Kình Dương, hóa khí là KỴ (âm kim). Mang đến trở ngại và TRÌ HOÃN, việc sinh chuyện ngang trái, kéo dài, thành rồi lợi vẫn chưa tới tay khiến nản lòng. Khác Kình (mặt nổi), Đà La trở ngại ở MẶT CHÌM — khó tìm ra ai/đâu là chướng ngại thật (như ngụy quân tử). Đà + Hỏa Tinh chủ đột sinh trở ngại ngoài dự liệu, cảm giác khó chịu hơn Kình Hỏa. Đà hợp Linh Tinh (âm hỏa). Tham + Đà tại Dần = Phong lưu thái trượng (vì sắc sinh họa, mang sắc thái cá nhân). Đà La luôn cùng Kình giáp một cung (cung đó tất có Lộc Tồn). Đà đồng Thiên Mã = Chiết Túc Mã."
  },
  "Địa Không": {
    star: "Địa Không", han: "地空",
    tinhTinh: "Cùng Địa Kiếp là một cặp Không diệu (Trung Châu lấy Địa Không–Địa Kiếp làm đôi, không phải Thiên Không). Cổ: tác sự hư không, bất hành chính đạo, thành bại đa đoan. Nhưng không nên võ đoán xấu: tùy chính diệu đồng cung. Địa Không chủ ĐỘT NHIÊN gặp tỏa chiết (trắc trở bất ngờ). Hợp tư duy phá cách: Thái Dương Thiên Lương + Không + Xương Khúc chuyển thành giỏi tư duy/nghiên cứu học thuật, tư tưởng độc đáo. 'Kim không tắc minh, hỏa không tắc phát' — chính diệu thuộc kim (Vũ, Sát) hay hỏa (Liêm, Thái Dương, Sát) đồng Địa Không có thể trải gian khổ rồi phát. Liêm/Tham gặp Không có thể chuyển hóa thành nghệ thuật. Triết gia/khoa học gia/nghệ sĩ đôi khi lại thích Không Kiếp."
  },
  "Địa Kiếp": {
    star: "Địa Kiếp", han: "地劫",
    tinhTinh: "Cùng Địa Không thành đôi Không diệu. Cổ: tác sự sơ cuồng, gọi là bại cục. Địa Kiếp chủ BA ĐỘNG TẦN PHỒN (sóng gió biến động liên miên), khác Địa Không chủ tỏa chiết đột ngột. Cổ cho làm việc 'sơ cuồng' bất câu tiểu tiết, tư tưởng nghịch trào lưu — nay nhiều người phản trào lưu lại thành công, nên hiểu là phản truyền thống/phản trào lưu hơn là xấu tuyệt đối. Tài bạch cung gặp Không Kiếp thì trắc trở/ba động chắc chắn bất lợi (không liên quan bối cảnh xã hội). Phúc đức cung gặp Không Kiếp + chính diệu phù hợp (Liêm Tham...) chủ xúc phát đột nhiên. Địa Kiếp không có 'kim không hỏa không tắc phát' như Địa Không — nên kém Địa Không một bậc."
  },
  "Thiên Hình": {
    star: "Thiên Hình", han: "天刑",
    tinhTinh: "Chủ HÌNH, không thích nhập cung lục thân; gặp sát kỵ thường chủ hình khắc (không nhất định tử vong, có khi chỉ tai bệnh/mổ xẻ). Kình Dương hóa khí là hình nên Thiên Hình + Kình đồng độ thì tăng cường lẫn nhau, đôi khi chủ thị phi khẩu thiệt từ tụng. Thiên Hình + Thiên Vu gặp sát kỵ thường vì tranh di sản mà kiện tụng. Nhưng vô sát kỵ thì Thiên Hình chỉ chủ KÍCH PHÁT hoặc tự luật (kỷ luật). Thái Dương Thiên Lương + Thiên Hình thường hợp pháp luật, hoặc nhờ kích phát mà được thanh danh/thương dự. Liêm/Tham + Thiên Hình có thể nhờ tự luật mà giảm tính đào hoa. Kỵ đồng Đại Hao (Hình Hao — phá bại, tổn hao)."
  },
  "Thiên Diêu": {
    star: "Thiên Diêu", han: "天姚",
    tinhTinh: "Một trong các đào hoa chư diệu, mang sắc thái 'chiêu thủ thành thân' (gặp gỡ ngẫu nhiên là sinh tình). Thiên Diêu ở phu thê thì kết hợp ít nhiều mang tính bất kỳ nhi ngộ; hội Xương Khúc thì tăng lực Thiên Diêu. Nhưng nếu gặp Tả Hữu thì Thiên Diêu hóa thành 'môi tinh' (sao mai mối), tính chất khác hẳn. Thiên Diêu + cát hóa/cát diệu ở Mệnh/Quan/Tài có tính dị tính sinh tài (hợp nghề tiếp xúc nhiều người khác giới), có thể coi như tài tinh ở mức độ nào đó. Nhưng dị tính sinh tài cũng có thể chuyển thành dị tính phá tài — kỵ Văn Khúc Hóa Kỵ (đào hoa kiếp). Kỵ Âm Sát (quyền mưu âm mưu, gặp thêm sát kỵ chớ trêu hoa ghẹo nguyệt)."
  },
  "Hồng Loan": {
    star: "Hồng Loan", han: "紅鸞",
    tinhTinh: "Cùng Thiên Hỷ là cặp tạp diệu trọng yếu, luôn đối củng nhau (một ở Mệnh thì một ở Thiên Di), sức tăng cường lẫn nhau. Hồng Loan chủ hôn nhân, Thiên Hỷ chủ sinh dục — hai sao quan hệ mật thiết nên có thể hoán đổi luận. Hồng Loan thích Xương Khúc đồng hội, lại gặp lưu Xương lưu Khúc thì thường là năm hôn nhân (nay hiểu là giai đoạn tình cảm chín muồi, đôi khi lệch kỳ do thủ tục đăng ký). Hồng Loan là đào hoa CHÍNH (chính thường), chỉ khi hội đào hoa khác mới đổi tính chất. Về già, Hồng Loan có thể chuyển từ đào hoa sang điềm tật bệnh."
  },
  "Thiên Hỷ": {
    star: "Thiên Hỷ", han: "天喜",
    tinhTinh: "Vốn là sao sinh dục, thích nhập Tử nữ cung hoặc Điền trạch cung; gặp cát tinh chủ sinh con (Tử Vi luận con thường lấy kỳ thụ thai làm chuẩn). Vì luôn đối Hồng Loan nên cũng dùng để đoán hôn nhân; nếu lạc hãm thì hôn kỳ thường ứng sang năm sau. Hồng Loan Thiên Hỷ cũng chủ tài nhưng phải hội cát/Hóa Lộc/Lộc Tồn mới chủ tiến tài; gặp sát kỵ hình hao thì là đào hoa phá tài. Thông thường chủ vì hôn nhân/sinh dục mà tiêu tiền. Lưu niên điền trạch có Thiên Hỷ + hư hao mà không cát phụ chủ trong nhà có người tới ở nhờ (không luận thêm nhân khẩu)."
  },
  "Hàm Trì": {
    star: "Hàm Trì", han: "咸池",
    tinhTinh: "Đào hoa tính chất KHÔNG TỐT, luôn ở Tý Ngọ Mão Dậu (tứ đào hoa địa). Gặp Thiên Diêu hoặc Mộc Dục thì tính đào hoa rất nặng (cổ gọi 'vô môi cẩu hợp'). Tại Tý Ngọ, Hàm Trì hay đồng Đại Hao — Đại Hao tăng tính đào hoa và chủ hao tổn. Kỵ gặp Xương Khúc (Xương Khúc dễ hóa đào hoa, tăng lực Hàm Trì); nếu Xương/Khúc Hóa Kỵ thì chủ tình cảm rối ren, kèm phá hao có thể là cạm bẫy tình cảm. Tham/Liêm + Hàm Trì thì đào hoa tăng cường lẫn nhau; hai sao này Hóa Kỵ cũng chủ khốn nhiễu tình cảm. Riêng Hàm Trì + Thiên Hỷ, Liêm Trinh Hóa Kỵ ở phu thê/mệnh nữ thì chỉ chủ sinh dục/thai nghén."
  },
  "Đại Hao": {
    star: "Đại Hao", han: "大耗",
    tinhTinh: "Có hai Đại Hao: theo năm sinh (mang tính đào hoa) và theo lưu niên (chỉ chủ hao tán). Đại Hao (năm sinh) đồng/đối Hàm Trì thì coi là đào hoa, tính chất bất lương — kỵ Liêm Trinh, Tham Lang, Văn Xương, Văn Khúc, càng kỵ bốn chính diệu này Hóa Kỵ (vì tửu sắc mà phá tài hoặc đào hoa kiếp). Đại Hao liền kề Thiên Hư (Hư Hao): Mệnh thấy Thiên Hư, phụ mẫu thấy Đại Hao thì có nghiệp tổ cũng không hưởng được; Tử nữ thấy Đại Hao chủ con phá hao. Khi sát kỵ hình tụ tập thêm Đại Hao thì từ điềm xấu dẫn tới tổn thất thực chất."
  },
  "Cô Thần": {
    star: "Cô Thần", han: "孤辰",
    tinhTinh: "Cùng Quả Tú là cặp, nhưng Cô Thần chỉ ở Dần Thân Tỵ Hợi, Quả Tú chỉ ở Thìn Tuất Sửu Mùi nên chỉ hội tam phương, lực tăng cường nhau không rõ. Ảnh hưởng rõ nhất lên tứ đào hoa địa (Tý Ngọ Mão Dậu) bị giáp/hội — nếu là phu thê thì ảnh hưởng hôn nhân, là tử nữ thì ảnh hưởng sinh dục. Cô Thần kỵ nhập phụ mẫu/tử nữ cung, phối hợp ác diệu thường chủ hình khắc/phân ly với cha mẹ hoặc con. Riêng Cô Thần ở Phúc đức thường chủ tinh thần độc lập; ở Điền trạch cổ chủ phân gia (ở riêng), từ đó suy ra điềm tạo lập cơ ngơi riêng."
  },
  "Quả Tú": {
    star: "Quả Tú", han: "寡宿",
    tinhTinh: "Cung ảnh hưởng chính là Phu thê: nếu sao ở phu thê không tốt hoặc phù động (Thiên Cơ, Cự Môn...) thì thường khiến vợ chồng tụ ít ly nhiều. Quả Tú nhập phụ mẫu, nếu thân cung có Thái Âm Hóa Kỵ và phụ mẫu lại gặp sát thì bất lợi cha, thường chủ theo mẹ tái giá. Phối hợp với Cô Thần: khi ảnh hưởng tới Phúc đức thì chủ có năng lực tư duy độc lập, tới Mệnh thì tăng tính độc lập — nên thích Tả Hữu phối hợp để bớt cô. Quả Tú tối kỵ đồng Vũ Khúc ở phu thê (phối ngẫu quá lấy mình làm trung tâm, độc đoán); gặp sát kỵ hình thì hình khắc phân ly. Lộc Tồn không bao giờ vào đất Quả Tú nên chỉ có Hóa Lộc điều hòa."
  },
  "Âm Sát": {
    star: "Âm Sát", han: "陰煞",
    tinhTinh: "Tạp diệu thường bị xem nhẹ là 'phạm tiểu nhân', nhưng tai hại đôi khi quá thế. Chỉ ở Dần Ngọ Tuất, Thân Tý Thìn; nhập miếu ở Ngọ, lạc hãm ở Thân Tý Thìn. Tác hại lộ ra khi đồng sát diệu — tăng mặt âm ám của sát: Kình (cạnh tranh) + Âm Sát = đả kích ngầm; Đà La (trở ngại) + Âm Sát = trì hoãn ngầm; đồng Linh Tinh thì tổn hại mặt chìm rất lớn. Âm Sát bản thân không chủ bệnh, nhưng đồng một số sao có thể đem tới nguy/tuyệt chứng — thống kê thấy tật ách cung của một số bệnh nhân ung thư hay có Âm Sát (tuy không tất yếu). Kỵ đồng Thiên Diêu (quyền mưu âm mưu)."
  },
  "Hoa Cái": {
    star: "Hoa Cái", han: "華蓋",
    tinhTinh: "Có Hoa Cái theo năm sinh và theo lưu niên. Theo năm sinh: chủ tín ngưỡng tôn giáo, triết lý — nhất là đồng Không diệu thì tính cận triết học; cũng có thể chuyển đào hoa chư diệu thành thông minh thanh khiết. Theo lưu niên: là sao tiêu giải quan tụng hình pháp (cổ dùng đoán kỳ ra tù / kỳ giải tán quan tư), độ ứng nghiệm khá cao. Lưu Hoa Cái trùng điệp Hoa Cái năm sinh thì rõ nhất, thích ở lưu niên mệnh/phúc đức/thiên di. Hoa Cái thích đồng Khôi Việt, mệnh gặp chủ một đời ít quan phi từ tụng."
  }
};

// ===== TỨ HÓA TỔNG QUÁT (Giai đoạn 2) =====
// Tinh tình bản chất bốn Hóa, cô đọng từ phần Tứ Hóa (四化) của Đàm Tinh.
export const DAM_TINH_TU_HOA: Record<string, DamTinhEntry> = {
  "Hóa Lộc": {
    star: "Hóa Lộc", han: "化祿",
    tinhTinh: "Tài tinh trọng yếu. Bất kể chính diệu nào Hóa Lộc đều mang tính tài lộc, chỉ khác nhau ở tính chất tài do bản chất chính diệu quyết định, nhưng chủ tài lộc thì không đổi. Một mình Hóa Lộc tác dụng không lớn vì tiền tài phải LƯU THÔNG mới vượng — nên thích Hóa Lộc đồng/đối Lộc Tồn hoặc hội tam phương (gọi là 'điệp lộc'), khi đó mới khởi tác dụng lưu thông. Hóa Lộc chủ TIẾN tài, nhưng không nhất định chủ tiền có thể tích súc; mức tiến tài và khả năng cất giữ phải xét bản chất chính diệu thụ Lộc."
  },
  "Hóa Quyền": {
    star: "Hóa Quyền", han: "化權",
    tinhTinh: "Tính chất là QUYỀN LỰC, dẫn tới địa vị (thường có địa vị rồi mới có quyền). Thích hai quyền tinh gặp nhau (tăng độ quyền lực và sinh đặc chất riêng). Ngoài quyền lực còn một tính chất quan trọng: tăng tính TÍCH CỰC và ỔN ĐỊNH của chính diệu thụ Quyền — vd Thiên Cơ vốn bất ổn, Hóa Quyền thì bớt động đãng, thành linh hoạt phát huy. Quyền tinh lợi cho kế hoạch, quản lý. Hội Khoa văn chư diệu = địa vị và thanh vọng tương phụ tương thành; hội Lộc tinh = tài phúc và địa vị tương thành; gặp Kỵ tinh = vì quyền lực mà chuốc đố kỵ, chướng ngại."
  },
  "Hóa Khoa": {
    star: "Hóa Khoa", han: "化科",
    tinhTinh: "Tính chất cơ bản là DANH DỰ và THANH VỌNG, tính chất danh do bản chất chính diệu quyết định. Xã hội xưa trọng công danh nên thích Văn Xương Văn Khúc Hóa Khoa (khoa văn đồng hội, chủ đăng đệ); xã hội nay thương mại, lại hay thích tài tinh Hóa Khoa (Thái Âm, Vũ Khúc, Thiên Phủ Hóa Khoa) và danh vọng đôi khi còn lớn hơn văn tinh Hóa Khoa. Nhưng đôi khi Hóa Khoa chỉ là thỏa mãn tâm lý/tự hào, không hẳn được người tôn sùng — luận lưu niên/lưu nguyệt phải lưu ý. Hóa Khoa cũng dẫn tới TRƯƠNG DƯƠNG (phô trương), nên sợ nhất Kỵ tinh xung hội (vì phô trương mà bị cản, hoặc ác sự truyền nghìn dặm)."
  },
  "Hóa Kỵ": {
    star: "Hóa Kỵ", han: "化忌",
    tinhTinh: "Phức tạp nhất; đại để là phát huy mặt XẤU NHẤT của bản chất chính diệu thụ Kỵ. Bất kỳ sao nào cũng không toàn thiện toàn ác (như bàn tay có lòng có lưng), Hóa Kỵ là phần ác lộ ra. Vd thiện tính Thái Dương là chiếu cố người, ác tính là xuất phong đầu — Hóa Kỵ chính là vì xuất đầu mà chuốc đố kỵ. Tính chất thường thấy: TỎA CHIẾT (trắc trở), chướng ngại, nghi kỵ, thị phi, vong thất. Có khi Hóa Kỵ chỉ là CẢM THỤ trong lòng đương sự (vd Thiên Đồng Hóa Kỵ thường là bận rộn lao thần, người ngoài lại thấy là 'năng giả đa lao') — không nhất định gây thay đổi xấu trong tế ngộ thực tế."
  }
};

/**
 * Lọc tri thức Đàm Tinh cho phụ/tá/sát/tạp diệu CÓ trên lá số.
 * Quét đủ minor + adjective; KHÔNG nhồi toàn bộ DAM_TINH_AUX.
 */
export function getDamTinhForAuxStars(starNames: string[], maxEntries: number = 18): string {
  const seen = new Set<string>();
  const blocks: string[] = [];
  let matched = 0;
  let truncated = 0;
  for (const raw of starNames) {
    const name = String(raw || "")
      .normalize("NFC")
      .replace(/\[SAO LƯU\]\s*/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const entry = DAM_TINH_AUX[name];
    if (entry) {
      matched++;
      // Trần ngân sách mềm: chỉ chèn tới maxEntries để tránh phình prompt.
      if (blocks.length < maxEntries) {
        blocks.push("  - " + entry.star + " (" + entry.han + "): " + entry.tinhTinh);
      } else {
        truncated++;
      }
    }
  }
  if (blocks.length === 0) {
    return "  - Khong co phu/ta/sat/tap dieu nao khop du lieu Dam Tinh hien co.";
  }
  if (truncated > 0) {
    blocks.push(
      "  - (Đã hiển thị " + maxEntries + "/" + matched +
      " phụ tạp diệu trọng yếu; " + truncated +
      " sao thứ yếu còn lại đã có mặt ở bảng 12 cung — luận theo dữ liệu cung, không bỏ sót.)"
    );
  }
  return blocks.join("\n");
}

/**
 * Lọc tinh tình Tứ Hóa cho các Hóa thực sự xuất hiện (natal/đại vận/lưu niên).
 * Truyền vào danh sách nhãn Hóa (vd: ["Hóa Lộc", "Hóa Kỵ"]).
 */
export function getDamTinhTuHoa(hoaLabels: string[]): string {
  const seen = new Set<string>();
  const blocks: string[] = [];
  for (const raw of hoaLabels) {
    // Chuẩn hóa: bỏ tiền tố "Lưu " để map về nhãn gốc.
    const label = String(raw || "").replace(/^Lưu\s+/u, "").trim();
    if (!label || seen.has(label)) continue;
    seen.add(label);
    const entry = DAM_TINH_TU_HOA[label];
    if (entry) {
      blocks.push("  - " + entry.star + " (" + entry.han + "): " + entry.tinhTinh);
    }
  }
  return blocks.length > 0
    ? blocks.join("\n")
    : "  - Khong xac dinh duoc Tu Hoa nao de tra tinh tinh Dam Tinh.";
}

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

// ===== TỨ HÓA CHI TIẾT THEO TỪNG CAN (Giai đoạn 3) =====
// Key dạng "<Chính tinh>|<Loại Hóa>", vd "Vũ Khúc|Hóa Lộc".
// Cô đọng trung thực từ vuongdinhchidamtinh.txt. Bổ sung dần theo nhóm.
export const DAM_TINH_TU_HOA_DETAIL: Record<string, string> = {
  // --- Nhóm HÓA LỘC ---
  "Liêm Trinh|Hóa Lộc": "(Giáp) Đại lợi tiến tài, mang sắc thái tình cảm. Tích tài khó nhưng dễ danh lợi song thu; nếu thiên lý trí thì tiến tài phải dùng thủ đoạn, chủ lợi không chủ danh. Thích ở Mệnh/Tài/Quan; ở Phúc đức chỉ là hưởng thụ. Liêm hãm hóa Lộc kỵ thêm sát hao Không Kiếp (dễ chìm tửu sắc mà phá tài). Hợp lục thân cung (tình cảm thâm hậu); huynh đệ/phu thê chủ hợp tác, cùng tạo nghiệp. Rất thích Lộc Mã giao trì thành đại phú; tại Dần Thân đối Tham+Hỏa tất đại phú.",
  "Thiên Cơ|Hóa Lộc": "(Ất) Phù động không đổi, chủ lưu thông lượng lớn (hóa như luân chuyển) nhưng KHÔNG chủ đại phú. Thời nay hợp nghề động não (tài chính, kế hoạch, kỹ thuật) lương cao. Phải nương hậu đài, không hợp quá độc lập tự mở. Có khi chỉ chủ chuyển việc/kiêm chức. Tối kỵ Hỏa Linh đồng độ (chỉ tiểu phú nhất thời rồi phá bại), kỵ Không Kiếp. Cơ+Nguyệt hóa Lộc: trực giác mạnh.",
  "Thiên Đồng|Hóa Lộc": "(Bính) Thuần về tinh thần — chủ đời sống vật chất khiến tinh thần thỏa mãn, KHÔNG chủ đại phú đại quý. Thường vãn niên mới an định/thành phú, thiếu/trung niên phải trải ba chiết (khổ tận cam lai). Gặp sát Không Kiếp hư hao thì ba động lớn, thành tựu nhỏ. Đồng Lộc Tồn thì tài khí vượng, có Tả Hữu Khôi Việt thì cơ hội + trợ lực cùng đến. Kỵ Địa Không/Kiếp (khí nhỏ dễ đầy, táo bạo sinh phá tài), kỵ đào hoa+Xương Khúc (phong lưu lãng tử).",
  "Thái Âm|Hóa Lộc": "(Đinh) Thái Âm là tài tinh, hóa Lộc là đồng khí, tăng sức chủ tài — nhưng phải NHẬP MIẾU mới chủ tài nguồn thuận; lạc hãm (nhất là người sinh ngày) chỉ chủ thỏa mãn tinh thần. Tính chủ tĩnh/tàng, chủ KẾ HOẠCH — tiến tài nhờ kế hoạch thành công, không bôn ba như Vũ Khúc. Đồng/đối Lộc Tồn thì tài phong, tiến tài thong dong. Phúc đức có Thái Âm hóa Lộc: lạc quan, biết hưởng thụ. Cần nhớ tất có Cự Môn hóa Kỵ ở Phúc đức (lao tâm).",
  "Tham Lang|Hóa Lộc": "(Mậu) Giỏi giao tế ứng thù, hay nhờ xã giao mà được tài (trường tụ thiện vũ). Nhưng đồng đào hoa chư diệu thì ham tửu sắc hơn; gặp sát tất vì tửu sắc tài khí mà sinh phiền. Đồng Hỏa/Linh = Hỏa Tham/Linh Tham chủ đắc tài bất ngờ/đột phát; vô sát kỵ thì sau khi phát vẫn giữ được, tối kỵ Không Kiếp (phát rồi tan nhanh, phú quý trên giấy). Mang tính cạnh tranh; gặp Đà La là cản nhất. Kỵ ở phu thê (phối ngẫu bất trung nếu có đào hoa Xương Khúc).",
  "Vũ Khúc|Hóa Lộc": "(Kỷ) Tài tinh cầu tài bằng HÀNH ĐỘNG (không phải kế hoạch). Hóa Lộc = hành động cầu tài thuận, hoặc vô tình mà đắc tài. Vô sát + Khôi Việt Tam Thai Bát Tọa Ân Quang Thiên Quý thì tiến tài do nắm tài quyền; có sát kỵ hình hao thì phải dựa kỹ nghệ (nữ thì vất vả). Kỵ Không Kiếp (hao tổn ngoài dự tính), kỵ Văn Khúc (hư phù, có chức không quyền). Không kỵ tứ sát thường (chỉ thêm cạnh tranh vất vả). Vũ+Tham thành Hỏa/Linh Tham thì phát đạt.",
  "Thái Dương|Hóa Lộc": "(Canh) Chủ quý không chủ phú — phải xây được địa vị xã hội rồi tài mới theo đó (tiên quý hậu phú). Tính phát tán, phải có Khôi Việt Tả Hữu Xương Khúc thì cục diện mới lớn; đơn thủ dễ lộ phong mang chiêu đố kỵ. Kỵ ở cung quá quang huy (Tỵ/Ngọ — chói mắt, dễ đố kỵ); hợp Dần Mão (hừng nhật) chủ dễ chuyển quý thành phú; Tuất Hợi (thất huy) thì tiềm phát u quang, cần Khôi Việt cận quý. Ở cung quang huy KHÔNG thành phú cục, chỉ danh lớn hơn lợi.",
  "Cự Môn|Hóa Lộc": "(Tân) Ám diệu, cát hung đều chủ lao tâm — hóa Lộc vẫn phải lao tâm lao lực mà tiến tài. Thích Tả Hữu Khôi Việt (bớt nhọc). Thạch trung ẩn ngọc + hóa Lộc rất đẹp, phú mà người đời thường không ngờ. Có tổ hợp chủ được ngoại tộc/dị vực trọng dụng (tốt khi hội Thái Dương hóa Quyền, cả hai không hãm). Chủ miệng sinh tài. Kỵ Văn Xương hóa Kỵ xung (tiến tài kèm phá hao). Lục thân thích gặp (tình thâm, nhất là được Thái Dương nhập miếu chiếu).",
  "Thiên Lương|Hóa Lộc": "(Nhâm) Ấm tinh hóa Lộc chỉ lợi ở phụ mẫu chi ấm (kế thừa/cơ nghiệp sẵn), không lợi quan quý chi ấm — nên thích Khôi Việt bù vào. Hợp phát triển nghiệp gia tộc hoặc phục vụ cơ quan có danh. Nhưng trừ nghề công ích/vì người giải nạn (luật sư, bác sĩ, kế toán), nếu mưu tư lợi thì dễ vì tiền sinh phiền/thành cớ bị công kích. Di chuyển cung + Thiên Mã thì hợp buôn bán nơi xa/ngoại quốc, đắc Lộc Tồn thành đại phú. Kỵ ở lục thân (tranh chấp tài).",
  "Phá Quân|Hóa Lộc": "(Quý) Khử cũ đổi mới, biên độ thay đổi lớn — hóa Lộc thì thay đổi thường có lợi, kể cả sau tỏa chiết vẫn mở cục diện mới tốt hơn. Mệnh/Tài/Quan gặp thì có thể thuận theo đà tìm biến đổi (không nhất thiết mất thu nhập). Tối kỵ Địa Không/Kiếp đồng độ (ba động cực lớn, có khi lung lay gốc rễ rồi mới tìm ra lối thoát). Chủ thích hợp tác (nên thích Tả Hữu); chủ bất thủ nhất nghiệp, hay kiêm chức/kiêm nghiệp. Huynh đệ cung có hai nghĩa trái ngược: hợp tác đắc tài HOẶC bị khống chế tài quyền.",

  // --- Nhóm HÓA QUYỀN ---
  "Phá Quân|Hóa Quyền": "(Giáp) Sức đột phá khai sáng tăng mạnh, chủ động tìm thay đổi dù hoàn cảnh đang ổn — người bận rộn không yên. Mệnh/Quan hợp võ chức, công nghiệp, việc mạo hiểm; có Khôi Việt Tả Hữu Thiên Hình Tam Thai Bát Tọa thì võ chức vinh thân, hội Liêm Trinh hóa Lộc thì phú quý song toàn. KHÔNG chủ phú (danh lớn hơn lợi). Ở lục thân thường TĂNG tính khắc (vd phu thê vẫn chủ chia ly dù hóa Quyền). + Kình/Thiên Hình chủ mổ xẻ.",
  "Thiên Lương|Hóa Quyền": "(Ất) Thanh quý, hóa Quyền hơn hóa Lộc — phát huy bản chất giám sát/quản lý, hợp chuyên môn (kiểm toán, thiết kế, kế hoạch, y). Nhưng kém hóa Khoa: gặp sát hao dễ chủ quan, cố chấp. Cần Thái Dương nhập miếu chiếu mới hợp làm việc đối diện đám đông/truyền thông; Thái Dương hãm thì bất lợi. Di chuyển + Lộc Mã chủ ngoại phương đắc tài nhờ thành tín. Cô khắc không giảm; phu thê chủ lệch tuổi lớn hơn, tử nữ dễ sảy.",
  "Thiên Cơ|Hóa Quyền": "(Bính) Phù động chuyển thành linh hoạt, cơ xảo — tính chất cải thiện, nguồn tài đỡ bất ổn hơn hóa Lộc. Tăng sức mưu lược/kế hoạch; hợp Văn Xương hóa Khoa thì lấy mưu lược thành danh, cơ nguyệt đồng lương hợp chuyên môn/tham mưu. Kỵ Hỏa Linh (cơ xảo nhuộm hư phù, phô trương). Hay kiêm nghề/kiêm chức. Tăng đầu tư đầu cơ — cát thì thắng, sát thì hỏng. Ở lục thân TĂNG ổn định (giảm chia ly, giảm sảy thai).",
  "Thiên Đồng|Hóa Quyền": "(Đinh) Thường KHÔNG bằng hóa Lộc vì hóa Quyền là lao khổ nhiều hơn — nhưng vất vả rồi tất thành. Đẹp nhất khi đồng Lộc Tồn (nhọc mà dễ đắc tài, thành phú cục). Rất nhạy sát Không Kiếp; đồng/xung Cự Môn hóa Kỵ thì thị phi thầm ngầm, việc gần thành hay bị phá. Có cát thì tình cảm ổn định trầm tĩnh; có sát Không Kiếp thì dễ hư mà khí nhỏ dễ đầy. Nhẹ bớt nhu nhược (thêm cương khí).",
  "Thái Âm|Hóa Quyền": "(Mậu) Hợp quản/vận dụng tài bạch (kế hoạch thị trường, tài chính, kiểm toán) — người mệnh này hợp quản tiền cho người, KHÔNG hẳn tự có đại phú. Phải NHẬP MIẾU; lạc hãm thì chỉ nắm quyền hư hay làm công. Thường hội Thiên Cơ hóa Kỵ: có sát thì nghề lao tâm/kỹ nghệ, vô sát vẫn dễ thay người giữ tiền mà tự thu không nhiều. Cần xem kỹ Phúc đức. Ở lục thân (nữ thân): kỵ Không Kiếp, kỵ Hỏa-Đà (lụy vì nữ thân).",
  "Tham Lang|Hóa Quyền": "(Kỷ) Giao tế chủ động và mạnh hơn — tốt/xấu phải xem có Lộc hội không. Tốt nhất đồng Vũ Khúc hóa Lộc, vô Không Kiếp tứ sát thì chủ động giao tế mà được lợi; vô Lộc thì tốn thời gian tiền bạc. Thành Hỏa/Linh Tham thì hóa Quyền KHÔNG bằng hóa Lộc (chỉ phong quang bề mặt, dễ đầu cơ). Ưu điểm: TĂNG ỔN ĐỊNH, bớt biến động, cạnh tranh dễ chiếm ưu thế. + đào hoa thì hướng nghệ thuật/giải trí.",
  "Vũ Khúc|Hóa Quyền": "(Canh) Lấy HÀNH ĐỘNG sinh tài, phải tự tay xử lý nghiệp vụ — chủ vất vả. Chủ lấy sự nghiệp cầu tài (tài nhiều ít theo cục diện/chức vị). Dễ được cấp trên đề bạt. Kém hóa Lộc vì chỉ hợp cách mới chủ có thành tựu; cần thêm Lộc Tồn mới đủ điều kiện thành phú. + sát thì hợp kỹ thuật/dụng cụ kim loại; + Không Kiếp thì mở xưởng dùng máy móc. Lục thân: giảm khắc nhưng không đổi tình cảm; phu thê (nam) TĂNG phụ đoạt phu quyền.",
  "Thái Dương|Hóa Quyền": "(Tân) Hơn hóa Lộc về bản chất — chuyên chú sự nghiệp, lấy địa vị xã hội/chuyên môn mà thành. + Cự Môn hóa Lộc (đồng/đối) chủ dị tộc sinh tài, hợp ngoại giao/cơ quan nước ngoài. Thành Dương Lương Xương Lộc thì tăng địa vị học thuật, lợi phát minh độc quyền. Tính độc lập/khai sáng tăng nhưng cũng thích được vỗ tay — dễ tiến thủ sai thời điểm, cần chọn năm nên ẩn. + Văn Xương hóa Kỵ (không thành cách) thì xử sự nhẹ dạ, quyết định thiếu cân nhắc.",
  "Tử Vi|Hóa Quyền": "(Nhâm) Đế tọa nắm thực quyền — quyết đoán và lãnh đạo tăng, độc đương một cõi; nhưng chủ quan hơn, ít nghĩ cho người. PHẢI có Tả Hữu mới bớt vất vả (không thì tự làm mọi việc, công vô ích). PHẢI có Lộc Tồn hội mới quý (vì Tài bạch tất có Vũ Khúc hóa Kỵ — vô Lộc thì cảnh đẹp mà ruột rỗng). + sát thì như vua gần tiểu nhân (đa nghi, tật khí); + Xương Khúc dễ thông minh tự ngộ. Lục thân: thường chủ quan, kỵ ở phu thê.",
  "Cự Môn|Hóa Quyền": "(Quý) Ám diệu — hóa Quyền hơn hóa Lộc: khẩu tài hay mà không ngọt sáo, nói có trọng lượng. Tránh xuất phong đầu/đi đường tắt, nếu trầm mình rèn giũa thì danh lợi tự đến. Thái Âm đồng thời hóa Khoa; nếu cả Nhật Nguyệt nhập miếu thì thành cấu trúc đẹp, phú quý. Kỵ Hỏa Linh đồng độ. Lục thân: nhìn chung TỐT hơn không hóa Quyền (huynh đệ tạo nghiệp, phu thê được vợ đảm, tử nữ tú tài, bạn có trực hữu). Chủ miệng/hầu/đường hô hấp, gặp sát mới bệnh.",

  // --- Nhóm HÓA KHOA ---
  "Vũ Khúc|Hóa Khoa": "(Giáp) Tài tinh hóa Khoa chủ thanh danh về tài — tiến tài có tiếng tốt, được tin cậy về tiền bạc/tín dụng, hợp tài chính ngân hàng kế toán. Trọng chữ tín hơn lợi nhuận lớn; thích hợp Lộc Tồn/Hóa Lộc để vừa có danh vừa có thực. Gặp Khôi Việt Xương Khúc thì danh tài kiêm bị. Kỵ Không Kiếp (hư danh, tài đến rồi đi). Không chủ đại phú nhưng chủ tài lộc bền, được trọng vọng.",
  "Tử Vi|Hóa Khoa": "(Ất) Đế tọa hóa Khoa chủ uy danh, được tôn kính, danh tiếng lãnh đạo — hợp địa vị có tiếng nói. Cần Tả Hữu Khôi Việt mới thành quý cách trọn vẹn (có người phò tá). Tăng tính ôn hòa, bớt độc đoán so với hóa Quyền. Gặp Xương Khúc thì thêm phần học thức tao nhã. Tài bạch thường có Vũ Khúc, cần Lộc hội mới thực phú. Chủ được tiếng thơm, hợp chức vụ danh dự/cố vấn.",
  "Văn Xương|Hóa Khoa": "(Bính) Khoa giáp tinh hóa Khoa — đắc cách công danh khoa bảng, học hành thi cử thuận, văn tài hiển đạt. Hợp Thái Dương/Thiên Lương thành Dương Lương Xương Lộc thì quý hiển. Chủ văn chương, học vị, bằng cấp, tiếng tăm về tri thức. Kỵ gặp Hỏa Linh Không Kiếp (văn tài bị hao, học hành dở dang). Là một trong các sao hóa Khoa đắc lực nhất về đường thi cử công danh.",
  "Thiên Cơ|Hóa Khoa": "(Đinh) Trí tinh hóa Khoa — mưu lược cơ trí được tiếng, hợp tham mưu cố vấn nghiên cứu kế hoạch. Tăng phần minh mẫn, tính toán có danh. Hợp Văn Xương/Thái Âm thì thông tuệ hơn. Chủ thành danh nhờ trí óc, không nhờ sức. Gặp cát thì tài hoa được công nhận; gặp Hỏa Linh thì cơ xảo dễ thành tinh ranh, danh không bền. Hợp nghề trí tuệ, tư vấn, kỹ thuật.",
  "Hữu Bật|Hóa Khoa": "(Mậu) Tá tinh hóa Khoa — chủ được quý nhân phù trợ có danh, gặp người giúp đỡ đắc lực và có tiếng. Tăng sức trợ lực ngầm, hợp vị trí phụ tá/thứ hai mà vẫn được trọng. Thích đồng cung chính tinh đắc địa để phát huy. Chủ nhân duyên tốt, được tín nhiệm. Phối Tả Phụ thì trợ lực song toàn. Là cát hóa về nhân hòa và danh dự khiêm nhường.",
  "Thiên Lương|Hóa Khoa": "(Kỷ) Ấm tinh hóa Khoa là đẹp nhất trong các Hóa của Thiên Lương — chủ thanh danh cao khiết, được kính trọng, hợp y dược pháp luật giám sát giáo dục. Chủ giải nạn có tiếng, gặp hung hóa cát. Hợp Thái Dương nhập miếu thì danh càng hiển. Tăng tính cẩn trọng, chính trực, bớt cố chấp so với hóa Quyền. Chủ phúc ấm, trường thọ, được người tôn làm bậc đáng tin. Kỵ mưu tư lợi (mất thanh danh).",
  "Văn Khúc|Hóa Khoa": "(Tân) Khoa văn tinh hóa Khoa — chủ tài hoa nghệ thuật khẩu tài được tiếng, hợp diễn thuyết văn nghệ tài lẻ. Khác Văn Xương (thiên chính quy khoa bảng), Văn Khúc thiên về tài hoa linh hoạt, ứng đối. Hợp Xương Khúc giáp mệnh thì văn tài song toàn. Gặp Tham Lang thì thêm phần phong nhã. Kỵ Hóa Kỵ xung hoặc Không Kiếp (tài hoa bị mai một, hư danh). Chủ thành danh nhờ tài ăn nói/biểu diễn.",
  "Thái Âm|Hóa Khoa": "(Nhâm) Phú tinh hóa Khoa — chủ thanh danh về tài và về văn, hợp kế hoạch tài chính có tiếng, nữ mệnh thì đoan trang được khen. Phải NHẬP MIẾU mới phát huy; lạc hãm thì chỉ hư danh. Tăng tính ôn nhu, thẩm mỹ, trực giác. Hợp Thiên Đồng/Thiên Cơ thì thông tuệ tao nhã. Chủ tài đến êm thuận kèm tiếng tốt. Cần xem Phúc đức (thường có Cự Môn liên đới). Đẹp cho người làm nghệ thuật, thiết kế, tài chính.",
  "Tả Phụ|Hóa Khoa": "(Quý) Tá tinh hóa Khoa — chủ được quý nhân chính trực phù trợ có danh, trợ lực công khai đắc lực. Hợp vị trí phó/tham mưu mà vẫn được tôn trọng và ghi nhận. Phối Hữu Bật thì song phụ giáp, trợ lực trọn vẹn. Thích đồng cung chính tinh miếu vượng. Chủ nhân hòa, được tín nhiệm, danh tiếng về sự đáng tin cậy và tận tâm. Là cát hóa nâng đỡ cục diện chung.",

  // --- Nhóm HÓA KỴ ---
  "Thái Dương|Hóa Kỵ": "(Giáp) Quang huy bị ám: lao tâm vì danh, dễ bị đố kỵ thị phi, hưởng ít hơn cống hiến. Hãm địa (Tuất-Hợi) nặng hơn: bệnh mắt, bất lợi nam thân (cha/chồng/con trai), bất hòa với cấp trên/phái nam. Nhập miếu chỉ nhọc tâm hao khí. Tránh tranh danh nơi đông người; thêm sát Hình thì thị phi thành kiện tụng.",
  "Thái Âm|Hóa Kỵ": "(Ất) Tài tinh bị ám: hao tài ngầm, tính nhiều thu không bền, phiền muộn nội tâm. Hãm địa bất lợi nữ thân (mẹ/vợ/con gái), nam dễ lụy tình, nữ dễ u uất; chủ mất ngủ, bệnh thuộc âm/thận. + Không Kiếp tài tan; + đào hoa Xương Khúc thì lụy tình. Nhập miếu giảm hại.",
  "Liêm Trinh|Hóa Kỵ": "(Bính) Đào hoa + tù tinh bị ám, HÓA KỴ NẶNG NHẤT: tình cảm phiền lụy, quan phi thị phi, huyết quang tai ách. + Không Kiếp/Dương Đà/Hình dễ kiện tụng, tù ngục, mổ xẻ, đổ máu. Phải đề phòng họa bất ngờ, thận trọng hợp đồng pháp lý. Tối kỵ ở Mệnh/Quan/Tài có sát.",
  "Cự Môn|Hóa Kỵ": "(Đinh) Ám diệu bị ám thêm: THỊ PHI KHẨU THIỆT nặng, cãi vã hiểu lầm, vạ miệng, tiếng xấu, đa nghi; bệnh miệng/hầu/tiêu hóa. Cần Thái Dương nhập miếu chiếu để giảm ám; Dương hãm thì thị phi đậm. + Hỏa Linh Dương Đà dễ kiện tụng kéo dài.",
  "Thiên Cơ|Hóa Kỵ": "(Mậu) Trí tinh bị ám: mưu sự bất thành, tính quá hóa rối, hay đổi mà hỏng, lo âu mất ngủ. + Hỏa Linh thì cơ xảo hại thân; + Không Kiếp kế hoạch đổ vỡ. Chủ gân cốt, di chuyển bất định. Tránh đầu cơ và thay đổi liên tục.",
  "Văn Khúc|Hóa Kỵ": "(Kỷ) Khoa văn bị ám: văn thư giấy tờ sai sót, hợp đồng trục trặc, khẩu thiệt nghệ thuật/lời nói, dễ bị hiểu lầm. + đào hoa lụy tình; + Không Kiếp hư danh. Cẩn thận ký kết, thi cử. Nặng về tình cảm/ứng đối hơn là khoa bảng.",
  "Thiên Đồng|Hóa Kỵ": "(Canh) Phúc tinh bị ám: phúc khí bị khuấy, tình cảm phiền muộn, an nhàn hóa lao tâm. Đáng chú ý có thể KÍCH động lực (an quá hóa trì trệ, bị Kỵ thúc mới động) nên không thuần xấu. + Không Kiếp/đào hoa dễ sa đà cảm xúc. Bệnh thủy/thận; nữ dễ đa cảm.",
  "Văn Xương|Hóa Kỵ": "(Tân) Khoa giáp bị ám: văn thư bằng cấp thi cử trục trặc, hợp đồng dễ rắc rối pháp lý, vì chữ ký/văn bản sinh phiền, công danh dễ trượt phút chót. + sát nặng về kiện tụng giấy tờ. Soát kỹ văn bản trong hạn; nặng về khoa bảng chính quy hơn Văn Khúc.",
  "Vũ Khúc|Hóa Kỵ": "(Nhâm) Tài tinh bị ám: HAO TÀI, tài vận trắc trở, cầu tài vất vả mà tổn thất ngoài dự kiến; cương quyết hóa cố chấp, dễ sai về tiền. + Không Kiếp/Dương Đà phá tài nợ nần; + Hình thương tích kim khí/phẫu thuật. Bệnh phổi/hô hấp. Tử Vi hóa Quyền kéo theo Vũ Khúc hóa Kỵ ở Tài, cần Lộc giải.",
  "Tham Lang|Hóa Kỵ": "(Quý) Đào hoa bị ám: dục vọng bị cản, sa đà, tình cảm phong nguyệt sinh phiền, ham muốn quá mức hại thân. + đào hoa Xương Khúc lụy tình; + Hỏa Linh vẫn đột phát nhưng kèm trắc trở. Thiếu cát chế dễ tửu sắc cờ bạc. Nhẹ thì hướng huyền học/ngũ thuật. Cần tiết chế trong hạn."
};

/**
 * Lọc Tứ Hóa CHI TIẾT cho đúng các cặp (chính tinh × loại Hóa) thực có.
 * Truyền vào mảng cặp dạng { star, hoa } (hoa đã bỏ tiền tố "Lưu ").
 */
export function getDamTinhTuHoaDetail(pairs: { star: string; hoa: string }[]): string {
  const seen = new Set<string>();
  const blocks: string[] = [];
  for (const p of pairs) {
    const star = String(p?.star || "").trim();
    const hoa = String(p?.hoa || "").replace(/^Lưu\s+/u, "").trim();
    if (!star || !hoa) continue;
    const key = star + "|" + hoa;
    if (seen.has(key)) continue;
    seen.add(key);
    const text = DAM_TINH_TU_HOA_DETAIL[key];
    if (text) {
      blocks.push("  - " + star + " " + hoa + ": " + text);
    }
  }
  return blocks.length > 0
    ? blocks.join("\n")
    : "  - Khong co cap (chinh tinh x Hoa) chi tiet nao khop du lieu Dam Tinh hien co.";
}
