"use client"

import { ColumnDef } from "@tanstack/react-table"
import { trans } from '../../../composables/translate';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import financialLaunches from '@/routes/financial-launches';
import { getDate } from "@/utils/date";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<FinancialFlow>[] = [
    {
        accessorKey: "year",
        header: () => <div className="text-start text-xs md:text-base">{trans("Year")}</div>,
        cell: ({ row }) => {
            const year = row.getValue("year") ? getDate(row.getValue("year")) : "-";
     return (
                <div className="flex justify-start">{year}</div>
            )
        }
    },

     {
        accessorKey: "financialLaunches",
         header: () => <div className="text-center text-xs md:text-base">{trans("Financial Lanches")}</div>,
        size: 200,
        cell: ({ row }) => {
            return (
                <div className="flex justify-center">

                    <Button  className="justify-center">
           <Link href={`${financialLaunches.index().url}?financial_flow_id=${encodeURIComponent(String(row.original.id))}`} className="flex justify-center">
  Acessar lançamentos
</Link>
                    </Button>
                </div>
            )
        }
    },

]
