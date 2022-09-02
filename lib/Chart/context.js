import { setContext, getContext } from 'svelte';
const noop = () => { }; // eslint-disable-line
export const CONTEXT = 'chartManager';
export const setChart = (chart) => setContext(CONTEXT, chart);
export const getChart = () => getContext(CONTEXT);
export function newPlotManager() {
    const subscribers = new Set();
    const call = (subscriber) => subscriber();
    return {
        items: new Map(),
        delete(id) {
            this.items.set(id, noop);
        },
        get(id) {
            return this.items.get(id);
        },
        set(id, clb) {
            this.items.set(id, clb);
        },
        subscribe(subscriber) {
            subscribers.add(subscriber);
            return () => subscribers.delete(subscriber);
        },
        emitDrawFinish() {
            subscribers.forEach(call);
        },
    };
}
//# sourceMappingURL=context.js.map