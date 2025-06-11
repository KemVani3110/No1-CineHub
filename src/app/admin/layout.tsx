import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    console.log("Admin Layout - No session, redirecting to login");
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    console.log("Admin Layout - User is not admin, redirecting to home");
    redirect("/home");
  }

  console.log("Admin Layout - Access granted");

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
