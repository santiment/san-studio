<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Author from 'webkit/ui/Profile/svelte'
  import { Metric } from '@/metrics'

  export let layout: Pick<SAN.Layout, 'project' | 'user' | 'metrics'>

  $: ({ project, user, metrics } = layout)

  const listMetrics = (metricKey: string) => Metric[metricKey]?.label
</script>

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

<Author {user} class="$style.author" />

<style>
  .label {
    color: var(--waterloo);
    fill: var(--waterloo);
    margin-bottom: 8px;
  }

  .value,
  .author {
    margin-left: 20px;
  }

  .value {
    white-space: normal;
  }
</style>
