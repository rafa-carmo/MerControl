import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { DataTable } from "../../components/Table/data-table";
import { columns } from "./table/columns";
import financialFlows from "@/routes/financial-flows";
import { Button } from "@/components/ui/button";
import revenueRoutes from "@/routes/revenues";


import financialLaunchesRoutes from '@/routes/financial-launches';
import { dashboard } from "@/routes";


const breadcrumbs = (financial_launch_id: number, financial_flow_id: number) => [
    { title: "Dashboard", href: dashboard.url() },
    { title: "Financial Flows", href: financialFlows.index().url },
    { title: "Financial Launches", href: financialLaunchesRoutes.index({ financial_flow: financial_flow_id }).url },
    { title: "Revenues", href: revenueRoutes.index({ financial_flow: financial_flow_id, financial_launch: financial_launch_id }).url },
];

const filters = [
    {
        name: 'description',
        label: '',
        placeholder: 'Filtrar por descrição',
        className: 'w-full',
    },
];


export default function RevenuesIndex({ revenues, financial_launch_id, financial_flow_id }: { revenues?: Paginated<Revenue>, financial_launch_id: number, financial_flow_id: number }) {

    const createHref = revenueRoutes.create({ financial_flow: financial_flow_id, financial_launch: financial_launch_id }).url;

    return (
        <AppLayout breadcrumbs={breadcrumbs(financial_launch_id!, financial_flow_id!)}>

            <Head title={trans("Revenues")} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl px-1 md:p-4">
                <aside className="flex items-center justify-end">
                    <Link href={createHref} className="flex justify-center">
                        <Button className="justify-center">
                            Criar Receita
                        </Button>
                    </Link>
                </aside>
                <h1>{trans("Revenues")}</h1>

                <DataTable columns={columns}
                    data={revenues?.data.map((item) => ({
                        ...item,
                        financial_flow_id: financial_flow_id
                    })) ?? []}
                    paginated={revenues}
                    filters={filters}
                />
            </div>


        </AppLayout>
    );
}
