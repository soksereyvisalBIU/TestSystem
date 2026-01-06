import { NavUser } from '@/components/nav-user';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
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
import { Link, usePage, router } from '@inertiajs/react';
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
import React, { useEffect, useState, useMemo } from 'react';
import { route } from 'ziggy-js';
import AppLogoIcon from './app-logo-icon';

export function AppSidebar() {
    const { auth } = usePage().props as {
        auth?: { user: any; can?: Record<string, boolean> };
    };
    const { state } = useSidebar();
    const [open, setOpen] = useState(false);
    const can = auth?.can ?? {};

    const navGroups = useMemo(() => [
        {
            label: 'Platform',
            items: [
                { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
                { title: 'Intelligence', href: '#', icon: Sparkles, badge: 'AI' },
            ],
        },
        {
            label: 'System Admin',
            can: 'access-instructor-page',
            items: [
                { title: 'User Management', icon: Users, href: '#' },
                { title: 'Faculty Settings', icon: Cpu, href: '#' },
                {
                    title: 'Classrooms',
                    icon: SquareLibrary,
                    items: [{ title: 'Classes', href: route('instructor.classes.index') }],
                },
            ],
        },
        {
            label: 'Academic Management',
            items: [
                {
                    title: 'Classrooms',
                    icon: SquareLibrary,
                    isActive: true,
                    items: [
                        { title: 'All Classes', href: route('student.classes.index') },
                        { title: 'Year I', href: route('student.classes.index', { year: 1 }) },
                        { title: 'Year II', href: route('student.classes.index', { year: 2 }) },
                        { title: 'Year III', href: route('student.classes.index', { year: 3 }) },
                        { title: 'Year IV', href: route('student.classes.index', { year: 4 }) },
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
    ], [can]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const searchableItems = useMemo(() => {
        return navGroups.flatMap((group) => {
            if (group.can && !can[group.can]) return [];
            return group.items.flatMap((item) => {
                if (item.items) {
                    return item.items.map((sub) => ({
                        ...sub,
                        icon: item.icon || Search,
                        parent: item.title,
                    }));
                }
                return [item];
            });
        }).filter(item => item.href && item.href !== '#');
    }, [navGroups, can]);

    const isRouteActive = (href: string) => {
        if (!href || href === '#') return false;
        try {
            return window.location.pathname === new URL(href, window.location.origin).pathname;
        } catch { return false; }
    };

    return (
        <>
            <Sidebar collapsible="icon" className="border-sidebar-border bg-sidebar">
                <SidebarHeader className="bg-sidebar pb-4">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={dashboard()}>
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                                        <AppLogoIcon />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-black tracking-tight text-title">BIU SYSTEM</span>
                                        <span className="truncate text-[10px] font-bold tracking-widest text-primary uppercase">Faculty of IT</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>

                    {state === 'expanded' && (
                        <div className="mt-2 px-2">
                            <button 
                                onClick={() => setOpen(true)}
                                className="group flex w-full items-center justify-between rounded-lg border border-sidebar-border bg-background px-3 py-2 text-xs text-description shadow-sm transition-all hover:border-primary hover:text-primary"
                            >
                                <div className="flex items-center gap-2">
                                    <Search className="h-3.5 w-3.5 transition-colors group-hover:text-primary" />
                                    <span>Search curriculum...</span>
                                </div>
                                <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border border-sidebar-border bg-sidebar-accent px-1.5 font-mono text-[10px] font-medium text-description">
                                    <span>⌘</span>K
                                </kbd>
                            </button>
                        </div>
                    )}
                </SidebarHeader>

                <SidebarContent className="px-2">
                    {navGroups.map((group) => {
                        if (group.can && !can[group.can]) return null;
                        return (
                            <SidebarGroup key={group.label} className="py-2">
                                <SidebarGroupLabel className="px-2 text-[10px] font-black tracking-widest text-description uppercase">
                                    {group.label}
                                </SidebarGroupLabel>
                                <SidebarMenu>
                                    {group.items.map((item) => {
                                        const isActive = item.href ? isRouteActive(item.href) : false;
                                        if (item.href && !item.items) {
                                            return (
                                                <SidebarMenuItem key={item.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        tooltip={item.title}
                                                        isActive={isActive}
                                                        className={`group relative h-9 transition-all duration-200 ${
                                                            isActive ? 'bg-sidebar-accent font-bold text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                                                        }`}
                                                    >
                                                        <Link href={item.href}>
                                                            <item.icon className={isActive ? 'text-primary' : 'text-sidebar-foreground/40 group-hover:text-sidebar-foreground'} />
                                                            <span>{item.title}</span>
                                                            {item.badge && (
                                                                <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                            {isActive && <div className="absolute top-1.5 bottom-1.5 left-0 w-1 rounded-r-full bg-primary" />}
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        }
                                        return (
                                            <Collapsible key={item.title} asChild defaultOpen={item.isActive || item.items?.some(sub => isRouteActive(sub.href))} className="group/collapsible">
                                                <SidebarMenuItem>
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuButton tooltip={item.title} className="group-data-[state=open]/collapsible:text-primary text-sidebar-foreground/70 hover:bg-sidebar-accent/50">
                                                            <item.icon className="text-sidebar-foreground/40 group-data-[state=open]/collapsible:text-primary" />
                                                            <span className="font-medium group-data-[state=open]/collapsible:font-bold">{item.title}</span>
                                                            <ChevronRight className="ml-auto text-sidebar-foreground/30 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        </SidebarMenuButton>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {item.items?.map((subItem) => (
                                                                <SidebarMenuSubItem key={subItem.title}>
                                                                    <SidebarMenuSubButton asChild isActive={isRouteActive(subItem.href)}>
                                                                        <Link href={subItem.href}>
                                                                            <span className={isRouteActive(subItem.href) ? 'font-bold text-primary' : 'text-sidebar-foreground/60'}>{subItem.title}</span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            ))}
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

                <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-2">
                    {state === 'expanded' && (
                        <div className="mb-2 rounded-md border border-primary/20 bg-primary/5 p-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-primary">
                                <Activity className="size-3 animate-pulse" />
                                <span className="tracking-wider uppercase">System Operational</span>
                            </div>
                            <div className="mt-1 text-[9px] text-description">Maintained by <span className="font-bold text-subtitle">Faculty of IT & Science</span></div>
                        </div>
                    )}
                    <NavUser />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search curriculum..." className="border-none focus:ring-0" />
                <CommandList className="max-h-[300px] overflow-y-auto bg-popover">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Navigation">
                        {searchableItems.map((item) => (
                            <CommandItem
                                key={item.href}
                                onSelect={() => { setOpen(false); router.visit(item.href); }}
                                className="flex items-center gap-3 px-4 py-3 cursor-pointer aria-selected:bg-sidebar-accent aria-selected:text-sidebar-accent-foreground"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card">
                                    <item.icon className="h-4 w-4 text-description" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-title">{item.title}</span>
                                    {item.parent && <span className="text-[10px] text-description uppercase">in {item.parent}</span>}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}