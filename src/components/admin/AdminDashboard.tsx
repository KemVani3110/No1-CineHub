import { useState, useEffect } from "react";
import { User } from "@/types/auth";
import { UserManagement } from "./UserManagement";
import { ActivityLogs } from "./ActivityLogs";
import { AdminStats } from "./AdminStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

      console.log("Fetched users:", data.users);
      setUsers(data.users);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-lg font-medium">{error}</div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminStats users={users} />

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement users={users} onUsersChange={setUsers} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
