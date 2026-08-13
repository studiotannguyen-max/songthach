// Danh sách nhà tài trợ đồng hành cùng Giải Cầu Lông Song Thạch Mở Rộng 2026.
// Thêm / sửa / bớt nhà tài trợ chỉ cần chỉnh mảng bên dưới.
//
//   name : tên nhà tài trợ (bắt buộc)
//   logo : đường dẫn ảnh logo, đặt trong /public — ví dụ '/nha-tai-tro/cuong-apple.png'.
//          Bỏ trống thì tự hiển thị ô monogram (chữ cái đầu của tên) làm placeholder.
//   url  : link website/fanpage (tùy chọn) — có thì tên bọc thành liên kết.

export type NhaTaiTro = {
  name: string;
  logo?: string;
  url?: string;
};

export const NHA_TAI_TRO_DATA: NhaTaiTro[] = [
  { name: 'Cường Apple', logo: 'https://tqhihuvpjegjmbbokcfb.supabase.co/storage/v1/object/public/post-images/1784542033620-jmhavxdrxi.jpg' },
  { name: 'Vy Vy Bridal', logo: 'https://tqhihuvpjegjmbbokcfb.supabase.co/storage/v1/object/public/post-images/1784542075191-ut7lw9ndq3.jpg' },
  { name: 'Đỗ Kim Ngân' },
];
