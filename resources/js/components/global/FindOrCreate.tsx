
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { trans } from "@/composables/translate"


export function ComboboxDemo({ placeholder, handleCreate, items, value, setValue, label }:
    {
        placeholder: string,
        handleCreate?: (value: string) => void,
        items: { value: string, label: string }[],
        value: string,
        setValue: (value: string) => void,
        label?: string
    }) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? items.find((item) => item.label === label || item.value === value || item.value === label)?.label
                        : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={placeholder} className="h-9" asChild>
                        <input value={value} onChange={(e) => {
                            setValue(e.target.value)
                        }} />
                    </CommandInput>
                    <CommandList>
                        <CommandEmpty>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => {
                                    handleCreate?.(value)
                                    setOpen(false)
                                    setValue("")
                                }}
                            >
                                {trans("Create")} "{value}"
                            </Button>
                        </CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {item.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === item.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
