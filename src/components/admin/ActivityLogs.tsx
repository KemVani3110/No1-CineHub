import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface ActivityLog {
  id: number;
  admin_id: number;
  action: string;
  target_user_id: number | null;
  description: string;
  metadata: any;
  ip_address: string;
  created_at: string;
}

export function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/admin/activity-logs");
      if (!response.ok) throw new Error("Failed to fetch activity logs");
      const data = await response.json();
      setLogs(data.logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search logs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>IP Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell>{log.ip_address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
