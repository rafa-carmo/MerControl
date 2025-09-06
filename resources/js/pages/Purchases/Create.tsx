import Heading from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"
import InputCurrency from "@/components/currency-input";
import { ComboboxDemo } from "@/components/global/FindOrCreate";


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

export default function Create() {
    const [items, setItems] = useState<PurchaseItem[]>([]);
    const [data, setData] = useState({
        place: "",
        date: new Date(),
        tag: "",
        items: items,
    });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={trans("Add Purchase")} />
            <div className="px-4 py-6">
                <Heading title={trans("Add Purchase")} description={trans("Create a new purchase record")} />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <form>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between gap-5">
                                <div className="grid gap-2 flex-1">
                                    <label htmlFor="place" className="font-medium">Place</label>
                                    <Select
                                        name="place"
                                        required
                                        defaultValue=""
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a place" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="store1">Store 1</SelectItem>
                                            <SelectItem value="store2">Store 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="date" className="font-medium">Date</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                data-empty={!data.date}
                                                className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                                            >
                                                <CalendarIcon />
                                                {data.date ? format(data.date, "PPP") : <span>Pick a date</span>}
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
                                    placeholder="Select a tag"
                                    items={[{ value: "tag1", label: "Tag 1" }, { value: "tag2", label: "Tag 2" }]}
                                    value={data.tag}
                                    setValue={(value) => setData(prev => ({ ...prev, tag: value }))}
                                    handleCreate={(value) => alert(`Create tag: ${value}`)} />

                            </div>
                            <div className="grid gap-2">
                                <label className="font-medium">Items</label>
                                <div className="space-y-2">
                                    {items.length === 0 ? <p className="py-4 border border-primary/25 rounded-lg text-center">No items added</p> : items.map((item) => (
                                        <div key={item.id} className="flex gap-2">
                                            <Input
                                                type="text"
                                                name={`items[${item.id}].name`}
                                                placeholder="Item name"
                                                className="block flex-1 border rounded px-3 py-2"
                                                required
                                            />
                                            <InputCurrency
                                                id="input-example"
                                                name="input-name"
                                                placeholder="Please enter a number"
                                                defaultValue={0}
                                                decimalsLimit={2}
                                                className="w-fit"
                                                value={item.price.toString()}
                                                onValueChange={(_, __, values) =>
                                                    setItems(prev => prev.map(i => i.id === item.id ? { ...i, price: values?.value || '0' } : i))
                                                }
                                            />

                                            <Select
                                                name="items[0].unity"
                                                required
                                                defaultValue=""
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select unity" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                                    <SelectItem value="g">Gram (g)</SelectItem>
                                                    <SelectItem value="l">Liter (l)</SelectItem>
                                                    <SelectItem value="ml">Milliliter (ml)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {/* Button to remove item (for dynamic list) */}
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => {
                                                    setItems(prev => prev.slice(0, 0).concat(prev.slice(1)));
                                                }}
                                                className="ml-2"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                    {/* Button to add new item (for dynamic list) */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setItems(prev => [
                                                ...prev,
                                                { id: Date.now().toString(), name: "", price: '0', unity: "" }
                                            ]);
                                        }}
                                        className="mt-2"
                                    >
                                        Add Item
                                    </Button>
                                </div>
                            </div>



                            <div className="flex items-center justify-center md:justify-end gap-4">
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded w-full md:w-fit md:min-w-24">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
