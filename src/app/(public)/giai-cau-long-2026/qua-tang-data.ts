export interface GiftBundle {
  group: string;      // nhóm học sinh, vd 'Tiểu học'
  bundle: string;     // tên bộ quà, vd 'Bộ VPP Cấp 1'
  count: number;      // số HS (hoặc số xe với phần thưởng)
  unitPrice: number;  // đơn giá/phần (đ)
  total: number;      // thành tiền (đ)
  note: string;       // mô tả ngắn nội dung bộ quà
  isReward?: boolean; // true = phần thưởng hiện vật (xe đạp)
}

export const QUA_TANG_DATA: GiftBundle[] = [
  { group: 'Tiểu học', bundle: 'Bộ VPP Cấp 1', count: 45, unitPrice: 736000, total: 33120000, note: 'Vở, bìa bao, bút chì/gel, bộ thước, bút màu, hồ, kéo, bảng… trọn bộ dụng cụ học tập.' },
  { group: 'THCS', bundle: 'Bộ VPP Cấp 2', count: 23, unitPrice: 670000, total: 15410000, note: 'Vở, bút bi/highlight, bút chì bấm, và máy tính Casio Fx-580VN X.' },
  { group: 'Mầm non', bundle: 'Phần quà sữa & bánh', count: 14, unitPrice: 800000, total: 11200000, note: 'Sữa tươi tiệt trùng, sữa chua uống & bánh dinh dưỡng.' },
  { group: 'Phần thưởng', bundle: 'Xe đạp', count: 10, unitPrice: 1600000, total: 16000000, isReward: true, note: 'Phần thưởng hiện vật tiếp thêm động lực đến trường cho các em.' },
];

export const QUA_TANG_TONG = QUA_TANG_DATA.reduce((sum, b) => sum + b.total, 0);
