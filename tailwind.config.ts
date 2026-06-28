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
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },
        // --- Sports Zone Theme (đồng bộ với trang chủ: xanh sân cỏ + lime) ---
        sports: {
          primary:   '#0F3C2C',   // Pitch — xanh sân cỏ đậm
          accent:    '#9CE25C',   // Lime
          dark:      '#10150F',   // Ink
          light:     '#F4EEE1',   // Sand
        },
        // --- Wedding Zone Theme (đồng bộ với trang chủ: hồng rose) ---
        wedding: {
          primary:   '#C8746B',   // Rose
          accent:    '#C8746B',   // Rose
          dark:      '#10150F',   // Ink
          cream:     '#FBFAF7',   // Paper
          rose:      '#F6EBE9',   // Rose nhạt
        },
        // --- Cafe Zone Theme (đồng bộ với trang chủ: hồng rose) ---
        cafe: {
          primary:   '#C8746B',   // Rose
          accent:    '#C8746B',   // Rose
          dark:      '#10150F',   // Ink
          light:     '#F6EBE9',   // Rose nhạt
        },
      },
      fontFamily: {
        sans:   ['var(--font-sans)', 'sans-serif'],
        mono:   ['var(--font-mono)', 'monospace'],
        serif:  ['var(--font-playfair)', 'serif'],
        sport:  ['var(--font-oswald)', 'sans-serif'],
        bebas:  ['var(--font-bebas)', 'sans-serif'],
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
        'float':      'float 6s ease-in-out infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
