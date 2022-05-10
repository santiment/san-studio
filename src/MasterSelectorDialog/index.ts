import { dialogs } from 'webkit/ui/Dialog'
import MasterSelectorDialog from './index.svelte'

export const showMasterSelectorDialog = () => dialogs.showOnce(MasterSelectorDialog)
