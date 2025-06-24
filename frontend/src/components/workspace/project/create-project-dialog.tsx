import { Dialog, DialogContent } from '@/components/ui/dialog';
import CreateProjectForm from '@/components/workspace/project/create-project-form';
import { useStore } from '@/store/store';

const CreateProjectDialog = () => {
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useStore((state) => [
    state.isCreateProjectOpen,
    state.setIsCreateProjectOpen,
  ]);

  return (
    <div>
      <Dialog modal={true} open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
        <DialogContent className="sm:max-w-lg border-0">
          <CreateProjectForm onClose={() => setIsCreateProjectOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProjectDialog;

