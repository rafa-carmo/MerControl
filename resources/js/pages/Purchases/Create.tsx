import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";

const breadcrumbs = [
    { title: "Dashboard", href: "/" },
    { title: "Purchases", href: "/purchases" },
    { title: "Add Purchase", href: "/purchases/create" },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={trans("Add Purchase")} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>{trans("Add Purchase")}</h1>
            </div>
        </AppLayout>
    );
}
