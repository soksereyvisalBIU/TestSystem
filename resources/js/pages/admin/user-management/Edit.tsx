import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    from: number;
    to: number;
    total: number;
    links: PaginationLink[];
}

export default function Edit({ user }: { user: User }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <AppLayout>
            <Head title="Edit User" />

            <form onSubmit={submit} className="max-w-md space-y-4">
                <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                <Input value={data.email} onChange={e => setData('email', e.target.value)} />

                <Button disabled={processing}>Save</Button>
            </form>
        </AppLayout>
    );
}
