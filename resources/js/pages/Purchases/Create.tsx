import Heading from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"
import InputCurrency from "@/components/currency-input";
import { ComboboxDemo } from "@/components/global/FindOrCreate";
import tags from "@/routes/tags";
import { fetchWithCsrf } from "@/utils/fetch";

import { toast } from "sonner";
import purchases from "@/routes/purchases";


const breadcrumbs = [
    { title: "Dashboard", href: "/" },
    { title: "Purchases", href: "/purchases" },
    { title: "Add Purchase", href: "/purchases/create" },
];

type PurchaseItem = {
    id: string
    name: string;
    price: string;
    unity: string;
};

function handleCreateTag(value: string): Promise<{ data: Tag }> {
    return fetchWithCsrf().post(tags.create.fetch().url, { name: value })
}

export default function Create({ tags, places, unityTypes }: { tags: Tag[], places: Place[], unityTypes: UnityType[] }) {
    const { data, setData, post, errors } = useForm({
        place: "",
        date: new Date(),
        tag: "",
        items: [] as PurchaseItem[],
    })
    const [tagsState, setTagsState] = useState<Tag[]>(tags);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(purchases.store.url(), {
            onError: () => {
                toast.error(trans("An error occurred while creating the purchase."));
            },
            onSuccess: () => {
                toast.success(trans("Purchase created successfully."));
            }
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={trans("Add Purchase")} />
            <div className="px-4 py-6">
                <Heading title={trans("Add Purchase")} description={trans("Create a new purchase record")} />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between gap-5">
                                <div className="grid gap-2 flex-1">
                                    <label htmlFor="place" className="font-medium">{trans("Place")}</label>
                                    <Select
                                        name="place"
                                        required
                                        defaultValue={data.place}
                                        value={data.place}
                                        onValueChange={(value) => setData(prev => ({ ...prev, place: value }))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={trans("Select a place")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {places.map((place) => (
                                                <SelectItem key={place.id} value={place.id.toString()}>{place.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="date" className="font-medium">{trans("Date")}</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                data-empty={!data.date}
                                                className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                                            >
                                                <CalendarIcon />
                                                {data.date ? format(data.date, "PPP") : <span>{trans("Pick a date")}</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[320px] p-0">
                                            <Calendar
                                                className="w-full"
                                                mode="single"
                                                selected={data.date}
                                                onSelect={date => setData(prev => ({ ...prev, date: date || new Date() }))}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                captionLayout="dropdown"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="font-medium">Tag</label>
                                <ComboboxDemo
                                    placeholder={trans("Select a tag")}
                                    items={[...tagsState.map(tag => ({ value: tag.id.toString(), label: tag.name }))]}
                                    label={data.tag}
                                    value={data.tag}
                                    setValue={(value) => setData(prev => ({ ...prev, tag: value }))}
                                    handleCreate={(value) => {
                                        handleCreateTag(value).then(response => {
                                            setTagsState(prev => [...prev, response.data])
                                            setData(prev => ({ ...prev, tag: `${response.data.id}` }))
                                            toast.success(trans("Tag created successfully"))
                                        }).catch((e) => {
                                            toast.error(e.response.data.message)
                                        })
                                    }} />
                            </div>
                            <div className="grid gap-2">
                                <label className="font-medium">{trans("Items")}</label>
                                <div className="space-y-2">
                                    {data.items.length === 0 ? <p className="py-4 border border-primary/25 rounded-lg text-center">{trans("No items added")}</p> : data.items.map((item) => (
                                        <div key={item.id} className="flex gap-2">
                                            <Input
                                                type="text"
                                                name={`items[${item.id}].name`}
                                                placeholder={trans("Item name")}
                                                className="block flex-1 border rounded px-3 py-2"
                                                onChange={(e) => setData("items", data.items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))}
                                                required
                                            />
                                            <InputCurrency
                                                id="input-example"
                                                name="input-name"
                                                placeholder={trans("Item price")}
                                                defaultValue={0}
                                                decimalsLimit={2}
                                                className="w-fit"
                                                value={item.price.toString()}
                                                onValueChange={(_, __, values) =>
                                                    setData("items", data.items.map(i => i.id === item.id ? { ...i, price: values?.value || '0' } : i))
                                                }
                                            />
                                            <Input
                                                type="number"
                                                step={0.01}
                                                name={`items[${item.id}].quantity`}
                                                placeholder={trans("Quantity")}
                                                className="block w-full max-w-24 md:max-w-1/4 border rounded px-3 py-2"
                                                onChange={(e) => setData("items", data.items.map(i => i.id === item.id ? { ...i, quantity: e.target.value } : i))}
                                                required
                                            />
                                            <Select
                                                name={`items[${item.id}].unity`}
                                                required
                                                defaultValue=""
                                                value={item.unity}
                                                onValueChange={(value) => setData("items", data.items.map(i => i.id === item.id ? { ...i, unity: value } : i))}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder={trans("Select unity")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {unityTypes.map((unity) => (
                                                        <SelectItem key={unity.id} value={unity.abbreviation}>{`${trans(unity.name)} (${unity.abbreviation})`}</SelectItem>
                                                    ))}

                                                </SelectContent>
                                            </Select>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => {
                                                    setData("items", data.items.filter(i => i.id !== item.id));
                                                }}
                                                className="ml-2"
                                            >
                                                {trans("Remove")}
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setData("items", [
                                                ...data.items,
                                                { id: Date.now().toString(), name: "", price: '0', unity: "" }
                                            ]);
                                        }}
                                        className="mt-2"
                                    >
                                        {trans("Add Item")}
                                    </Button>
                                </div>
                            </div>



                            <div className="flex items-center justify-center md:justify-end gap-4">
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded w-full md:w-fit md:min-w-24">{trans("Save")}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
