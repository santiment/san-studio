import { writable } from 'svelte/store';
import { track } from 'san-webkit/lib/analytics';
import { queryFavoriteMetrics, mutateFavoriteMetrics } from './../api/metrics/favorites.js';
import { Event } from './../analytics.js';
let favoritesSet = new Set();
const { update, subscribe, set } = writable(favoritesSet);
if (process.browser)
    queryFavoriteMetrics().then((value) => set((favoritesSet = new Set(value))));
export const favoriteMetrics = {
    subscribe,
    update,
    toggle(metricKey) {
        const saved = new Set(favoritesSet);
        if (favoritesSet.has(metricKey)) {
            favoritesSet.delete(metricKey);
            track.event(Event.UnfavoriteMetric, { metric: metricKey });
        }
        else {
            favoritesSet.add(metricKey);
            track.event(Event.FavoriteMetric, { metric: metricKey });
        }
        set(favoritesSet);
        mutateFavoriteMetrics(Array.from(favoritesSet)).catch(() => {
            favoritesSet = saved;
            set(saved);
        });
    },
};
//# sourceMappingURL=favoriteMetrics.js.map