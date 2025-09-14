"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Trash } from "lucide-react"
import { trans } from '../../../composables/translate';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: () => <div className="text-start text-xs md:text-base">{trans("Name")}</div>,
        cell: ({ row }) => {
            const name = row.getValue("name") as string
            return <div className="text-start text-xs md:text-base">{name}</div>
        }
    },
    {
        accessorKey: "unity_type",
        header: () => <div className="text-center text-xs md:text-base">{trans("Unity Type")}</div>,
        cell: ({ row }) => {
            const unityType = row.original.unity_type?.name ?? ''
            return <div className="text-center text-xs md:text-base">{trans(unityType)}</div>
        }
    }

]
