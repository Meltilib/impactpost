import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const isClerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export async function getUserRole(): Promise<'admin' | 'editor' | null> {
  if (!isClerkConfigured) return null;

  try {
    const { userId } = await auth();
    if (!userId) return null;
    
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata?.role;
    return role === 'admin' || role === 'editor' ? role : null;
  } catch (error) {
    console.warn('[auth] Unable to load Clerk user role:', error);
    return null;
  }
}

export async function requireAdmin() {
  const role = await getUserRole();
  if (role !== 'admin') {
    redirect('/admin?error=unauthorized');
  }
}

export async function requireAdminOrEditor() {
  const role = await getUserRole();
  if (!role || !['admin', 'editor'].includes(role)) {
    redirect('/admin?error=unauthorized');
  }
}
