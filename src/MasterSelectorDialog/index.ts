import { dialogs } from 'webkit/ui/Dialog'
import MasterSelectorDialog from './index.svelte'

export const showMasterSelectorDialog = (onSelect?: (item: any) => void) =>
  dialogs.showOnce(MasterSelectorDialog, { onItemSelect: onSelect })
