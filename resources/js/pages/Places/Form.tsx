import Heading from "@/components/heading";

import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";

import { toast } from "sonner";
import places from "@/routes/places";
import { cnpjMask } from "@/utils/masks";
import { Input } from "@/components/ui/inputWithLabel";
import { Button } from "@/components/ui/button";


const breadcrumbs = [
    { title: "Dashboard", href: "/" },
    { title: "Places", href: places.index().url },
];

export default function Create({ place, disabled }: { place?: Place, disabled?: boolean }) {

    const { data, setData, post, put } = useForm({
        id: place?.id || undefined,
        cnpj: place?.cnpj || "",
        name: place?.name || "",
        business_name: place?.business_name || "",
    })


    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (disabled) return;
        if (place) {
            put(places.update(place.id).url, {
                onError: () => {
                    toast.error(trans("An error occurred while updating the place."));
                },
                onSuccess: () => {
                    toast.success(trans("Place updated successfully."));
                }
            });
            return;
        }
        post(places.store.url(), {
            onError: () => {
                toast.error(trans("An error occurred while creating the place."));
            },
            onSuccess: () => {
                toast.success(trans("Place created successfully."));
            }
        })
    }

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, {
            title: place ? (disabled ? trans("View Place") : trans("Edit Place")) : trans("Add Place"),
            href: place ? (disabled ? places.show(place.id).url : places.edit(place.id).url) : places.create().url
        }]}>
            <Head title={trans("Add Purchase")} />
            <div className="px-4 py-6">
                <Heading title={trans("Add Purchase")} description={trans("Create a new purchase record")} />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <Input
                                type="text"
                                name="CNPJ"
                                label="CNPJ"
                                value={data.cnpj}
                                placeholder={trans("CNPJ")}
                                className="block flex-1 border rounded px-3 py-2"
                                onChange={(e) => setData("cnpj", cnpjMask(e.target.value))}
                                disabled={disabled}
                            />


                            <Input
                                type="text"
                                label={trans("Name")}
                                name="place_name"
                                value={data.name}
                                placeholder={trans("Place Name")}
                                className="block flex-1 border rounded px-3 py-2"
                                onChange={(e) => setData("name", e.target.value)}
                                disabled={disabled}
                                required
                            />
                            <Input
                                type="text"
                                label={trans("Business Name")}
                                name="business_name"
                                value={data.business_name || ""}
                                placeholder={trans("Business Name")}
                                className="block flex-1 border rounded px-3 py-2"
                                onChange={(e) => setData("business_name", e.target.value)}
                                disabled={disabled}
                            />
                            {!disabled && (
                                <div className="flex items-center justify-center md:justify-end gap-4">
                                    <Button type="submit">{trans("Save")}</Button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
