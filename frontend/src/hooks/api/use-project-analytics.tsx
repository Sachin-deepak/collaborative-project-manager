import { useQuery } from '@tanstack/react-query';
import { getProjectAnalyticsFn } from '@/lib/api';

const useProjectAnalytics = (projectId: string, workspaceId: string) => {
  return useQuery({
    queryKey: ['projectAnalytics', projectId, workspaceId],
    queryFn: () => getProjectAnalyticsFn(projectId, workspaceId),
    enabled: !!projectId && !!workspaceId,
  });
};

export default useProjectAnalytics; 