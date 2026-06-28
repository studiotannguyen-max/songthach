import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = { title: 'Khu Thể thao' };

export default function SportsPage() {
  return (
    <>
      <Navbar />
      <section className="relative h-[60vh] min-h-[440px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1600&q=80"
          alt="Khu Thể thao Song Thạch" fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sports-dark" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <p className="sports-hero-text text-sports-accent text-sm tracking-widest mb-2">SONG THẠCH</p>
          <h1 className="sports-hero-text text-5xl md:text-7xl font-bold text-white">KHU THỂ THAO</h1>
          <p className="text-white/70 mt-3 text-lg">Dành cho mọi người · Mở cửa 06:00 – 22:00</p>
        </div>
      </section>

      <section className="py-20" style={{ background: '#F4EEE1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'SÂN BÓNG ĐÁ', sub: '2 sân 5 người · 1 sân 7 người', href: '/sports/football',
                src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
                desc: 'Cỏ nhân tạo thế hệ 3, hệ thống đèn LED cao cấp. Phù hợp mọi trình độ.' },
              { title: 'SÂN CẦU LÔNG', sub: '3 sân tiêu chuẩn BWF', href: '/sports/badminton',
                src: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
                desc: 'Sàn PVC chính hãng, hệ thống thông gió, cho thuê vợt và cầu tại sân.' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group sports-card block">
                <div className="relative h-64 overflow-hidden" style={{ borderBottom: '3px solid #0F3C2C' }}>
                  <Image src={item.src} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-sports-dark/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h2 className="sports-hero-text text-2xl font-bold text-white">{item.title}</h2>
                    <p className="text-sports-accent text-sm">{item.sub}</p>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  <ArrowRight size={20} className="text-sports-primary shrink-0 ml-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
