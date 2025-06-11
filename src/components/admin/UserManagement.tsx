"use client";

import { useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Search,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Filter,
  RefreshCw,
  Users,
  MoreHorizontal,
  Eye,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserManagementProps {
  users?: User[];
  initialUsers?: User[];
  onUsersChange?: (users: User[]) => void;
}

export function UserManagement({
  users: propUsers,
  initialUsers,
  onUsersChange,
}: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(propUsers || initialUsers || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  useEffect(() => {
    if (propUsers) {
      setUsers(propUsers);
    }
  }, [propUsers]);

  useEffect(() => {
    if (onUsersChange) {
      onUsersChange(users);
    }
  }, [users, onUsersChange]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setLoading((prev) => ({ ...prev, [`role-${userId}`]: true }));

      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role: newRole as UserRole,
          isActive: users.find((u) => u.id === userId)?.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole as UserRole } : user
        )
      );

      toast({
        title: "Success",
        description: "User role updated successfully",
        className: "bg-green-600/10 border-green-500/20 text-green-400",
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [`role-${userId}`]: false }));
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      setLoading((prev) => ({ ...prev, [`status-${userId}`]: true }));

      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role: users.find((u) => u.id === userId)?.role,
          isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isActive } : user
        )
      );

      toast({
        title: "Success",
        description: `User ${
          isActive ? "activated" : "deactivated"
        } successfully`,
        className: "bg-green-600/10 border-green-500/20 text-green-400",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [`status-${userId}`]: false }));
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "moderator":
        return "default";
      default:
        return "secondary";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3 w-3" />;
      case "moderator":
        return <UserCheck className="h-3 w-3" />;
      default:
        return <Mail className="h-3 w-3" />;
    }
  };

  const formatRoleDisplay = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getStatsCount = (type: string) => {
    switch (type) {
      case "total":
        return users.length;
      case "active":
        return users.filter((u) => u.isActive).length;
      case "admin":
        return users.filter((u) => u.role === "admin").length;
      case "moderator":
        return users.filter((u) => u.role === "moderator").length;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6 bg-[var(--bg-main)] text-[var(--text-main)] p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <Users className="h-6 w-6 text-[var(--cinehub-accent)]" />
            User Management
          </h1>
          <p className="text-[var(--text-sub)]">
            Manage user roles and permissions
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="cursor-pointer hover:bg-[var(--cinehub-accent)]/10 hover:text-[var(--cinehub-accent)] transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[var(--bg-card)] border-[var(--border)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[var(--text-sub)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatsCount("total")}</div>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bg-card)] border-[var(--border)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-[var(--text-sub)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatsCount("active")}</div>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bg-card)] border-[var(--border)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-[var(--text-sub)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatsCount("admin")}</div>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bg-card)] border-[var(--border)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderators</CardTitle>
            <UserCheck className="h-4 w-4 text-[var(--text-sub)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatsCount("moderator")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-[var(--bg-card)] border-[var(--border)]">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-sub)] h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[var(--bg-main)] border-[var(--border)] focus:border-[var(--cinehub-accent)] transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[var(--text-sub)]" />
                <Select
                  value={roleFilter}
                  onValueChange={(value) =>
                    setRoleFilter(value as UserRole | "all")
                  }
                >
                  <SelectTrigger className="w-[140px] bg-[var(--bg-main)] border-[var(--border)] cursor-pointer hover:border-[var(--cinehub-accent)] transition-colors">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--bg-card)] border-[var(--border)]">
                    <SelectItem value="all" className="cursor-pointer hover:bg-[var(--cinehub-accent)]/10">
                      All Roles
                    </SelectItem>
                    <SelectItem value="admin" className="cursor-pointer hover:bg-[var(--cinehub-accent)]/10">
                      Admin
                    </SelectItem>
                    <SelectItem value="moderator" className="cursor-pointer hover:bg-[var(--cinehub-accent)]/10">
                      Moderator
                    </SelectItem>
                    <SelectItem value="user" className="cursor-pointer hover:bg-[var(--cinehub-accent)]/10">
                      User
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[140px] bg-[var(--bg-main)] border-[var(--border)] cursor-pointer hover:border-[var(--cinehub-accent)] transition-colors">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--bg-card)] border-[var(--border)]">
                  <SelectItem value="all" className="cursor-pointer hover:bg-[var(--cinehub-accent)]/10">
                    All Status
                  </SelectItem>
                  <SelectItem value="active" className="cursor-pointer hover:bg-[var(--cinehub-accent)]/10">
                    Active
                  </SelectItem>
                  <SelectItem value="inactive" className="cursor-pointer hover:bg-[var(--cinehub-accent)]/10">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-[var(--bg-card)] border-[var(--border)]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--border)]">
                <TableHead className="w-[300px]">User</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Change Role</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-[var(--cinehub-accent)]/5 transition-colors border-[var(--border)] cursor-pointer"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border-2 border-[var(--border)] cursor-pointer hover:border-[var(--cinehub-accent)] transition-colors">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-[var(--cinehub-accent)]/10 text-[var(--cinehub-accent)] font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[var(--text-main)]">
                          {user.name}
                        </p>
                        <p className="text-sm text-[var(--text-sub)] sm:hidden">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[var(--text-sub)] hidden sm:table-cell">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getRoleBadgeVariant(user.role)}
                      className="flex items-center space-x-1 w-fit cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {getRoleIcon(user.role)}
                      <span>{formatRoleDisplay(user.role)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                      disabled={loading[`role-${user.id}`]}
                    >
                      <SelectTrigger className="w-[130px] h-9 text-sm bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-main)] cursor-pointer hover:border-[var(--cinehub-accent)] transition-colors">
                        {loading[`role-${user.id}`] ? (
                          <div className="flex items-center">
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-main)]">
                        <SelectItem value="admin" className="cursor-pointer hover:bg-[var(--cinehub-accent)]/10">
                          Admin
                        </SelectItem>
                        <SelectItem value="moderator" className="cursor-pointer hover:bg-[var(--cinehub-accent)]/10">
                          Moderator
                        </SelectItem>
                        <SelectItem value="user" className="cursor-pointer hover:bg-[var(--cinehub-accent)]/10">
                          User
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Button
                      variant={user.isActive ? "default" : "destructive"}
                      size="sm"
                      onClick={() => handleStatusChange(user.id, !user.isActive)}
                      disabled={loading[`status-${user.id}`]}
                      className="w-[100px]"
                    >
                      {loading[`status-${user.id}`] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : user.isActive ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Active
                        </>
                      ) : (
                        <>
                          <UserX className="h-4 w-4 mr-2" />
                          Inactive
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 hover:bg-[var(--cinehub-accent)]/10"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[var(--bg-card)] border-[var(--border)]">
                        <DropdownMenuItem className="cursor-pointer hover:bg-[var(--cinehub-accent)]/10">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-[var(--cinehub-accent)]/10">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}