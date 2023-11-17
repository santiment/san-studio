<script lang="ts">
  import { InputCalendar as PresetCalendar } from 'webkit/ui/Calendar'
  import { getDateFormats } from 'webkit/utils/dates'
  import { studio as settings$ } from '@/stores/studio'

  let className = ''
  export { className as class }
  export let dates: any

  function formatDate(date: Date) {
    const { DD, MM, YY } = getDateFormats(date)
    return `${DD}/${MM}/${YY}`
  }

  function formatDates([from, to]: Date[]) {
    return `${formatDate(from)} - ${formatDate(to)}`
  }

  function onDateSelect([from, to]: Date[]) {
    if (to) settings$.setPeriod(from, to)
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
