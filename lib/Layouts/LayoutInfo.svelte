<script lang="ts">import Svg from 'san-webkit/lib/ui/Svg/svelte';
import Author from 'san-webkit/lib/ui/Profile/svelte';
import { Metric } from './../../lib/metrics';
export let layout;

$: ({
  project,
  user,
  metrics
} = layout);

const listMetrics = metricKey => {
  var _a;

  return (_a = Metric[metricKey]) === null || _a === void 0 ? void 0 : _a.label;
};</script>

<div class="label txt-m row v-center">
  <Svg id="asset-small" w="12" class="mrg-s mrg--r" />
  Asset
</div>
<div class="value mrg-m mrg--b">{project.name}</div>

<div class="label txt-m row v-center">
  <Svg id="bars" w="12" class="mrg-s mrg--r" />
  Metrics
</div>
<div class="value mrg-m mrg--b">
  {metrics.map(listMetrics).filter(Boolean).join(', ')}
</div>

<div class="label txt-m row v-center">
  <Svg id="user" w="16" class="mrg-s mrg--r" />
  Author
</div>

<Author {user} class="author-HPbuWu" />

<style>
  .label {
    color: var(--waterloo);
    fill: var(--waterloo);
    margin-bottom: 8px;
  }

  .value,
  :global(.author-HPbuWu) {
    margin-left: 20px;
  }

  .value {
    white-space: normal;
  }
</style>
