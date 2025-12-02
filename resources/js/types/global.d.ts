import type { PageProps as InertiaPageProps } from "@inertiajs/core"
import type { PageProps as AppPageProps } from "./"


declare module "@inertiajs/core" {
	interface PageProps extends InertiaPageProps, AppPageProps {
        name?: string;
        translations: Record<string, string>;
    }
}

type DefaultModelAttributes = {
    id: number;
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
    type FinancialFlow = App.Models.FinancialFlow & DefaultModelAttributes;
    type FinancialLaunch = App.Models.FinancialLaunch & DefaultModelAttributes;
    type ExpenseType = App.Models.ExpenseType & DefaultModelAttributes;
    type RevenueType = App.Models.RevenueType & DefaultModelAttributes;
    type PaymentMethod = App.Models.PaymentMethod & DefaultModelAttributes;
    type Expense = App.Models.Expense & DefaultModelAttributes;
    type Revenue = App.Models.Revenue & DefaultModelAttributes;


    type Paginated<T> = {
        data: T[];
        current_page: number;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: { url: string | null; label: string; active: boolean }[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    }
}
