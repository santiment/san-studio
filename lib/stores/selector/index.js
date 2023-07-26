import { writable } from 'svelte/store';
import { each, getSelectableType, SelectableModifier } from './utils.js';
export const selectedItems = (() => {
    const setOf = { all: new Set() };
    const store = { has: (item) => setOf.all.has(item) };
    each((selectable) => {
        store[selectable] = [];
        setOf[selectable] = new Set();
    });
    const { subscribe, set } = writable(store);
    return {
        subscribe,
        set(metrics) {
            setOf.metrics = new Set(metrics);
            store.metrics = metrics;
            set(store);
        },
        clear() {
            setOf.all.clear();
            each((selectable) => {
                store[selectable] = [];
                setOf[selectable].clear();
            });
            set(store);
        },
        toggle(item) {
            const selectable = getSelectableType(item);
            const selectableSet = setOf[selectable];
            const modifier = SelectableModifier[selectable];
            const hasItem = selectableSet.has(item);
            if (hasItem) {
                selectableSet.delete(item);
                setOf.all.delete(item);
            }
            else {
                selectableSet.add(item);
                setOf.all.add(item);
            }
            modifier === null || modifier === void 0 ? void 0 : modifier(item, store, setOf, hasItem);
            store[selectable] = Array.from(selectableSet);
            set(store);
        },
    };
})();
//# sourceMappingURL=index.js.map