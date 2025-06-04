import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface UserManagementProps {
  users: User[];
  onUsersChange: (users: User[]) => void;
}

export function UserManagement({ users, onUsersChange }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    try {
      setLoading((prev) => ({ ...prev, [`role-${userId}`]: true }));

      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role: newRole,
          isActive: users.find((u) => u.id === userId)?.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      onUsersChange(
        users.map((user) => (user.id === userId ? data.user : user))
      );

      toast({
        title: "Success",
        description: "User role updated successfully",
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

      onUsersChange(
        users.map((user) => (user.id === userId ? data.user : user))
      );

      toast({
        title: "Success",
        description: `User ${isActive ? "enabled" : "disabled"} successfully`,
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
      });

      setSelectedUser(null);
      setIsChangingPassword(false);
      setNewPassword("");
      setAdminPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(value) =>
                      handleRoleChange(user.id, value as UserRole)
                    }
                    disabled={loading[`role-${user.id}`]}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.USER}>User</SelectItem>
                      <SelectItem value={UserRole.MODERATOR}>
                        Moderator
                      </SelectItem>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant={user.isActive ? "destructive" : "default"}
                    onClick={() => handleStatusChange(user.id, !user.isActive)}
                    disabled={loading[`status-${user.id}`]}
                    className="w-[100px]"
                  >
                    {loading[`status-${user.id}`] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : user.isActive ? (
                      "Disable"
                    ) : (
                      "Enable"
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsChangingPassword(true);
                    }}
                  >
                    Change Password
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isChangingPassword && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg space-y-4 w-[400px] shadow-lg">
            <h3 className="text-lg font-semibold">
              Change Password for {selectedUser.name}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Password</label>
                <Input
                  type="password"
                  placeholder="Enter your admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  setSelectedUser(null);
                  setNewPassword("");
                  setAdminPassword("");
                }}
                disabled={loading.password}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordChange}
                disabled={loading.password || !newPassword || !adminPassword}
              >
                {loading.password ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
