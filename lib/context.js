import { getContext, setContext } from 'svelte';
export const CTX = 'STUDIO';
export const newStudioCtx = () => setContext(CTX, new Map());
export const getStudioCtx = () => getContext(CTX);
export function setStudioContext(key, value) {
    getStudioCtx().set(key, value);
    return value;
}
export const getStudioContext = (key) => getStudioCtx().get(key);
//# sourceMappingURL=context.js.map