import useWorkspaceId from '@/hooks/use-workspace-id';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getProjectsInWorkspaceQueryFn } from '@/lib/api';
import { AllProjectResponseType } from '@/types/api.type';
import { InfiniteData } from '@tanstack/react-query';

const NavProjects = () => {
  const workspaceId = useWorkspaceId();

  useInfiniteQuery<
    AllProjectResponseType,
    Error,
    InfiniteData<AllProjectResponseType>,
    [string, string | undefined],
    number
  >({
    queryKey: ['projects', workspaceId],
    queryFn: ({ pageParam = 1 }) =>
      getProjectsInWorkspaceQueryFn({
        workspaceId,
        pageNumber: pageParam,
        pageSize: 10
      }),
    getNextPageParam: (lastPage: AllProjectResponseType) => {
      const { pagination } = lastPage;
      if (pagination.pageNumber < pagination.totalPages) {
        return pagination.pageNumber + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!workspaceId,
  });

  return null; // Since this component is not being used currently
};

export default NavProjects; 