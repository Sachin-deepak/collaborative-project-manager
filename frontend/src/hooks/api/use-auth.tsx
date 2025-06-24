import { getCurrentUserQueryFn } from '@/lib/api';
import { useStore } from '@/store/store';
import { useQuery } from '@tanstack/react-query';

const useAuth = () => {
  const accessToken = useStore((state) => state.accessToken);

  const query = useQuery({
    queryKey: ['authUser'],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: 2,
    enabled: !!accessToken,
  });

  return query;
};

export default useAuth;

