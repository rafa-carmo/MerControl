import EcommerceMetrics from '@/components/ecommerce/EcommerceMetrics';
import MonthlySalesChart from '@/components/ecommerce/MonthlySalesChart';
import MonthlyTarget from '@/components/ecommerce/MonthlyTarget';
import StatisticsChart from '@/components/ecommerce/StatisticsChart';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    }
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="grid grid-cols-12 gap-4 md:gap-6 px-10 py-6">
                <div className="col-span-12 space-y-6 xl:col-span-7">
                    <EcommerceMetrics />

                    <MonthlySalesChart />
                </div>

                <div className="col-span-12 xl:col-span-5">
                    <MonthlyTarget />
                </div>

                <div className="col-span-12">
                    <StatisticsChart />
                </div>

            </div>

        </AppLayout>
    );
}
