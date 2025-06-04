import { User } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminStatsProps {
  users: User[];
}

export function AdminStats({ users }: AdminStatsProps) {
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.isActive).length;
  const adminUsers = users.filter((user) => user.role === "admin").length;
  const moderatorUsers = users.filter(
    (user) => user.role === "moderator"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{adminUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Moderators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{moderatorUsers}</div>
        </CardContent>
      </Card>
    </div>
  );
}
