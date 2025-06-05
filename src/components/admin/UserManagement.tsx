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
import { useToast } from "@/components/ui/use-toast";
import { 
  Loader2, 
  Search, 
  UserCheck, 
  UserX, 
  Key, 
  Shield, 
  Mail,
  Calendar,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UserManagementProps {
  users?: User[];
  initialUsers?: User[];
  onUsersChange?: (users: User[]) => void;
}

export function UserManagement({ users: propUsers, initialUsers, onUsersChange }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(propUsers || initialUsers || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
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
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = async (userId: number, newRole: string) => {
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

      setUsers(prevUsers =>
        prevUsers.map((user) => 
          user.id === userId ? { ...user, role: newRole as UserRole } : user
        )
      );

      toast({
        title: "Success",
        description: "User role updated successfully",
        className: "bg-green-600/10 border-green-500/20 text-green-400"
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update role",
        variant: "destructive"
      });
    } finally {
      setLoading((prev) => ({ ...prev, [`role-${userId}`]: false }));
    }
  };

  const handleStatusChange = async (userId: number, isActive: boolean) => {
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

      setUsers(prevUsers =>
        prevUsers.map((user) => (user.id === userId ? { ...user, isActive } : user))
      );

      toast({
        title: "Success",
        description: `User ${isActive ? "activated" : "deactivated"} successfully`,
        className: "bg-green-600/10 border-green-500/20 text-green-400"
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive"
      });
    } finally {
      setLoading((prev) => ({ ...prev, [`status-${userId}`]: false }));
    }
  };

  const handlePasswordChange = async () => {
    if (!selectedUser) return;

    try {
      setLoading((prev) => ({ ...prev, password: true }));

      const response = await fetch("/api/admin/users/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPassword,
          adminPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      toast({
        title: "Success",
        description: "Password changed successfully",
        className: "bg-green-600/10 border-green-500/20 text-green-400"
      });

      setSelectedUser(null);
      setIsChangingPassword(false);
      setNewPassword("");
      setAdminPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive"
      });
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "moderator": return "default";
      default: return "secondary";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Shield className="h-3 w-3" />;
      case "moderator": return <UserCheck className="h-3 w-3" />;
      default: return <Mail className="h-3 w-3" />;
    }
  };

  const formatRoleDisplay = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="space-y-6 bg-[var(--bg-main)] text-[var(--text-main)]">
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-sub)] h-4 w-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-[var(--text-sub)]" />
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | "all")}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[var(--cinehub-accent)]/5 border-[var(--border)]">
              <TableHead className="w-[50px] text-[var(--text-main)]">Avatar</TableHead>
              <TableHead className="text-[var(--text-main)]">Name</TableHead>
              <TableHead className="text-[var(--text-main)]">Email</TableHead>
              <TableHead className="text-[var(--text-main)]">Role</TableHead>
              <TableHead className="text-[var(--text-main)]">Change Role</TableHead>
              <TableHead className="text-[var(--text-main)]">Status</TableHead>
              {/* <TableHead className="text-[var(--text-main)]">Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-[var(--cinehub-accent)]/5 transition-colors border-[var(--border)]">
                <TableCell>
                  <Avatar className="h-8 w-8 border-2 border-[var(--border)]">
                    <AvatarImage
                      src={user.avatar}
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[var(--cinehub-accent)]/10 text-[var(--cinehub-accent)]">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium text-[var(--text-main)]">{user.name}</TableCell>
                <TableCell className="text-[var(--text-sub)]">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center space-x-1 w-fit">
                    {getRoleIcon(user.role)}
                    <span>{formatRoleDisplay(user.role)}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                    disabled={loading[`role-${user.id}`]}
                  >
                    <SelectTrigger className="w-[120px] h-9 text-sm bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-main)]">
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
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.isActive ? "default" : "secondary"}
                    className={cn(
                      "cursor-pointer hover:opacity-80 transition-opacity",
                      user.isActive 
                        ? "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20 hover:bg-[var(--success)]/20" 
                        : "bg-[var(--text-sub)]/10 text-[var(--text-sub)] border-[var(--text-sub)]/20 hover:bg-[var(--text-sub)]/20"
                    )}
                    onClick={() => handleStatusChange(user.id, !user.isActive)}
                  >
                    {loading[`status-${user.id}`] ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        <span>...</span>
                      </div>
                    ) : (
                      user.isActive ? "Active" : "Inactive"
                    )}
                  </Badge>
                </TableCell>
                {/* <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsChangingPassword(true);
                    }}
                    className="hover:bg-[var(--cinehub-accent)]/10 hover:text-[var(--cinehub-accent)] text-[var(--text-sub)]"
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Password Change Modal */}
      {/* {isChangingPassword && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 ">
          <div className="bg-[var(--bg-card)]/95 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-full max-w-md border border-[var(--border)] cursor-pointer">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--cinehub-accent)] to-[var(--cinehub-accent-hover)] rounded-full flex items-center justify-center mx-auto mb-4 ">
                  <Key className="h-8 w-8 text-[var(--bg-main)] " />
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-main)] mb-2">
                  Change Password
                </h3>
                <p className="text-[var(--text-sub)]">
                  Updating password for <span className="font-semibold text-[var(--cinehub-accent)]">{selectedUser.name}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--text-main)]">New Password</label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-[var(--bg-main)]/80 backdrop-blur-sm border-[var(--border)] focus:border-[var(--cinehub-accent)] text-[var(--text-main)] placeholder:text-[var(--text-sub)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--text-main)]">Admin Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="bg-[var(--bg-main)]/80 backdrop-blur-sm border-[var(--border)] focus:border-[var(--cinehub-accent)] text-[var(--text-main)] placeholder:text-[var(--text-sub)]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-[var(--border)]">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setSelectedUser(null);
                    setNewPassword("");
                    setAdminPassword("");
                  }}
                  disabled={loading.password}
                  className="bg-[var(--bg-main)]/80 backdrop-blur-sm border-[var(--border)] hover:bg-[var(--cinehub-accent)]/10 hover:text-[var(--cinehub-accent)] text-[var(--text-main)] cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordChange}
                  disabled={loading.password || !newPassword || !adminPassword}
                  className="bg-gradient-to-r from-[var(--cinehub-accent)] to-[var(--cinehub-accent-hover)] hover:from-[var(--cinehub-accent-hover)] hover:to-[var(--cinehub-accent)] text-[var(--bg-main)] shadow-lg font-medium cursor-pointer"
                >
                  {loading.password ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-[var(--bg-card)]/80 backdrop-blur-sm rounded-lg border border-[var(--border)]">
          <div className="w-16 h-16 bg-[var(--cinehub-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserX className="h-8 w-8 text-[var(--text-sub)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-main)] mb-2">No users found</h3>
          <p className="text-[var(--text-sub)]">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}