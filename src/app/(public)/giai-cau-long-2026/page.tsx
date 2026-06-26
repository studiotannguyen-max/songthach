import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import './giai.css';

export const metadata: Metadata = {
  title: 'Điều Lệ Giải Cầu Lông Song Thạch Mở Rộng 2026',
  description: 'Điều lệ chính thức Giải Cầu Lông Song Thạch Mở Rộng 2026 — giải gây quỹ trao học bổng cho học sinh vượt khó học giỏi xã Hưng Thịnh. Thi đấu 31/07 · 01 & 02/08/2026.',
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
              Giải Cầu Lông <span className="a">Song Thạch</span> <span className="b">Mở Rộng 2026</span>
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
                <div><div className="k">Thời gian</div><div className="v">31/07 · 01 &amp; 02/08/2026</div></div>
              </div>
              <div className="fact">
                <span className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 21s-7-5.3-7-11a7 7 0 0114 0c0 5.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>
                  </svg>
                </span>
                <div><div className="k">Địa điểm</div><div className="v">Sân CL Song Thạch, xã Hưng Thịnh, Đồng Nai</div></div>
              </div>
              <div className="fact">
                <span className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
                  </svg>
                </span>
                <div><div className="k">Cầu thi đấu</div><div className="v">Bamboo tốc độ 76</div></div>
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

        {/* Mission */}
        <section className="mission" id="mucdich">
          <div className="wrap mission-grid">
            <div>
              <span className="kicker">Mục đích giải đấu</span>
              <h2>Mỗi trận đấu — <span className="hl">thêm phần quà cho các em!</span></h2>
              <p>Giải Cầu Lông Song Thạch Mở Rộng 2026 là sân chơi thể thao lành mạnh dành cho mọi lứa tuổi — nơi mọi người <strong>giao lưu học hỏi, lan tỏa yêu thương</strong>.</p>
              <p>Tinh thần của giải hướng tới việc <strong>gây quỹ trao học bổng và quà</strong> cho các em học sinh có hoàn cảnh khó khăn nhưng vẫn nỗ lực vươn lên học giỏi tại địa phương.</p>
            </div>
            <div className="stat-card">
              <svg className="rays" viewBox="0 0 200 200" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
                <g fill="currentColor">
                  <path d="M100 0l6 50h-12zM100 200l6-50h-12zM0 100l50 6v-12zM200 100l-50 6v-12zM30 30l40 28-8 8zM170 170l-40-28 8-8zM170 30l-28 40-8-8zM30 170l28-40 8 8z"/>
                </g>
              </svg>
              <div className="big">7</div>
              <div className="lbl">nhóm thi đấu — từ thiếu nhi tiểu học đến phong trào nâng cao &amp; khách mời</div>
            </div>
          </div>
        </section>

        {/* Groups */}
        <section id="noidung">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">Nội dung &amp; khen thưởng</span>
              <h2>7 nhóm thi đấu</h2>
              <p>Mỗi nội dung chỉ tổ chức khi có từ 12 VĐV/cặp trở lên (Nhóm 7 từ 20 cặp). Cấm VĐV đã đạt thành tích quốc gia; riêng Nhóm 5 cấm thêm thành tích cấp tỉnh, thành phố.</p>
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
                  <div className="prize-gift"><GiftIcon /><span>Huy chương + bằng khen + quà</span></div>
                </div>
              </article>

              <article className="grp">
                <div className="top">
                  <div><span className="gnum">Nhóm 2</span><h3>12 – 13 tuổi</h3><div className="age">Thiếu niên</div></div>
                  <span className="fee">80.000đ</span>
                </div>
                <div className="content">
                  <div className="c-lbl">Nội dung</div>
                  <div className="events"><span>Đơn nam</span><span>Đơn nữ</span><span>Đôi nam</span></div>
                  <div className="prize-gift"><GiftIcon /><span>Huy chương + bằng khen + quà</span></div>
                </div>
              </article>

              <article className="grp">
                <div className="top">
                  <div><span className="gnum">Nhóm 3</span><h3>14 – 15 tuổi</h3><div className="age">Thiếu niên</div></div>
                  <span className="fee">80.000đ</span>
                </div>
                <div className="content">
                  <div className="c-lbl">Nội dung</div>
                  <div className="events"><span>Đơn nam</span><span>Đơn nữ</span><span>Đôi nam</span></div>
                  <div className="prize-gift"><GiftIcon /><span>Huy chương + bằng khen + quà</span></div>
                </div>
              </article>

              <article className="grp">
                <div className="top">
                  <div><span className="gnum">Nhóm 4</span><h3>16 – &lt;18 tuổi</h3><div className="age">Thanh thiếu niên</div></div>
                  <span className="fee">150.000đ</span>
                </div>
                <div className="content">
                  <div className="c-lbl">Nội dung</div>
                  <div className="events"><span>Đôi nam</span><span>Đôi nam nữ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal g" /> Giải nhất <span className="amt">800.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal s" /> Giải nhì <span className="amt">600.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal b" /> Đồng giải ba <span className="amt">400.000đ</span></div>
                  <div className="prize-gift">+ Huy chương &amp; bằng khen cho mỗi giải</div>
                </div>
              </article>

              <article className="grp">
                <div className="top">
                  <div><span className="gnum">Nhóm 5</span><h3>Phong trào</h3><div className="age">Không phân biệt lứa tuổi</div></div>
                  <span className="fee">200.000đ</span>
                </div>
                <div className="content">
                  <div className="c-lbl">Nội dung</div>
                  <div className="events"><span>Đôi nam</span><span>Đôi nam nữ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal g" /> Giải nhất <span className="amt">2.000.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal s" /> Giải nhì <span className="amt">1.000.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal b" /> Giải ba <span className="amt">500.000đ</span></div>
                  <div className="prize-gift">+ Huy chương &amp; bằng khen cho mỗi giải</div>
                </div>
              </article>

              <article className="grp">
                <div className="top">
                  <div><span className="gnum">Nhóm 6</span><h3>Phong trào nâng cao</h3><div className="age">Trình độ khá</div></div>
                  <span className="fee">200.000đ</span>
                </div>
                <div className="content">
                  <div className="c-lbl">Nội dung</div>
                  <div className="events"><span>Đôi nam</span><span>Đôi nam nữ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal g" /> Giải nhất <span className="amt">2.000.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal s" /> Giải nhì <span className="amt">1.000.000đ</span></div>
                  <div className="prize-row"><MedalIcon className="pmedal b" /> Giải ba <span className="amt">500.000đ</span></div>
                  <div className="prize-gift">+ Huy chương &amp; bằng khen cho mỗi giải</div>
                </div>
              </article>

              <article className="grp wide">
                <div className="top">
                  <div>
                    <span className="gnum">Nhóm 7</span>
                    <h3>Nội bộ · Tài trợ · Khách mời (hạng B)</h3>
                    <div className="age">Không phân biệt lứa tuổi · trình độ trung bình của đội: hạng B</div>
                  </div>
                  <span className="fee">300.000đ</span>
                </div>
                <div className="content">
                  <div className="c-lbl">Nội dung</div>
                  <div className="events"><span>Đôi nam nữ hỗn hợp</span></div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 40px' }}>
                    <div className="prize-row"><MedalIcon className="pmedal g" /> Giải nhất <span className="amt">2.500.000đ</span></div>
                    <div className="prize-row"><MedalIcon className="pmedal s" /> Giải nhì <span className="amt">1.500.000đ</span></div>
                    <div className="prize-row"><MedalIcon className="pmedal b" /> Đồng giải ba <span className="amt">1.000.000đ</span></div>
                  </div>
                  <div className="prize-gift">+ Huy chương &amp; bằng khen cho mỗi giải</div>
                </div>
              </article>

            </div>
          </div>
        </section>

        {/* Lệ phí */}
        <section id="lephi" style={{ background:'var(--cream2)' }}>
          <div className="wrap">
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
                <tr><td>Nhóm 2 &amp; 3</td><td>12 – 15 tuổi</td><td>80.000đ / VĐV / nội dung</td></tr>
                <tr><td>Nhóm 4</td><td>16 – &lt;18 tuổi</td><td>150.000đ / VĐV / nội dung</td></tr>
                <tr><td>Nhóm 5 &amp; 6</td><td>Phong trào</td><td>200.000đ / VĐV / nội dung</td></tr>
                <tr><td>Nhóm 7</td><td>Nội bộ / khách mời</td><td>300.000đ / VĐV / nội dung</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Quy định */}
        <section id="quydinh">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">Quy định thi đấu</span>
              <h2>Thể lệ &amp; lưu ý quan trọng</h2>
            </div>
            <div className="rules-grid">
              <div className="rule"><span className="ico">1</span><p><strong>Luật thi đấu:</strong> Nhóm 1, 2, 3, 4 loại trực tiếp 1 set 25 điểm. Nhóm 5, 6 loại trực tiếp 3 set 15 điểm. Nhóm 7 đánh vòng tròn tính điểm ở vòng loại, các vòng trong loại trực tiếp.</p></div>
              <div className="rule"><span className="ico">2</span><p>Mỗi nội dung chỉ tổ chức khi có từ <strong>12 VĐV/cặp trở lên</strong>; riêng Nhóm 7 từ <strong>20 cặp trở lên</strong>.</p></div>
              <div className="rule"><span className="ico">3</span><p>Cầu thi đấu chính thức là <strong>cầu Bamboo tốc độ 76</strong>.</p></div>
              <div className="rule"><span className="ico">4</span><p>VĐV mang theo <strong>CCCD / bản sao Giấy khai sinh / Hộ chiếu / Thẻ học sinh</strong> còn hiệu lực để xuất trình khi có yêu cầu.</p></div>
              <div className="rule"><span className="ico">5</span><p>Khiếu nại phải bằng văn bản của trưởng đoàn: trước trận đấu với vấn đề nhân sự, trong vòng 10 phút sau trận với vấn đề trong trận.</p></div>
              <div className="rule"><span className="ico">6</span><p>BTC chỉ giải quyết khiếu nại <strong>trước vòng bán kết</strong>; từ bán kết trở đi không giải quyết khiếu nại về nhân sự.</p></div>
              <div className="rule"><span className="ico">7</span><p>Sau khi đăng ký <strong>không thể thay đổi VĐV</strong> — đề nghị cân nhắc kỹ trước khi đăng ký.</p></div>
              <div className="rule"><span className="ico">8</span><p>Ban tổ chức có quyền thay đổi hoặc bổ sung điều lệ cho phù hợp với hoàn cảnh thực tế.</p></div>
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
          <div className="wrap reg-card" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
            <div>
              <span className="kicker">Đăng ký tham gia</span>
              <h2>Sẵn sàng ra sân?</h2>
              <p className="lede">Hoàn tất đăng ký qua Google Biểu mẫu và chuyển khoản lệ phí theo hướng dẫn. Mỗi lượt đăng ký của bạn góp thêm một phần quà cho các em.</p>
              <a className="g-btn btn-mustard btn-lg" href={FORM_URL} target="_blank" rel="noopener" style={{ marginTop: '24px' }}>
                Mở biểu mẫu đăng ký <ArrowIcon />
              </a>
            </div>
            <div className="pay">
              <h4>Hình thức nộp lệ phí — chuyển khoản</h4>
              <div className="row"><span className="lbl">Số tài khoản</span><span className="val">0988918418</span></div>
              <div className="row"><span className="lbl">Ngân hàng</span><span className="val">VPBANK</span></div>
              <div className="row"><span className="lbl">Chủ tài khoản</span><span className="val">Nguyễn Thị Thùy Linh</span></div>
              <div className="row"><span className="lbl">Nội dung CK</span><span className="val">Lệ phí CL + Tên + Nội dung thi đấu</span></div>
              <p className="note">Lưu ý: sau khi đăng ký không thể thay đổi vận động viên thi đấu.</p>
            </div>
          </div>
        </section>

        {/* Mini footer bar cho giải */}
        <div className="giai-footer">
          <div className="inner">
            <span className="fb">
              <svg width="22" height="22" aria-hidden="true"><use href="#ic-racket-giai"/></svg>
              Giải Cầu Lông Song Thạch Mở Rộng 2026
            </span>
            <span>CLB Cầu Lông Song Thạch &amp; Đoàn Thanh niên xã Hưng Thịnh · <a href="https://songthach.com">songthach.com</a></span>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
