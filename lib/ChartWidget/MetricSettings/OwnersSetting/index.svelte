<script>var _a;
import 'svelte';
import { track } from 'san-webkit/lib/analytics';
import VirtualList from 'san-webkit/lib/ui/VirtualList/svelte';
import Search from 'san-webkit/lib/ui/Search.svelte';
import { debounce$$ } from 'san-webkit/lib/utils/fn';
import { withScroll } from 'san-webkit/lib/ui/history';
import { getHistoryContext } from './../../../history/ctx';
import { studio } from './../../../stores/studio';
import { getWidget } from './../../../ChartWidget/context';
import './../../../stores/studio';
import { queryAvailableOwners } from './api';
import LabelsSetting from './LabelsSetting.svelte';
import Dropdown from '../Dropdown.svelte';
export let metric;
const History = getHistoryContext();
const widget = getWidget();
const { MetricSettings } = widget;
let owners = [];
let searchTerm = '';
const auto = 'Auto';
$: slug = ((_a = metric.project) === null || _a === void 0 ? void 0 : _a.slug) || $studio.slug;
$: items = Array.from(new Set([auto, ...owners]));
$: metricSettings = $MetricSettings[metric.key];
$: metricOwner = metricSettings === null || metricSettings === void 0 ? void 0 : metricSettings.owner;
$: filtered = searchTerm ? filter(items) : items;
$: process.browser && queryOwners(slug);
const onSearch$ = debounce$$(250, (value) => (searchTerm = value));
const onInput = ({ currentTarget }) => $onSearch$(currentTarget.value);
function filter(items) {
    const value = searchTerm.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(value));
}
function onOptionSelect(newOwner) {
    track.event(Event.MetricOwner, { metric: metric.key, owner: newOwner });
    const oldOwner = metricOwner || auto;
    if (newOwner === oldOwner) {
        return;
    }
    const oldLabel = metricSettings === null || metricSettings === void 0 ? void 0 : metricSettings.label;
    const redo = () => setOwner(metric, newOwner);
    redo();
    History.add('Owner change', withScroll(widget, () => setOwner(metric, oldOwner, oldLabel)), withScroll(widget, redo));
}
function setOwner(metric, newOwner, newLabel) {
    const { key } = metric;
    if (newOwner === auto) {
        MetricSettings.delete(key, 'owner');
        MetricSettings.delete(key, 'label');
        return;
    }
    MetricSettings.set(key, { owner: newOwner });
    MetricSettings.set(key, { label: newLabel });
}
function queryOwners(slug) {
    console.log(metric);
    const { key, queryKey = key } = metric;
    queryAvailableOwners(queryKey, slug).then((data) => {
        owners = data;
    });
}
</script>

<Dropdown>
  Owner: {metricOwner || auto}

  <svelte:fragment slot="dropdown">
    <Search class="search-E9hASL mrg-s mrg--b" placeholder="Search..." on:input={onInput} />

    <div class="column">
      <VirtualList itemHeight={32} renderAmount={20} maxFluidHeight={150} items={filtered} let:item>
        <button class="btn-ghost" on:click={() => onOptionSelect(item)}>{item}</button>
      </VirtualList>
    </div>
  </svelte:fragment>
</Dropdown>

<LabelsSetting {metric} />

<style>
  :global(.search-E9hASL) {
    width: 160px;
  }

  div {
    height: 150px;
    width: 160px;
  }
</style>
