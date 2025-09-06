import type { PageProps as InertiaPageProps } from "@inertiajs/core"
import type { PageProps as AppPageProps } from "./"


declare module "@inertiajs/core" {
	interface PageProps extends InertiaPageProps, AppPageProps {
        name?: string;
        translations: Record<string, string>;
    }
}
declare global {
    type Place = App.Models.Place;
    type Tag = App.Models.Tag;
    type UnityType = App.Models.UnityType;
}
