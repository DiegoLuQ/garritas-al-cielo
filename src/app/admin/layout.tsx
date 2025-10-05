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

  React.useEffect(() => {
    // No hacer nada mientras se está cargando el estado de autenticación
    if (isLoading) {
      return;
    }

    // Cuando la carga ha terminado, verificar si el usuario no está autenticado o no es admin
    if (!isAuthenticated || user?.role !== 'admin') {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Mostrar un loader mientras se verifica el estado de autenticación
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si después de cargar, el usuario está autenticado y es admin, mostrar el contenido
  if (isAuthenticated && user?.role === 'admin') {
    return <>{children}</>;
  }
  
  // Si no, no mostrar nada mientras se redirige (o mostrar el loader de nuevo)
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
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
            <Logo />
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
