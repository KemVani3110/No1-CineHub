'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home,
  Compass,
  Bell,
  Settings,
  LogOut,
  Search,
  User,
  LogIn,
  PanelLeftClose
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Search', path: '/search', icon: Search },
  ];

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Get user avatar with fallback
  const getUserAvatar = () => {
    if (!user) return null;
    
    const avatarUrl = user.avatar || 
                     (user as any).picture || 
                     (user as any).photoURL || 
                     (user as any).image || 
                     (user as any).profilePicture;
    
    return avatarUrl || null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-background border-r border-border/50 z-40 animate-slide-in-left">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <Link href="/home" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="CineHub Logo"
                  fill
                  className="object-contain rounded-full"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold gradient-text">CineHub</span>
                <span className="text-xs text-muted-foreground -mt-0.5">Cinema Experience</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-accent/10"
              onClick={onClose}
            >
              <PanelLeftClose size={18} />
            </Button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage 
                  src={getUserAvatar()} 
                  alt={user.name || user.email || 'User'}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getUserInitials(user.name || user.email || 'User')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium text-sm text-foreground truncate">
                  {user.name || user.email}
                </span>
                {user.email && user.name && (
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? 'text-white bg-primary shadow-lg' 
                        : 'text-muted-foreground hover:text-primary hover:bg-accent/10'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <Separator className="my-4" />

            {/* Additional Actions */}
            {user && (
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-auto px-3 py-2.5 text-sm rounded-lg relative"
                  onClick={onClose}
                >
                  <Bell size={18} className="mr-2" />
                  Notifications
                  <Badge 
                    variant="destructive" 
                    className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    3
                  </Badge>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-auto px-3 py-2.5 text-sm rounded-lg"
                  onClick={onClose}
                  asChild
                >
                  <Link href="/settings">
                    <Settings size={18} className="mr-2" />
                    Settings
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="border-t">
          {user ? (
            <div className="p-4">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10 text-sm text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10 text-sm rounded-lg"
                onClick={onClose}
                asChild
              >
                <Link href="/login">
                  <LogIn size={16} className="mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button 
                className="w-full justify-start h-10 text-sm rounded-lg"
                onClick={onClose}
                asChild
              >
                <Link href="/register">
                  <User size={16} className="mr-2" />
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 