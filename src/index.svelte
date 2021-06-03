<script lang="ts">
  import Widget from '@/Widget/index.svelte'
  import Sidebar from '@/Sidebar/index.svelte'
  import Mapview from '@/Mapview/index.svelte'
  import SidewidgetComponent from '@/Sidewidget/index.svelte'
  import { newTooltipSynchronizer } from '@/Chart/Tooltip/context'
  import { studio } from '@/stores/studio'
  import { initWidgets, initSidewidget } from '@/stores/widgets'
  import { newAutoUpdaterStore } from '@/stores/autoUpdater'
  import { newNodeController } from '@/stores/selector'
  import { setAdapterController } from '@/adapter/context'
  import { newSizedQueue } from '@/Widget/queue'

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
  export let onScreenMount = (screen: any) => {}
  export let getExternalWidget = undefined
  export let InsightsContextStore = undefined

  studio.setProject(defaultSettings)
  const Widgets = initWidgets(widgets, getExternalWidget)
  const Sidewidget = initSidewidget(sidewidget)
  const onScreen = () => onScreenMount && onScreenMount(screen)

  setAdapterController({
    onSubwidget,
    onWidget,
    onWidgetInit,
    onChartPointClick,
    onAnonFavoriteClick,
    onModRangeSelect,
    InsightsContextStore,
  })
  newNodeController(Widgets, Sidewidget)
  newTooltipSynchronizer()
  const AutoUpdater = newAutoUpdaterStore(Widgets)
  const Queue = newSizedQueue()

  let screenRef
  $: screenRef && onScreen()
  $: AutoUpdater.check($studio)

  // Queueing only on mount
  $Widgets.forEach((widget) => widget.isExternal || Queue.add(widget))
</script>

<main>
  <Sidebar />
  <div class="content column">
    <div class="studio-top" />
    {#if !screen}
      <div class="border header panel row" />

      <div class="row main" bind:this={screenRef}>
        <div class="widgets">
          {#each $Widgets as widget (widget.id)}
            <Widget {widget} {Widgets} />
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
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    position: relative;
  }

  .content {
    flex: 1 1;
    background: var(--athens);
    padding: 20px 40px;
    position: relative;
    min-width: 0;
  }

  .panel {
    padding: 14px 16px;
  }

  .header {
    background: var(--white);
    position: sticky;
    top: 0;
    z-index: 24;
    margin: 0 0 13px;
    transition: transform 0.3s ease-out;
    min-height: 64px;
  }

  .widgets {
    flex: 1 1 auto;
    min-width: 0;
  }

  .main {
    flex: 1;
  }
</style>
