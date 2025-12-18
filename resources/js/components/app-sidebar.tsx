import { NavUser } from '@/components/nav-user';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
    SidebarRail,
    useSidebar,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ChevronRight,
    ClipboardCheck,
    Cpu,
    LayoutGrid,
    Search,
    Sparkles,
    SquareLibrary,
    Users,
} from 'lucide-react';
import { route } from 'ziggy-js';
import AppLogoIcon from './app-logo-icon';

export function AppSidebar() {
    const { auth } = usePage().props as {
        auth?: { user: any; can?: Record<string, boolean> };
    };
    const { state } = useSidebar();
    const can = auth?.can ?? {};

    // --- NAVIGATION CONFIGURATION ---
    const navGroups = [
        {
            label: 'Platform',
            items: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                    activeMatch: '/dashboard',
                },
                {
                    title: 'Intelligence',
                    href: '#',
                    icon: Sparkles,
                    badge: 'AI', // New Feature Badge
                },
            ],
        },
        {
            label: 'Academic Management',
            items: [
                {
                    title: 'Classrooms',
                    icon: SquareLibrary,
                    isActive: true, // Default open for demo
                    items: [
                        {
                            title: 'All Classes',
                            href: route('student.classes.index'),
                        },
                        {
                            title: 'Freshman (Y1)',
                            href: route('instructor.classes.index', 1),
                        },
                        {
                            title: 'Sophomore (Y2)',
                            href: route('instructor.classes.index', 2),
                        },
                        {
                            title: 'Junior (Y3)',
                            href: route('instructor.classes.index', 3),
                        },
                        {
                            title: 'Senior (Y4)',
                            href: route('instructor.classes.index', 4),
                        },
                    ],
                },
                {
                    title: 'Assessments',
                    icon: ClipboardCheck,
                    items: [
                        { title: 'Active Exams', href: '#' },
                        { title: 'Gradebook', href: '#' },
                    ],
                },
            ],
        },
        {
            label: 'System Admin',
            can: 'access-instructor-page', // Permission Check
            items: [
                { title: 'User Management', icon: Users, href: '#' },
                { title: 'Faculty Settings', icon: Cpu, href: '#' },
            ],
        },
    ];

    // Helper to check active state
    const isRouteActive = (href: string) => {
        if (!href || href === '#') return false;
        try {
            return (
                window.location.pathname ===
                new URL(href, window.location.origin).pathname
            );
        } catch {
            return false;
        }
    };

    return (
        <Sidebar
            collapsible="icon"
            className="border-r border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-[#09090b]"
        >
            {/* --- 1. HEADER: BRAND & SEARCH --- */}
            <SidebarHeader className="bg-white pb-4 dark:bg-[#09090b]">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Link href={dashboard()}>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                                    {/* <AppLogo className="size-5 fill-white" /> */}
                                    {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                                    <AppLogoIcon  />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-black tracking-tight text-slate-900 dark:text-white">
                                        BIU CLOUD
                                    </span>
                                    <span className="truncate text-[10px] font-bold tracking-widest text-blue-500 uppercase">
                                        Faculty of IT
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Command Search Bar - Only visible when expanded */}
                {state === 'expanded' && (
                    <div className="mt-2 px-2">
                        <button className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-blue-500">
                            <div className="flex items-center gap-2">
                                <Search className="h-3.5 w-3.5" />
                                <span>Search curriculum...</span>
                            </div>
                            <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100 select-none dark:border-slate-700 dark:bg-slate-800">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </button>
                    </div>
                )}
            </SidebarHeader>

            {/* --- 2. MAIN CONTENT --- */}
            <SidebarContent className="px-2">
                {navGroups.map((group) => {
                    // Check permissions for the whole group
                    if (group.can && !can[group.can]) return null;

                    return (
                        <SidebarGroup key={group.label} className="py-2">
                            <SidebarGroupLabel className="px-2 text-[10px] font-black tracking-widest text-slate-400/80 uppercase">
                                {group.label}
                            </SidebarGroupLabel>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const isActive = item.href
                                        ? isRouteActive(item.href)
                                        : false;

                                    // RENDER: Simple Link Item
                                    if (item.href && !item.items) {
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    tooltip={item.title}
                                                    isActive={isActive}
                                                    className={`group relative h-9 transition-all duration-200 ${
                                                        isActive
                                                            ? 'bg-blue-50 font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                                            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                                    } `}
                                                >
                                                    <Link href={item.href}>
                                                        <item.icon
                                                            className={
                                                                isActive
                                                                    ? 'text-blue-600 dark:text-blue-400'
                                                                    : 'text-slate-400 group-hover:text-slate-600'
                                                            }
                                                        />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                        {item.badge && (
                                                            <span className="ml-auto rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                        {/* Active Left Border Indicator */}
                                                        {isActive && (
                                                            <div className="absolute top-1.5 bottom-1.5 left-0 w-1 rounded-r-full bg-blue-600" />
                                                        )}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    }

                                    // RENDER: Collapsible Submenu
                                    return (
                                        <Collapsible
                                            key={item.title}
                                            asChild
                                            defaultOpen={
                                                item.isActive ||
                                                item.items?.some((sub) =>
                                                    isRouteActive(sub.href),
                                                )
                                            }
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={item.title}
                                                        className="group-data-[state=open]/collapsible:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    >
                                                        <item.icon className="text-slate-400 group-data-[state=open]/collapsible:text-blue-600" />
                                                        <span className="font-medium group-data-[state=open]/collapsible:font-bold">
                                                            {item.title}
                                                        </span>
                                                        <ChevronRight className="ml-auto text-slate-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.items?.map(
                                                            (subItem) => (
                                                                <SidebarMenuSubItem
                                                                    key={
                                                                        subItem.title
                                                                    }
                                                                >
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={isRouteActive(
                                                                            subItem.href,
                                                                        )}
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                subItem.href
                                                                            }
                                                                        >
                                                                            <span
                                                                                className={
                                                                                    isRouteActive(
                                                                                        subItem.href,
                                                                                    )
                                                                                        ? 'font-bold text-blue-600'
                                                                                        : ''
                                                                                }
                                                                            >
                                                                                {
                                                                                    subItem.title
                                                                                }
                                                                            </span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            ),
                                                        )}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroup>
                    );
                })}
            </SidebarContent>

            {/* --- 3. FOOTER: SYSTEM STATUS & USER --- */}
            <SidebarFooter className="border-t border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-[#09090b]">
                {state === 'expanded' && (
                    <div className="mb-2 rounded-md border border-blue-100 bg-blue-50/50 p-2 dark:border-blue-500/20 dark:bg-blue-900/10">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                            <Activity className="size-3 animate-pulse" />
                            <span className="tracking-wider uppercase">
                                System Operational
                            </span>
                        </div>
                        <div className="mt-1 text-[9px] text-slate-500 dark:text-slate-400">
                            Maintained by{' '}
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                Faculty of IT & Science
                            </span>
                        </div>
                    </div>
                )}
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
