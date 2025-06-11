import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";
import { UserManagement } from "@/components/admin/UserManagement";
import { User } from "@/types/auth";

async function getUsers() {
  const db = getFirestore();
  const usersSnapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
  
  return usersSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      role: data.role,
      isActive: data.isActive,
      avatar: data.avatar,
      createdAt: data.createdAt?.toDate(),
      lastLoginAt: data.lastLoginAt?.toDate(),
      emailVerified: data.emailVerified || false,
      updatedAt: data.updatedAt?.toDate() || new Date(),
      provider: data.provider || 'local',
      providerId: data.providerId,
      stats: data.stats || {
        watchlistCount: 0,
        reviewCount: 0,
        ratingCount: 0
      },
      recentActivity: data.recentActivity || []
    } as User;
  });
}

export default async function UserManagementPage() {
  const session = await getServerSession(authOptions);

  // Check if user is admin
  if (!session || session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  const users = await getUsers();

  return (
    <div className="p-6">
      <UserManagement initialUsers={users} />
    </div>
  );
}
