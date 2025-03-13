<script>import { onDestroy } from 'svelte';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { newHistoryContext, newHistoryEmitter } from 'san-webkit/lib/ui/history';
import { newAppTooltipsCtx, getAppTooltipsCtx } from 'san-webkit/lib/ui/Tooltip/ctx';
import HistoryAction from './history/Action.svelte';
import MasterAsset from './MasterAsset/index.svelte';
import Header from './Header/index.svelte';
import Widget, { newWidgetViewportObserver } from './Widget/index.svelte';
import Sidebar from './Sidebar/index.svelte';
import Mapview from './Mapview/index.svelte';
import SidewidgetComponent from './Sidewidget/index.svelte';
import { newTooltipSynchronizer } from './Chart/Tooltip/context';
import { studio, newLockedAssetStore } from './stores/studio';
import { initWidgets, initSidewidget } from './stores/widgets';
import { newAutoUpdaterStore } from './stores/autoUpdater';
import { widgetsListener } from './stores/widgetsListener';
import { setAdapterController } from './adapter/context';
import ChartTooltipContexts from './ChartWidget/TooltipContexts.svelte';
let className = '';
export { className as class };
export let widgets;
export let sidewidget;
export let defaultSettings = undefined;
export let screen = undefined;
export let onWidget = undefined;
export let onWidgetInit = undefined;
export let onSubwidget = undefined;
export let onChartPointClick = undefined;
export let onAnonFavoriteClick = undefined;
export let onModRangeSelect = undefined;
export let onScreenMount = (screen) => { };
export let getExternalWidget = undefined;
export let adjustSelectedMetric = undefined;
export let checkIsMapviewDisabled = undefined;
export let parseLayoutWidgets = undefined;
export let shareLayoutWidgets = undefined;
export let InsightsContextStore = undefined;
export let onSidebarProjectMount = undefined;
export let headerPadding = 65;
export let HistoryEmitter = newHistoryEmitter();
export let History = newHistoryContext(HistoryEmitter.set);
export let title = '';
export let description = '';
export let projectName = '';
export let metricsList = '';
if (defaultSettings)
    studio.setProject(defaultSettings);
const Widgets = initWidgets(widgets, getExternalWidget, History);
const Sidewidget = initSidewidget(sidewidget);
const onScreen = () => onScreenMount && onScreenMount(screen);
window.showLoginPrompt = onAnonFavoriteClick || (() => { });
window.shareLayoutWidgets = shareLayoutWidgets || (() => []);
window.parseLayoutWidgets = parseLayoutWidgets || (() => []);
if (!getAppTooltipsCtx())
    newAppTooltipsCtx();
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
});
newTooltipSynchronizer();
newLockedAssetStore();
const AutoUpdater = newAutoUpdaterStore(Widgets);
let screenRef;
$: screenRef && onScreen();
$: AutoUpdater.check($studio);
function onWidgetUpdate() {
    widgetsListener.update();
}
const widgetViewportObserver = newWidgetViewportObserver();
onDestroy(() => {
    window.showLoginPrompt = undefined;
    window.shareLayoutWidgets = undefined;
    // @ts-ignore
    window.parseLayoutWidgets = undefined;
});
</script>

<slot />

<main class="column {className}">
  <div class="studio-top">
    <MasterAsset />
  </div>

  <div class="row">
    <Sidebar {Widgets} {Sidewidget} {adjustSelectedMetric} />
    <div class="content column">
      {#if !screen}
        <Header {headerPadding} />

        {#if title && description}
          <article class="border mrg-m mrg--b column gap-s">
            <h1 class="body-1 txt-m">{title}</h1>
            <p class="description c-fiord">{description}</p>
            <div class="row mrg-m mrg--t">
              <asset class="row v-center gap-s">
                <Svg id="asset-small" w="12" />
                {projectName || 'Bitcoin'}
              </asset>

              {#if metricsList}
                <metrics class="row v-center gap-s">
                  <Svg id="bars" w="12" class="mrg-s mrg--r" />
                  {metricsList}
                </metrics>
              {/if}
            </div>
          </article>
        {/if}

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

<ChartTooltipContexts />

<style>
  main {
    min-height: 100vh;
    position: relative;
  }

  main,
  .content {
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

  article {
    padding: 16px 24px;
  }

  p {
    max-width: 905px;
  }

  asset,
  metrics {
    fill: var(--waterloo);
  }

  metrics::before {
    display: block;
    content: '';
    height: 4px;
    width: 4px;
    border-radius: 50%;
    background: var(--mystic);
    margin: 0 12px 0 4px;
  }

  .description {
    white-space: pre-line;
  }
</style>
