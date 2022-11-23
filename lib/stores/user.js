import { writable } from 'svelte/store';
import { queryCurrentUser } from './../../lib/api/user';
const { subscribe, set } = writable(null);
let wasNotFetched = true;
export const currentUser = {
    set,
    subscribe(run, invalidate) {
        if (wasNotFetched) {
            wasNotFetched = false;
            queryCurrentUser().then(set);
        }
        return subscribe(run, invalidate);
    },
};
//# sourceMappingURL=user.js.map