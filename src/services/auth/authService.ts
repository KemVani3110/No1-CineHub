import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { AuthUser } from '@/types/auth';
import { query } from '@/lib/db';

export class AuthService {
  // Email/Password Authentication
  static async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      // Get user from database
      const users = await query<AuthUser[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      
      if (users.length === 0) {
        throw new Error("User not found in database");
      }
      
      return users[0];
    } catch (error) {
      console.error("Email sign in error:", error);
      throw error;
    }
  }

  static async registerWithEmail(email: string, password: string, name: string): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user in database
      await query(
        `INSERT INTO users (email, name, provider, provider_id, role, is_active, email_verified)
         VALUES (?, ?, 'local', ?, 'user', true, true)`,
        [email, name, user.uid]
      );
      
      const users = await query<AuthUser[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      
      return users[0];
    } catch (error) {
      console.error("Email registration error:", error);
      throw error;
    }
  }

  // Google Authentication
  static async signInWithGoogle(): Promise<AuthUser> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Get or create user in database
      const users = await query<AuthUser[]>(
        "SELECT * FROM users WHERE email = ?",
        [user.email]
      );
      
      if (users.length === 0) {
        await query(
          `INSERT INTO users (email, name, avatar, provider, provider_id, role, is_active, email_verified)
           VALUES (?, ?, ?, 'google', ?, 'user', true, true)`,
          [user.email, user.displayName, user.photoURL, user.uid]
        );
        
        const newUsers = await query<AuthUser[]>(
          "SELECT * FROM users WHERE email = ?",
          [user.email]
        );
        return newUsers[0];
      }
      
      return users[0];
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  }

  // Facebook Authentication
  static async signInWithFacebook(): Promise<AuthUser> {
    try {
      const provider = new FacebookAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Get or create user in database
      const users = await query<AuthUser[]>(
        "SELECT * FROM users WHERE email = ?",
        [user.email]
      );
      
      if (users.length === 0) {
        await query(
          `INSERT INTO users (email, name, avatar, provider, provider_id, role, is_active, email_verified)
           VALUES (?, ?, ?, 'facebook', ?, 'user', true, true)`,
          [user.email, user.displayName, user.photoURL, user.uid]
        );
        
        const newUsers = await query<AuthUser[]>(
          "SELECT * FROM users WHERE email = ?",
          [user.email]
        );
        return newUsers[0];
      }
      
      return users[0];
    } catch (error) {
      console.error("Facebook sign in error:", error);
      throw error;
    }
  }

  // Password Reset
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  }

  // Sign Out
  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }

  // Get Current User
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      
      const users = await query<AuthUser[]>(
        "SELECT * FROM users WHERE email = ?",
        [user.email]
      );
      
      return users[0] || null;
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  }
}