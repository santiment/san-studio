import { setContext, getContext } from 'svelte';
import { writable } from 'svelte/store';
export const CONTEXT = 'QUEUE';
export const getQueueStore = () => getContext(CONTEXT);
export function newSizedQueue(size = 2) {
    const processings = new Set();
    let queue = new Set();
    const { subscribe, set } = writable(queue);
    const store = {
        subscribe,
        add(widget) {
            if (processings.size < size) {
                processings.add(widget);
            }
            else {
                queue.add(widget);
            }
            set(queue);
        },
        delete(widget) {
            processings.delete(widget);
            queue.delete(widget);
            if (processings.size < size) {
                const newQueue = Array.from(queue);
                if (newQueue.length) {
                    processings.add(newQueue[0]);
                    queue = new Set(newQueue.slice(1));
                }
            }
            set(queue);
        },
    };
    setContext(CONTEXT, store);
    return store;
}
//# sourceMappingURL=queue.js.map