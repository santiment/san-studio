import { writable } from 'svelte/store';
const GLOBALS = {
    isPro: false,
    isProPlus: false,
    isTrial: false,
    isNightMode: false,
    isLoggedIn: false,
    isBeta: false,
    isPresenterMode: false,
};
const { subscribe, set } = writable(GLOBALS);
export const globals = {
    subscribe,
    set,
    toggle(name, value) {
        GLOBALS[name] = value === undefined ? !GLOBALS[name] : value;
        set(GLOBALS);
    },
};
//# sourceMappingURL=globals.js.map