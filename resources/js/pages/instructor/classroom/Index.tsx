import ClassCard from '@/components/instructor/card/class-card';
import ClassModal from '@/components/instructor/modal/class-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Class', href: '/' }];

export default function SubjectIndex() {


    const [openModal, setOpenModal] = useState();
 


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between border-b pb-3">
                    <h2 className="text-2xl font-bold">Classes</h2>
                    <Button onClick={()=>setOpenModal(true)}>+ Create Class</Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    <ClassCard />
                </div>
            </div>

            <ClassModal isOpen={openModal} setIsOpen={setOpenModal} />
            
        </AppLayout>
    );
}
