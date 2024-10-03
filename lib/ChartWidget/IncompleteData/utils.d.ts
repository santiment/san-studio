export declare function formatDate(date: string): string;
export declare function closeBanners(): void;
export declare function saveBannerCloseDate(): void;
export declare function checkShouldShowBanner(): boolean;
export declare type TrackUpgrageProps = {
    e: MouseEvent;
    restrictedMetrics: any[];
    isLoggedIn: boolean;
    location: string;
};
export declare function trackUpgrade({ e, restrictedMetrics, isLoggedIn, location }: TrackUpgrageProps): any;
export declare type RestrictionInfo = {
    metric: string;
    date: string;
};
