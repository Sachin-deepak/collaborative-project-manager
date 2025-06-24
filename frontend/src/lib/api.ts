import API from './axios-client';
import {
  AllMembersInWorkspaceResponseType,
  AllProjectPayloadType,
  AllProjectResponseType,
  AllTaskPayloadType,
  AllTaskResponseType,
  AllWorkspaceResponseType,
  AnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
  CreateProjectPayloadType,
  CreateTaskPayloadType,
  CreateWorkspaceResponseType,
  CreateWorkspaceType,
  CurrentUserResponseType,
  EditByIdPayloadType,
  EditProjectPayloadType,
  EditWorkspaceType,
  LoginResponseType,
  loginType,
  ProjectByIdPayloadType,
  ProjectResponseType,
  registerType,
  TaskResponseType,
  UpdateByIdPayloadType,
  WorkspaceByIdResponseType,
} from '@/types/api.type';

export const loginMutationFn = async (data: loginType): Promise<LoginResponseType> => {
  const response = await API.post(`/auth/login`, data);
  return response.data;
};

export const registerMutationFn = async (data: registerType): Promise<LoginResponseType> => {
  const response = await API.post(`/auth/register`, data);
  return response.data;
};

export const logoutMutationFn = async () => await API.post('/auth/logout');

export const getCurrentUserQueryFn = async (): Promise<CurrentUserResponseType> => {
  const response = await API.get(`/user/current`);
  return response?.data;
};

//********* WORKSPACE ****************
//************* */

export const createWorkspaceMutationFn = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  const response = await API.post(`/workspace/create/new`, data);
  return response.data;
};

export const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: EditWorkspaceType) => {
  const response = await API.put(`/workspace/update/${workspaceId}`, data);
  return response.data;
};

export const getWorkspaceByIdQueryFn = async (
  workspaceId: string
): Promise<WorkspaceByIdResponseType> => {
  const response = await API.get(`/workspace/${workspaceId}`);
  return response.data;
};

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResponseType> => {
    const response = await API.get(`/workspace/all`);
    return response.data;
  };

export const getMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`/workspace/members/${workspaceId}`);
  return response.data;
};

export const getWorkspaceAnalyticsQueryFn = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  const response = await API.get(`/workspace/analytics/${workspaceId}`);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: ChangeWorkspaceMemberRoleType) => {
  const response = await API.put(`/workspace/change/member/role/${workspaceId}`, data);
  return response.data;
};

export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<{
  message: string;
  currentWorkspace: string;
}> => {
  const response = await API.delete(`/workspace/delete/${workspaceId}`);
  return response.data;
};

//*******MEMBER ****************

export const invitedUserJoinWorkspaceMutationFn = async (
  inviteCode: string
): Promise<{
  message: string;
  workspaceId: string;
}> => {
  const response = await API.post(`/member/workspace/${inviteCode}/join`);
  return response.data;
};

//********* */
//********* PROJECTS
export const createProjectMutationFn = async ({
  workspaceId,
  data,
}: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.post(`/project/workspace/${workspaceId}/create`, data);
  return response.data;
};

export const editProjectMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: EditProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.put(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getProjectsInWorkspaceQueryFn = async ({
  workspaceId,
  pageSize = 10,
  pageNumber = 1,
}: AllProjectPayloadType): Promise<AllProjectResponseType> => {
  const response = await API.get(
    `/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );

  return response.data;
};

export const getProjectByIdQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  const response = await API.get(`/project/${projectId}/workspace/${workspaceId}`);
  return response.data;
};

export const getProjectAnalyticsQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}/analytics`
  );
  return response.data;
};

export const deleteProjectMutationFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `/project/${projectId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

//*******TASKS ********************************
//************************* */

export const createTaskMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: CreateTaskPayloadType) => {
  const response = await API.post(
    `/task/projects/${projectId}/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const getTaskByIdQueryFn = async ({
  workspaceId,
  projectId,
  taskId,
}: EditByIdPayloadType): Promise<TaskResponseType> => {
  const response = await API.get(
    `/task/${taskId}/project/${projectId}/workspace/${workspaceId}`
  );
  return response.data;
};

export const editTaskMutationFn = async ({
  workspaceId,
  projectId,
  taskId,
  data,
}: UpdateByIdPayloadType): Promise<TaskResponseType> => {
  console.log('api runignignigjijgijgn');

  const response = await API.put(
    `/task/${taskId}/projects/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getAllTasksQueryFn = async ({
  workspaceId,
  keyword,
  projectId,
  assignedTo,
  priority,
  status,
  dueDate,
  pageNumber = 1,
  pageSize = 10,
}: AllTaskPayloadType): Promise<AllTaskResponseType> => {
  // `/task/workspace/${workspaceId}/all?keyword=${keyword}&assignedTo=${assignedTo}&priority=${priority}&status=${status}&dueDate=${dueDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`

  const baseUrl = `/task/workspace/${workspaceId}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append('keyword', keyword);
  if (projectId) queryParams.append('projectId', projectId);
  if (assignedTo) queryParams.append('assignedTo', assignedTo);
  if (priority) queryParams.append('priority', priority);
  if (status) queryParams.append('status', status);
  if (dueDate) queryParams.append('dueDate', dueDate);
  if (pageNumber) queryParams.append('pageNumber', pageNumber.toString());
  if (pageSize) queryParams.append('pageSize', pageSize.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;
  const response = await API.get(url);

  return response.data;
};

export const deleteTaskMutationFn = async ({
  workspaceId,
  taskId,
}: {
  workspaceId: string;
  taskId: string;
}): Promise<{
  message: string;
}> => {
  const response = await API.delete(`task/${taskId}/workspace/${workspaceId}/delete`);
  return response.data;
};

// Workspace Analytics
export const getWorkspaceAnalyticsFn = async (workspaceId: string) => {
  const { data } = await API.get(`/workspace/analytics/${workspaceId}`);
  return data;
};

export const getProjectAnalyticsFn = async (projectId: string, workspaceId: string) => {
  const { data } = await API.get(`/project/${projectId}/workspace/${workspaceId}/analytics`);
  return data;
};

export const getWorkspaceMembersFn = async (workspaceId: string) => {
  const { data } = await API.get(`/workspace/${workspaceId}/members`);
  return data;
};

export const getAllProjectsWorkspaceFn = async (
  workspaceId: string,
  pageSize: number = 10,
  pageNumber: number = 1
) => {
  const { data } = await API.get(
    `/project/workspace/${workspaceId}?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return data;
};

