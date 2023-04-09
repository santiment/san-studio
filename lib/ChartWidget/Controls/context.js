import { writable } from 'svelte/store';
import { logScale, linearScale } from '@santiment-network/chart/scales';
import { track } from 'san-webkit/lib/analytics';
import { getSavedBoolean, saveBoolean } from 'san-webkit/lib/utils/localStorage';
import { Event } from './../../analytics';
const SaveOption = {
    cartesianGrid: (value) => saveBoolean('isCartesianGridActive', value),
    watermark: (value) => saveBoolean('isWatermarkVisible', value),
    isWatermarkLessVisible: (value) => saveBoolean('isWatermarkLighter', value),
};
const OPTIONS = {
    scale: linearScale,
    isLogScale: false,
    cartesianGrid: process.browser ? getSavedBoolean('isCartesianGridActive', true) : false,
    watermark: true,
    isWatermarkLessVisible: false,
};
export function newChartOptionsStore({ isCartesianGrid, isWatermarkHidden } = OPTIONS) {
    const options = Object.assign({}, OPTIONS);
    if (isCartesianGrid !== undefined)
        options.cartesianGrid = isCartesianGrid;
    if (isWatermarkHidden !== undefined)
        options.watermark = !isWatermarkHidden;
    const { subscribe, set } = writable(options);
    const store = {
        subscribe,
        set,
        toggleScale() {
            const isLogScale = options.scale === logScale;
            options.scale = isLogScale ? linearScale : logScale;
            options.isLogScale = !isLogScale;
            set(options);
            track.event(Event.Scale, { type: isLogScale ? 'linear' : 'log' });
        },
        toggle(option) {
            var _a;
            const value = !options[option];
            options[option] = value;
            set(options);
            (_a = SaveOption[option]) === null || _a === void 0 ? void 0 : _a.call(SaveOption, value);
        },
        getProDefaults(isPro, isProPlus) {
            if (isProPlus)
                options.watermark = getSavedBoolean('isWatermarkVisible', true);
            if (isPro || isProPlus) {
                options.isWatermarkLessVisible = getSavedBoolean('isWatermarkLighter', false);
                set(options);
            }
        },
    };
    return store;
}
//# sourceMappingURL=context.js.map