import './../rating.css';

export const metadata = { title: 'Thể lệ · Giải đấu phân trình độ Song Thạch' };

export default function TheLePage() {
  return (
    <div className="rating-page">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: 20 }}>Thể lệ hệ thống điểm trình</h1>
        {SECTIONS.map(s => (
          <div key={s.h} style={{ background: 'var(--paper)', border: '2.5px solid var(--ink)', borderRadius: 16, boxShadow: '4px 4px 0 var(--ink)', padding: '18px 22px', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 8, color: 'var(--terra-d)' }}>{s.h}</h2>
            <div style={{ fontWeight: 600, color: 'var(--brown)' }}>{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SECTIONS = [
  { h: '5 mức trình A100–A500', body: 'Từ thấp lên cao: A100, A200, A300, A400, A500. Mức trình ban đầu do BTC chấm sau buổi test thực tế tại sân để tránh khai gian.' },
  { h: 'Điểm hiệu dụng', body: 'Mỗi VĐV có mức trình cộng với điểm tiến độ. Ví dụ A300 tích thêm 60 điểm thì điểm hiệu dụng là 360. Con số này dùng để ghép cặp và xếp hạng.' },
  { h: 'Ghép cặp theo tổng điểm', body: 'Mỗi giải công bố một hạng (tổng điểm tối đa của cặp). Cộng điểm hiệu dụng của hai người lại phải nằm trong hạng đó — cho phép người trình cao "gánh" người trình thấp để cân sức các cặp.' },
  { h: 'Thăng hạng', body: 'Tích đủ 100 điểm tiến độ thì lên một mức trình. Điểm chỉ được cộng khi vô địch. Đạt A500 rồi thì điểm vẫn cộng tiếp để xếp hạng trong nhóm mạnh nhất, nhưng không có mức cao hơn.' },
  { h: 'Điểm chỉ tăng, lịch sử công khai', body: 'Không có hạ hạng khi thua. Mọi thay đổi điểm đều ghi vào sổ công khai kèm lý do, nên không ai giấu trình được lâu — cả cộng đồng cùng giám sát.' },
];
