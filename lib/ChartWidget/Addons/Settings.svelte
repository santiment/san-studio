<script lang="ts">
  var _a

  import { getDateFormats } from 'san-webkit/lib/utils/dates'
  import { globals } from './../../../lib/stores/globals'
  import { getWidget } from './../../../lib/ChartWidget/context'
  import Dropdown from './../../../lib/ChartWidget/MetricSettings/Dropdown.svelte'
  import { getCoinCostDate, checkAreSameDay, MAX_DATE, MAX_FREE_DATE } from './utils'
  const widget = getWidget()
  const { MetricSettings } = widget
  export let addon
  let calendarNode

  $: metricSettings = $MetricSettings[addon.key]

  $: isPro = $globals.isPro || $globals.isProPlus

  $: dates = getCoinCostDate(metricSettings, isPro)

  $: (_a = window.mountSettingsCalendar) === null || _a === void 0
    ? void 0
    : _a.call(window, calendarNode, dates, isPro ? MAX_DATE : MAX_FREE_DATE)

  function formatDate(date) {
    const { DD, MMM, YY } = getDateFormats(date)
    return `${DD} ${MMM} ${YY}`
  }

  function getLabel([from, to]) {
    if (checkAreSameDay(from, to)) {
      return formatDate(to)
    }

    return formatDate(from) + ' - ' + formatDate(to)
  }

  window.setSettingsCalendarDate = ([from, to]) => {
    MetricSettings.set(addon.key, {
      from: from.toISOString(),
      to: to === null || to === void 0 ? void 0 : to.toISOString(),
    })
  }
</script>

<Dropdown isList={false}>
  Date: {getLabel(dates)}

  <svelte:fragment slot="options">
    <div bind:this={calendarNode} class="calendar" />
  </svelte:fragment>
</Dropdown>
