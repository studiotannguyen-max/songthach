import type { ReactNode } from 'react';

export default function Field({
  label, htmlFor, error, hint, required, children,
}: {
  label: string; htmlFor: string; error?: string; hint?: string;
  required?: boolean; children: ReactNode;
}) {
  return (
    <div className="mb-5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-fg mb-2">
        {label}{required && <span className="text-danger ml-1">*</span>}
      </label>
      {children}
      {hint  && <p id={`${htmlFor}-hint`}  className="mt-1.5 text-xs text-fg-muted">{hint}</p>}
      {error && <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}

// Lớp dùng chung cho <input>/<select>/<textarea> đặt bên trong Field.
// Cao 48px để đạt vùng bấm tối thiểu. Nhớ gắn aria-describedby trên chính
// thẻ input khi có lỗi: aria-describedby={error ? `${id}-error` : undefined}
export const inputClass =
  'w-full min-h-[48px] rounded border border-line bg-bg px-3 text-base text-fg ' +
  'placeholder:text-fg-muted focus:border-brand-strong focus:outline-none ' +
  'focus-visible:outline-2 focus-visible:outline-brand-strong';
