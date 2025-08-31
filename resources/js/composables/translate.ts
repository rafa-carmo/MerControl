import { usePage } from "@inertiajs/react";


export function useTrans( value: string )
{
    const array = usePage().props.translations;

    return array[ value ] != null ? array[ value ] : value;
}
