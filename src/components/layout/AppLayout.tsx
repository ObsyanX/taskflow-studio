import { Outlet } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

export function AppLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
