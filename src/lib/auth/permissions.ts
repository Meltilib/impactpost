import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function getUserRole(): Promise<'admin' | 'editor' | null> {
  const { userId } = await auth();
  if (!userId) return null;
  
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.publicMetadata.role as 'admin' | 'editor') || null;
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
