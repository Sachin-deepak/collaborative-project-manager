import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjectsInWorkspaceQueryFn } from '@/lib/api';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { useStore } from '@/store/store';
import { ScrollArea } from './ui/scroll-area';

export function ProjectSwitcher() {
  const workspaceId = useWorkspaceId();
  const setIsCreateProjectOpen = useStore((state) => state.setIsCreateProjectOpen);

  const { data } = useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: () => getProjectsInWorkspaceQueryFn({ 
      workspaceId,
      pageSize: 10,
      pageNumber: 1,
      skip: true
    }),
    enabled: !!workspaceId,
  });

  if (!data?.projects?.length) return null;

  return (
    <div className="flex items-center gap-2 w-full">
      <ScrollArea className="w-full h-10">
        <div className="flex items-center gap-2 px-1">
          {data.projects.map((project) => (
            <Link
              key={project._id}
              to={`/workspace/${workspaceId}/project/${project._id}`}
              className="flex-none"
            >
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs whitespace-nowrap"
              >
                {project.emoji} {project.name}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <Button
        variant="outline"
        size="sm"
        className="h-7 shrink-0"
        onClick={() => setIsCreateProjectOpen(true)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
} 