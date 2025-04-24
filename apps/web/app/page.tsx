import GuestLayout from '@/components/layouts/guest.layout';
import HomePage from '@/components/pages/home.page';

export default function RootPage() {
  return (
    <GuestLayout>
      <HomePage />
    </GuestLayout>
  );
}
