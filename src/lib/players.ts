import type { SupabaseClient } from '@supabase/supabase-js';
import { applyPoints, effectivePoints } from './rating';
import type { Reconciled } from './player-import';

export type PlayerInput = {
  full_name: string;
  nickname?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  band: number;
  progress_points?: number;
  tested_at?: string | null;
  test_note?: string | null;
};

/**
 * Tạo hồ sơ mới + ghi dòng đầu tiên vào sổ điểm.
 * initial event lưu giá trị hiệu dụng tuyệt đối (band + tiến độ khởi đầu).
 */
export async function createPlayer(admin: SupabaseClient, input: PlayerInput): Promise<{ id: string }> {
  const progress = input.progress_points ?? 0;
  const { data, error } = await admin
    .from('players')
    .insert({
      full_name:       input.full_name,
      nickname:        input.nickname ?? null,
      phone:           input.phone ?? null,
      avatar_url:      input.avatar_url ?? null,
      band:            input.band,
      progress_points: progress,
      tested_at:       input.tested_at ?? null,
      test_note:       input.test_note ?? null,
    })
    .select('id')
    .single();
  if (error) throw error;

  const effective = effectivePoints({ band: input.band, progress_points: progress });
  const { error: evErr } = await admin.from('rating_events').insert({
    player_id: data.id,
    points:    effective,
    reason:    'initial',
    note:      `Xếp trình ban đầu — A${input.band} · ${effective} điểm`,
  });
  if (evErr) throw evErr;
  return { id: data.id };
}

/** Sửa thông tin hồ sơ (không đụng điểm). Band/tiến độ chỉ đổi qua adjustPoints. */
export async function updatePlayer(admin: SupabaseClient, id: string, patch: Partial<PlayerInput>): Promise<void> {
  const allowed: Record<string, unknown> = {};
  for (const k of ['full_name', 'nickname', 'phone', 'avatar_url', 'tested_at', 'test_note'] as const) {
    if (k in patch) allowed[k] = (patch as Record<string, unknown>)[k];
  }
  if (Object.keys(allowed).length === 0) return;
  const { error } = await admin.from('players').update(allowed).eq('id', id);
  if (error) throw error;
}

export async function setActive(admin: SupabaseClient, id: string, isActive: boolean): Promise<void> {
  const { error } = await admin.from('players').update({ is_active: isActive }).eq('id', id);
  if (error) throw error;
}

/**
 * Cộng/trừ điểm: ghi một dòng manual_adjust + cập nhật band/progress đã tính sẵn.
 * Trả về band/progress mới để API phản hồi cho UI.
 */
export async function adjustPoints(
  admin: SupabaseClient,
  id: string,
  delta: number,
  note: string,
): Promise<{ band: number; progress_points: number }> {
  const { data: player, error: pErr } = await admin
    .from('players').select('band, progress_points').eq('id', id).single();
  if (pErr) throw pErr;

  const next = applyPoints(player.band, player.progress_points, delta);

  const { error: evErr } = await admin.from('rating_events').insert({
    player_id: id, points: delta, reason: 'manual_adjust', note,
  });
  if (evErr) throw evErr;

  const { error: uErr } = await admin
    .from('players').update({ band: next.band, progress_points: next.progress }).eq('id', id);
  if (uErr) throw uErr;

  return { band: next.band, progress_points: next.progress };
}

/**
 * Ghi các dòng đã chọn. Mới → createPlayer. Update đổi điểm → adjustPoints bằng phần chênh lệch;
 * chỉ đổi thông tin → updatePlayer. Không dùng transaction thật (Supabase JS không hỗ trợ);
 * ghi tuần tự, lỗi thì ném ra để API báo — các dòng đã ghi trước đó vẫn nằm trong sổ (an toàn vì
 * mỗi dòng độc lập, không để lại trạng thái nửa vời trong một hồ sơ).
 */
export async function commitImport(admin: SupabaseClient, rows: Reconciled[]): Promise<{ created: number; updated: number }> {
  let created = 0, updated = 0;
  for (const row of rows) {
    if (row.kind === 'new') {
      await createPlayer(admin, {
        full_name: row.parsed.full_name, nickname: row.parsed.nickname, phone: row.parsed.phone,
        band: row.parsed.band, progress_points: row.parsed.progress_points,
        tested_at: row.parsed.tested_at, test_note: row.parsed.test_note,
      });
      created++;
    } else if (row.kind === 'update' && row.existingId) {
      const { data: cur } = await admin.from('players').select('band, progress_points').eq('id', row.existingId).single();
      await updatePlayer(admin, row.existingId, {
        full_name: row.parsed.full_name, nickname: row.parsed.nickname,
        phone: row.parsed.phone, tested_at: row.parsed.tested_at, test_note: row.parsed.test_note,
      });
      const oldEff = cur ? effectivePoints(cur) : 0;
      const newEff = effectivePoints({ band: row.parsed.band, progress_points: row.parsed.progress_points });
      if (newEff !== oldEff) {
        await adjustPoints(admin, row.existingId, newEff - oldEff, 'Nhập từ Excel — cập nhật điểm');
      }
      updated++;
    }
  }
  return { created, updated };
}
