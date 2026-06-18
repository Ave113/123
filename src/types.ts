export type BirthplaceRegion = 
  | "Miền Nam VN" 
  | "Miền Trung VN (Vĩ tuyến 17 trở vào: Huế, Đà Nẵng, Khánh Hòa...)"
  | "Miền Trung VN (Vĩ tuyến 17 trở ra: Thanh Hóa, Nghệ An, Hà Tĩnh, Quảng Bình)"
  | "Miền Bắc VN / Khác" 
  | "Nước ngoài (Quy đổi GMT+7)";

export interface BirthInput {
  name: string;
  solarDate: string; // YYYY-MM-DD
  solarTime: string; // HH:MM
  birthplace: BirthplaceRegion;
  gender: "Nam" | "Nữ";
  customApiKey: string;
  modelSelection: "gemini-3.5-flash" | "gemini-3.1-flash-lite";
  originalTimezoneOffset?: number; // for overseas births
}

// Một lượt hỏi đáp follow-up trên lá số đã luận giải.
export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

// Bản luận giải đã lưu kèm hồ sơ (bền hóa vào localStorage cùng SavedProfile),
// để mở lại hồ sơ không phải gọi AI lại.
export interface SavedInterpretation {
  content: string;
  modelUsed: string;
  transitYear: number;
  createdAt: string;
  chat: ChatTurn[];
}

export interface SavedProfile extends Omit<BirthInput, "customApiKey"> {
  id: string;
  createdAt: string;
  // Đính kèm bản luận giải + lịch sử hỏi đáp gần nhất (nếu có).
  savedInterpretation?: SavedInterpretation;
}
