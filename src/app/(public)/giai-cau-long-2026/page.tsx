import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import './giai.css';
import { HOC_BONG_DATA } from './hoc-bong-data';
import { QUA_TANG_DATA, QUA_TANG_TONG } from './qua-tang-data';

function obscureName(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return name;
  const last = words[words.length - 1];
  const chars = last.split('');
  const hidden = chars.map((c, i) => (i < 2 ? '*' : c)).join('');
  words[words.length - 1] = hidden;
  return words.join(' ');
}

export const metadata: Metadata = {
  title: 'Điều Lệ Giải Cầu Lông Song Thạch Mở Rộng — Tranh Cúp iStudio 2026',
  description: 'Điều lệ chính thức Giải Cầu Lông Song Thạch Mở Rộng Tranh Cúp iStudio 2026 — gây quỹ trao học bổng cho học sinh vượt khó học giỏi xã Hưng Thịnh, TP Đồng Nai. Thi đấu 07 · 08 · 09/08/2026.',
};

const FORM_URL = 'https://docs.google.com/forms/d/1T7WlV7UVsLfAykyDU7FwXJL_ks74St44Y2o3C_QKkvY/viewform';

const MedalIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="14" r="6"/>
    <path d="M9 8L7 2h10l-2 6"/>
  </svg>
);

const GiftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="8" width="18" height="13" rx="1.5"/>
    <path d="M3 12h18M12 8v13M12 8S9 3 6.5 4.5 9 8 12 8s5.5.5 5.5-1.5S14.5 3 12 8z"/>
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);

