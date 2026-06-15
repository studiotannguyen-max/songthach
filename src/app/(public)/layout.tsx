import MobileTabBar from '@/components/shared/MobileTabBar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* chừa chỗ cho thanh điều hướng dưới đáy trên mobile */}
      <div className="pb-16 lg:pb-0">{children}</div>
      <MobileTabBar />
    </>
  );
}
