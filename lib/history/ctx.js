import { getContext } from 'svelte';
import { CONTEXT } from 'san-webkit/lib/ui/history';
import { getStudioContext } from './../context.js';
export const getHistoryContext = () => getStudioContext(CONTEXT) || getContext(CONTEXT);
//# sourceMappingURL=ctx.js.map