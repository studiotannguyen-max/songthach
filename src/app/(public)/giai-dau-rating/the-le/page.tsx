import { PageHero, Card, CardBody, Breadcrumb } from '@/components/ui';

// Mẫu "%s | Song Thạch" ở layout gốc tự nối tên tổ hợp, đừng viết lại trong tiêu đề trang.
export const metadata = { title: 'Thể lệ · Giải đấu phân trình độ' };

const SECTIONS: { h: string; body: string; bullets?: string[] }[] = [
  { h: '5 mức trình A100–A500', body: 'Từ thấp lên cao: A100, A200, A300, A400, A500. Mức trình ban đầu do BTC chấm sau buổi test thực tế tại sân để tránh khai gian.' },
  { h: 'Điểm hiệu dụng', body: 'Mỗi VĐV có mức trình cộng với điểm tiến độ. Ví dụ A300 tích thêm 60 điểm thì điểm hiệu dụng là 360. Con số này dùng để xếp hạng và xét thăng hạng — riêng việc ghép cặp thì tính theo mức trình, không cộng điểm tiến độ.' },
  {
    h: 'Cách ghép cặp thi đấu',
    body: 'BTC công bố mức giải của từng đợt: 200, 300, 400, 500… Hai VĐV tự do ghép đôi với nhau, miễn tổng mức trình của cặp đúng bằng mức giải đó.',
    bullets: [
      'Giải 400 nhận cặp A300 + A100, hoặc A200 + A200.',
      'Tính theo mức trình: A300 là 300 điểm, dù người đó đã tích thêm điểm tiến độ.',
      'Không giới hạn chênh lệch trình giữa hai người trong cặp.',
      'Một cặp được đăng ký nhiều mức giải trong cùng một tháng.',
    ],
  },
  {
    h: 'Thăng hạng',
    body: 'Tích đủ 100 điểm tiến độ thì lên một mức trình. Sau mỗi giải, BTC cộng điểm theo thứ hạng chung cuộc — số điểm linh hoạt chứ không cố định, để hệ thống bắt kịp trình thật của VĐV.',
    bullets: [
      'Mức thường dùng: nhất 25, nhì 15, ba 10 — mỗi người trong cặp nhận như nhau.',
      'Ai vô địch liên tiếp ở cùng một mức giải, hoặc đánh lệch hẳn mức đang xếp, BTC cộng thêm để đưa về đúng trình cho nhanh.',
      'Mọi khoản điểm đều ghi vào sổ công khai kèm lý do — cộng bao nhiêu, vì sao, ai cũng đọc được.',
      'Chạm mức trần (nam A500, nữ A400) thì điểm vẫn cộng tiếp để xếp hạng trong nhóm mạnh nhất, nhưng không có mức cao hơn.',
    ],
  },
  { h: 'Điểm chỉ tăng, lịch sử công khai', body: 'Không có hạ hạng khi thua. Mọi thay đổi điểm đều ghi vào sổ công khai kèm lý do, nên không ai giấu trình được lâu — cả cộng đồng cùng giám sát.' },
];

export default function TheLePage() {
  return (
    <>
      <PageHero
        label="Giải đấu phân trình độ"
        title="Thể lệ hệ thống điểm trình"
        description="Cách tính điểm, ghép cặp và điều kiện thăng hạng của CLB Cầu Lông Song Thạch."
      />

      <section className="section">
        <div className="container-page max-w-[720px]">
          <Breadcrumb
            items={[
              { label: 'Trang chủ',      href: '/' },
              { label: 'Giải đấu Rating', href: '/giai-dau-rating' },
              { label: 'Thể lệ' },
            ]}
          />

          <div className="mt-8 space-y-4">
            {SECTIONS.map((s) => (
              <Card key={s.h}>
                <CardBody>
                  <h2 className="text-xl mb-2 normal-case">{s.h}</h2>
                  <p className="text-fg-muted">{s.body}</p>
                  {s.bullets && (
                    <ul className="mt-3 pl-5 space-y-1.5 list-disc marker:text-brand text-fg-muted">
                      {s.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
