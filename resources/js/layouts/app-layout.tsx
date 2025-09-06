import { trans } from '@/composables/translate';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from "@/components/ui/sonner"

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs?.map((item) => (
        {
            title: trans(item.title),
            href: item.href
        }
    ))} {...props}>
        {children}
        <Toaster />

    </AppLayoutTemplate>
);
