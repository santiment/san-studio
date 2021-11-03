<script lang="ts">
  import type { Layout } from '@/api/layouts'
  import { onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import { CMD } from 'webkit/utils/os'
  import { newGlobalShortcut } from 'webkit/utils/events'
  import { getHistoryContext } from 'webkit/ui/history'
  import { dialogs } from 'webkit/ui/Dialog'
  import Svg from 'webkit/ui/Svg.svelte'
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import { Event } from '@/analytics'
  import { studio } from '@/stores/studio'
  import { getWidgets } from '@/stores/widgets'
  import { selectedLayout } from '@/stores/layout'
  import { currentUser } from '@/stores/user'
  import { deleteSavedValue, getSavedJson } from '@/utils/localStorage'
  import {
    updateUserLayout,
    createUserLayout,
    LayoutCreation,
  } from '@/api/layouts/mutate'
  import {
    showNewLayoutDialog,
    Mode,
    SCHEDULED_CHART,
  } from './NewLayoutDialog.svelte'
  import LoadLayoutDialog, {
    showLoadLayoutDialog,
  } from './LoadLayoutDialog.svelte'
  import { showDeleteLayoutDialog } from './DeleteLayoutDialog.svelte'
  import { getAllWidgetsMetricsKeys } from './utils'

  const Widgets = getWidgets()
  const History = getHistoryContext()

  $: location = window.location
  $: layout = $selectedLayout
  $: isAuthor = $currentUser && layout && +layout.user.id === +$currentUser.id

  const selectLayout = (layout) => layout && selectedLayout.set(layout as any)
  const callIfRegistered = (clb: () => any) => () =>
    ($currentUser ? clb : window.showLoginPrompt)?.()

  function onSave() {
    let promise: Promise<any>

    if (layout) {
      const projectId = +$studio.projectId
      const { id, title, description } = layout
      const settings = {
        title,
        description,
        projectId,
        metrics: getAllWidgetsMetricsKeys($Widgets),
        options: {
          widgets: window.shareLayoutWidgets?.($Widgets),
        },
      }

      promise = (isAuthor
        ? updateUserLayout(id, settings)
        : createUserLayout(settings)
      ).then((layout) => {
        window.notifyLayoutSave?.()
        return layout
      })
    } else {
      promise = showNewLayoutDialog()
    }

    promise.then(selectLayout)
  }

  const onSaveAsNew = () =>
    layout &&
    showNewLayoutDialog({ layout, title: 'Save Chart Layout as ...' }).then(
      selectLayout,
    )

  const onEdit = () =>
    layout &&
    showNewLayoutDialog({
      layout,
      title: 'Edit Chart Layout',
      mode: Mode.Edit,
    }).then(selectLayout)

  const onNew = () => showNewLayoutDialog().then(selectLayout)

  window.onLayoutCreationOpen = () => {
    onNew()
  }

  window.onLayoutSelect = (layout: Layout) => {
    if ($selectedLayout && +layout.id === +$selectedLayout.id) return

    const newWidgets = window.parseLayoutWidgets(layout)
    const oldWidgets = $Widgets
    const oldLayout = $selectedLayout

    const redo = () => (Widgets.set(newWidgets), selectedLayout.set(layout))
    History.add(
      'Apply layout',
      () => (Widgets.set(oldWidgets), selectedLayout.set(oldLayout)),
      redo,
    )
    redo()

    track.event(Event.LoadLayout, { id: layout.id })
  }

  window.onChartsLayoutMount = () => {
    const settings = getSavedJson(SCHEDULED_CHART) as LayoutCreation

    if (settings) {
      const mutation = createUserLayout(settings)

      mutation.then((layout) => {
        track.event(Event.NewLayout, {
          id: layout.id,
        })

        window.onLayoutSelect(layout)

        deleteSavedValue(SCHEDULED_CHART)

        window.notifyLayoutCreation?.()
      })
    }
  }

  function openLoadLayoutDialog() {
    if (dialogs.has(LoadLayoutDialog)) return
    showLoadLayoutDialog()
  }

  const unsubSave = newGlobalShortcut('CMD+S', callIfRegistered(onSave))
  const unsubLoad = newGlobalShortcut('CMD+L', openLoadLayoutDialog)
  onDestroy(() => {
    // @ts-ignore
    window.onLayoutSelect = undefined
    window.onLayoutCreationOpen = undefined
    window.onChartsLayoutMount = undefined
    unsubSave()
    unsubLoad()
  })
</script>

<div class="layout border btn row">
  <div class="action btn" on:click={callIfRegistered(onSave)}>
    {layout ? 'Save' : 'Save as'}
  </div>
  <Tooltip on="click" duration={0} align="center" class="$style.tooltip">
    <div class="menu btn" slot="trigger">
      <Svg id="arrow" w="8" h="5" class="$style.arrow" />
    </div>

    <div slot="tooltip">
      {#if layout}
        <div
          class="btn btn--ghost row v-center"
          on:click={callIfRegistered(onSave)}>
          Save
          <span class="caption mrg-a mrg--l">{CMD} + S</span>
        </div>
        <div class="btn btn--ghost" on:click={callIfRegistered(onSaveAsNew)}>
          Save as new
        </div>
      {/if}

      {#if isAuthor}
        <div class="btn btn--ghost" on:click={onEdit}>Edit</div>
      {/if}

      {#if layout}
        <div class="divider" />
      {/if}

      <div class="btn btn--ghost" on:click={showLoadLayoutDialog}>Load</div>
      <div class="btn btn--ghost" on:click={callIfRegistered(onNew)}>New</div>

      {#if isAuthor}
        <div
          class="delete btn btn--ghost"
          on:click={() =>
            showDeleteLayoutDialog({ layout }).then(
              (wasDeleted) => wasDeleted && selectedLayout.set(undefined),
            )}>
          Delete
        </div>
      {/if}
    </div>
  </Tooltip>
</div>

<style>
  .layout {
    position: relative;
  }

  .action,
  .menu {
    --color-hover: var(--green);
    height: 32px;
    padding: 6px 12px;
  }

  .menu {
    border-left: 1px solid var(--porcelain);
    border-radius: 0;
    --color: var(--waterloo);
  }

  .arrow {
    transform: rotate(180deg);
  }

  .tooltip {
    left: 0px !important;
    width: 200px;
    padding: 8px;
  }

  .divider {
    margin: 8px -8px;
    border-bottom: 1px solid var(--porcelain);
  }

  .delete {
    --color: var(--red);
    --color-hover: var(--red-hover);
  }

  .caption {
    color: var(--waterloo);
  }
</style>
