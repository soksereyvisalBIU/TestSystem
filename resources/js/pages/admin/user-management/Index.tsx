import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronUp,
    Edit,
    Filter,
    Loader2,
    MoreHorizontal,
    Search,
    ShieldCheck,
    Trash2,
    User,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

// UI Components (shadcn/ui)
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ResponsivePagination } from '@/components/ui/responsive-pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
// import {
//     Sheet,
//     SheetContent,
//     SheetFooter,
//     SheetHeader,
//     SheetTitle,
// } from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';

export default function Index({ users, filters }: any) {
    const auth = usePage().props.auth;

    
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    // const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: '1',
    });

    // High-Performance Filtering & Sorting
    const updateFilters = (newFilters: object) => {
        router.get(
            route('admin.user-management.index'),
            { ...filters, ...newFilters },
            { preserveState: true, replace: true, only: ['users'] },
        );
    };

    const toggleSort = (column: string) => {
        const direction =
            filters.sort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';
        updateFilters({ sort: column, direction });
    };

    const roles = {
        1: { label: 'Student', color: 'bg-blue-100 text-blue-700' },
        2: { label: 'Instructor', color: 'bg-purple-100 text-purple-700' },
        3: { label: 'Admin', color: 'bg-rose-100 text-rose-700' },
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const action = editingUser ? put : post;
        const url = editingUser
            ? route('admin.user-management.update', editingUser.id)
            : route('admin.user-management.store');

        action(url, {
            onSuccess: () => {
                // setIsSheetOpen(false);
                setIsModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Users" />
            <div className="max-w-8xl mx-auto min-w-4xl space-y-6 p-6">
                {/* Header Section */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Users
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your team and their permissions.
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingUser(null);
                            reset();
                            setIsModalOpen(true);
                            // setIsSheetOpen(true);
                        }}
                        className="shadow-lg"
                    >
                        <UserPlus className="mr-2 h-4 w-4" /> New User
                    </Button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-sm">
                    <div className="relative min-w-[300px] flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search name or email..."
                            className="pl-10"
                            defaultValue={filters.search}
                            onChange={(e) =>
                                updateFilters({ search: e.target.value })
                            }
                        />
                    </div>
                    <Select
                        value={filters.role ?? 'all'}
                        onValueChange={(v) => updateFilters({ role: v })}
                    >
                        <SelectTrigger className="w-[160px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="1">Students</SelectItem>
                            <SelectItem value="2">Instructors</SelectItem>
                            <SelectItem value="3">Admins</SelectItem>
                        </SelectContent>
                    </Select>
                    {selectedIds.length > 0 && (
                        <Button
                            variant="destructive"
                            onClick={() => setIsDeleteOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete (
                            {selectedIds.length})
                        </Button>
                    )}
                </div>

                {/* Main Table */}
                <div className="overflow-hidden rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                    <Table>
                        <TableHeader className="bg-card/50">
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={
                                            selectedIds.length ===
                                            users.data.length
                                        }
                                        onCheckedChange={(checked) =>
                                            setSelectedIds(
                                                checked
                                                    ? users.data.map(
                                                          (u: any) => u.id,
                                                      )
                                                    : [],
                                            )
                                        }
                                    />
                                </TableHead>
                                <TableHead
                                    onClick={() => toggleSort('name')}
                                    className="group cursor-pointer"
                                >
                                    User{' '}
                                    {filters.sort === 'name' ? (
                                        filters.direction === 'asc' ? (
                                            <ChevronUp className="inline h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="inline h-4 w-4" />
                                        )
                                    ) : (
                                        <ChevronDown className="inline h-4 w-4 opacity-0 group-hover:opacity-100" />
                                    )}
                                </TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user: any) => (
                                <TableRow
                                    key={user.id}
                                    className="transition-colors hover:bg-slate-50/80"
                                >
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(
                                                user.id,
                                            )}
                                            onCheckedChange={(checked) =>
                                                setSelectedIds((prev) =>
                                                    checked
                                                        ? [...prev, user.id]
                                                        : prev.filter(
                                                              (id) =>
                                                                  id !==
                                                                  user.id,
                                                          ),
                                                )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 ring-2 ring-slate-100">
                                                <AvatarImage
                                                    src={user.avatar}
                                                />
                                                <AvatarFallback className="bg-slate-200">
                                                    {user.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid">
                                                <span className="leading-none font-semibold text-slate-900">
                                                    {user.name}
                                                </span>
                                                <span className="text-sm text-slate-500">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${roles[user.role as keyof typeof roles].color}`}
                                        >
                                            {
                                                roles[
                                                    user.role as keyof typeof roles
                                                ].label
                                            }
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
<DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-muted"
        >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-[160px]">
        {/* Profile Link - Prefetched for instant navigation */}
        <DropdownMenuItem asChild>
            <Link
                href={route('admin.user-management.show', user.id)}
                prefetch
                className="flex w-full items-center cursor-pointer"
            >
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>View Profile</span>
            </Link>
        </DropdownMenuItem>

        {/* Edit Action */}
        <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
                setEditingUser(user);
                setData({
                    name: user.name,
                    email: user.email,
                    role: String(user.role),
                    password: '',
                });
                setIsModalOpen(true);
            }}
        >
            <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Edit Details</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Delete Action - Only visible if not self */}
        {user.id !== auth.user.id ? (
            <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 cursor-pointer"
                onClick={() => {
                    setSelectedIds([user.id]);
                    setIsDeleteOpen(true);
                }}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete User</span>
            </DropdownMenuItem>
        ) : (
            <DropdownMenuItem disabled className="opacity-50">
                <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Current Session</span>
            </DropdownMenuItem>
        )}
    </DropdownMenuContent>
</DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <ResponsivePagination
                        links={users.links}
                        meta={{
                            current_page: users.current_page,
                            last_page: users.last_page,
                        }}
                    />
                </div>
            </div>

            {/* Slide-over UI for Add/Edit */}
            {/* <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-md p-4 sm:p-6">
                    <SheetHeader>
                        <SheetTitle>
                            {editingUser ? 'Update Profile' : 'Create Account'}
                        </SheetTitle>
                    </SheetHeader>
                    <form onSubmit={handleSave} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Full Name</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    error={errors.name}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    error={errors.email}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Role</Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(v) => setData('role', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            Student
                                        </SelectItem>
                                        <SelectItem value="2">
                                            Instructor
                                        </SelectItem>
                                        <SelectItem value="3">
                                            Administrator
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>
                                    Password{' '}
                                    {editingUser &&
                                        '(Leave blank to keep current)'}
                                </Label>
                                <Input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    error={errors.password}
                                />
                            </div>
                        </div>
                        <SheetFooter>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                {processing ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                )}{' '}
                                {editingUser ? 'Save Changes' : 'Create User'}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet> */}

            {/* Modal: Create/Edit */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <p className="text-xs text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label>Role</Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(v) => setData('role', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            Student
                                        </SelectItem>
                                        <SelectItem value="2">
                                            Instructor
                                        </SelectItem>
                                        <SelectItem value="3">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {!editingUser && (
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                    />
                                    {errors.password && (
                                        <p className="text-xs text-destructive">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto"
                            >
                                {processing && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {editingUser ? 'Save Changes' : 'Create User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Global Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to delete {selectedIds.length}{' '}
                            user(s). This action cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedIds([])}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                router.post(
                                    route('admin.user-management.bulk-destroy'),
                                    { ids: selectedIds },
                                    {
                                        onSuccess: () => {
                                            setIsDeleteOpen(false);
                                            setSelectedIds([]);
                                        },
                                    },
                                )
                            }
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Confirm Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
