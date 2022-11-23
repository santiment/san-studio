<script lang="ts">import { getTodaysEnd } from 'san-webkit/lib/utils/dates';
import { studio } from './../../lib/stores/studio';
import { globals } from './../../lib/stores/globals';
import { getTimeseries } from './../../lib/api/timeseries';
import { themes } from './../../lib/Chart/theme';
import { getMetricNodes } from './../../lib/Chart/nodes';
import Chart from './../../lib/Chart/index.svelte';
import Areas from './../../lib/Chart/Areas.svelte';
const TO = getTodaysEnd();
TO.setDate(TO.getDate() - 30);
const FROM = new Date(TO);
FROM.setDate(TO.getDate() - 30);
const SETTINGS = {
  interval: '1d',
  from: FROM.toISOString(),
  to: TO.toISOString()
};
const metricSettings = {};
export let metrics;
export let colors;
let data = [];

$: ({
  slug
} = $studio);

$: settings = Object.assign({
  slug
}, SETTINGS);

$: fetchData(metrics, settings);

$: theme = themes[+$globals.isNightMode];

$: nodes = getMetricNodes(metrics, {});

let abortFetch;

const onData = newData => data = newData;

const onError = () => {};

function fetchData(metrics, settings) {
  if (abortFetch) abortFetch();
  abortFetch = getTimeseries(metrics, settings, onData, onError);
}</script>

<Chart {data} {colors} {theme} {metricSettings} categories={nodes}>
  <Areas />
</Chart>
