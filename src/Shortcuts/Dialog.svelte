<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import ShortcutsDialog from './Dialog.svelte'

  export const showShortcutsDialog = (): Promise<unknown> =>
    dialogs.show(ShortcutsDialog)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import { isMac } from 'webkit/utils/os'
  import Section from './Section.svelte'

  const CMD = isMac ? '⌘' : 'Ctrl'

  function newShortcut(keys: string[], description: string) {
    return { keys, description }
  }

  const GENERAL = [
    newShortcut(['/'], 'Focus search bar'),

    newShortcut(['Esc'], 'Close a dialog'),

    newShortcut(['Shift', '?'], 'Open shortcuts info'),

    newShortcut([CMD, 'L'], 'Open Chart layout explorer'),

    newShortcut([CMD, 'S'], 'Save Chart layout'),

    newShortcut([CMD, 'Z'], 'Undo action'),

    newShortcut([CMD, 'Shift', 'Z'], 'Redo action'),
  ]

  const MAPVIEW = [
    newShortcut([CMD, 'M'], 'Open Mapview'),

    newShortcut(['Esc'], 'Close Mapview'),

    newShortcut([CMD, 'Click'], 'Keep the applied metrics to the chart'),
  ]

  const SIDEBAR = [
    newShortcut([CMD, '\\'], 'Collapse the sidebar'),

    newShortcut([CMD, 'Click'], 'Add a metric to the first chart'),

    newShortcut([CMD, 'Shift', 'Click'], 'Create a new chart with a metric'),
  ]

  const CHARTS = [
    newShortcut(['L'], 'Start drawing'),

    newShortcut(['Shift'], 'Show difference between two range points'),

    newShortcut([CMD, 'Click'], 'Supply Distribution - deselect other holders'),
  ]
</script>

<Dialog {...$$props} title="Keyboard shortcuts" class="shortcuts-dialog">
  <div class="dialog-body">
    <Section title="General" shortcuts={GENERAL} class="mrg-l mrg--b" />
    <Section title="Sidebar" shortcuts={SIDEBAR} class="mrg-l mrg--b" />
    <Section title="Mapview" shortcuts={MAPVIEW} class="mrg-l mrg--b" />
    <Section title="Charts" shortcuts={CHARTS} />
  </div>
</Dialog>

<style></style>
