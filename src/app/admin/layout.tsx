import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFirestore } from "firebase-admin/firestore";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { UserRole } from "@/types/auth";
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      throw new Error('Missing Firebase Admin configuration');
    }

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

const adminDb = getFirestore();

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user?.id) {
    console.log("Admin Layout - No session, redirecting to login");
    redirect("/login");
  }

  try {
    // Get user data from Firestore
    const userDoc = await adminDb.collection('users').doc(session.user.id).get();
    
    if (!userDoc.exists) {
      console.log("Admin Layout - User not found in database");
      redirect("/login");
    }

    const userData = userDoc.data();
    const role = userData?.role as UserRole;

    // Check if user is active
    if (!userData?.isActive) {
      console.log("Admin Layout - User account is inactive");
      redirect("/login?error=account_inactive");
    }

    // Check if user has admin role
    if (role !== "admin" && role !== "moderator") {
      console.log("Admin Layout - User is not admin or moderator");
      redirect("/home?error=insufficient_permissions");
    }

    console.log("Admin Layout - Access granted for role:", role);

    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Admin Layout - Error checking permissions:", error);
    redirect("/login?error=server_error");
  }
}