const formatVND = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export default function GiaiCauLong2026Page() {
  return (
    <>
      <Navbar />

      <div className="giai-page" style={{ paddingTop: '80px' }}>

        {/* Hidden SVG symbol */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
          <symbol id="ic-racket-giai" viewBox="0 0 24 24">
            <defs>
              <clipPath id="rkclip-giai"><ellipse cx="12" cy="8" rx="5.3" ry="6.3"/></clipPath>
            </defs>
            <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="8" rx="6.1" ry="7.1"/>
              <g clipPath="url(#rkclip-giai)" strokeWidth="0.9">
                <path d="M8.5 1v14M12 1v14M15.5 1v14M5 5h14M5 8h14M5 11h14"/>
              </g>
              <path d="M12 15.1v5.4"/><path d="M10.2 20.5h3.6"/>
            </g>
          </symbol>
        </svg>

        {/* Ribbon */}
        <div className="ribbon">
          Đơn vị tổ chức: <b>CLB Cầu Lông Song Thạch</b> &nbsp;·&nbsp; Đơn vị đồng hành: <b>Đoàn Thanh niên xã Hưng Thịnh</b>
        </div>

        {/* Hero */}
        <section className="hero">
          <svg className="sunburst" viewBox="0 0 200 200" aria-hidden="true">
            <g fill="currentColor">
              <path d="M100 0l8 40-8 0-8-40zM100 200l8-40-8 0-8 40zM0 100l40 8 0-8-40-8zM200 100l-40 8 0-8 40-8zM29 29l34 23-6 6-23-34zM171 171l-34-23 6-6 23 34zM171 29l-23 34-6-6 34-23zM29 171l23-34 6 6-34 23z"/>
              <circle cx="100" cy="100" r="20"/>
            </g>
          </svg>
          <svg className="racket-bg" aria-hidden="true">
            <use href="#ic-racket-giai"/>
          </svg>
          <div className="hero-inner">
            <span className="sticker"><span className="dot"/> Điều lệ chính thức · Giải gây quỹ từ thiện</span>
            <h1 className="title">
              Giải Cầu Lông <span className="a">Song Thạch</span> <span className="b">Mở Rộng — Tranh Cúp iStudio</span>
            </h1>
            <p className="lede">
              Giao lưu học hỏi, lan tỏa yêu thương — gây quỹ trao học bổng cho các em học sinh vượt khó học giỏi trên địa bàn xã Hưng Thịnh.
            </p>
            <div className="facts">
              <div className="fact">
                <span className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                  </svg>
                </span>
                <div><div className="k">Thời gian</div><div className="v">07 · 08 · 09/08/2026</div></div>
              </div>
              <div className="fact">
                <span className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 21s-7-5.3-7-11a7 7 0 0114 0c0 5.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>
                  </svg>
                </span>
                <div><div className="k">Địa điểm</div><div className="v">Sân CL Song Thạch, xã Hưng Thịnh, TP Đồng Nai</div></div>
              </div>
              <div className="fact">
                <span className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 15h4"/>
                  </svg>
                </span>
                <div><div className="k">Hạn chốt ĐK</div><div className="v">01/08/2026</div></div>
              </div>
            </div>
            <div className="hero-cta">
              <a className="g-btn btn-terra btn-lg" href={FORM_URL} target="_blank" rel="noopener">
                Đăng ký thi đấu <ArrowIcon />
              </a>
              <a className="g-btn btn-cream btn-lg" href="#noidung">Xem nội dung &amp; thể lệ</a>
            </div>
          </div>
        </section>

        <svg className="wave" viewBox="0 0 1200 46" preserveAspectRatio="none" aria-hidden="true">
          <path fill="#FBF4E6" d="M0,30 C150,6 300,6 450,24 C600,42 750,42 900,24 C1050,6 1150,6 1200,18 L1200,46 L0,46 Z"/>
        </svg>

        {/* Groups */}
        <section id="noidung">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">Nội dung &amp; khen thưởng</span>
              <h2>6 nhóm thi đấu</h2>
              <p>Mỗi nội dung chỉ tổ chức khi có từ 12 VĐV/cặp trở lên (Nhóm 5 &amp; 6 từ 16 cặp — tối đa 64 cặp). Tất cả VĐV đạt giải Nhất, Nhì, Ba đều được trao Huy chương, Bằng khen và Quà của nhà tài trợ.</p>
            </div>
            <div className="doi-tuong">
              <div className="dt-title">Đối tượng tham dự</div>
              <ul>
                <li>Các CLB khách mời;</li>
                <li>Có hộ khẩu thường trú, tạm trú 6 tháng tại Đồng Nai (danh sách đăng ký phải có xác nhận của CLB).</li>
              </ul>
              <p className="grp-note" style={{ marginTop: '8px' }}><strong>Nhóm 6</strong> mở rộng các tỉnh.</p>
            </div>
            <div className="groups">

              <article className="grp">
                <div className="top">
                  <div><span className="gnum">Nhóm 1</span><h3>Tiểu học</h3><div className="age">≤ 11 tuổi</div></div>
                  <span className="fee free">Miễn phí</span>
                </div>
                <div className="content">
                  <div className="c-lbl">Nội dung</div>
                  <div className="events"><span>Đơn nam</span><span>Đơn nữ</span></div>
                  <p className="grp-note">Cấm VĐV đạt thành tích quốc gia, giải Nhất tỉnh hoặc năng khiếu 2025–2026 (buộc lên Nhóm 2).</p>
                  <div className="prize-gift"><GiftIcon /><span>Huy chương + Bằng khen + Quà BTC</span></div>
                </div>
              </article>

              <article className="grp">
                <div className="top">
                  <div><span className="gnum">Nhóm 2</span><h3>12 – 13 tuổi</h3><div className="age">Thiếu niên</div></div>
                  <span className="fee">100.000đ</span>
                </div>
                <div className="content">
                  <div className="c-lbl">Nội dung</div>
                  <div className="events"><span>Đơn nam</span><span>Đơn nữ</span><span>Đôi nam</span></div>
                  <p className="grp-note">Cấm VĐV Quốc gia, giải Nhất tỉnh/năng khiếu 2025–2026. Tổ chức khi đủ 12 VĐV/cặp — không giới hạn đăng ký.</p>
                  <div className="c-lbl" style={{ marginTop: '8px' }}>Giải đơn</div>
                  <div className="prize-row"><MedalIcon className="pmedal g" /> Nhất <span className="amt">350.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal s" /> Nhì <span className="amt">250.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal b" /> Ba <span className="amt">150.000đ</span></div>
                  <div className="c-lbl" style={{ marginTop: '8px' }}>Giải đôi</div>
                  <div className="prize-row"><MedalIcon className="pmedal g" /> Nhất <span className="amt">500.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal s" /> Nhì <span className="amt">400.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal b" /> Ba <span className="amt">300.000đ</span></div>
                  <div className="prize-gift">+ Huy chương &amp; bằng khen cho mỗi giải</div>
                </div>
              </article>

              <article className="grp">
                <div className="top">
                  <div><span className="gnum">Nhóm 3</span><h3>14 – 15 tuổi</h3><div className="age">Thiếu niên</div></div>
                  <span className="fee">100.000đ</span>
                </div>
                <div className="content">
                  <div className="c-lbl">Nội dung</div>
                  <div className="events"><span>Đơn nam</span><span>Đơn nữ</span><span>Đôi nam</span></div>
                  <p className="grp-note">Cấm VĐV Quốc gia, giải Nhất tỉnh/năng khiếu 2025–2026. Tổ chức khi đủ 12 VĐV/cặp — không giới hạn đăng ký.</p>
                  <div className="c-lbl" style={{ marginTop: '8px' }}>Giải đơn</div>
                  <div className="prize-row"><MedalIcon className="pmedal g" /> Nhất <span className="amt">350.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal s" /> Nhì <span className="amt">250.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal b" /> Ba <span className="amt">150.000đ</span></div>
                  <div className="c-lbl" style={{ marginTop: '8px' }}>Giải đôi</div>
                  <div className="prize-row"><MedalIcon className="pmedal g" /> Nhất <span className="amt">500.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal s" /> Nhì <span className="amt">400.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal b" /> Ba <span className="amt">300.000đ</span></div>
                  <div className="prize-gift">+ Huy chương &amp; bằng khen &amp; Quà nhà tài trợ</div>
                </div>
              </article>

              <article className="grp">
                <div className="top">
                  <div><span className="gnum">Nhóm 4</span><h3>16 – 18 tuổi</h3><div className="age">Thanh thiếu niên</div></div>
                  <span className="fee">150.000đ</span>
                </div>
                <div className="content">
                  <div className="c-lbl">Nội dung</div>
                  <div className="events"><span>Đôi nam</span><span>Đôi nam nữ</span></div>
                  <p className="grp-note">Cấm VĐV QG, giải Nhất tỉnh/năng khiếu 2025–2026. Tổ chức khi đủ 12 cặp — không giới hạn đăng ký.</p>
                  <div className="prize-row"><MedalIcon className="pmedal g" /> Giải nhất <span className="amt">800.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal s" /> Giải nhì <span className="amt">600.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal b" /> Giải ba <span className="amt">400.000đ</span></div>
                  <div className="prize-gift">+ Huy chương &amp; bằng khen &amp; Quà nhà tài trợ</div>
                </div>
              </article>

              <article className="grp">
                <div className="top">
                  <div><span className="gnum">Nhóm 5</span><h3>Phong trào &amp; Khách mời</h3><div className="age">Không phân biệt lứa tuổi</div></div>
                  <span className="fee">250.000đ</span>
                </div>
                <div className="content">
                  <div className="c-lbl">Nội dung</div>
                  <div className="events"><span>Đôi nam</span><span>Đôi nữ</span><span>Đôi nam nữ</span></div>
                  <p className="grp-note">Cấm VĐV đạt thành tích Giải vô địch cá nhân, vô địch đồng đội của TP Đồng Nai và Toàn Quốc từ năm 2024 đến nay. Cấm VĐV đạt hạng I, II các giải phong trào Ngọc Phát, Tiến Minh, Trường An, ZATA từ năm 2024 đến nay. Chỉ tổ chức khi đủ 16 cặp VĐV/nội dung.</p>
                  <p className="grp-note"><strong>Có thể ưu tiên khách mời của BTC.</strong></p>
                  <div className="prize-row"><MedalIcon className="pmedal g" /> Giải nhất <span className="amt">3.000.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal s" /> Giải nhì <span className="amt">2.000.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal b" /> Giải ba <span className="amt">1.000.000đ</span></div>
                  <div className="prize-gift">+ Huy chương &amp; bằng khen cho mỗi giải</div>
                </div>
              </article>

              <article className="grp">
                <div className="top">
                  <div><span className="gnum">Nhóm 6</span><h3>Nâng cao</h3><div className="age">Không giới hạn tỉnh thành</div></div>
                  <span className="fee">250.000đ</span>
                </div>
                <div className="content">
                  <div className="c-lbl">Nội dung</div>
                  <div className="events"><span>Đôi nam</span><span>Đôi nam nữ</span></div>
                  <p className="grp-note">Cấm VĐV tham gia các giải Quốc gia. Chỉ tổ chức khi đủ 16 cặp VĐV/nội dung. Nhận tối đa 64 cặp.</p>
                  <p className="grp-note"><strong>Nhóm 6 mở rộng các tỉnh.</strong></p>
                  <div className="prize-row"><MedalIcon className="pmedal g" /> Giải nhất <span className="amt">3.500.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal s" /> Giải nhì <span className="amt">2.000.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal b" /> Giải ba <span className="amt">1.000.000đ</span></div>
                  <div className="prize-gift">+ Huy chương &amp; bằng khen cho mỗi giải</div>
                </div>
              </article>

            </div>
          </div>
        </section>

        {/* Lệ phí + Quy định — ngang nhau */}
        <section id="lephi-quydinh" style={{ background:'var(--cream2)' }}>
          <div className="wrap">
            <div className="lephi-rules-row">
              <div id="lephi">
                <div className="sec-head">
                  <span className="kicker">Lệ phí thi đấu</span>
                  <h2>Mức lệ phí theo nhóm</h2>
                  <p>Lệ phí tính theo mỗi nội dung đăng ký của một vận động viên.</p>
                </div>
                <table className="feetable">
                  <thead>
                    <tr><th>Nhóm</th><th>Đối tượng</th><th>Lệ phí</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Nhóm 1</td><td>Tiểu học (≤ 11 tuổi)</td><td>Miễn phí</td></tr>
                    <tr><td>Nhóm 2 &amp; 3</td><td>12 – 15 tuổi</td><td>100.000đ / VĐV / nội dung</td></tr>
                    <tr><td>Nhóm 4</td><td>16 – 18 tuổi</td><td>150.000đ / VĐV / nội dung</td></tr>
                    <tr><td>Nhóm 5 &amp; 6</td><td>Phong trào</td><td>250.000đ / VĐV / nội dung</td></tr>
                  </tbody>
                </table>
              </div>
              <div id="quydinh">
                <div className="sec-head">
                  <span className="kicker">Quy định thi đấu</span>
                  <h2>Điều lệ thi đấu</h2>
                </div>
                <div className="rules-grid">
                  <div className="rule"><span className="ico">1</span><p><strong>Luật thi đấu:</strong> Tất cả các nhóm thi đấu loại trực tiếp, mỗi trận 3 sét — thắng 2 sét. Mỗi sét đến <strong>15 điểm</strong>, chạm tối đa <strong>17 điểm</strong>.</p></div>
                  <div className="rule"><span className="ico">2</span><p>Mỗi nội dung chỉ tổ chức khi có từ <strong>12 VĐV/cặp trở lên</strong>; Nhóm 5 &amp; 6 từ <strong>16 cặp</strong> (tối đa 64 cặp).</p></div>
                  <div className="rule"><span className="ico">3</span><p>Cầu thi đấu chính thức là <strong>cầu Bamboo tốc độ 76</strong>.</p></div>
                  <div className="rule"><span className="ico">4</span><p>VĐV mang theo <strong>CCCD / bản sao Giấy khai sinh / Hộ chiếu / Thẻ học sinh</strong> còn hiệu lực để xuất trình khi có yêu cầu.</p></div>
                  <div className="rule"><span className="ico">5</span><p>Khiếu nại phải bằng văn bản của trưởng đoàn, nộp trước khi trận đấu diễn ra. Phí khiếu nại <strong>300.000đ/lần</strong> — không hoàn lại nếu khiếu nại sai.</p></div>
                  <div className="rule"><span className="ico">6</span><p>BTC chỉ giải quyết khiếu nại <strong>trước vòng bán kết</strong>; từ bán kết trở đi không giải quyết khiếu nại về nhân sự.</p></div>
                  <div className="rule"><span className="ico">7</span><p>Sau khi đăng ký <strong>không thể thay đổi VĐV</strong> — đề nghị cân nhắc kỹ trước khi đăng ký.</p></div>
                  <div className="rule"><span className="ico">8</span><p>Ban tổ chức có quyền thay đổi hoặc bổ sung điều lệ cho phù hợp với hoàn cảnh thực tế.</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Đăng ký */}
        <section className="register" id="dangky">
          <svg className="rays" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g fill="currentColor">
              <path d="M100 0l6 60h-12zM100 200l6-60h-12zM0 100l60 6v-12zM200 100l-60 6v-12zM26 26l44 32-10 10zM174 174l-44-32 10-10zM174 26l-32 44-10-10zM26 174l32-44 10 10z"/>
            </g>
          </svg>
          <div className="wrap reg-card" style={{ paddingTop: '36px', paddingBottom: '36px' }}>
            <div>
              <span className="kicker">Đăng ký tham gia</span>
              <h2>Sẵn sàng ra sân?</h2>
              <p className="lede">Hoàn tất đăng ký qua Google Biểu mẫu và chuyển khoản lệ phí theo hướng dẫn bên cạnh.</p>
              <a className="g-btn btn-mustard btn-lg" href={FORM_URL} target="_blank" rel="noopener" style={{ marginTop: '24px' }}>
                Mở biểu mẫu đăng ký <ArrowIcon />
              </a>
            </div>
            <div className="pay">
              <h4>Hình thức nộp lệ phí — chuyển khoản</h4>
              <div className="row"><span className="lbl">Số tài khoản</span><span className="val">0988918418</span></div>
              <div className="row"><span className="lbl">Ngân hàng</span><span className="val">VPBANK</span></div>
              <div className="row"><span className="lbl">Chủ tài khoản</span><span className="val">Nguyễn Thị Thùy Linh</span></div>
              <div className="row"><span className="lbl">Nội dung CK</span><span className="val">Le phi CL [Tên] Nhom [số]</span></div>
              <p className="note">Chuyển khoản xong liên hệ Zalo <strong>0988918418</strong> để xác nhận. Đã đăng ký không hoàn lệ phí.</p>
            </div>
          </div>
        </section>

        {/* Danh sách học sinh nhận học bổng */}
        <section id="hoc-bong" style={{ background: 'var(--paper)' }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">Mục tiêu gây quỹ</span>
              <h2>Danh sách học bổng 2026</h2>
              <p>
                82 học sinh vượt khó trên địa bàn xã Hưng Thịnh sẽ được trao học bổng từ quỹ giải.
                Tên học sinh được ẩn một phần để bảo vệ quyền riêng tư.
              </p>
            </div>

            <div className="hb-table-wrap">
              <table className="hb-table">
                <thead>
                  <tr>
                    <th className="hb-stt">STT</th>
                    <th className="hb-name">Họ và tên</th>
                    <th className="hb-sit">Hoàn cảnh</th>
                  </tr>
                </thead>
                <tbody>
                  {HOC_BONG_DATA.flatMap((g) => g.students).map((s) => (
                    <tr key={s.stt}>
                      <td className="hb-stt">{s.stt}</td>
                      <td className="hb-name">{obscureName(s.name)}</td>
                      <td className="hb-sit">{s.situation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Bộ quà trao tận tay các em */}
        <section id="qua-tang" style={{ background: 'var(--cream2)' }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">Quỹ giải dùng vào đâu</span>
              <h2>Bộ quà trao tận tay các em</h2>
              <p>Bên cạnh học bổng, mỗi em còn nhận bộ quà học tập thiết thực. Toàn bộ chi phí được công khai minh bạch.</p>
            </div>
            <div className="qt-table-wrap">
              <table className="qt-table">
                <thead>
                  <tr>
                    <th>Nhóm</th>
                    <th>Bộ quà / phần thưởng</th>
                    <th className="num">Số lượng</th>
                    <th className="num">Đơn giá/phần</th>
                    <th className="num">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {QUA_TANG_DATA.map((b) => (
                    <tr key={b.bundle} className={b.isReward ? 'reward' : undefined}>
                      <td className="qt-grp">{b.group}</td>
                      <td><b>{b.bundle}</b><span className="qt-note">{b.note}</span></td>
                      <td className="num">{b.count}{b.isReward ? ' xe' : ' em'}</td>
                      <td className="num">{formatVND(b.unitPrice)}</td>
                      <td className="num strong">{formatVND(b.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4}>Tổng giá trị quà tặng &amp; phần thưởng</td>
                    <td className="num">{formatVND(QUA_TANG_TONG)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="qt-foot">Chi tiết từng món (vở, bút, thước, máy tính Casio…) theo bảng báo giá VPP. Phần quà mầm non gồm sữa tươi, sữa chua &amp; bánh dinh dưỡng.</p>
          </div>
        </section>

        {/* Đồng hành cùng chương trình — kêu gọi tài trợ */}
        <section className="register" id="tai-tro">
          <svg className="rays" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g fill="currentColor">
              <path d="M100 0l6 60h-12zM100 200l6-60h-12zM0 100l60 6v-12zM200 100l-60 6v-12zM26 26l44 32-10 10zM174 174l-44-32 10-10zM174 26l-32 44-10-10zM26 174l32-44 10 10z"/>
            </g>
          </svg>
          <div className="wrap reg-card" style={{ paddingTop: '36px', paddingBottom: '36px' }}>
            <div>
              <span className="kicker">Tiếp Bước Em Đến Trường 2026</span>
              <h2>Đồng hành cùng chương trình</h2>
              <p className="lede">Toàn bộ nguồn quỹ vận động được dành trọn để trao học bổng cho các em học sinh mồ côi cha mẹ, sống cùng ông bà già yếu, gia đình hộ nghèo – cận nghèo nhưng vẫn kiên trì đến trường và học tốt.</p>
              <div className="donate-goal">
                <div><span className="k">Mục tiêu học bổng 2026</span><span className="v">82 suất × 800.000đ = 65.650.000đ</span></div>
                <div><span className="k">Năm 2025 đã trao</span><span className="v">67 suất · 40.000.000đ + nhiều hiện vật</span></div>
              </div>
              <div className="donate-forms">
                <span>💰 Tài trợ tiền mặt</span>
                <span>🎁 Tài trợ hiện vật</span>
                <span>🎓 Trao học bổng trực tiếp</span>
              </div>
            </div>
            <div className="pay donate">
              <h4>Thông tin nhận ủng hộ</h4>
              <div className="row"><span className="lbl">Chủ tài khoản</span><span className="val">Hộ Kinh Doanh Song Thạch</span></div>
              <div className="row"><span className="lbl">Số tài khoản</span><span className="val">165099</span></div>
              <div className="row"><span className="lbl">Nội dung CK</span><span className="val">Ho tro hoc bong Song Thach 2026 - [Tên nhà tài trợ]</span></div>
              <div className="row"><span className="lbl">Người phụ trách</span><span className="val">Nguyễn Nhật Tân</span></div>
              <a className="g-btn btn-mustard btn-lg" href="https://zalo.me/0378990979" target="_blank" rel="noopener" style={{ marginTop: '16px' }}>
                Liên hệ tài trợ · Zalo 0378.99.09.79 <ArrowIcon />
              </a>
              <p className="note">BTC cam kết sử dụng nguồn tài trợ đúng mục đích, minh bạch và công khai danh sách sau chương trình. Xin trân trọng cảm ơn!</p>
            </div>
          </div>
        </section>

        {/* Mini footer bar cho giải */}
        <div className="giai-footer">
          <div className="inner">
            <span className="fb">
              <svg width="22" height="22" aria-hidden="true"><use href="#ic-racket-giai"/></svg>
              Giải Cầu Lông Song Thạch Mở Rộng — Tranh Cúp iStudio 2026
            </span>
            <span>CLB Cầu Lông Song Thạch &amp; Đoàn Thanh niên xã Hưng Thịnh · <a href="https://songthach.com">songthach.com</a></span>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
