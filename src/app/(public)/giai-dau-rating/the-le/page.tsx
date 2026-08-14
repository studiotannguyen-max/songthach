import { PageHero, Card, CardBody, Breadcrumb } from '@/components/ui';

export const metadata = { title: 'Thể lệ · Giải đấu phân trình độ Song Thạch' };

const SECTIONS = [
  { h: '5 mức trình A100–A500', body: 'Từ thấp lên cao: A100, A200, A300, A400, A500. Mức trình ban đầu do BTC chấm sau buổi test thực tế tại sân để tránh khai gian.' },
  { h: 'Điểm hiệu dụng', body: 'Mỗi VĐV có mức trình cộng với điểm tiến độ. Ví dụ A300 tích thêm 60 điểm thì điểm hiệu dụng là 360. Con số này dùng để ghép cặp và xếp hạng.' },
  { h: 'Ghép cặp theo tổng điểm', body: 'Mỗi giải công bố một hạng (tổng điểm tối đa của cặp). Cộng điểm hiệu dụng của hai người lại phải nằm trong hạng đó — cho phép người trình cao "gánh" người trình thấp để cân sức các cặp.' },
  { h: 'Thăng hạng', body: 'Tích đủ 100 điểm tiến độ thì lên một mức trình. Điểm chỉ được cộng khi vô địch. Đạt A500 rồi thì điểm vẫn cộng tiếp để xếp hạng trong nhóm mạnh nhất, nhưng không có mức cao hơn.' },
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
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
