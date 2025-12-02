import { dashboard } from "@/routes";
import purchases from "@/routes/purchases";
import places from "@/routes/places";
import { NavItem } from "@/types";
import { Apple, Building, LayoutGrid, ShoppingCart, DollarSign   } from "lucide-react";
import products from "@/routes/products";
import financialFlows from "@/routes/financial-flows";


export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
        {
        title: 'Fluxo de de caixa',
        icon: DollarSign ,
        subitems: [
            {
                title: 'Visualizar Fluxo de caixa',
                href: financialFlows.index().url,
            },
            {
                title: 'Adicionar Fluxo de caixa',
                href: financialFlows.create().url,
            },
        ],
    },
    {
        title: 'Compras',
        icon: ShoppingCart,
        subitems: [
            {
                title: 'Visualizar Compras',
                href: purchases.index().url,
            },
            {
                title: 'Adicionar Compra',
                href: purchases.create().url,
            },
        ],
    },
    {
        title: 'Estabelecimentos',
        icon: Building,
        subitems: [
            {
                title: 'Visualizar Estabelecimentos',
                href: places.index().url,
            },
            {
                title: 'Adicionar Estabelecimento',
                href: places.create().url,
            },
        ],
    },
    {
        title: 'Produtos',
        icon: Apple,
        subitems: [
            {
                title: 'Visualizar Produtos',
                href: products.index().url,
            },
            {
                title: 'Adicionar Produto',
                href: products.create().url,
            },
        ],
    }
];
