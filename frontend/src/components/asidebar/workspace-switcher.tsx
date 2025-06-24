import { useStore } from '@/store/store';
import { getAllWorkspacesUserIsMemberQueryFn } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface WorkspaceSwitcherProps {
  className?: string;
}

interface Workspace {
  id: string;
  name: string;
  // Add other workspace properties as needed
}

const WorkspaceSwitcher = ({ className }: WorkspaceSwitcherProps) => {
  const navigate = useNavigate();
  const { currentWorkspace, workspaces, setIsWorkspaceSwitcherOpen } = useStore();

  useQuery({
    queryKey: ['workspaces'],
    queryFn: getAllWorkspacesUserIsMemberQueryFn,
  });

  const handleWorkspaceClick = (workspace: Workspace) => {
    navigate(`/workspace/${workspace.id}`);
    setIsWorkspaceSwitcherOpen(false);
  };

  return (
    <div className={className}>
      {workspaces?.map((workspace: Workspace) => (
        <Button
          key={workspace.id}
          variant={workspace.id === currentWorkspace ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => handleWorkspaceClick(workspace)}
        >
          {workspace.name}
        </Button>
      ))}
    </div>
  );
};

export { WorkspaceSwitcher };

