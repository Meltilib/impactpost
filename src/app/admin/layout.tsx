'use client';

import { ClerkProvider, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, Users, FolderOpen, AlertTriangle, Megaphone } from 'lucide-react';

const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

type UserRole = 'admin' | 'editor';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/new', label: 'New Article', icon: Plus },
  { href: '/admin/authors', label: 'Authors', icon: Users },
  { href: '/admin/advertisements', label: 'Advertisements', icon: Megaphone, roles: ['admin'] as UserRole[] },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen, roles: ['admin'] as UserRole[] },
  { href: '/admin/settings', label: 'Settings', icon: AlertTriangle },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as UserRole | undefined) ?? 'editor';
  const filteredNavItems = navItems.filter((item) => !item.roles || item.roles.includes(role));
  const roleLabel = role === 'admin' ? 'Admin Console' : 'Editor Workspace';

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="font-heavy text-xl">
            IMPACT POST
          </Link>
          <p className="text-sm text-white/60 mt-1">{roleLabel}</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                        ? 'bg-brand-purple text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <UserButton
              afterSignOutUrl="/admin/sign-in"
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs capitalize text-white/70">
                  {role}
                </span>
                <span className="text-[10px] uppercase tracking-widest border border-white/30 px-2 py-0.5 rounded-full text-white/80">
                  {role === 'admin' ? 'Full Access' : 'Editor'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area - this will be filled by children */}
    </div>
  );
}

function AdminContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function ClerkNotConfigured() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light p-8">
      <div className="max-w-md text-center bg-white border-2 border-black shadow-hard p-8">
        <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
        <h1 className="font-heavy text-2xl mb-4">Admin Setup Required</h1>
        <p className="text-gray-600 mb-6">
          To use the admin dashboard, you need to configure Clerk authentication.
        </p>
        <div className="text-left bg-gray-100 p-4 rounded text-sm font-mono mb-6">
          <p className="font-bold mb-2">Add to .env.local:</p>
          <p>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...</p>
          <p>CLERK_SECRET_KEY=sk_...</p>
        </div>
        <a
          href="https://clerk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-brand-purple text-white px-6 py-2 font-bold hover:bg-brand-purple/90"
        >
          Get Clerk Keys →
        </a>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isClerkConfigured) {
    return <ClerkNotConfigured />;
  }

  return (
    <ClerkProvider>
      <AdminContent>{children}</AdminContent>
    </ClerkProvider>
  );
}
