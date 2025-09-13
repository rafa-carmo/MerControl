import type { PageProps as InertiaPageProps } from "@inertiajs/core"
import type { PageProps as AppPageProps } from "./"


declare module "@inertiajs/core" {
	interface PageProps extends InertiaPageProps, AppPageProps {
        name?: string;
        translations: Record<string, string>;
    }
}

type DefaultModelAttributes = {
    id: string;
    created_at: string;
    updated_at: string;
}
declare global {
    type Place = App.Models.Place & DefaultModelAttributes;
    type Tag = App.Models.Tag & DefaultModelAttributes;
    type UnityType = App.Models.UnityType & DefaultModelAttributes;
    type Item = App.Models.Item & DefaultModelAttributes;
    type Purchase = App.Models.Purchase & DefaultModelAttributes;
    type PurchaseItem = App.Models.PurchaseItem & DefaultModelAttributes;
    type Product = App.Models.Product & DefaultModelAttributes;
    type PurchaseProduct = App.Models.PurchaseProduct & DefaultModelAttributes;
    type PendingScraping = App.Models.PendingScraping & DefaultModelAttributes;
}
