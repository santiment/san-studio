import { getDateFormats, ONE_DAY_IN_MS } from 'san-webkit/lib/utils/dates';
import { getSavedValue, saveValue } from 'san-webkit/lib/utils/localStorage';
import { track } from 'san-webkit/lib/analytics';
import { showPaymentDialog } from 'san-webkit/lib/ui/PaymentDialog/index.svelte';
import { Event } from './../../analytics.js';
export function formatDate(date) {
    const { DD, MMM, YY } = getDateFormats(new Date(date));
    return `${DD} ${MMM}, ${YY}`;
}
export function closeBanners() {
    const banners = document.querySelectorAll('.limit-banner');
    for (let i = 0; i < banners.length; i++)
        banners[i].remove();
    saveBannerCloseDate();
}
const INCOMPLETE_DATA_BANNER_CLOSE_DATE = 'INCOMPLETE_DATA_BANNER_CLOSE_DATE';
export function saveBannerCloseDate() {
    const nextDay = Date.now() + ONE_DAY_IN_MS;
    saveValue(INCOMPLETE_DATA_BANNER_CLOSE_DATE, nextDay.toString());
}
export function checkShouldShowBanner() {
    const value = getSavedValue(INCOMPLETE_DATA_BANNER_CLOSE_DATE);
    return !value || +value < Date.now();
}
export function trackUpgrade({ e, restrictedMetrics, isLoggedIn, location }) {
    var _a;
    track.event(Event.IncompleteDataUpgrade, {
        location,
        metrics: Array.from(new Set(restrictedMetrics.map(({ key, queryKey = key }) => queryKey))),
    });
    closeBanners();
    if (isLoggedIn) {
        e.preventDefault();
        return showPaymentDialog({
            source: 'charts_incomplete_data_upgrade',
        });
    }
    (_a = window.__onLinkClick) === null || _a === void 0 ? void 0 : _a.call(window, e);
}
//# sourceMappingURL=utils.js.map