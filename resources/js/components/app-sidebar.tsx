// ui/app-sidebar.tsx
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react'; // 👈 FIX: Added usePage import
import {
    BookOpen,
    ChevronDown,
    Folder,
    LayoutGrid,
    SquareLibrary,
} from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js'; // 👈 FIX: Added route function import
import AppLogo from './app-logo';

const mainNavItems: (NavItem & {
    subItems?: NavItem[];
    section?: string;
    group?: string;
    can?: string;
})[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        section: 'Main',
        group: 'Admin', // 👈 group name
        can: 'access-instructor-page',
    },
    {
        title: 'Class',
        href: '#', // Using '#' as a placeholder if the item is just a toggle
        icon: SquareLibrary,
        section: 'Main',
        group: 'Admin', // 👈 group name
        can: 'access-instructor-page',
        subItems: [
            { title: 'All Classes', href: route('instructor.classes.index') },
            { title: 'Create Course', href: '' },
        ],
    },
    {
        title: 'Course',
        href: '',
        icon: SquareLibrary,
        section: 'Main',
        can: 'access-instructor-page',
        subItems: [
            { title: 'All Courses', href: '' },
            { title: 'Create Course', href: '' },
        ],
    },

    {
        title: 'Classrooms',
        href: route('student.classes.index'),
        icon: SquareLibrary,
        section: 'Student',
        subItems: [
            { title: 'All Classrooms', href: route('student.classes.index') },
            { title: 'Year 1', href: route('instructor.classes.index', 1) },
            { title: 'Year 2', href: route('instructor.classes.index', 2) },
            { title: 'Year 3', href: route('instructor.classes.index', 3) },
            { title: 'Year 4', href: route('instructor.classes.index', 4) },
        ],
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
    // FIX: Imported usePage above, now use it here.
    const { auth } = usePage().props as {
        auth?: { user: any; can?: Record<string, boolean> };
    };

    // fallback if no can object
    const can = auth?.can ?? {};

    // Filter items based on permissions
    const filteredItems = mainNavItems.filter(
        (item) => !item.can || can[item.can],
    );

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    // Group filtered items by section (FIX: using filteredItems instead of mainNavItems)
    const sections = filteredItems.reduce<Record<string, typeof mainNavItems>>(
        (acc, item) => {
            const section = item.section || 'Other';
            if (!acc[section]) acc[section] = [];
            acc[section].push(item);
            return acc;
        },
        {},
    );

    // Helper function to check if a navigation item is active
    // This is a basic implementation; a more robust solution would check the current URL/route.
    const isActive = (href: string) => {
        // Simple check for demonstration. In a real app, you'd use a more accurate comparison.
        if (href === '#') return false;
        return window.location.href.includes(href);
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
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
                {/* Render navigation groups by section */}
                {Object.entries(sections).map(([sectionTitle, items]) => (
                    <SidebarGroup key={sectionTitle}>
                        <SidebarGroupLabel>{sectionTitle}</SidebarGroupLabel>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {/* Use SidebarMenuButton to contain the Link and Toggle Logic */}
                                    <SidebarMenuButton
                                        asChild
                                        // This onClick handles toggling the submenu for items that have subItems
                                        onClick={() =>
                                            item.subItems &&
                                            toggleMenu(item.title)
                                        }
                                        // A slightly better isActive check for the main menu item
                                        isActive={
                                            isActive(item.href) ||
                                            !!(
                                                item.subItems &&
                                                openMenus[item.title]
                                            )
                                        }
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            {/* The Link component for navigation. 
                                                If it has sub-items, we still link but also enable the toggle.
                                                You might want to change the Link's href to '#' if it only opens a submenu.
                                            */}
                                            <Link
                                                href={item.href}
                                                className="flex items-center gap-2"
                                            >
                                                <item.icon className="size-4" />
                                                {item.title}
                                            </Link>

                                            {/* Chevron Icon for dropdown */}
                                            {item.subItems && (
                                                <ChevronDown
                                                    className={`size-4 transition-transform duration-200 ${
                                                        openMenus[item.title]
                                                            ? 'rotate-180'
                                                            : ''
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    </SidebarMenuButton>

                                    {/* Submenu rendering */}
                                    {item.subItems && openMenus[item.title] && (
                                        <SidebarMenuSub>
                                            {item.subItems.map((sub) => (
                                                <SidebarMenuSubItem
                                                    key={sub.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isActive(
                                                            sub.href,
                                                        )}
                                                    >
                                                        <Link href={sub.href}>
                                                            {sub.title}
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
