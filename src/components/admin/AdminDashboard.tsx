import { useState, useEffect } from "react";
import { User } from "@/types/auth";
import { UserManagement } from "./UserManagement";
import { ActivityLogs } from "./ActivityLogs";
import { AdminStats } from "./AdminStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  AlertTriangle,
  Users,
  Activity,
  BarChart3,
  TrendingUp,
  Clock,
  Shield,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      ("Fetched users:", data.users);
      setUsers(data.users);
      setLastRefresh(new Date());

      toast({
        title: "Success",
        description: "User data refreshed successfully",
        duration: 2000,
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatLastRefresh = () => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - lastRefresh.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return lastRefresh.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <span>Admin Dashboard</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive overview of system management
                </CardDescription>
              </div>
              <Badge variant="secondary" className="animate-pulse">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Loading...
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Loading Content */}
        <Card>
          <CardContent className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent absolute top-0"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Loading Dashboard</h3>
                <p className="text-muted-foreground">Fetching latest data...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Error Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <span>Admin Dashboard</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive overview of system management
                </CardDescription>
              </div>
              <Badge variant="destructive">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Error
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Error Content */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              onClick={fetchUsers}
              size="sm"
              variant="outline"
              className="ml-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
              <div>
                <h3 className="font-semibold text-xl mb-2">
                  Dashboard Unavailable
                </h3>
                <p className="text-muted-foreground mb-4">
                  We're having trouble loading your dashboard data.
                </p>
                <Button onClick={fetchUsers} size="lg">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-background/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <span className="text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Admin Dashboard
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                Comprehensive overview of system management and user analytics
              </CardDescription>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Last updated: {formatLastRefresh()}</span>
                </div>
              </div>
              <Button
                onClick={fetchUsers}
                variant="outline"
                size="sm"
                disabled={loading}
                className="hover:bg-primary/10 hover:text-primary"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Section */}
      <AdminStats users={users} />

      {/* Quick Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary/80">
                  System Health
                </p>
                <p className="text-2xl font-bold text-primary">Excellent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary/80">
                  Security Status
                </p>
                <p className="text-2xl font-bold text-primary">Secure</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary/80">
                  Active Sessions
                </p>
                <p className="text-2xl font-bold text-primary">
                  {users.filter((u) => u.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="users" className="w-full">
            <div className="border-b px-6 py-4">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-primary/5">
                <TabsTrigger
                  value="users"
                  className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:text-primary"
                >
                  <Users className="w-4 h-4" />
                  <span>User Management</span>
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:text-primary"
                >
                  <Activity className="w-4 h-4" />
                  <span>Activity Logs</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="users" className="mt-0">
                <UserManagement users={users} onUsersChange={setUsers} />
              </TabsContent>

              <TabsContent value="activity" className="mt-0">
                <ActivityLogs />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
