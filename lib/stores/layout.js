import { writable } from 'svelte/store';
import { addRecentLayoutId } from './../Layouts/utils';
const store = writable();
export const selectedLayout = Object.assign(Object.assign({}, store), { set(layout) {
        if (layout)
            addRecentLayoutId(layout.id);
        store.set(layout);
    } });
//# sourceMappingURL=layout.js.map