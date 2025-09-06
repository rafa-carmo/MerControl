import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { PurchaseDataTable } from "./table/data-table";
import { columns } from "./table/columns";
import purchasesMock from './table/mock';

const breadcrumbs = [
    { title: "Dashboard", href: "/" },
    { title: "Purchases", href: "/purchases" },
];

export default function PurchasesIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={trans("Purchases")} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl px-1 md:p-4">
                <h1>{trans("Purchases")}</h1>

                <PurchaseDataTable columns={columns} data={purchasesMock} />
            </div>


        </AppLayout>
    );
}
