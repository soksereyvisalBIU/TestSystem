import AutoBreadcrumb from '@/components/breadcrumb/auto-bread-crumb';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <div className="ms-4 mt-2">
            <AutoBreadcrumb />
        </div>

        {children}
    </AppLayoutTemplate>
);
