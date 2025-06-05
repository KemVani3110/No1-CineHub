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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Calendar,
  Activity,
  User,
  Shield,
  AlertCircle,
  RefreshCw,
  Filter,
  Download,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [actionFilter, setActionFilter] = useState<string>("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
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

  const getActionBadge = (action: string) => {
    const actionTypes = {
      login: { variant: "secondary" as const, color: "text-blue-600" },
      logout: { variant: "outline" as const, color: "text-gray-600" },
      create: { variant: "default" as const, color: "text-green-600" },
      update: { variant: "secondary" as const, color: "text-orange-600" },
      delete: { variant: "destructive" as const, color: "text-red-600" },
      view: { variant: "outline" as const, color: "text-purple-600" },
    };

    const actionType =
      Object.keys(actionTypes).find((type) =>
        action.toLowerCase().includes(type)
      ) || "view";

    return actionTypes[actionType as keyof typeof actionTypes];
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const uniqueActions = [...new Set(logs.map((log) => log.action))];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip_address.includes(searchTerm);

    const matchesFilter = actionFilter === "all" || log.action === actionFilter;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground font-medium">
              Loading activity logs...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">Error Loading Logs</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={fetchLogs} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Activity Logs</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Monitor admin actions and system activities
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={fetchLogs} className="hover:bg-primary/10 hover:text-primary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 h-4 w-4" />
              <Input
                placeholder="Search by action, description, or IP address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-primary/20 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/80 backdrop-blur-sm border-primary/20">
                <Filter className="w-4 h-4 mr-2 text-primary/50" />
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>
            Showing {filteredLogs.length} of {logs.length} logs
          </span>
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Filtered by: "{searchTerm}"
            </Badge>
          )}
        </div>
      </div>

      {/* Activity Logs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-[140px] font-semibold">
                  <Calendar className="w-4 h-4 inline mr-2 text-primary/50" />
                  Time
                </TableHead>
                <TableHead className="font-semibold">
                  <Shield className="w-4 h-4 inline mr-2 text-primary/50" />
                  Action
                </TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="w-[140px] font-semibold">
                  <User className="w-4 h-4 inline mr-2 text-primary/50" />
                  IP Address
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-2">
                      <Activity className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground font-medium">
                        No activity logs found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => {
                  const actionBadge = getActionBadge(log.action);
                  return (
                    <TableRow key={log.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimeAgo(log.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={actionBadge.variant}
                          className={`${actionBadge.color} font-medium`}
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">
                        {log.ip_address}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
