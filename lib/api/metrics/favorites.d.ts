export declare const FAVORITE_METRICS_QUERY = "\n  {\n    currentUser {\n      settings {\n        favoriteMetrics\n      }\n    }\n  }\n";
export declare type FavoriteMetrics = string[];
export declare const queryFavoriteMetrics: () => Promise<FavoriteMetrics>;
export declare const mutateFavoriteMetrics: (metrics: string[]) => Promise<any>;
