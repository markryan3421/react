import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, ShoppingBag, FileText, Lock, Shield, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { useLayout } from '@/contexts/LayoutContext';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Permissions',
        href: '/permissions',
        icon: Lock,
        permission: 'access-permissions-module',
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: Shield,
        permission: 'access-roles-module',
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
        permission: 'access-users-module',
    },
    {
        title: 'Manage Products',
        href: '/products',
        icon: ShoppingBag,
        permission: 'access-products-module',
    },
    {
        title: 'Manage Categories',
        href: '/categories',
        icon: FileText,
        permission: 'access-categories-module',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {

    // TODO: Refactor to use a custom hook for auth and permissions
    const { auth } = usePage().props as any;
    const roles = auth.roles;
    const permissions = auth.permissions;

    const { position } = useLayout();

    // TODO: Refactor to use a custom hook for auth and permissions
    // This is a simple example of how to filter nav items based on permissions.
    const filterNavItems = mainNavItems.filter((item) => !item.permission || permissions.includes(item.permission));

    // console.log('FilterNavItems', filterNavItems);

    return (
        <Sidebar side={position} collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filterNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
