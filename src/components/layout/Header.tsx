"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { useAuth } from '@/hooks/use-auth';
import { UserCircle, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo />
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">
            Inicio
          </Link>
          <Link href="/catalogo" className="transition-colors hover:text-primary">
            Catálogo
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isAuthenticated && user?.role === 'admin' ? (
            <Button asChild>
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/login">
                <UserCircle className="mr-2 h-4 w-4" />
                Admin Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
