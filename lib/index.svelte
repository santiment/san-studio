<script lang="ts">
  import { onDestroy } from 'svelte'
  import { newHistoryContext, newHistoryEmitter } from 'san-webkit/lib/ui/history'
  import Dialogs from 'san-webkit/lib/ui/Dialog/Dialogs.svelte'
  import HistoryAction from './../lib/history/Action.svelte'
  import MasterAsset from './../lib/MasterAsset/index.svelte'
  import Header from './../lib/Header/index.svelte'
  import Widget, { newWidgetViewportObserver } from './../lib/Widget/index.svelte'
  import Sidebar from './../lib/Sidebar/index.svelte'
  import Mapview from './../lib/Mapview/index.svelte'
  import SidewidgetComponent from './../lib/Sidewidget/index.svelte'
  import { newTooltipSynchronizer } from './../lib/Chart/Tooltip/context'
  import { studio, newLockedAssetStore } from './../lib/stores/studio'
  import { initWidgets, initSidewidget } from './../lib/stores/widgets'
  import { newAutoUpdaterStore } from './../lib/stores/autoUpdater'
  import { widgetsListener } from './../lib/stores/widgetsListener'
  import { setAdapterController } from './../lib/adapter/context'
  import ChartTooltipContexts from './../lib/ChartWidget/TooltipContexts.svelte'
  export let widgets
  export let sidewidget
  export let defaultSettings = undefined
  export let screen = undefined
  export let onWidget = undefined
  export let onWidgetInit = undefined
  export let onSubwidget = undefined
  export let onChartPointClick = undefined
  export let onAnonFavoriteClick = undefined
  export let onModRangeSelect = undefined
  export let onScreenMount = (screen) => {}
  export let getExternalWidget = undefined
  export let adjustSelectedMetric = undefined
  export let checkIsMapviewDisabled = undefined
  export let parseLayoutWidgets = undefined
  export let shareLayoutWidgets = undefined
  export let InsightsContextStore = undefined
  export let onSidebarProjectMount = undefined
  export let headerPadding = 65
  if (defaultSettings) studio.setProject(defaultSettings)
  const HistoryEmitter = newHistoryEmitter()
  const History = newHistoryContext(HistoryEmitter.set)
  const Widgets = initWidgets(widgets, getExternalWidget, History)
  const Sidewidget = initSidewidget(sidewidget)

  const onScreen = () => onScreenMount && onScreenMount(screen)

  window.showLoginPrompt = onAnonFavoriteClick || (() => {})

  window.shareLayoutWidgets = shareLayoutWidgets || (() => [])

  window.parseLayoutWidgets = parseLayoutWidgets || (() => [])

  setAdapterController({
    onSubwidget,
    onWidget,
    onWidgetInit,
    onChartPointClick,
    onAnonFavoriteClick,
    onModRangeSelect,
    onSidebarProjectMount,
    checkIsMapviewDisabled,
    InsightsContextStore,
    adjustSelectedMetric,
  })
  newTooltipSynchronizer()
  newLockedAssetStore()
  const AutoUpdater = newAutoUpdaterStore(Widgets)
  let screenRef

  $: screenRef && onScreen()

  $: AutoUpdater.check($studio)

  function onWidgetUpdate() {
    widgetsListener.update()
  }

  const widgetViewportObserver = newWidgetViewportObserver()
  onDestroy(() => {
    window.showLoginPrompt = undefined
    window.shareLayoutWidgets = undefined // @ts-ignore

    window.parseLayoutWidgets = undefined
  })
</script>

<ChartTooltipContexts>
  <main class="column">
    <div class="studio-top">
      <MasterAsset />
    </div>
    <div class="row">
      <Sidebar {Widgets} {Sidewidget} {adjustSelectedMetric} />
      <div class="content column">
        {#if !screen}
          <Header {headerPadding} />

          <div class="row main" bind:this={screenRef}>
            <div class="widgets">
              {#each $Widgets as widget (widget.id)}
                <Widget
                  {widget}
                  {Widgets}
                  {onWidgetUpdate}
                  viewportObserver={widgetViewportObserver}
                />
              {/each}
            </div>

            {#if $Sidewidget} <SidewidgetComponent /> {/if}
          </div>
        {:else}
          {#key screen}
            <div class="main studio-screen" bind:this={screenRef} />
          {/key}
        {/if}

        <Mapview />

        <HistoryAction {HistoryEmitter} />
      </div>
    </div>
  </main>

  <Dialogs />
</ChartTooltipContexts>

<style>
  main {
    min-height: 100vh;
    position: relative;
  }

  .column {
    flex: 1 1;
    min-width: 0;
  }

  .content {
    background: var(--athens);
    padding: 16px;
    position: relative;
    min-height: calc(100vh + 80px);
  }

  .studio-top {
    padding: 16px;
    background: var(--white);
    border-bottom: 1px solid var(--porcelain);
  }

  .widgets {
    flex: 1 1 auto;
    min-width: 0;
  }

  .main {
    flex: 1;
  }
</style>
