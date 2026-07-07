-- supabase/migrations/010_finance_entries.sql
-- Sổ thu chi nội bộ (thay cho Excel) — chạy trong Supabase SQL Editor

CREATE TABLE finance_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date  DATE NOT NULL,
  type        VARCHAR(10) NOT NULL CHECK (type IN ('thu', 'chi')),
  category    VARCHAR(20) CHECK (category IN ('luong', 'dien_nuoc', 'dung_cu', 'sua_chua', 'khac')),
  description TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX finance_entries_entry_date_idx ON finance_entries (entry_date, created_at);

ALTER TABLE finance_entries ENABLE ROW LEVEL SECURITY;
-- Không tạo policy nào cho anon/authenticated — chỉ service role (admin API) truy cập,
-- giống payments/court_blocks ở 004_security_rls.sql.
