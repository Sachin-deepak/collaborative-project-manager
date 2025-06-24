import { create, StateCreator } from 'zustand';
import createSelectors from './selectors';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Workspace {
  id: string;
  name: string;
  // Add other workspace properties as needed
}

type AuthState = {
  accessToken: string | null;
  user: null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
};

type DialogState = {
  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: (isOpen: boolean) => void;
  isWorkspaceSwitcherOpen: boolean;
  setIsWorkspaceSwitcherOpen: (isOpen: boolean) => void;
  isCreateWorkspaceOpen: boolean;
  setIsCreateWorkspaceOpen: (isOpen: boolean) => void;
};

type WorkspaceState = {
  currentWorkspace: string | null;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspaceId: string) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
};

type StoreType = AuthState & DialogState & WorkspaceState;

const createAuthSlice: StateCreator<
  StoreType,
  [],
  [],
  AuthState
> = (set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),
});

const createDialogSlice: StateCreator<
  StoreType,
  [],
  [],
  DialogState
> = (set) => ({
  isCreateProjectOpen: false,
  setIsCreateProjectOpen: (isOpen) => set({ isCreateProjectOpen: isOpen }),
  isWorkspaceSwitcherOpen: false,
  setIsWorkspaceSwitcherOpen: (isOpen) => set({ isWorkspaceSwitcherOpen: isOpen }),
  isCreateWorkspaceOpen: false,
  setIsCreateWorkspaceOpen: (isOpen) => set({ isCreateWorkspaceOpen: isOpen }),
});

const createWorkspaceSlice: StateCreator<
  StoreType,
  [],
  [],
  WorkspaceState
> = (set) => ({
  currentWorkspace: null,
  workspaces: [],
  setCurrentWorkspace: (workspaceId) => set({ currentWorkspace: workspaceId }),
  setWorkspaces: (workspaces) => set({ workspaces }),
});

export const useStoreBase = create<StoreType>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createAuthSlice(...a),
        ...createDialogSlice(...a),
        ...createWorkspaceSlice(...a),
      })),
      {
        name: 'session-storage',
        getStorage: () => sessionStorage,
      }
    )
  )
);

export const useStore = createSelectors(useStoreBase);

