import { usePage } from "@inertiajs/react";

export function trans( value: string )
{
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const array = usePage().props.translations;
    return array[ value ] != null ? array[ value ] : value;
}
