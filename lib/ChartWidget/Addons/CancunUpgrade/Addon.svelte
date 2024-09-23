<script>import { onDestroy, onMount } from 'svelte';
import { getChart } from './../../../Chart/context';
import { DATES } from './dates';
import { getDateFormats } from 'san-webkit/lib/utils/dates';
const chart = getChart();
const ID = 'cancun_upgrade';
let items = [];
let bottom = 0;
chart.plotManager.set(ID, (chart, scale) => {
    var _a;
    bottom = chart.padding.bottom;
    const firstPoint = chart.points[0];
    if (!firstPoint) {
        items = [];
        return;
    }
    const firstDate = firstPoint.value;
    const lastDate = (_a = chart.points[chart.points.length - 1]) === null || _a === void 0 ? void 0 : _a.value;
    if (!lastDate) {
        items = [];
        return;
    }
    const dates = DATES.filter((date) => +date > firstDate && +date < lastDate);
    const yFactor = chart.width / (lastDate - firstDate);
    const scaler = (value) => (lastDate - value) * yFactor;
    items = dates.map((item) => {
        const { DD, MMM, YY } = getDateFormats(item);
        return {
            date: `${DD} ${MMM}, ${YY}`,
            left: chart.width - scaler(+item),
        };
    });
});
onMount(() => {
    chart.redraw();
});
onDestroy(() => {
    chart.plotManager.delete(ID);
});
</script>

{#each items as item}
  <div
    class="expl-tooltip row hv-center"
    style="bottom:{bottom}px;left:{item.left}px"
    aria-label="Cancun Upgrade: {item.date}"
  >
    C
  </div>
{/each}

<style>
  div {
    position: absolute;
    transform: translateX(-50%);
    --expl-left: -70px;
    background: var(--athens);
    border-radius: 50%;
    width: 22px;
    height: 22px;
    cursor: pointer;
    z-index: 5;
  }
</style>
