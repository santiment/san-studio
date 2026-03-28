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
import { queryAvailableOwnerLabels } from './api';
import Dropdown from '../Dropdown.svelte';
export let metric;
const History = getHistoryContext();
const widget = getWidget();
const { MetricSettings } = widget;
let labels = [];
let searchTerm = '';
const auto = 'Auto';
$: slug = ((_a = metric.project) === null || _a === void 0 ? void 0 : _a.slug) || $studio.slug;
$: items = Array.from(new Set([auto, ...labels]));
$: metricSettings = $MetricSettings[metric.key];
$: metricOwner = metricSettings === null || metricSettings === void 0 ? void 0 : metricSettings.owner;
$: metricLabel = metricSettings === null || metricSettings === void 0 ? void 0 : metricSettings.label;
$: filtered = searchTerm ? filter(items) : items;
$: process.browser && queryData(slug, metricOwner);
const onSearch$ = debounce$$(250, (value) => (searchTerm = value));
const onInput = ({ currentTarget }) => $onSearch$(currentTarget.value);
function filter(items) {
    const value = searchTerm.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(value));
}
function onOptionSelect(newLabel) {
    track.event(Event.MetricLabel, { metric: metric.key, label: newLabel });
    const oldLabel = metricLabel || auto;
    if (newLabel === oldLabel) {
        return;
    }
    const redo = () => setLabel(metric, newLabel);
    redo();
    History.add('Label change', withScroll(widget, () => setLabel(metric, oldLabel)), withScroll(widget, redo));
}
function setLabel(metric, newLabel) {
    const { key } = metric;
    if (newLabel === auto) {
        MetricSettings.delete(key, 'label');
        return;
    }
    MetricSettings.set(key, { label: newLabel });
}
function queryData(slug, owner) {
    if (!owner) {
        return;
    }
    const { key, queryKey = key } = metric;
    queryAvailableOwnerLabels(queryKey, slug, owner).then((data) => {
        labels = data.filter(Boolean);
    });
}
</script>

<Dropdown>
  Label: {metricLabel || auto}

  <svelte:fragment slot="dropdown">
    <Search class="search-Eenyns mrg-s mrg--b" placeholder="Search..." on:input={onInput} />

    <div class="column">
      <VirtualList itemHeight={32} renderAmount={20} maxFluidHeight={150} items={filtered} let:item>
        <button class="btn-ghost" on:click={() => onOptionSelect(item)}>{item}</button>
      </VirtualList>
    </div>
  </svelte:fragment>
</Dropdown>

<style>
  :global(.search-Eenyns) {
    width: 230px;
  }

  div {
    height: 150px;
    width: 230px;
  }
</style>
