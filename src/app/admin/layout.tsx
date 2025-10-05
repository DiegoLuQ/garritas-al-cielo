"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { LogOut, Settings, ShoppingBag, LayoutDashboard, Loader2, MousePointerClick } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = React.useState(true);

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.replace('/login');
      } else {
        setIsVerifying(false);
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || isVerifying) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/productos', label: 'Productos', icon: ShoppingBag },
    { href: '/admin/seguimiento', label: 'Seguimiento', icon: MousePointerClick },
    { href: '/admin/configuracion-sitio', label: 'Configuración', icon: Settings },
  ];

  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Link href="/">
              <Logo />
            </Link>
          </SidebarHeader>
          <SidebarMenu className="flex-grow">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarFooter className="border-t -mx-2">
            <div className="flex items-center gap-2 p-2">
                <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/8.x/identicon/svg?seed=${user?.username}`} />
                    <AvatarFallback>{user?.username?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user?.username}</span>
                    <span className="text-xs text-muted-foreground">{user?.role}</span>
                </div>
            </div>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={logout} tooltip="Cerrar Sesión">
                        <LogOut />
                        <span>Cerrar Sesión</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
