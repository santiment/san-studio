import { setContext, getContext } from 'svelte';
import { get, writable } from 'svelte/store';
import { CachePolicy } from 'san-webkit/lib/api/cache';
import { getTodaysEnd } from 'san-webkit/lib/utils/dates';
import { studio } from './studio';
export const CONTEXT = 'AUTO_UPDATER';
export const setAutoUpdater = (store) => setContext(CONTEXT, store);
export const getAutoUpdater = () => getContext(CONTEXT);
export function newAutoUpdaterStore(Widgets) {
    const state = { isUpdating: false, lastUpdate: Date.now() };
    const { subscribe, set } = writable(state);
    let autoTimer;
    const store = {
        subscribe,
        check({ to }) {
            if (to === getTodaysEnd().toISOString())
                return store.update(true);
            window.clearTimeout(autoTimer);
            state.isUpdating = false;
            state.lastUpdate = Date.now();
            set(state);
        },
        enable(changePeriod) {
            changePeriod(get(studio).from, getTodaysEnd());
            store.update();
        },
        update(refetch = true) {
            window.clearTimeout(autoTimer);
            if (refetch) {
                const widgets = Array.isArray(Widgets) ? Widgets : get(Widgets);
                widgets.forEach((widget) => {
                    var _a;
                    if (widget.isHidden) {
                        widget.defferedCachePolicy = CachePolicy.NewCache;
                        return;
                    }
                    (_a = widget.fetchData) === null || _a === void 0 ? void 0 : _a.call(widget, CachePolicy.NewCache);
                });
            }
            state.isUpdating = true;
            state.lastUpdate = Date.now();
            // NOTE: Auto updating every 5 mins [@vanguard | Jun  1, 2021]
            autoTimer = window.setTimeout(store.update, 300 * 1000);
            set(state);
        },
    };
    setAutoUpdater(store);
    return store;
}
//# sourceMappingURL=autoUpdater.js.map