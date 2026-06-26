import MobileTabBar from '@/components/shared/MobileTabBar';
import { SportPickerProvider } from '@/components/providers/SportPickerProvider';
import SportPickerModal from '@/components/shared/SportPickerModal';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SportPickerProvider>
      <div className="pb-16 lg:pb-0">{children}</div>
      <MobileTabBar />
      <SportPickerModal />
    </SportPickerProvider>
  );
}
