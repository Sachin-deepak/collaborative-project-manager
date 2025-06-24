import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  CheckCircle,
  Users,
  Settings,
  LogOut,
  Menu,
  Loader,
} from 'lucide-react';
import Logo from '@/components/logo';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useAuthContext } from '@/context/auth-provider';
import { Permissions } from '@/constant';
import useWorkspaceId from '@/hooks/use-workspace-id';
import LogoutDialog from './asidebar/logout-dialog';

type NavItem = {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
};

interface User {
  name: string;
  email: string;
  profilePicture?: string;
}

const Header = () => {
  const { isLoading, user, hasPermission } = useAuthContext();
  const workspaceId = useWorkspaceId();
  const location = useLocation();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const canManageSettings = hasPermission(Permissions.MANAGE_WORKSPACE_SETTINGS);
  const pathname = location.pathname;

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      url: `/workspace/${workspaceId}`,
      icon: LayoutDashboard,
    },
    {
      title: 'Tasks',
      url: `/workspace/${workspaceId}/tasks`,
      icon: CheckCircle,
    },
    {
      title: 'Members',
      url: `/workspace/${workspaceId}/members`,
      icon: Users,
    },
    ...(canManageSettings
      ? [
          {
            title: 'Settings',
            url: `/workspace/${workspaceId}/settings`,
            icon: Settings,
          },
        ]
      : []),
  ];

  const userProfile = user as User;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Logo />
            <nav className="flex flex-col gap-4 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 text-sm font-medium ${
                    pathname === item.url ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2 mx-4 lg:mx-8">
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                pathname === item.url ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Loader className="h-8 w-8 animate-spin" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userProfile?.profilePicture}
                        alt={userProfile?.name}
                      />
                      <AvatarFallback>
                        {userProfile?.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="flex-col items-start">
                      <div className="text-sm font-medium">{userProfile?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {userProfile?.email}
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsLogoutOpen(true)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      <LogoutDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen} />
    </header>
  );
};

export default Header;
