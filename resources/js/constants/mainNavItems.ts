import { dashboard } from "@/routes";
import purchases from "@/routes/purchases";
import places from "@/routes/places";

import { NavItem } from "@/types";
import { Apple, Building, LayoutGrid, ShoppingCart } from "lucide-react";
import products from "@/routes/products";


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
    },
    {
        title: 'Places',
        icon: Building,
        subitems: [
            {
                title: 'View Places',
                href: places.index().url,
            },
            {
                title: 'Add Place',
                href: places.create().url,
            },
        ],
    },
    {
        title: 'Products',
        icon: Apple,
        subitems: [
            {
                title: 'View Products',
                href: products.index().url,
            },
            {
                title: 'Add Product',
                href: products.create().url,
            },
        ],
    }
];
