declare namespace App.Models {
    export type Place = {
        name: string;
        slug: string;
        cnpj: string | null;
        business_name: string | null;
        created_at: string;
        updated_at: string;
        incrementing: boolean;
        preventsLazyLoading: boolean;
        exists: boolean;
        wasRecentlyCreated: boolean;
        timestamps: boolean;
        usesUniqueIds: boolean;
    };
    export type Product = {
        barcode: string;
        name: string;
        slug: string;
        purchases: App.Models.PurchaseProduct;
        incrementing: boolean;
        preventsLazyLoading: boolean;
        exists: boolean;
        wasRecentlyCreated: boolean;
        timestamps: boolean;
        usesUniqueIds: boolean;
    };
    export type Purchase = {
        date: string;
        products: Array<App.Models.PurchaseProduct>;
        place: App.Models.Place;
        tags: App.Models.Tag;
        total_tax: number;
        total_discount: number;
        incrementing: boolean;
        preventsLazyLoading: boolean;
        exists: boolean;
        wasRecentlyCreated: boolean;
        timestamps: boolean;
        usesUniqueIds: boolean;
    };
    export type PurchaseProduct = {
        quantity: number;
        unity_price: string;
        total_price: string;
        purchase: App.Models.Purchase;
        product: App.Models.Product;
        incrementing: boolean;
        preventsLazyLoading: boolean;
        exists: boolean;
        wasRecentlyCreated: boolean;
        timestamps: boolean;
        usesUniqueIds: boolean;
    };
    export type Tag = {
        name: string;
        slug: string;
        created_at: string;
        updated_at: string;
        incrementing: boolean;
        preventsLazyLoading: boolean;
        exists: boolean;
        wasRecentlyCreated: boolean;
        timestamps: boolean;
        usesUniqueIds: boolean;
    };
    export type UnityType = {
        name: string;
        abbreviation: string;
        type: string;
        created_at: string;
        updated_at: string;
        incrementing: boolean;
        preventsLazyLoading: boolean;
        exists: boolean;
        wasRecentlyCreated: boolean;
        timestamps: boolean;
        usesUniqueIds: boolean;
    };
}
