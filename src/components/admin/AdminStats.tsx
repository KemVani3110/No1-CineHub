import { User } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserCheck, 
  Shield, 
  UserCog,
  TrendingUp,
  Activity,
  UserX
} from "lucide-react";

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

  const inactiveUsers = totalUsers - activeUsers;
  const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "All registered users",
      trend: "+12% from last month",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      description: `${activePercentage}% of total users`,
      trend: `${inactiveUsers} inactive`,
      color: "text-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Administrators",
      value: adminUsers,
      icon: Shield,
      description: "System administrators",
      trend: "Full access level",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Moderators",
      value: moderatorUsers,
      icon: UserCog,
      description: "Content moderators",
      trend: "Limited access level",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary/80">Total Users</p>
              <p className="text-2xl font-bold text-primary">{users.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary/80">Active Users</p>
              <p className="text-2xl font-bold text-primary">
                {users.filter((user) => user.isActive).length}
              </p>
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
              <p className="text-sm font-medium text-primary/80">Admins</p>
              <p className="text-2xl font-bold text-primary">
                {users.filter((user) => user.role === "admin").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <UserX className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary/80">Inactive Users</p>
              <p className="text-2xl font-bold text-primary">
                {users.filter((user) => !user.isActive).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}