import { dialogs } from 'san-webkit/lib/ui/Dialog';
import MasterSelectorDialog from './index.svelte';
export const showMasterSelectorDialog = (onSelect) => dialogs.showOnce(MasterSelectorDialog, { onItemSelect: onSelect });
//# sourceMappingURL=index.js.map