/// <reference types="./api" />
declare type CurrentUserQuery<T> = SAN.API.Query<'currentUser', null | {
    layouts: T[];
}>;
export declare type CurrentUserLayoutsQuery = CurrentUserQuery<SAN.CurrentUserLayout>;
export declare const USER_LAYOUTS_QUERY: string;
export declare const queryCurrentUserLayouts: () => Promise<SAN.CurrentUserLayout[]>;
export declare const updateCurrentUserLayoutsCache: (updateCache: SAN.API.Updater<CurrentUserLayoutsQuery>) => void;
export declare const subscribeCurrentUserLayoutsCache: (clb: SAN.API.Subscriber<CurrentUserLayoutsQuery>) => SAN.API.Unsubscriber;
export declare const CURRENT_USER_SHORT_LAYOUTS_QUERY = "\n  {\n    currentUser {\n\t\t\tlayouts:chartConfigurations{\n\t\t\t\tid\n\t\t\t\ttitle\n\t\t\t  updatedAt\n\t\t\t}\n    }\n  }\n";
export declare type CurrentUserShortLayoutsQuery = CurrentUserQuery<SAN.SortedShortLayout>;
export declare const queryCurrentUserShortLayouts: () => Promise<SAN.SortedShortLayout[]>;
export declare const updateCurrentUserShortLayoutsCache: (updateCache: SAN.API.Updater<CurrentUserShortLayoutsQuery>) => void;
export declare const subscribeCurrentUserShortLayoutsCache: (clb: SAN.API.Subscriber<CurrentUserShortLayoutsQuery>) => SAN.API.Unsubscriber;
export {};
