import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import MobileTabBar from '@/components/shared/MobileTabBar';
import { SportPickerProvider } from '@/components/providers/SportPickerProvider';
import SportPickerModal from '@/components/shared/SportPickerModal';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SportPickerProvider>
      <Navbar />
      {/* pb-24 = 96px chừa chỗ cho thanh tab dưới trên điện thoại */}
      <main id="main-content" className="pb-24 lg:pb-0">{children}</main>
      <Footer />
      <MobileTabBar />
      <SportPickerModal />
    </SportPickerProvider>
  );
}
