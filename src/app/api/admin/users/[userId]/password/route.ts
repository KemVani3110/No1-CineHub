import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import pool from '@/lib/db';
import { hash, compare } from 'bcryptjs';

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newPassword, adminPassword } = await request.json();

    // Verify admin password
    const [adminRows] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [session.user.id]
    );
    const admin = (adminRows as any[])[0];

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const isPasswordValid = await compare(adminPassword, admin.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 401 }
      );
    }

    // Update user password
    const hashedPassword = await hash(newPassword, 12);
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, parseInt(params.userId)]
    );

    const [userRows] = await pool.execute(
      'SELECT id, name, email FROM users WHERE id = ?',
      [parseInt(params.userId)]
    );
    const updatedUser = (userRows as any[])[0];

    // Log the activity
    await pool.execute(
      `INSERT INTO admin_activity_logs 
        (admin_id, action, target_user_id, description, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        session.user.id,
        'CHANGE_PASSWORD',
        parseInt(params.userId),
        `Changed password for user ${updatedUser.name} (${updatedUser.email})`,
        request.headers.get('x-forwarded-for') || 'unknown',
        request.headers.get('user-agent') || 'unknown',
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 