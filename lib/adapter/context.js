import { setContext, getContext } from 'svelte'
export const ADAPTER_CONTROLLER_CONTEXT = 'ADAPTER_CONTROLLER_CONTEXT '
export const setAdapterController = (controller) =>
  setContext(ADAPTER_CONTROLLER_CONTEXT, controller)
export const getAdapterController = () => getContext(ADAPTER_CONTROLLER_CONTEXT) || {}
//# sourceMappingURL=context.js.map
