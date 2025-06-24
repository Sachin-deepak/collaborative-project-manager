import { DashboardSkeleton } from '@/components/skeleton-loaders/dashboard-skeleton';
import useAuth from '@/hooks/api/use-auth';
import { useStore } from '@/store/store';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { data: authData, isLoading } = useAuth();
  const accessToken = useStore((state) => state.accessToken);
  const user = authData?.user;

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;

