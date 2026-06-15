'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

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
      <div className="text-center py-16 px-8">
        <CheckCircle size={56} className="text-wedding-accent mx-auto mb-6" />
        <h3 className="wedding-serif text-3xl font-bold text-wedding-dark mb-3">Cảm ơn bạn!</h3>
        <p className="text-wedding-primary/70 leading-relaxed max-w-sm mx-auto">
          Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ tư vấn trong vòng <strong>24 giờ</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs tracking-widest text-wedding-primary/60 uppercase mb-2">Họ & Tên *</label>
          <input {...register('contact_name')} placeholder="Nguyễn Văn A" className="wedding-input" />
          {errors.contact_name && <p className="text-red-400 text-xs mt-1">{errors.contact_name.message}</p>}
        </div>
        <div>
          <label className="block text-xs tracking-widest text-wedding-primary/60 uppercase mb-2">Điện thoại *</label>
          <input {...register('phone')} placeholder="0901 234 567" className="wedding-input" />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-widest text-wedding-primary/60 uppercase mb-2">Email</label>
        <input {...register('email')} placeholder="example@email.com" className="wedding-input" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs tracking-widest text-wedding-primary/60 uppercase mb-2">Ngày dự kiến *</label>
          <input type="date" {...register('event_date')} className="wedding-input" />
          {errors.event_date && <p className="text-red-400 text-xs mt-1">{errors.event_date.message}</p>}
        </div>
        <div>
          <label className="block text-xs tracking-widest text-wedding-primary/60 uppercase mb-2">Số bàn tiệc *</label>
          <input type="number" {...register('table_count', { valueAsNumber: true })} placeholder="30" className="wedding-input" />
          {errors.table_count && <p className="text-red-400 text-xs mt-1">{errors.table_count.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-widest text-wedding-primary/60 uppercase mb-2">Sảnh mong muốn</label>
        <select {...register('hall_preference')} className="wedding-input bg-transparent cursor-pointer">
          {HALLS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs tracking-widest text-wedding-primary/60 uppercase mb-2">Yêu cầu đặc biệt</label>
        <textarea
          {...register('special_requests')}
          rows={4}
          placeholder="Chủ đề trang trí, thực đơn đặc biệt, yêu cầu âm nhạc..."
          className="wedding-input resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="wedding-btn w-full flex items-center justify-center gap-3 py-5"
      >
        {isSubmitting ? (
          <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <><Send size={16} /> Gửi yêu cầu tư vấn</>
        )}
      </button>

      <p className="text-center text-xs text-wedding-primary/50">
        Tư vấn hoàn toàn miễn phí · Phản hồi trong 24 giờ
      </p>
    </form>
  );
}
