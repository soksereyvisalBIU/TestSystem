import AutoBreadcrumb from '@/components/breadcrumb/auto-bread-crumb';
import FlashMessage from '@/components/notifications/FlashMessage';
// import GlobalAlert from '@/components/notifications/GlobalAlert';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster as HotToast } from 'react-hot-toast';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <div className="ms-4 mt-2">
            <AutoBreadcrumb />
        </div>
        <HotToast position="bottom-right" reverseOrder={false} />
        {/* <GlobalAlert /> */}

        <FlashMessage />

        {children}
    </AppLayoutTemplate>
);
