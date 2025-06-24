import { useQuery } from '@tanstack/react-query';
import { getWorkspaceAnalyticsFn } from '@/lib/api';

const useWorkspaceAnalytics = (workspaceId: string) => {
  return useQuery({
    queryKey: ['workspaceAnalytics', workspaceId],
    queryFn: () => getWorkspaceAnalyticsFn(workspaceId),
    enabled: !!workspaceId,
  });
};

export default useWorkspaceAnalytics; 