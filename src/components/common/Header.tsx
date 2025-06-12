"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Menu,
  User,
  LogIn,
  Home,
  Compass,
  Bell,
  LogOut,
  Search,
  PanelLeft,
  Users,
  Activity,
  BookmarkPlus,
  History,
  CircleUser,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useHistoryStore } from "@/store/historyStore";
import { useHeaderStore } from "@/store/headerStore";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { signOut as nextAuthSignOut } from 'next-auth/react';
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";

interface HeaderProps {
  onSidebarChange?: (isOpen: boolean) => void;
}

const Header = ({ onSidebarChange }: HeaderProps) => {
  const pathname = usePathname();
  const {
    isMobileMenuOpen,
    isSidebarOpen,
    setIsMobileMenuOpen,
    closeMobileMenu,
  } = useHeaderStore();
  const { data: session, status } = useSession();
  const { user: authUser, logout, getCurrentUser } = useAuthStore();
  const { user: profileUser, fetchUserData } = useProfileStore();
  const { admin, isLoading: isAdminLoading } = useAdmin();
  const { toast } = useToast();
  const router = useRouter();
  const { getRecentHistory } = useHistoryStore();
  const recentHistory = getRecentHistory(5);

  // Use refs to track if data has been fetched
  const authDataFetched = useRef(false);
  const profileDataFetched = useRef(false);

  // Fetch user data when session changes, but only once
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          // Only fetch auth data if not already fetched
          if (!authUser && !authDataFetched.current) {
            authDataFetched.current = true;
            await getCurrentUser();
          }

          // Only fetch profile data if not already fetched
          if (!profileUser && !profileDataFetched.current) {
            profileDataFetched.current = true;
            await fetchUserData();
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          if (isMounted) {
            toast({
              title: "Error",
              description: "Failed to load user data. Please try refreshing the page.",
              variant: "destructive",
            });
          }
        }
      }
    };

    fetchData();

    // Reset fetch flags when session changes
    if (status !== 'authenticated') {
      authDataFetched.current = false;
      profileDataFetched.current = false;
    }

    return () => {
      isMounted = false;
    };
  }, [status, session?.user?.id]); // Remove unnecessary dependencies

  // Memoize handlers
  const handleLogout = useCallback(async () => {
    try {
      // First sign out from NextAuth
      await nextAuthSignOut({ redirect: false });
      
      // Then logout from our auth store
      await logout();
      
      // Reset all stores
      useProfileStore.getState().reset();
      useHistoryStore.getState().reset();
      useHeaderStore.getState().reset();
      
      // Reset fetch flags
      authDataFetched.current = false;
      profileDataFetched.current = false;
      
      // Close mobile menu if open
      closeMobileMenu();
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  }, [logout, closeMobileMenu, router, toast]);

  const handleNavClick = useCallback((item: (typeof navItems)[0]) => {
    if (item.requiresAuth && !authUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }
    router.push(item.path);
  }, [authUser, router, toast]);

  const handleAdminNav = useCallback((path: string) => {
    if (!hasAdminAccess()) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin area.",
        variant: "destructive",
      });
      return;
    }
    router.push(path);
    closeMobileMenu();
  }, [router, closeMobileMenu, toast]);

  // Memoize computed values
  const isSocialLogin = useMemo(() => 
    authUser?.provider === "google" || authUser?.provider === "facebook",
    [authUser?.provider]
  );

  const getUserInitials = useCallback((name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  }, []);

  const getUserAvatar = useCallback(() => {
    // First check if user has a custom avatar from our system
    if (profileUser?.avatar) {
      return profileUser.avatar;
    }

    // Then check auth user avatar
    if (authUser?.avatar) {
      return authUser.avatar;
    }

    // Then check session image (for social logins)
    if (session?.user?.image) {
      return session.user.image;
    }

    return undefined;
  }, [profileUser?.avatar, authUser?.avatar, session?.user?.image]);

  const getUserName = useCallback(() => {
    return profileUser?.name || 
           authUser?.name || 
           session?.user?.name || 
           profileUser?.email || 
           authUser?.email || 
           session?.user?.email || 
           "User";
  }, [profileUser, authUser, session?.user]);

  const getUserEmail = useCallback(() => {
    return profileUser?.email || 
           authUser?.email || 
           session?.user?.email;
  }, [profileUser?.email, authUser?.email, session?.user?.email]);

  const getUserRole = useCallback(() => {
    if (admin?.role) return admin.role;
    if (profileUser?.role) return profileUser.role;
    if (authUser?.role) return authUser.role;
    if (session?.user?.role) return session.user.role;
    return 'user' as const;
  }, [admin?.role, profileUser?.role, authUser?.role, session?.user?.role]);

  const hasAdminAccess = useCallback(() => {
    const role = getUserRole();
    return role === 'admin' || role === 'moderator';
  }, [getUserRole]);

  const formatRole = useCallback((role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  }, []);

  const navItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Explore", path: "/explore", icon: Compass },
    { name: "Search", path: "/search", icon: Search },
    {
      name: "Watchlist",
      path: "/watchlist",
      icon: BookmarkPlus,
      requiresAuth: true,
    },
    { name: "History", path: "/history", icon: History, requiresAuth: true },
  ];

  // Debug log to check authUser
  console.log("Auth User:", authUser);
  console.log("Session:", session);

  return (
    <>
      <header
        className={`w-full bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-40 transition-all duration-300 ${
          isSidebarOpen ? "hidden" : "block"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <Link
                href="/home"
                className="flex items-center space-x-3 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14">
                  <Image
                    src="/logo.png"
                    alt="CineHub Logo"
                    fill
                    className="object-contain rounded-full"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">
                    CineHub
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground -mt-1 hidden sm:block">
                    Cinema Experience
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item)}
                    className={`nav-item flex items-center space-x-2 px-4 py-2 mx-1 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "text-white bg-primary shadow-lg shadow-primary/25"
                        : "text-muted-foreground hover:text-primary hover:bg-accent/10"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {authUser ? (
                <>
                  {/* Notifications Button */}
                  <div className="relative hidden sm:block">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full hover:bg-accent/10 cursor-pointer"
                    >
                      <Bell size={20} />
                    </Button>
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      3
                    </Badge>
                  </div>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="hidden sm:flex p-1 rounded-full hover:!bg-transparent focus-visible:ring-0 cursor-pointer"
                      >
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage
                            src={getUserAvatar()}
                            alt={getUserName()}
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getUserInitials(getUserName())}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="pb-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={getUserAvatar()}
                              alt={getUserName()}
                              referrerPolicy="no-referrer"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getUserInitials(getUserName())}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-medium truncate">
                              {getUserName()}
                            </span>
                            {getUserEmail() && (
                              <span className="text-xs text-muted-foreground truncate">
                                {getUserEmail()}
                              </span>
                            )}
                            {hasAdminAccess() && (
                              <Badge
                                variant={getUserRole() === 'admin' ? 'destructive' : 'default'}
                                className="mt-1 text-xs"
                              >
                                {formatRole(getUserRole())}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-3 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {hasAdminAccess() && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleAdminNav('/admin/dashboard')}
                            className="cursor-pointer"
                          >
                            <PanelLeft className="mr-3 h-4 w-4" />
                            Admin Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAdminNav('/admin/users')}
                            className="cursor-pointer"
                          >
                            <Users className="mr-3 h-4 w-4" />
                            User Management
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {/* Auth Buttons */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="rounded-full"
                    >
                      <Link href="/login">
                        <LogIn size={18} className="mr-2" />
                        Sign In
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="rounded-full">
                      <Link href="/register">
                        <User size={18} className="mr-2" />
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-9 w-9 rounded-full hover:bg-accent/10 relative"
                  >
                    <Menu size={22} />
                    {authUser && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                      >
                        3
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[400px] p-0"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-border/50">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12">
                          <Image
                            src="/logo.png"
                            alt="CineHub Logo"
                            fill
                            className="object-contain rounded-full"
                          />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold gradient-text">
                            CineHub
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Cinema Experience
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-2">
                        {navItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.path;
                          return (
                            <Link
                              key={item.path}
                              href={item.path}
                              onClick={closeMobileMenu}
                              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive
                                  ? "text-white bg-primary shadow-lg shadow-primary/25"
                                  : "text-muted-foreground hover:text-primary hover:bg-accent/10"
                              }`}
                            >
                              <Icon size={20} className="flex-shrink-0" />
                              <span>{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>

                      <Separator className="my-4" />

                      {/* User Section */}
                      {authUser ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 px-4 py-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={getUserAvatar()}
                                alt={getUserName()}
                                referrerPolicy="no-referrer"
                              />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getUserInitials(getUserName())}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {getUserName()}
                              </p>
                              {getUserEmail() && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {getUserEmail()}
                                </p>
                              )}
                              {hasAdminAccess() && (
                                <Badge
                                  variant={getUserRole() === 'admin' ? 'destructive' : 'default'}
                                  className="mt-1 text-xs"
                                >
                                  {formatRole(getUserRole())}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Link
                            href="/profile"
                            onClick={closeMobileMenu}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/10"
                          >
                            <User size={20} className="flex-shrink-0" />
                            <span>Profile</span>
                          </Link>

                          {hasAdminAccess() && (
                            <>
                              <button
                                onClick={() => handleAdminNav('/admin/users')}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/10"
                              >
                                <Users size={20} className="flex-shrink-0" />
                                <span>User Management</span>
                              </button>
                              <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              >
                                <LogOut size={20} className="flex-shrink-0" />
                                <span>Logout</span>
                              </Button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Link
                            href="/login"
                            onClick={closeMobileMenu}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/10"
                          >
                            <LogIn size={20} className="flex-shrink-0" />
                            <span>Login</span>
                          </Link>
                          <Link
                            href="/register"
                            onClick={closeMobileMenu}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/10"
                          >
                            <User size={20} className="flex-shrink-0" />
                            <span>Register</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;