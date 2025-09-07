import type { PageProps as InertiaPageProps } from "@inertiajs/core"
import type { PageProps as AppPageProps } from "./"


declare module "@inertiajs/core" {
	interface PageProps extends InertiaPageProps, AppPageProps {
        name?: string;
        translations: Record<string, string>;
    }
}
declare global {
    type Place = App.Models.Place & { id: string };
    type Tag = App.Models.Tag & { id: string };
    type UnityType = App.Models.UnityType & { id: string };
    type Item = App.Models.Item & { id: string };
    type Purchase = App.Models.Purchase & { id: string };
    type PurchaseItem = App.Models.PurchaseItem & { id: string };
    type Product = App.Models.Product & { id: string };
    type PurchaseProduct = App.Models.PurchaseProduct & { id: string };
}
