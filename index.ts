// DEPRECATED: Entrypoint serverless cho Vercel đã chuyển sang ./api/index.ts
// (Vercel map /api/* -> /api/index). File này chỉ giữ lại để tương thích ngược
// và đã sửa import cho hợp lệ (trước đây "../server" trỏ ra ngoài project gây lỗi).
// Có thể xóa thủ công khi chắc chắn không còn tham chiếu.
export { default } from "./server";
