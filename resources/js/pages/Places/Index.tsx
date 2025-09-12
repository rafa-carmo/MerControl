import { DataTable } from "@/components/Table/data-table";
import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import places from "@/routes/places";
import { Head } from "@inertiajs/react";
import { columns } from './table/columns';

const breadcrumbs = [
    { title: "Dashboard", href: dashboard().url },
    { title: "Places", href: places.index().url },
];

export default function Index({ places }: { places?: Place[] }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={trans("Places")} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl px-1 md:p-4">
                <h1>{trans("Places")}</h1>

                <DataTable columns={columns} data={
                    places ? places.map((place) => ({
                        id: place.id,
                        name: place.name,
                        business_name: place.business_name,
                        cnpj: place.cnpj,
                        created_at: new Date(place.created_at),
                    })) : []
                }
                />
            </div>
        </AppLayout>
    );
}
