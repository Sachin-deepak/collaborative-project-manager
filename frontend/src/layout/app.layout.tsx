import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/auth-provider';
import Header from '@/components/header';
import CreateWorkspaceDialog from '@/components/workspace/create-workspace-dialog';
import CreateProjectDialog from '@/components/workspace/project/create-project-dialog';

const AppLayout = () => {
  return (
    <AuthProvider>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 w-full max-w-none">
          <div className="h-full p-6 md:p-8">
            <Outlet />
          </div>
        </main>
        <CreateWorkspaceDialog />
        <CreateProjectDialog />
      </div>
    </AuthProvider>
  );
};

export default AppLayout;

