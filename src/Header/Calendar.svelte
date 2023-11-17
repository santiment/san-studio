<script lang="ts">
  import { InputCalendar as PresetCalendar } from 'webkit/ui/Calendar'
  import { getDateFormats } from 'webkit/utils/dates'
  import { studio as settings$ } from '@/stores/studio'
  import { noop } from 'webkit/utils'

  let className = ''
  export { className as class }
  export let dates: any
  export let _onDateSelect = noop as (from: Date, to: Date) => void

  function formatDate(date: Date) {
    const { DD, MM, YY } = getDateFormats(date)
    return `${DD}/${MM}/${YY}`
  }

  function formatDates([from, to]: Date[]) {
    return `${formatDate(from)} - ${formatDate(to)}`
  }

  function onDateSelect([from, to]: Date[]) {
    if (to) {
      settings$.setPeriod(from, to)
      _onDateSelect(from, to)
    }
  }
</script>

<PresetCalendar
  date={dates}
  label={formatDates(dates)}
  class="{className} gap-s mrg-s mrg--r"
  {onDateSelect}
/>

<style>
</style>
