<script lang="ts">
  import { tick, onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import { CMD } from 'webkit/utils/os'
  import { newGlobalShortcut } from 'webkit/utils/events'
  import { getHistoryContext } from '@/history/ctx'
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import { Event } from '@/analytics'
  import { Metric } from '@/metrics'
  import { studio } from '@/stores/studio'
  import { getWidgets, newWidget } from '@/stores/widgets'
  import { selectedLayout } from '@/stores/layout'
  import { currentUser } from '@/stores/user'
  import { widgetsListener } from '@/stores/widgetsListener'
  import { updateUserLayout, createUserLayout } from '@/api/layouts/mutate'
  import ChartWidget from '@/ChartWidget/index.svelte'
  import { showNewLayoutDialog, Mode } from './NewLayoutDialog.svelte'
  import { showLoadLayoutDialog } from './LoadLayoutDialog.svelte'
  import { showDeleteLayoutDialog } from './DeleteLayoutDialog.svelte'
  import {
    getScheduledLayout,
    deleteScheduledLayout,
    getAllWidgetsMetricsKeys,
    getLayoutMetrics,
  } from './utils'

  const Widgets = getWidgets()
  const History = getHistoryContext()

  let widgetsHash = ''
  let changed = false

  $: layout = $selectedLayout
  $: isAuthor = $currentUser && layout && +layout.user.id === +$currentUser.id
  // @ts-ignore
  $: layout, isAuthor, hashWidgets()

  const getWidgetsHash = (widgets = Widgets.get()) =>
    JSON.stringify(window.shareLayoutWidgets?.(widgets))
  function hashWidgets() {
    if (!layout || !isAuthor) return (widgetsHash = '')

    tick().then(() => {
      widgetsHash = getWidgetsHash(window.parseLayoutWidgets(layout))
      checkIsChanged()
    })
  }

  function checkIsChanged() {
    const newHash = getWidgetsHash()
    const isUpdated = widgetsHash !== newHash

    if (isUpdated) window.onChartHashChange?.(newHash)

    changed = isAuthor ? isUpdated : false
  }

  const unsubWidgets = widgetsListener.subscribe(checkIsChanged)

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
        metricsJson: getLayoutMetrics($Widgets),
        options: { widgets: window.shareLayoutWidgets?.($Widgets) },
      }

      promise = (isAuthor ? updateUserLayout(id, settings) : createUserLayout(settings)).then(
        (layout) => {
          window.notifyLayoutSave?.()
          return layout
        },
      )
    } else {
      promise = showNewLayoutDialog()
    }

    promise.then(selectLayout)
  }
  window.saveLayout = callIfRegistered(onSave)

  const onSaveAsNew = () =>
    layout && showNewLayoutDialog({ layout, title: 'Save Chart Layout as ...' }).then(selectLayout)
  window.saveAsNewLayout = callIfRegistered(onSaveAsNew)

  const onEdit = () =>
    layout &&
    showNewLayoutDialog({
      layout,
      title: 'Edit Chart Layout',
      mode: Mode.Edit,
    }).then(selectLayout)
  window.onLayoutEdit = callIfRegistered(onEdit)

  const onNew = () => showNewLayoutDialog().then(selectLayout)

  function onResetLayout() {
    const oldWidgets = Widgets.get().slice()
    const newWidgets = [
      newWidget(ChartWidget, {
        metrics: [Metric.price_usd],
      }),
    ]

    Widgets.set(newWidgets)
    History.add(
      'Reset layout',
      () => Widgets.set(oldWidgets),
      () => Widgets.set(newWidgets),
    )
  }

  window.onLayoutCreationOpen = () => {
    onNew()
  }

  window.onLayoutSelect = (layout: SAN.Layout) => {
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
    const settings = getScheduledLayout()

    if (settings) {
      createUserLayout(settings).then((layout) => {
        track.event(Event.NewLayout, {
          id: layout.id,
        })

        window.onLayoutSelect(layout)
        deleteScheduledLayout()
        window.notifyLayoutCreation?.()
      })
    }
  }

  const unsubSave = newGlobalShortcut('CMD+S', callIfRegistered(onSave))
  const unsubLoad = newGlobalShortcut('CMD+L', showLoadLayoutDialog)
  onDestroy(() => {
    // @ts-ignore
    delete window.onLayoutSelect
    delete window.onLayoutCreationOpen
    delete window.onChartsLayoutMount
    delete window.onLayoutEdit
    delete window.saveLayout
    delete window.saveAsNewLayout
    unsubSave()
    unsubLoad()
    unsubWidgets()
  })
</script>

<div class="layout btn row mrg-a mrg--l">
  <div class="action btn border" class:changed on:click={callIfRegistered(onSave)}>
    {layout ? 'Save' : 'Save as'}
  </div>
  <Tooltip on="click" duration={0} align="center" class="$style.tooltip">
    <div class="menu btn border row v-center" slot="trigger">
      <Svg id="arrow" w="8" h="5" class="$style.arrow" />
    </div>

    <div slot="tooltip">
      {#if layout}
        <div class="btn-ghost row v-center" on:click={callIfRegistered(onSave)}>
          Save
          <span class="caption mrg-a mrg--l">{CMD} + S</span>
        </div>
        <div class="btn-ghost" on:click={callIfRegistered(onSaveAsNew)}>Save as new</div>
      {/if}

      {#if isAuthor}
        <div class="btn-ghost" on:click={onEdit}>Edit</div>
      {/if}

      {#if layout}
        <div class="divider" />
      {/if}

      <div class="btn-ghost" on:click={showLoadLayoutDialog}>Load</div>
      <div class="btn-ghost" on:click={callIfRegistered(onNew)}>New</div>
      <div class="btn-ghost" on:click={onResetLayout}>Reset layout</div>

      {#if isAuthor}
        <div
          class="delete btn-ghost"
          on:click={() =>
            showDeleteLayoutDialog({ layout }).then(
              (wasDeleted) => wasDeleted && selectedLayout.set(undefined),
            )}
        >
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

  .action {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .menu {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
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

  .changed {
    --color: var(--orange);
    --border: var(--orange);
    --color-hover: var(--orange-hover);
    --border-hover: var(--orange-hover);
  }
</style>
