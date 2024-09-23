export declare function formatDate(date: string): string;
export declare function closeBanners(): void;
export declare function saveBannerCloseDate(): void;
export declare function checkShouldShowBanner(): boolean;
export type TrackUpgrageProps = {
    e: MouseEvent;
    restrictedMetrics: any[];
    isLoggedIn: boolean;
    location: string;
};
export declare function trackUpgrade({ e, restrictedMetrics, isLoggedIn, location }: TrackUpgrageProps): any;
export type RestrictionInfo = {
    metric: string;
    date: string;
};
