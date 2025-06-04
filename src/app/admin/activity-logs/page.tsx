import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

async function getActivityLogs() {
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
    LIMIT 100
  `);
  return rows;
}

export default async function ActivityLogs() {
  const session = await getServerSession(authOptions);
  const logs = await getActivityLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Logs</h1>
        <p className="text-muted-foreground">
          Monitor admin actions and system activities
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target User</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log: any) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{log.admin_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {log.admin_email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      log.action.includes("delete")
                        ? "destructive"
                        : log.action.includes("create")
                        ? "success"
                        : "default"
                    }
                  >
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
                <TableCell>{log.ip_address}</TableCell>
                <TableCell>
                  {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
