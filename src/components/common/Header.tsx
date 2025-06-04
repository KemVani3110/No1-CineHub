"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  PanelLeftClose,
  PanelLeft,
  Users,
  Activity,
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
import Sidebar from "./Sidebar";

interface HeaderProps {
  onSidebarChange?: (isOpen: boolean) => void;
}

const Header = ({ onSidebarChange }: HeaderProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Explore", path: "/explore", icon: Compass },
    { name: "Search", path: "/search", icon: Search },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
  };

  const handleSidebarToggle = (open: boolean) => {
    setIsSidebarOpen(open);
    onSidebarChange?.(open);
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
    if (!user) return null;

    const avatarUrl =
      user.avatar ||
      (user as any).picture ||
      (user as any).photoURL ||
      (user as any).image ||
      (user as any).profilePicture;

    return avatarUrl || null;
  };

  return (
    <>
      {/* <Sidebar isOpen={isSidebarOpen} onClose={() => handleSidebarToggle(false)} /> */}

      <header
        className={`w-full bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-40 transition-all duration-300 ${
          isSidebarOpen ? "hidden" : "block"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section - Simplified */}
            <div className="flex items-center space-x-4">
              {/* <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-accent/10"
                onClick={() => handleSidebarToggle(!isSidebarOpen)}
              >
                {isSidebarOpen ? <PanelLeftClose size={22} /> : <PanelLeft size={22} />}
              </Button> */}

              <Link
                href="/home"
                className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
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
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`nav-item flex items-center space-x-2 px-4 py-2 mx-1 rounded-full text-sm font-medium transition-all duration-200 ${
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
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {user ? (
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
                        className="hidden sm:flex p-1 rounded-full hover:bg-accent/10 cursor-pointer"
                      >
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage
                            src={getUserAvatar()}
                            alt={user.name || user.email || "User"}
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getUserInitials(user.name || user.email || "User")}
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
                              alt={user.name || user.email || "User"}
                              referrerPolicy="no-referrer"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getUserInitials(
                                user.name || user.email || "User"
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-medium truncate">
                              {user.name || user.email}
                            </span>
                            {user.email && user.name && (
                              <span className="text-xs text-muted-foreground truncate">
                                {user.email}
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
                      {user?.role === "admin" && (
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
                    className="md:hidden h-10 w-10 rounded-full"
                  >
                    <Menu size={22} />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="w-80 p-0 flex flex-col max-h-screen"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col h-full overflow-hidden">
                    {/* Header inside sidebar */}
                    <div className="p-6 border-b flex-shrink-0">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12">
                          <Image
                            src="/logo.png"
                            alt="CineHub Logo"
                            fill
                            className="object-contain rounded-full"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-bold gradient-text">
                            CineHub
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Cinema Experience
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    {user && (
                      <div className="p-6 border-b flex-shrink-0">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarImage
                              src={getUserAvatar()}
                              alt={user.name || user.email || "User"}
                              referrerPolicy="no-referrer"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getUserInitials(
                                user.name || user.email || "User"
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-medium text-foreground truncate">
                              {user.name || user.email}
                            </span>
                            {user.email && user.name && (
                              <span className="text-sm text-muted-foreground truncate">
                                {user.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Items */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-6">
                        <nav className="space-y-2">
                          {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;
                            return (
                              <Link
                                key={item.path}
                                href={item.path}
                                onClick={closeMobileMenu}
                                className={`flex items-center space-x-3 px-4 py-4 rounded-xl text-base font-medium transition-all ${
                                  isActive
                                    ? "text-white bg-primary shadow-lg"
                                    : "text-muted-foreground hover:text-primary hover:bg-accent/10"
                                }`}
                              >
                                <Icon size={22} />
                                <span>{item.name}</span>
                              </Link>
                            );
                          })}
                        </nav>

                        <Separator className="my-6" />

                        {/* Additional Actions */}
                        {user && (
                          <div className="space-y-2">
                            <Button
                              variant="ghost"
                              className="w-full justify-start h-auto px-4 py-4 text-base rounded-xl relative"
                              onClick={closeMobileMenu}
                            >
                              <Bell size={22} className="mr-3" />
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
                              className="w-full justify-start h-auto px-4 py-4 text-base rounded-xl"
                              onClick={closeMobileMenu}
                              asChild
                            >
                              <Link href="/settings">
                                <Settings size={22} className="mr-3" />
                                Settings
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Auth Buttons */}
                    <div className="border-t flex-shrink-0">
                      {user ? (
                        <div className="p-6">
                          <Button
                            variant="outline"
                            className="w-full justify-start h-12 text-base text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl"
                            onClick={handleLogout}
                          >
                            <LogOut size={20} className="mr-3" />
                            Logout
                          </Button>
                        </div>
                      ) : (
                        <div className="p-6 space-y-3">
                          <Button
                            variant="outline"
                            className="w-full justify-start h-12 text-base rounded-xl"
                            onClick={closeMobileMenu}
                            asChild
                          >
                            <Link href="/login">
                              <LogIn size={20} className="mr-3" />
                              Sign In
                            </Link>
                          </Button>
                          <Button
                            className="w-full justify-start h-12 text-base rounded-xl"
                            onClick={closeMobileMenu}
                            asChild
                          >
                            <Link href="/register">
                              <User size={20} className="mr-3" />
                              Sign Up
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Admin Actions */}
                    {user?.role === "admin" && (
                      <>
                        <Separator className="my-6" />
                        <div className="space-y-2">
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-auto px-4 py-4 text-base rounded-xl"
                            onClick={closeMobileMenu}
                            asChild
                          >
                            <Link href="/admin/dashboard">
                              <PanelLeft size={22} className="mr-3" />
                              Admin Dashboard
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-auto px-4 py-4 text-base rounded-xl"
                            onClick={closeMobileMenu}
                            asChild
                          >
                            <Link href="/admin/users">
                              <Users size={22} className="mr-3" />
                              User Management
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-auto px-4 py-4 text-base rounded-xl"
                            onClick={closeMobileMenu}
                            asChild
                          >
                            <Link href="/admin/activity-logs">
                              <Activity size={22} className="mr-3" />
                              Activity Logs
                            </Link>
                          </Button>
                        </div>
                      </>
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
