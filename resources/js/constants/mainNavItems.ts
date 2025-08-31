import { dashboard } from "@/routes";
import purchases from "@/routes/purchases";
import { NavItem } from "@/types";
import { LayoutGrid, ShoppingCart } from "lucide-react";

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Purchases',
        icon: ShoppingCart,
        subitems: [
            {
                title: 'View Purchases',
                href: purchases.index().url,
            },
            {
                title: 'Add Purchase',
                href: purchases.create().url,
            },
        ],
    }
];
