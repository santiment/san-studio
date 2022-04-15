<script lang="ts">
  import { newHistoryContext } from 'webkit/ui/history'
  import { ONE_MINUTE_IN_MS } from 'webkit/utils/dates'
  import Svg from 'webkit/ui/Svg/svelte'
  import { studio } from '@/stores/studio'
  import { setAdapterController } from '@/adapter/context'
  import { newAutoUpdaterStore } from '@/stores/autoUpdater'
  import ChartWidget from '@/ChartWidget/index.svelte'
  import MetricErrorTooltipCtx from '@/ChartWidget/Metrics/ErrorTooltipCtx.svelte'
  import { getViewOnSantimentLink } from './utils'
  import sanSvg from './san.svg'

  let className = ''
  export { className as class }
  export let widget = {}
  export let isWithMetricSettings = false
  export let sharedAccessToken: string | undefined

  const queryString = getViewOnSantimentLink($studio, widget)
  const AutoUpdater = newAutoUpdaterStore([widget])
  newHistoryContext({ add: () => {} })
  setAdapterController({
    sharedAccessToken,
    isWithMetricSettings,
    noWidgetControls: true,
    isOnlyChartEmbedded: true,
    isEmbedded: true,
  })

  let interval

  $: ({ lastUpdate } = $AutoUpdater)
  // @ts-ignore
  $: updated = (lastUpdate, startInterval())

  function startInterval() {
    window.clearInterval(interval)

    interval = window.setInterval(() => {
      const diff = Date.now() - lastUpdate
      updated = Math.floor(diff / ONE_MINUTE_IN_MS) + 'm'
    }, 60000)

    return 'less than a minute'
  }
</script>

<div class="column {className}">
  <MetricErrorTooltipCtx>
    <ChartWidget {widget} class="$style.widget" />
  </MetricErrorTooltipCtx>

  <div class="row justify txt-m mrg-xs mrg--t">
    <div class="update btn" on:click={AutoUpdater.update}>
      <Svg id="refresh" w="12" class="mrg-s mrg--r" />
      Updated {updated} ago
    </div>

    <a href="https://app.santiment.net/charts?{queryString}" target="__blank" class="btn caption">
      <img alt="SAN" src={sanSvg} class="mrg-s mrg--r" />
      View on Santiment
    </a>
  </div>
</div>

<style>
  .column {
    height: 100%;
  }

  .update {
    font-size: 10px;
  }

  .btn {
    display: flex;
    align-items: center;
    --color: var(--waterloo);
    --color-hover: var(--green);
  }

  .widget {
    height: 0 !important;
  }
</style>
