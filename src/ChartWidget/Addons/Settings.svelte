<script lang="ts">
  import { getDateFormats } from 'webkit/utils/dates'
  import { globals } from '@/stores/globals'
  import { getWidget } from '@/ChartWidget/context'
  import Dropdown from '@/ChartWidget/MetricSettings/Dropdown.svelte'
  import { getCoinCostDate, checkAreSameDay, MAX_DATE, MAX_FREE_DATE } from './utils'

  const widget = getWidget()
  const { MetricSettings } = widget

  export let addon

  let calendarNode

  $: metricSettings = $MetricSettings[addon.key]
  $: isPro = $globals.isPro || $globals.isProPlus
  $: dates = getCoinCostDate(metricSettings, isPro)
  $: window.mountSettingsCalendar?.(calendarNode, dates, isPro ? MAX_DATE : MAX_FREE_DATE)

  function formatDate(date: Date) {
    const { DD, MMM, YY } = getDateFormats(date)
    return `${DD} ${MMM} ${YY}`
  }

  function getLabel([from, to]: [Date, Date]) {
    if (checkAreSameDay(from, to)) {
      return formatDate(to)
    }

    return formatDate(from) + ' - ' + formatDate(to)
  }

  window.setSettingsCalendarDate = ([from, to]: [Date, Date | undefined]) => {
    MetricSettings.set(addon.key, {
      from: from.toISOString(),
      to: to?.toISOString(),
    })
  }
</script>

<Dropdown isList={false}>
  Date: {getLabel(dates)}

  <svelte:fragment slot="options">
    <div bind:this={calendarNode} class="calendar" />
  </svelte:fragment>
</Dropdown>
