"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Film,
  Heart,
  Settings,
  LogOut,
  User,
  TrendingUp,
  Star
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const mainRoutes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: "text-sky-500"
  },
  {
    label: 'Movies',
    icon: Film,
    href: '/movies',
    color: "text-violet-500",
  },
  {
    label: 'Favorites',
    icon: Heart,
    href: '/favorites',
    color: "text-pink-700",
  },
]

const personalRoutes = [
  {
    label: 'Profile',
    icon: User,
    href: '/profile',
    color: "text-cyan-500",
  },
  {
    label: 'Trending',
    icon: TrendingUp,
    href: '/trending',
    color: "text-green-500",
  },
  {
    label: 'Top Rated',
    icon: Star,
    href: '/top-rated',
    color: "text-yellow-500",
  },
]

const generalRoutes = [
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    color: "text-orange-700",
  },
]

export const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        router.push('/login')
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-bg-main to-bg-card text-text-main border-r border-custom shadow-2xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-custom/50">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-14 h-14">
            <img 
              src="/logo.png" 
              alt="CineHub Logo" 
              className="w-full h-full rounded-full object-contain transition-transform group-hover:scale-110"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cinehub-accent to-primary bg-clip-text text-transparent">
              CINE<span className="text-text-main">HUB</span>
            </h1>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4">
        {/* Main Menu Section */}
        <div className="py-6">
          <div className="mb-4">
            <h2 className="px-3 text-xs font-semibold text-text-sub uppercase tracking-wider">
              MAIN MENU
            </h2>
          </div>
          <div className="space-y-2">
            {mainRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden",
                  pathname === route.href 
                    ? "bg-gradient-to-r from-cinehub-accent/20 to-primary/20 text-white shadow-lg border border-cinehub-accent/30" 
                    : "text-text-sub hover:text-text-main hover:bg-bg-card/50 hover:shadow-md"
                )}
              >
                {pathname === route.href && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cinehub-accent to-primary rounded-r-full" />
                )}
                <route.icon className={cn(
                  "w-5 h-5 mr-3 transition-all duration-300",
                  pathname === route.href ? "text-cinehub-accent scale-110" : route.color,
                  "group-hover:scale-110"
                )} />
                {route.label}
                {pathname === route.href && (
                  <div className="ml-auto w-2 h-2 bg-cinehub-accent rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Personal Section */}
        <div className="py-6">
          <div className="mb-4">
            <h2 className="px-3 text-xs font-semibold text-text-sub uppercase tracking-wider">
              DISCOVER
            </h2>
          </div>
          <div className="space-y-2">
            {personalRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden",
                  pathname === route.href 
                    ? "bg-gradient-to-r from-cinehub-accent/20 to-primary/20 text-white shadow-lg border border-cinehub-accent/30" 
                    : "text-text-sub hover:text-text-main hover:bg-bg-card/50 hover:shadow-md"
                )}
              >
                {pathname === route.href && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cinehub-accent to-primary rounded-r-full" />
                )}
                <route.icon className={cn(
                  "w-5 h-5 mr-3 transition-all duration-300",
                  pathname === route.href ? "text-cinehub-accent scale-110" : route.color,
                  "group-hover:scale-110"
                )} />
                {route.label}
                {pathname === route.href && (
                  <div className="ml-auto w-2 h-2 bg-cinehub-accent rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* General Section */}
        <div className="py-6">
          <div className="mb-4">
            <h2 className="px-3 text-xs font-semibold text-text-sub uppercase tracking-wider">
              GENERAL
            </h2>
          </div>
          <div className="space-y-2">
            {generalRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden",
                  pathname === route.href 
                    ? "bg-gradient-to-r from-cinehub-accent/20 to-primary/20 text-white shadow-lg border border-cinehub-accent/30" 
                    : "text-text-sub hover:text-text-main hover:bg-bg-card/50 hover:shadow-md"
                )}
              >
                {pathname === route.href && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cinehub-accent to-primary rounded-r-full" />
                )}
                <route.icon className={cn(
                  "w-5 h-5 mr-3 transition-all duration-300",
                  pathname === route.href ? "text-cinehub-accent scale-110" : route.color,
                  "group-hover:scale-110"
                )} />
                {route.label}
                {pathname === route.href && (
                  <div className="ml-auto w-2 h-2 bg-cinehub-accent rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Logout Button */}
      <div className="p-4 border-t border-custom/50">
        <Button 
          onClick={handleLogout}
          variant="ghost" 
          className="w-full cursor-pointer justify-start text-danger hover:text-red-300 hover:bg-danger/20 rounded-xl transition-all duration-300 group py-3"
        >
          <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
          Logout
        </Button>
      </div>
    </div>
  )
}