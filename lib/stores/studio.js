import { setContext, getContext } from 'svelte';
import { writable } from 'svelte/store';
import { ONE_DAY_IN_MS, getTodaysEnd } from 'san-webkit/lib/utils/dates';
import { minifyAddress } from './../metrics/utils';
const TO = getTodaysEnd();
const FROM = new Date(TO);
FROM.setMonth(FROM.getMonth() - 6);
export const STUDIO = {
    slug: 'bitcoin',
    ticker: 'BTC',
    from: FROM.toISOString(),
    to: TO.toISOString(),
    interval: getPeriodInterval(FROM, TO),
};
const { subscribe, set } = writable(STUDIO);
export function getPeriodInterval(from, to) {
    const diff = (+to - +from) / ONE_DAY_IN_MS;
    if (diff < 7)
        return '5m';
    if (diff < 14)
        return '15m';
    if (diff < 20)
        return '30m';
    if (diff < 33)
        return '1h';
    if (diff < 63)
        return '2h';
    if (diff < 100)
        return '3h';
    if (diff < 185)
        return '4h';
    if (diff < 360)
        return '8h';
    if (diff < 800)
        return '12h';
    if (diff < 1400)
        return '1d';
    return '7d';
}
const get = () => STUDIO;
export const studio = {
    subscribe,
    get,
    setProject(project) {
        delete STUDIO.logoUrl;
        if (project === null || project === void 0 ? void 0 : project.address) {
            project.ticker = minifyAddress(project.address);
        }
        else {
            delete STUDIO.address;
        }
        Object.assign(STUDIO, project);
        set(STUDIO);
    },
    setPeriod(from, to) {
        STUDIO.from = from.toISOString();
        STUDIO.to = to.toISOString();
        STUDIO.interval = getPeriodInterval(from, to);
        set(STUDIO);
    },
};
export const LOCKED_ASSET_CONTEXT = 'LOCKED_ASSET_CONTEXT';
export const setLockedAssetStore = (store) => setContext(LOCKED_ASSET_CONTEXT, store);
export const getLockedAssetStore = () => getContext(LOCKED_ASSET_CONTEXT);
export function newLockedAssetStore() {
    const store = writable(STUDIO);
    setLockedAssetStore(store);
}
//# sourceMappingURL=studio.js.map