import type { SupabaseClient } from '@supabase/supabase-js';
import { applyPoints, effectivePoints, replayLedger, BANDS, type Gender } from './rating';
import type { Reconciled } from './player-import';

export type PlayerInput = {
  full_name: string;
  nickname?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  gender: Gender;
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
      gender:          input.gender,
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
 * Đổi giới tính rồi quy lại hạng theo trần mới. Tổng điểm trong sổ không đổi —
 * nam A500 tiến độ 20 (hiệu dụng 520) chuyển sang nữ thành A400 tiến độ 120.
 */
export async function setGender(admin: SupabaseClient, id: string, gender: Gender): Promise<void> {
  const { error } = await admin.from('players').update({ gender }).eq('id', id);
  if (error) throw error;
  await recalcFromLedger(admin, id);
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
    .from('players').select('band, progress_points, gender').eq('id', id).single();
  if (pErr) throw pErr;

  const next = applyPoints(player.band, player.progress_points, delta, player.gender as Gender);

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
 * Tính lại band/tiến độ từ TOÀN BỘ sổ điểm rồi ghi đè hai cột tính sẵn.
 * Dùng sau khi sửa/xoá một dòng cũ — cộng dồn kiểu adjustPoints không còn đúng nữa
 * vì dòng bị đổi nằm ở giữa sổ.
 */
export async function recalcFromLedger(
  admin: SupabaseClient,
  playerId: string,
): Promise<{ band: number; progress_points: number }> {
  // Trần hạng khác nhau giữa nam và nữ nên phải biết giới tính mới quy được điểm ra hạng.
  const [{ data, error }, { data: player, error: pErr }] = await Promise.all([
    admin.from('rating_events').select('points').eq('player_id', playerId),
    admin.from('players').select('gender').eq('id', playerId).single(),
  ]);
  if (error) throw error;
  if (pErr) throw pErr;

  const { band, progress } = replayLedger(data ?? [], player.gender as Gender);
  const { error: uErr } = await admin
    .from('players').update({ band, progress_points: progress }).eq('id', playerId);
  if (uErr) throw uErr;

  return { band, progress_points: progress };
}

/** Sửa một dòng sổ (điểm và/hoặc lý do) rồi tính lại trình độ.
 *  Lọc cả player_id để không bao giờ chạm sổ của người khác. */
export async function updateRatingEvent(
  admin: SupabaseClient,
  playerId: string,
  eventId: string,
  patch: { points: number; note: string },
): Promise<{ band: number; progress_points: number }> {
  const { data, error } = await admin
    .from('rating_events')
    .update({ points: patch.points, note: patch.note })
    .eq('id', eventId).eq('player_id', playerId)
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Không tìm thấy dòng sổ này');

  return recalcFromLedger(admin, playerId);
}

/** Xoá một dòng sổ rồi tính lại trình độ. Chốt chặn dòng 'initial' nằm ở lớp API. */
export async function deleteRatingEvent(
  admin: SupabaseClient,
  playerId: string,
  eventId: string,
): Promise<{ band: number; progress_points: number }> {
  const { data, error } = await admin
    .from('rating_events')
    .delete()
    .eq('id', eventId).eq('player_id', playerId)
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Không tìm thấy dòng sổ này');

  return recalcFromLedger(admin, playerId);
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
    // Chốt chặn phía server — PUT gửi lại dữ liệu client, không tin tuyệt đối.
    const { band, progress_points } = row.parsed;
    if (!(BANDS as number[]).includes(band) || progress_points < 0 || (band < 500 && progress_points >= 100)) {
      throw new Error(`Dòng ${row.rowNum}: mức trình/tiến độ không hợp lệ`);
    }
    if (row.kind === 'new') {
      await createPlayer(admin, {
        full_name: row.parsed.full_name, nickname: row.parsed.nickname, phone: row.parsed.phone,
        // File Excel chưa có cột giới tính — mọi dòng nhập vào là nam, sửa tay sau nếu cần.
        gender: 'nam',
        band, progress_points,
        tested_at: row.parsed.tested_at, test_note: row.parsed.test_note,
      });
      created++;
    } else if (row.kind === 'update' && row.existingId) {
      const { data: cur, error: curErr } = await admin.from('players').select('band, progress_points').eq('id', row.existingId).single();
      if (curErr || !cur) throw new Error(`Dòng ${row.rowNum}: không đọc được hồ sơ hiện tại để cập nhật`);
      await updatePlayer(admin, row.existingId, {
        full_name: row.parsed.full_name, nickname: row.parsed.nickname,
        phone: row.parsed.phone, tested_at: row.parsed.tested_at, test_note: row.parsed.test_note,
      });
      const oldEff = effectivePoints(cur);
      const newEff = effectivePoints({ band, progress_points });
      if (newEff !== oldEff) {
        await adjustPoints(admin, row.existingId, newEff - oldEff, 'Nhập từ Excel — cập nhật điểm');
      }
      updated++;
    }
  }
  return { created, updated };
}
