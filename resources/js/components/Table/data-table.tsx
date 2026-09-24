"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { trans } from "@/composables/translate"
import { Form, usePage } from '@inertiajs/react';
import { FormComponentSlotProps } from '@inertiajs/core';
import { useId, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { cn } from '@/lib/utils';
import { SearchIcon, X } from 'lucide-react';
import { RxCross1 } from "react-icons/rx"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    toolbar?: React.ReactNode
    paginated?: Paginated<TData>
    advancedFilters?: React.ReactNode;
}

type FilterProps = {
    name: string;
    label: string;
    placeholder?: string;
    className?: string;
    type?: 'text' | 'number' | 'select' | 'date';
    options?: { label: string; value: string }[];
};

export function DataTable<TData, TValue>({
    columns,
    data,
    toolbar,
    paginated,
    filters,
    advancedFilters,
}: DataTableProps<TData, TValue>& { filters?: FilterProps[] }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    const form = useRef<FormComponentSlotProps>(null);
    return (
        <div className="flex flex-col gap-4 h-full">
             {filters && (
                <>
                    <Form
                        method="get"
                        action="#"
                        className="flex w-full flex-col"
                        ref={form}
                    >
                        <h3 className="pb-2 font-bold">Filtros</h3>
                        <div
                            className={cn(
                                'gap-3 px-2 pb-1',
                                filters.length === 1
                                    ? 'flex'
                                    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2',
                            )}
                        >
                            {filters.map((filter) => (
                                <div
                                    key={filter.name}
                                    className={cn(
                                        filters.length === 1 && 'w-full',
                                        filter.className,
                                    )}
                                >
                                    <Filter
                                        name={filter.name}
                                        placeholder={
                                            filter.placeholder ||
                                            `Search ${filter.name.toLowerCase()}`
                                        }
                                        type={filter.type || 'text'}
                                        label={filter.label}
                                        options={filter.options}
                                    />
                                </div>
                            ))}
                        </div>
                    </Form>
                    <div className="mb-4 flex items-center justify-end gap-2  pb-6">
                        {advancedFilters}
                        <Button
                            type="button"
                            onClick={() => form.current?.submit()}
                        > Pesquisar
                            <SearchIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </>
            )}
            {toolbar && toolbar}
            <div className="overflow-hidden rounded-md border px-0 md:pl-4 pb-5 flex-1">
                <Table className="">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {trans("No results.")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {paginated && (
                <DataTablePagination {...paginated} />
            )}
        </div>
    )
}

function Filter({
    name,
    placeholder,
    type,
    label,
    options,
}: {
    name: string;
    placeholder?: string;
    type: string;
    label?: string;
    options?: { label: string; value: string }[];
}) {
    const value = usePage().props.filters?.[name] ?? '';
    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClearFilter = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.form?.requestSubmit();
        }
    };

    if (type === 'select') {
        if (!options) return null;

        const initialSelected =
            value && value !== '' ? (value as string) : 'todos';

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [selected, setSelected] = useState<string>(initialSelected);

        const submitSelectForm = () => {
            document
                .getElementById(`${id}-select`)
                ?.closest('form')
                ?.requestSubmit();
        };

        const handleClearSelect = () => {
            setSelected('todos');
            requestAnimationFrame(submitSelectForm);
        };

        return (
            <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-select`}>{label}</Label>
                <div className="relative">
                    <input type="hidden" name={name} value={selected} />
                    <Select
                        value={selected}
                        onValueChange={(v: string) => {
                            setSelected(v);
                            requestAnimationFrame(submitSelectForm);
                        }}
                    >
                        <SelectTrigger
                            id={`${id}-select`}
                            className="w-full pr-10"
                        >
                            <SelectValue
                                placeholder={
                                    placeholder ??
                                    `Selecione ${label?.toLowerCase()}`
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            {options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selected && selected !== 'todos' && (
                        <button
                            type="button"
                            onClick={handleClearSelect}
                            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="*:not-first:mt-2">
            <Label htmlFor={`${id}-input`}>{label}</Label>
            <div className="relative">
                <Input
                    ref={inputRef}
                    id={`${id}-input`}
                    className={cn({
                        'peer w-full pr-10 pl-2': true,
                    })}
                    defaultValue={value as string}
                    placeholder={placeholder ?? `Search ${name.toLowerCase()}`}
                    type={type}
                    name={name}
                />
                {value && (
                    <button
                        type="button"
                        onClick={handleClearFilter}
                        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                    >
                         <RxCross1 size="20" />
                    </button>
                )}
            </div>
        </div>
    );
}
