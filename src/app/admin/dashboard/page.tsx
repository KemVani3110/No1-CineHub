"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminDashboard() {
  const { admin, dashboardData } = useAdmin();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {admin?.name || "Admin"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage your users and system settings from here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 