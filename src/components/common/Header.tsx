'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  LogIn,
  Home,
  Film,
  Tv,
  Bell,
  Settings
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Movies', path: '/movies', icon: Film },
    { name: 'TV Shows', path: '/tv-shows', icon: Tv },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
            <div className="relative w-14 h-14 group-hover:scale-110 transition-transform">
              <Image
                src="/logo.png"
                alt="CineHub Logo"
                fill
                className="object-contain rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold gradient-text">CineHub</span>
              <span className="text-xs text-muted-foreground -mt-1">Cinema Experience</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`nav-item flex items-center space-x-2 text-sm font-medium transition-all hover:scale-105 ${
                    pathname === item.path 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden sm:flex"
            >
              <Search size={18} />
            </Button>

            {/* Notifications Button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden sm:flex relative"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full">
                <span className="sr-only">Notifications</span>
              </span>
            </Button>

            {/* Settings Button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden sm:flex"
            >
              <Settings size={18} />
            </Button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <LogIn size={16} className="mr-2" />
                Sign In
              </Button>
              <Button size="sm">
                <User size={16} className="mr-2" />
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Sheet */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden"
                >
                  <div className="relative w-5 h-5">
                    <Menu 
                      size={20} 
                      className={`absolute inset-0 transition-all duration-300 ${
                        isMobileMenuOpen 
                          ? 'rotate-90 opacity-0 scale-0' 
                          : 'rotate-0 opacity-100 scale-100'
                      }`} 
                    />
                  </div>
                </Button>
              </SheetTrigger>
              
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col h-full">
                  {/* Header trong sidebar */}
                  <div className="p-6 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10">
                        <Image
                          src="/logo.png"
                          alt="CineHub Logo"
                          fill
                          className="object-contain rounded-full"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-bold gradient-text">CineHub</span>
                        <span className="text-xs text-muted-foreground">Cinema Experience</span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <div className="flex-1 p-6">
                    <nav className="space-y-2">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            href={item.path}
                            onClick={closeMobileMenu}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-accent ${
                              pathname === item.path 
                                ? 'text-primary bg-primary/10 border-l-4 border-primary' 
                                : 'text-muted-foreground hover:text-primary'
                            }`}
                          >
                            <Icon size={20} />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </nav>

                    <Separator className="my-6" />

                    {/* Additional Actions */}
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start h-auto px-4 py-3"
                        onClick={closeMobileMenu}
                      >
                        <Search size={20} className="mr-3" />
                        Search
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start h-auto px-4 py-3"
                        onClick={closeMobileMenu}
                      >
                        <Bell size={20} className="mr-3" />
                        Notifications
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start h-auto px-4 py-3"
                        onClick={closeMobileMenu}
                      >
                        <Settings size={20} className="mr-3" />
                        Settings
                      </Button>
                    </div>
                  </div>

                  {/* Auth Buttons ở cuối */}
                  <div className="p-6 border-t space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={closeMobileMenu}
                    >
                      <LogIn size={18} className="mr-2" />
                      Sign In
                    </Button>
                    <Button 
                      className="w-full justify-start"
                      onClick={closeMobileMenu}
                    >
                      <User size={18} className="mr-2" />
                      Sign Up
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;