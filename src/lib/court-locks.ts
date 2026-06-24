// Các sân nằm chung diện tích vật lý — đặt 1 sân thì sân liên kết phải bị khoá cùng giờ.
// Sân 7A (fb7-1) chiếm đúng diện tích của Sân 5A (fb5-1) + Sân 5B (fb5-2). Sân 5C không liên quan.
const COURT_LOCK_GROUPS: Record<string, string[]> = {
  'fb7-1': ['fb5-1', 'fb5-2'],
  'fb5-1': ['fb7-1'],
  'fb5-2': ['fb7-1'],
};

export function getLockGroupCourtIds(courtId: string): string[] {
  return [courtId, ...(COURT_LOCK_GROUPS[courtId] ?? [])];
}
