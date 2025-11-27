// resources/js/pages/Teacher/Classes/Index.tsx
// import ClassModal from '@/components/Modal/ClassModal/ClassModal';
// import MorphCard from '@/components/class/MorphCard';
// import PrefetchLink from '@/components/class/PrefetchLink';
// import { usePrefetchClass } from '@/components/class/usePrefetchClass';
import { Button } from '@/components/ui/button';
// import { useClasses } from '@/hooks/classes/useClasses';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Class', href: '/' }];

export default function Dashboard() {
    // const { data: classes, isLoading } = useClasses();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    // const prefetch = usePrefetchClass();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between border-b pb-3">
                    <h2 className="text-2xl font-bold">Classes</h2>
                    <Button
                        onClick={() => {
                            setEditing(null);
                            setOpen(true);
                        }}
                    >
                        + Create Class
                    </Button>
                </div>

                {/* {isLoading && <p>Loading...</p>} */}

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">

                </div>
            </div>

        </AppLayout>
    );
}
