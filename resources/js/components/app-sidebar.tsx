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
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    ChevronDown,
    Folder,
    LayoutGrid,
    SquareLibrary,
} from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import AppLogo from './app-logo';

const mainNavItems: (NavItem & { subItems?: NavItem[]; section?: string })[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        section: 'Main',
    },
    {
        title: 'Class',
        href: '#',
        icon: SquareLibrary,
        section: 'Main',
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
        subItems: [
            { title: 'All Courses', href: '' },
            { title: 'Create Course', href: '' },
        ],
    },
    // {
    //     title: 'Student Course',
    //     href: route('student.courses.index'),
    //     icon: SquareLibrary,
    //     section: 'Main',
    //     subItems: [
    //         { title: 'All Student Courses', href: route('student.courses.index') },
    //         { title: 'Enrolled Students', href: route('student.courses.index') },
    //     ],
    // },
    // {
    //     title: 'Student Course',
    //     href: route('student.courses.index'),
    //     icon: SquareLibrary,
    //     section: 'Test',
    //     subItems: [
    //         { title: 'All Student Courses', href: route('student.courses.index') },
    //         { title: 'Enrolled Students', href: route('student.courses.index') },
    //     ],
    // },
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
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    // Group items by section
    const sections = mainNavItems.reduce<Record<string, typeof mainNavItems>>(
        (acc, item) => {
            const section = item.section || 'Other';
            if (!acc[section]) acc[section] = [];
            acc[section].push(item);
            return acc;
        },
        {},
    );

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
                {Object.entries(sections).map(([sectionTitle, items]) => (
                    <SidebarGroup key={sectionTitle}>
                        <SidebarGroupLabel>{sectionTitle}</SidebarGroupLabel>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        onClick={() =>
                                            item.subItems &&
                                            toggleMenu(item.title)
                                        }
                                        isActive={false}
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <Link
                                                href={item.href}
                                                className="flex items-center gap-2"
                                            >
                                                <item.icon className="size-4" />
                                                {item.title}
                                            </Link>
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

                                    {item.subItems && openMenus[item.title] && (
                                        <SidebarMenuSub>
                                            {item.subItems.map((sub) => (
                                                <SidebarMenuSubItem
                                                    key={sub.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
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
