"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Trash } from "lucide-react"
import { trans } from '../../../composables/translate';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    amount: number
    quantity: number
    place: string
    purchaseData: Date
}

export const columns: ColumnDef<Payment>[] = [

    {
        accessorKey: "id",
        header: () => <div className="text-start hidden md:block">ID</div>,
        cell: ({ row }) => {
            const id = row.getValue("id") as string
            return <div className="text-start hidden md:block">{id}</div>
        }
    },
    {
        accessorKey: "place",
        header: () => <div className="text-start text-xs md:text-base">{trans("Place")}</div>,
        cell: ({ row }) => {
            const place = row.getValue("place") as string
            return <div className="text-start text-xs md:text-base">{place}</div>
        }
    },
    {
        accessorKey: "quantity",
        header: () => <div className="text-center text-xs md:text-base">{trans("Quantity")}</div>,
        cell: ({ row }) => {
            const quantity = row.getValue("quantity") as number
            return <div className="text-center text-xs md:text-base">{quantity}</div>
        }
    },
    {
        accessorKey: "purchaseData",
        header: () => <div className="text-start hidden md:block">{trans("Purchase Date")}</div>,
        cell: ({ row }) => {
            const purchaseData = row.getValue("purchaseData") as Date
            return <div className="text-start hidden md:block">{purchaseData.toLocaleDateString("pt-BR")}</div>
        }
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-start text-xs md:text-base">{trans("Amount")}</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(amount)
            return <div className="text-start text-xs md:text-base">{formatted}</div>
        },
    },
    {
        accessorKey: "action",
        header: () => <div className="text-center text-xs md:text-base">{trans("Actions")}</div>,
        cell: ({ row }) => {
            const id = row.getValue("id")
            return (
                <div className="flex items-center justify-center gap-2">
                    <button className="btn" onClick={() => alert(`Edit ${id}`)}><Eye className="size-4 md:size-6" /></button>
                    <button className="btn" onClick={() => alert(`Delete ${id}`)}><Trash className="size-4 md:size-6" /></button>
                </div>
            )
        },
    },
]
