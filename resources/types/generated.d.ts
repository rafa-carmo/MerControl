declare namespace App.Models {
    export type Place = {
        id: string;
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
    export type Tag = {
        id: string;
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
        id: string;
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
