import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // --- Base UI Theme (shadcn-style tokens) ---
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        // --- Bảng màu mới: trắng + một màu nhấn xanh lá, dùng chung toàn khu công khai ---
        bg:             'var(--bg)',
        'bg-subtle':    'var(--bg-subtle)',
        fg:             'var(--fg)',
        'fg-muted':     'var(--fg-muted)',
        line:           'var(--line)',
        ink:            'var(--ink)',
        brand:          'var(--brand)',
        'brand-strong': 'var(--brand-strong)',
        danger:         'var(--danger)',

        // --- DI SẢN: CHỈ dành cho khu /admin ---
        // Khu admin dùng các lớp này ở ~63 chỗ và spec yêu cầu giữ nguyên giao diện admin.
        // Mã màu để literal, không qua biến, nên đổi token công khai không ảnh hưởng.
        // KHÔNG dùng trong khu công khai — Task 14 có bước grep chặn.
        sports: {
          primary: '#C5532F', accent: '#E3A21A', dark: '#3B2A1E', light: '#F4E9D6',
        },
        wedding: {
          primary: '#C5532F', accent: '#E3A21A', dark: '#3B2A1E', cream: '#FFFBF2', rose: '#F1C9B4',
        },
        cafe: {
          primary: '#C5532F', accent: '#E3A21A', dark: '#3B2A1E', light: '#F1C9B4',
        },
      },
      fontFamily: {
        sans:    ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        // DI SẢN: admin/login còn dùng `font-bebas`. Trỏ về font tiêu đề mới
        // thay vì nạp thêm Barlow Condensed chỉ cho một trang nội bộ.
        bebas:   ['var(--font-display)', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.8s ease-out forwards',
        'slide-left': 'slideLeft 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
