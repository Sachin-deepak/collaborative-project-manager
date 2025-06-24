import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/context/auth-provider';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar as CalendarIcon,
  PieChart as PieChartIcon,
  Loader2,
  Plus,
} from 'lucide-react';
import useWorkspaceAnalytics from '@/hooks/api/use-workspace-analytics';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { useQuery } from '@tanstack/react-query';
import { getWorkspaceMembersFn } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarColor, getAvatarFallbackText } from '@/lib/helper';
import { format } from 'date-fns';
import CreateProjectDialog from '@/components/workspace/project/create-project-dialog';
import { ProjectType } from '@/types/api.type';
import useGetProjectsInWorkspaceQuery from '@/hooks/api/use-get-projects';
import { useStore } from '@/store/store';

const Dashboard = () => {
  const { user, workspace } = useAuthContext();
  const workspaceId = useWorkspaceId();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const setIsCreateProjectOpen = useStore((state) => state.setIsCreateProjectOpen);

  // Fetch analytics data
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useWorkspaceAnalytics(workspaceId);

  // Fetch members data
  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: ['workspaceMembers', workspaceId],
    queryFn: () => getWorkspaceMembersFn(workspaceId),
    enabled: !!workspaceId,
  });

  // Fetch projects data
  const { data: projectsData, isLoading: isProjectsLoading } = useGetProjectsInWorkspaceQuery({
    workspaceId,
    pageSize: 10,
    pageNumber: 1,
  });

  const isLoading = isAnalyticsLoading || isMembersLoading || isProjectsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const analytics = analyticsData?.analytics || {};
  const members = membersData?.members || [];
  const projects = projectsData?.projects || [];

  // Calculate pending tasks (total - completed - overdue)
  const pendingTasks = (analytics.totalTasks || 0) - (analytics.completedTasks || 0) - (analytics.overdueTask || 0);

  // Stats cards data
  const stats = [
    {
      title: 'Total Members',
      value: members.length.toString(),
      icon: Users,
      trend: {
        value: members.length > 0 ? '+1' : '0',
        up: members.length > 0
      },
    },
    {
      title: 'Completed Tasks',
      value: analytics.completedTasks?.toString() || '0',
      icon: CheckCircle2,
      trend: {
        value: `${((analytics.completedTasks || 0) / (analytics.totalTasks || 1) * 100).toFixed(1)}%`,
        up: (analytics.completedTasks || 0) > 0
      },
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks.toString(),
      icon: AlertCircle,
      trend: {
        value: `${(pendingTasks / (analytics.totalTasks || 1) * 100).toFixed(1)}%`,
        up: false
      },
    },
    {
      title: 'Active Projects',
      value: projects.length.toString(),
      icon: Activity,
      trend: {
        value: projects.length > 0 ? '+1' : '0',
        up: projects.length > 0
      },
    },
  ];

  // Task distribution data
  const taskDistribution = [
    {
      name: 'Completed',
      value: analytics.completedTasks || 0,
      color: '#10B981'
    },
    {
      name: 'Overdue',
      value: analytics.overdueTask || 0,
      color: '#EF4444'
    },
    {
      name: 'In Progress',
      value: pendingTasks,
      color: '#F59E0B'
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's what's happening in {workspace?.name}.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <Button>
            <PieChartIcon className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend.up ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendIcon className="mr-1 h-4 w-4 inline" />
                  {stat.trend.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Calendar Card */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Task Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              {taskDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-center space-x-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Projects</CardTitle>
          <Button size="sm" onClick={() => setIsCreateProjectOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No projects created yet. Click the button above to create your first project.
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project: ProjectType) => {
                const name = project?.createdBy?.name || 'Unknown';
                const initials = getAvatarFallbackText(name);
                const avatarColor = getAvatarColor(name);

                return (
                  <Link
                    key={project._id}
                    to={`/workspace/${workspaceId}/project/${project._id}`}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{project.emoji}</div>
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created {project.createdAt ? format(new Date(project.createdAt), 'PPP') : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">Created by</div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={project?.createdBy?.profilePicture} alt={name} />
                        <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                      </Avatar>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      <CreateProjectDialog />
    </div>
  );
};

export default Dashboard;
