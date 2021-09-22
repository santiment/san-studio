<script lang="ts">
  import { getDateFormats } from 'webkit/utils/dates'
  import { globals } from '@/stores/globals'
  import { getWidget } from '@/ChartWidget/context'
  import Dropdown from '@/ChartWidget/MetricSettings/Dropdown.svelte'
  import { getCoinCostDate } from './utils'

  const widget = getWidget()
  const { MetricSettings } = widget

  export let addon

  let calendarNode

  $: metricSettings = $MetricSettings[addon.key]
  $: date = getCoinCostDate(
    metricSettings?.date,
    $globals.isPro || $globals.isProPlus,
  )
  $: window.mountSettingsCalendar?.(calendarNode, date)

  function getLabel(date: Date) {
    const { DD, MMM, YY } = getDateFormats(date)
    return `${DD} ${MMM} ${YY}`
  }

  window.setSettingsCalendarDate = (date: Date) => {
    MetricSettings.set(addon.key, { date: date.toISOString() })
  }
</script>

<Dropdown isList={false}>
  Date: {getLabel(date)}

  <svelte:fragment slot="options">
    <div bind:this={calendarNode} class="calendar" />
  </svelte:fragment>
</Dropdown>
