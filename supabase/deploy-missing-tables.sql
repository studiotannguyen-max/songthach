-- ============================================================================
-- SONG THẠCH — SCRIPT TỔNG HỢP: tạo các bảng còn thiếu trên Supabase production
-- ============================================================================
-- Gộp 007_missing_core_tables.sql + 005_bookings_schema_sync.sql + 006_gallery.sql
-- thành 1 script duy nhất để copy/paste 1 lần vào Supabase SQL Editor → Run.
--
-- KHÔNG có lệnh CREATE TABLE bookings / CREATE TABLE posts (2 bảng này đã tồn tại).
-- An toàn chạy lại nhiều lần (idempotent).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== USERS =====

