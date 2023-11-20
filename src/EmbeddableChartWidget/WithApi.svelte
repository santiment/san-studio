<script lang="ts">
  import { newHistoryContext } from 'webkit/ui/history'
  import { ONE_MINUTE_IN_MS } from 'webkit/utils/dates'
  import Svg from 'webkit/ui/Svg/svelte'
  import { InputCalendar as PresetCalendar } from 'webkit/ui/Calendar'
  import { studio } from '@/stores/studio'
  import { setAdapterController } from '@/adapter/context'
  import { newAutoUpdaterStore } from '@/stores/autoUpdater'
  import ChartWidget from '@/ChartWidget/index.svelte'
  import MetricErrorTooltipCtx from '@/ChartWidget/Metrics/ErrorTooltipCtx.svelte'
  import { getViewOnSantimentLink } from './utils'
  import sanSvg from './san.svg'
  import Calendar from '@/Header/Calendar.svelte'
  import { DatesMessage, AssetMessage, ThemeMessage } from './utils'
  import { globals } from '@/stores/globals'

  let className = ''
  export { className as class }
  export let widget = {}
  export let isWithMetricSettings = false
  export let sharedAccessToken: string | undefined

  export let isCalendarEnabled = true
  export let isMinimapEmbedded = true

  const queryString = getViewOnSantimentLink($studio, widget)
  const AutoUpdater = newAutoUpdaterStore([widget])
  newHistoryContext({ add: () => {} })
  setAdapterController({
    sharedAccessToken,
    isWithMetricSettings,
    noWidgetControls: true,
    isOnlyChartEmbedded: true,
    isMinimapEmbedded,
    isCalendarEnabled,
    isEmbedded: true,
  })

  let interval

  $: ({ lastUpdate } = $AutoUpdater)
  // @ts-ignore
  $: updated = (lastUpdate, startInterval())
  $: ({ from, to } = $studio)

  function startInterval() {
    window.clearInterval(interval)

    interval = window.setInterval(() => {
      const diff = Date.now() - lastUpdate
      updated = Math.floor(diff / ONE_MINUTE_IN_MS) + 'm'
    }, 60000)

    return 'less than a minute'
  }

  function onDateSelect(from: Date, to: Date) {
    DatesMessage.send({ from: from.toISOString(), to: to.toISOString() })
  }

  DatesMessage.listen(({ from, to }) => {
    studio.setPeriod(new Date(from), new Date(to))
  })

  AssetMessage.listen((asset) => {
    studio.setProject(asset)
  })

  ThemeMessage.listen((theme) => {
    globals.toggle('isNightMode', theme.dark)
    document.body.classList.toggle('night-mode', theme.dark)
  })
</script>

<div class="column {className}">
  <MetricErrorTooltipCtx>
    <ChartWidget {widget} class="$style.widget">
      {#if isCalendarEnabled}
        <Calendar dates={[new Date(from), new Date(to)]} _onDateSelect={onDateSelect} />
      {/if}
    </ChartWidget>
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

  Calendar {
    margin-top: -4px;
  }
</style>
