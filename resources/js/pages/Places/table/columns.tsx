import { trans } from "@/composables/translate";
import { ColumnDef } from "@tanstack/react-table";

export type Place = {
    id: string;
    cnpj: string | null;
    business_name?: string | null;
    name: string;
    created_at: Date;
}

export const columns: ColumnDef<Place>[] = [
    {
        accessorKey: "id",
        header: () => <p>ID</p>,
    },
    {
        accessorKey: "cnpj",
        header: () => <p className="max-w-10 ">CNPJ</p>,
        cell: ({ row }) => {
            const cnpj = row.getValue("cnpj") as string
            return <div className="text-start text-xs md:text-base">{cnpj ?? "-"}</div>
        },

    },
    {
        accessorKey: "name",
        header: () => <p>{trans("Name")}</p>,
        cell: ({ row }) => {
            const name = row.getValue("name") as string
            const businessName = row.original.business_name
            return <div className="text-start text-xs md:text-base">{businessName ? businessName : name}</div>
        }
    },
    {
        accessorKey: "created_at",
        header: () => <p>{trans("Date")}</p>,
        cell: ({ row }) => {
            const createdAt = row.getValue("created_at") as Date
            return <div className="text-start text-xs md:text-base">{createdAt.toLocaleDateString() ?? "-"}</div>
        }
    },
    {
        accessorKey: "actions",
        header: () => <p className="text-end">Actions</p>,
        cell: () => {
            return (
                <div className="flex w-full justify-end gap-2">
                    <button className="btn-ghost btn-xs btn">
                        <span className="hidden md:inline">Edit</span>

                    </button>
                    <button className="btn-ghost btn-xs btn">
                        <span className="hidden md:inline">Delete</span>
                    </button>
                </div>
            )
        }
    }

]
