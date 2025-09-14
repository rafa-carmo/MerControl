import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { DataTable } from "../../components/Table/data-table";
import { columns } from "./table/columns";
import products from "@/routes/products";

const breadcrumbs = [
    { title: "Dashboard", href: "/" },
    { title: "Products", href: products.index().url },
];


export default function ProductsIndex({ products }: { products?: Paginated<Product> }) {
    console.log(products);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={trans("Products")} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl px-1 md:p-4">
                <h1>{trans("Products")}</h1>

                <DataTable columns={columns}
                    data={products?.data ?? []}
                    paginated={products}
                />
            </div>


        </AppLayout>
    );
}
