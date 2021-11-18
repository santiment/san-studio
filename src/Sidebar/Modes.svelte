<script lang="ts" context="module">
  export const Mode = {
    Metrics: 'Metrics',
    Layouts: 'Layouts',
  } as const
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import { newGlobalShortcut } from 'webkit/utils/events'
  import { CMD } from 'webkit/utils/os'
  import { dialogs } from 'webkit/ui/Dialog'
  import Svg from 'webkit/ui/Svg.svelte'
  import { Event } from '@/analytics'
  import ShortcutsDialog, {
    showShortcutsDialog,
  } from '@/Shortcuts/Dialog.svelte'

  export let mode = Mode.Metrics
  export let isLocked

  const MODES = [Mode.Metrics, Mode.Layouts]

  function openShortcutsDialog() {
    if (dialogs.has(ShortcutsDialog)) return
    showShortcutsDialog()
  }

  function onModeCange(id) {
    mode = id
    track.event(Event.Sidebar, { mode: id.toLowerCase() })
  }

  const onHelpClick = () => (
    track.event(Event.HelpFeedback), window.Intercom?.('show')
  )

  const toggleSidebar = () => (isLocked = !isLocked)

  const removeOpenShortcutsDialogHandler = newGlobalShortcut(
    'SHIFT+?',
    openShortcutsDialog,
  )
  const removeToggleSidebarHandler = newGlobalShortcut('CMD+\\', toggleSidebar)

  onDestroy(() => {
    removeOpenShortcutsDialogHandler()
    removeToggleSidebarHandler()
  })
</script>

<div class="nav row">
  <div
    aria-label="{isLocked ? 'Hide' : 'Lock'} sidebar | {CMD} + \"
    class="toggle btn row hv-center expl-tooltip"
    on:click={toggleSidebar}>
    <Svg id="sidebar" w="12" h="10" class={isLocked ? '' : '$style.closed'} />
  </div>
  {#each MODES as id}
    <div
      class="btn"
      class:active={mode === id}
      on:click={() => onModeCange(id)}>
      {id}
    </div>
  {/each}

  <div class="bottom mrg-a mrg--t row">
    <div
      aria-label="Shortcuts | Shift + ?"
      class="shortcuts btn row hv-center expl-tooltip"
      on:click={showShortcutsDialog}>
      <Svg id="cmd-key" w="16" />
    </div>
    <div class="help btn row v-center" on:click={onHelpClick}>
      Help & Feedback
      <Svg id="chat" w="14" h="16" class="$style.chat mrg-s mrg--t" />
    </div>
  </div>
</div>

<style>
  .nav {
    --color: var(--waterloo);
    --color-hover: var(--green) !important;
    writing-mode: vertical-lr;
    border-right: 1px solid var(--porcelain);
    position: sticky;
    top: 0;
    height: 100vh;
    z-index: 1;
    background: var(--white);
  }
  .btn {
    padding: 16px 5px;
    border-top: 1px solid var(--porcelain);
    border-radius: 0;
    transform: rotate(180deg);
  }
  .active {
    --color: var(--green);
    --bg: var(--green-light-1);
  }

  .toggle {
    height: 32px;
    padding: 0;
    transform: none;
    border: none;
    border-bottom: 1px solid var(--porcelain);
  }
  .closed {
    transform: rotate(180deg);
  }

  .shortcuts {
    border-bottom: 1px solid var(--porcelain);
    height: 32px;
    width: 32px;
    padding: 0;
    transform: none;
  }

  .toggle,
  .shortcuts {
    --expl-position-y: 28px;
  }

  .expl-tooltip::before {
    writing-mode: initial;
    left: 36px;
  }

  .help {
    --fill: var(--casper);
    padding: 12px 5px;
  }
  .chat {
    transform: rotate(90deg);
  }

  .bottom {
    position: sticky;
    bottom: 0;
  }
</style>
