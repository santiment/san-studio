import { getDateFormats } from 'san-webkit/lib/utils/dates';
import { track } from 'san-webkit/lib/analytics';
import { showPaymentDialog } from 'san-webkit/lib/ui/PaymentDialog/index.svelte';
import { Event } from './../../analytics.js';
export function formatDate(date) {
    const { DD, MMM, YY } = getDateFormats(new Date(date));
    return `${DD} ${MMM}, ${YY}`;
}
export function trackUpgrade({ e, restrictedMetrics, isLoggedIn, location }) {
    var _a;
    track.event(Event.IncompleteDataUpgrade, {
        location,
        metrics: Array.from(new Set(restrictedMetrics.map(({ key, queryKey = key }) => queryKey))),
    });
    if (isLoggedIn) {
        e.preventDefault();
        const node = e.currentTarget;
        return showPaymentDialog({
            source: 'charts_incomplete_data_upgrade',
            triggeredBy: node,
        });
    }
    (_a = window.__onLinkClick) === null || _a === void 0 ? void 0 : _a.call(window, e);
}
//# sourceMappingURL=utils.js.map