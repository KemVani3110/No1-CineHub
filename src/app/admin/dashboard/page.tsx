import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Star, TrendingUp, BarChart3, Shield, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | CineHub",
  description: "Admin dashboard for managing users and system",
};

async function getStats() {
  const [users, activities, ratings, watchlist] = await Promise.all([
    db.query("SELECT COUNT(*) as count FROM users"),
    db.query("SELECT COUNT(*) as count FROM user_activity_logs"),
    db.query("SELECT COUNT(*) as count FROM ratings"),
    db.query("SELECT COUNT(*) as count FROM watchlist"),
  ]);

  return {
    totalUsers: users[0][0].count,
    totalActivities: activities[0][0].count,
    totalRatings: ratings[0][0].count,
    totalWatchlist: watchlist[0][0].count,
  };
}

async function getUserStats() {
  const [userStats] = await db.query(`
    SELECT 
      COUNT(*) as total_users,
      COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users,
      COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
      COUNT(CASE WHEN role = 'moderator' THEN 1 END) as moderator_users
    FROM users
  `);
  
  return userStats[0];
}

async function getRecentActivityLogs() {
  const [rows] = await db.query(`
    SELECT 
      al.id,
      al.admin_id,
      al.action,
      al.target_user_id,
      al.description,
      al.metadata,
      al.ip_address,
      al.created_at,
      u.name as admin_name,
      u.email as admin_email,
      tu.name as target_user_name,
      tu.email as target_user_email
    FROM admin_activity_logs al
    LEFT JOIN users u ON al.admin_id = u.id
    LEFT JOIN users tu ON al.target_user_id = tu.id
    ORDER BY al.created_at DESC
    LIMIT 10
  `);
  return rows;
}

function getActionBadgeVariant(action: string) {
  if (action.includes("delete")) return "destructive";
  if (action.includes("create")) return "default";
  if (action.includes("update")) return "secondary";
  return "outline";
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const [stats, userStats, recentLogs] = await Promise.all([
    getStats(),
    getUserStats(),
    getRecentActivityLogs(),
  ]);

  const activePercentage = userStats.total_users > 0 
    ? Math.round((userStats.active_users / userStats.total_users) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-background/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <span className="text-3xl">Admin Dashboard</span>
              </CardTitle>
              <p className="text-muted-foreground text-base">
                Welcome back, {session?.user?.name}. Here's your system overview.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Last updated: {format(new Date(), "MMM d, HH:mm")}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="p-2 rounded-full bg-blue-50">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="p-2 rounded-full bg-green-50">
              <Activity className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-600">{userStats.active_users}</div>
              <Badge variant="secondary" className="text-xs">
                {activePercentage}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
            <div className="w-full bg-muted rounded-full h-1.5 mt-2">
              <div 
                className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${activePercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <div className="p-2 rounded-full bg-yellow-50">
              <Star className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.totalRatings}</div>
            <p className="text-xs text-muted-foreground">User ratings given</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watchlist Items</CardTitle>
            <div className="p-2 rounded-full bg-purple-50">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalWatchlist}</div>
            <p className="text-xs text-muted-foreground">Items in watchlists</p>
          </CardContent>
        </Card>
      </div>

      {/* User Role Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Regular Users</p>
                <p className="text-2xl font-bold text-blue-700">
                  {userStats.total_users - userStats.admin_users - userStats.moderator_users}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-500/10">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">Administrators</p>
                <p className="text-2xl font-bold text-purple-700">{userStats.admin_users}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-orange-500/10">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-900">Moderators</p>
                <p className="text-2xl font-bold text-orange-700">{userStats.moderator_users}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Recent Admin Activity</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest 10 administrative actions
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target User</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Activity className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No recent activity</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentLogs.map((log: any) => (
                    <TableRow key={log.id} className="hover:bg-accent/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.admin_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {log.admin_email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.target_user_name ? (
                          <div>
                            <div className="font-medium">{log.target_user_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {log.target_user_email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {log.description}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(log.created_at), "MMM d, HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}