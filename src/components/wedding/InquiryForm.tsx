'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Field, inputClass, Button } from '@/components/ui';

const schema = z.object({
  contact_name:     z.string().min(2, 'Vui lòng nhập họ tên'),
  phone:            z.string().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
  email:            z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  event_date:       z.string().min(1, 'Vui lòng chọn ngày dự kiến'),
  table_count:      z.number({ invalid_type_error: 'Nhập số bàn' }).min(1).max(200),
  hall_preference:  z.string().optional(),
  special_requests: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const HALLS = ['Chưa xác định', 'Sảnh Grand (500 khách)', 'Sảnh Rose (300 khách)', 'Sảnh Garden (150 khách)'];

export default function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch('/api/wedding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error ?? 'Có lỗi xảy ra, vui lòng thử lại.');
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16 px-8 rounded border border-line bg-bg">
        <CheckCircle size={56} className="text-brand-strong mx-auto mb-6" aria-hidden="true" />
        <h3 className="text-2xl mb-3">Cảm ơn bạn!</h3>
        <p className="text-fg-muted max-w-sm mx-auto">
          Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ tư vấn trong vòng <strong>24 giờ</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <Field label="Họ &amp; tên" htmlFor="contact_name" required error={errors.contact_name?.message}>
          <input
            id="contact_name"
            placeholder="Nguyễn Văn A"
            aria-describedby={errors.contact_name ? 'contact_name-error' : undefined}
            className={inputClass}
            {...register('contact_name')}
          />
        </Field>

        <Field label="Điện thoại" htmlFor="phone" required error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            placeholder="0901 234 567"
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={inputClass}
            {...register('phone')}
          />
        </Field>
      </div>

      <Field label="Email" htmlFor="email" hint="Không bắt buộc — dùng để gửi báo giá chi tiết">
        <input
          id="email"
          type="email"
          inputMode="email"
          placeholder="example@email.com"
          aria-describedby="email-hint"
          className={inputClass}
          {...register('email')}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <Field label="Ngày dự kiến" htmlFor="event_date" required error={errors.event_date?.message}>
          <input
            id="event_date"
            type="date"
            aria-describedby={errors.event_date ? 'event_date-error' : undefined}
            className={inputClass}
            {...register('event_date')}
          />
        </Field>

        <Field label="Số bàn tiệc" htmlFor="table_count" required error={errors.table_count?.message}>
          <input
            id="table_count"
            type="number"
            inputMode="numeric"
            placeholder="30"
            aria-describedby={errors.table_count ? 'table_count-error' : undefined}
            className={inputClass}
            {...register('table_count', { valueAsNumber: true })}
          />
        </Field>
      </div>

      <Field label="Sảnh mong muốn" htmlFor="hall_preference">
        <select id="hall_preference" className={`${inputClass} cursor-pointer`} {...register('hall_preference')}>
          {HALLS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </Field>

      <Field label="Yêu cầu đặc biệt" htmlFor="special_requests">
        <textarea
          id="special_requests"
          rows={4}
          placeholder="Chủ đề trang trí, thực đơn đặc biệt, yêu cầu âm nhạc..."
          className={`${inputClass} py-3 resize-none`}
          {...register('special_requests')}
        />
      </Field>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <><Send size={16} aria-hidden="true" /> Gửi yêu cầu tư vấn</>
        )}
      </Button>

      <p className="text-center text-sm text-fg-muted mt-4">
        Tư vấn hoàn toàn miễn phí · Phản hồi trong 24 giờ
      </p>
    </form>
  );
}
