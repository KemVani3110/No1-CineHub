"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState} from "react";
import {
  Menu,
  User,
  LogIn,
  Home,
  Compass,
  Bell,
  Settings,
  LogOut,
  Search,
  PanelLeft,
  Users,
  Activity,
  BookmarkPlus,
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
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/profileStore";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onSidebarChange?: (isOpen: boolean) => void;
}

const Header = ({ onSidebarChange }: HeaderProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user: authUser, logout } = useAuth();
  const { user: profileUser } = useProfileStore();
  const { toast } = useToast();
  const router = useRouter();

  const navItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Explore", path: "/explore", icon: Compass },
    { name: "Watchlist", path: "/watchlist", icon: BookmarkPlus, requiresAuth: true },
    { name: "Search", path: "/search", icon: Search },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
  };

  const handleNavClick = (item: typeof navItems[0]) => {
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
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  // Get user avatar with fallback
  const getUserAvatar = () => {
    if (!authUser) return null;

    // First check if user has a custom avatar from our system
    if (profileUser?.avatar) {
      return profileUser.avatar;
    }

    // Then check social auth avatars
    const socialAvatar = 
      (authUser as any).picture ||
      (authUser as any).photoURL ||
      (authUser as any).image ||
      (authUser as any).profilePicture;

    return socialAvatar || null;
  };

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
                <div className="relative w-12 h-12 lg:w-14 lg:h-14">
                  <Image
                    src="/logo.png"
                    alt="CineHub Logo"
                    fill
                    className="object-contain rounded-full"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl lg:text-3xl font-bold gradient-text">
                    CineHub
                  </span>
                  <span className="text-sm text-muted-foreground -mt-1 hidden lg:block">
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
            <div className="flex items-center space-x-3">
              {authUser ? (
                <>
                  {/* Notifications Button */}
                  <div className="relative hidden sm:block ">
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
                            alt={authUser.name || authUser.email || "User"}
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getUserInitials(authUser.name || authUser.email || "User")}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="pb-2 ">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 ">
                            <AvatarImage
                              src={getUserAvatar()}
                              alt={authUser.name || authUser.email || "User"}
                              referrerPolicy="no-referrer"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getUserInitials(
                                authUser.name || authUser.email || "User"
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-medium truncate">
                              {authUser.name || authUser.email}
                            </span>
                            {authUser.email && authUser.name && (
                              <span className="text-xs text-muted-foreground truncate">
                                {authUser.email}
                              </span>
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
                      {authUser?.role === "admin" && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin/dashboard"
                              className="cursor-pointer"
                            >
                              <PanelLeft className="mr-3 h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin/users"
                              className="cursor-pointer"
                            >
                              <Users className="mr-3 h-4 w-4" />
                              User Management
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin/activity-logs"
                              className="cursor-pointer"
                            >
                              <Activity className="mr-3 h-4 w-4" />
                              Activity Logs
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="mr-3 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
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
                    className="md:hidden h-10 w-10 rounded-full hover:bg-accent/10"
                  >
                    <Menu size={24} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-4">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={closeMobileMenu}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "text-white bg-primary shadow-lg shadow-primary/25"
                              : "text-muted-foreground hover:text-primary hover:bg-accent/10"
                          }`}
                        >
                          <Icon size={20} />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                    <Separator />
                    {authUser ? (
                      <>
                        <Link
                          href="/profile"
                          onClick={closeMobileMenu}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/10"
                        >
                          <User size={20} />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={closeMobileMenu}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/10"
                        >
                          <Settings size={20} />
                          <span>Settings</span>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <LogOut size={20} />
                          <span>Logout</span>
                        </Button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/10"
                      >
                        <LogIn size={20} />
                        <span>Login</span>
                      </Link>
                    )}
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
