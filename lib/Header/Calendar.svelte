<script>import { InputCalendar as PresetCalendar } from 'san-webkit/lib/ui/Calendar';
import { getDateFormats } from 'san-webkit/lib/utils/dates';
import { studio as settings$ } from './../stores/studio';
import { noop } from 'san-webkit/lib/utils';
let className = '';
export { className as class };
export let dates;
export let _onDateSelect = noop;
function formatDate(date) {
    const { DD, MM, YY } = getDateFormats(date);
    return `${DD}/${MM}/${YY}`;
}
function formatDates([from, to]) {
    return `${formatDate(from)} - ${formatDate(to)}`;
}
function onDateSelect([from, to]) {
    if (to) {
        settings$.setPeriod(from, to);
        _onDateSelect(from, to);
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
