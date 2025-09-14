import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import { trans } from "@/composables/translate";
import places from "@/routes/places";
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, PencilLine } from "lucide-react";

export type Place = {
    id: number;
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
        header: () => <p>{trans("Created at")}</p>,
        cell: ({ row }) => {
            const createdAt = row.getValue("created_at") as Date
            return <div className="text-start text-xs md:text-base">{createdAt.toLocaleDateString() ?? "-"}</div>
        }
    },
    {
        accessorKey: "actions",
        header: () => <p className="text-center">Actions</p>,
        cell: ({ row }) => {
            return (
                <div className="flex w-full justify-center gap-2">
                    <Button variant="ghost" type="button" className="p-0 m-0">
                        <Link href={places.show(row.original.id).url}>
                            <span className="hidden md:inline">
                                <Eye className="size-4" />
                            </span>
                        </Link>
                    </Button>
                    <Button variant="ghost" type="button" className="p-0 m-0">
                        <Link href={places.edit(row.original.id).url}>
                            <span className="hidden md:inline">
                                <PencilLine className="size-4" />
                            </span>
                        </Link>
                    </Button>
                    <DeleteDialog
                        url={places.destroy(row.original.id).url}
                        text={trans("Are you sure you want to delete this place?")}
                        successMessage={trans("Place deleted successfully.")}
                    />
                </div>
            )
        }
    }

]
