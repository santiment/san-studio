<script lang="ts">
  import Widget from '@/Widget/index.svelte'
  import Sidebar from '@/Sidebar/index.svelte'
  import Mapview from '@/Mapview/index.svelte'
  import SidewidgetComponent from '@/Sidewidget/index.svelte'
  import { newTooltipSynchronizer } from '@/Chart/Tooltip/context'
  import { initWidgets, initSidewidget } from '@/stores/widgets'
  import { newNodeController } from '@/stores/selector'
  import { setAdapterController } from '@/adapter/context'

  export let widgets
  export let sidewidget
  export let onWidget = undefined
  export let onSubwidget = undefined
  export let InsightsContextStore = undefined

  const Widgets = initWidgets(widgets)
  const Sidewidget = initSidewidget(sidewidget)

  setAdapterController({ onSubwidget, onWidget, InsightsContextStore })
  newNodeController(Widgets, Sidewidget)
  newTooltipSynchronizer()
</script>

<main>
  <Sidebar />
  <div class="content column">
    <div class="studio-top" />
    <div class="border header panel row" />

    <div class="row main">
      <div class="widgets">
        {#each $Widgets as widget, i (widget.id)}
          <Widget {widget} {i} {Widgets} />
        {/each}
      </div>

      {#if $Sidewidget} <SidewidgetComponent /> {/if}
    </div>

    <Mapview />
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
  }

  .content {
    flex: 1;
    background: var(--athens);
    padding: 20px 25px;
    position: relative;
  }

  .panel {
    padding: 14px 16px;
  }

  .header {
    background: var(--white);
    position: sticky;
    top: 0;
    z-index: 21;
    margin: 0 0 13px;
  }

  .widgets {
    flex: 1 1 auto;
    min-width: 0;
  }

  .main {
    flex: 1;
  }
</style>
