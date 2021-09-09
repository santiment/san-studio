<script lang="ts">
  import type { Layout } from '@/api/layouts'
  import Svg from 'webkit/ui/Svg.svelte'
  import { Metric } from '@/metrics'

  export let layout: Pick<Layout, 'project' | 'user' | 'metrics'>

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
<a class="value row v-center" href="/profile/{user.id}">
  <div class="img mrg-s mrg--r row hv-center">
    {#if user.avatarUrl}
      <img alt="Avatar" src={user.avatarUrl} />
    {:else}
      <Svg id="user" w="16" />
    {/if}
  </div>
  <span>
    {user.username || user.email}
  </span>
</a>

<style>
  .label {
    color: var(--waterloo);
    fill: var(--waterloo);
    margin-bottom: 8px;
  }

  .value {
    margin-left: 20px;
  }

  .img,
  img {
    width: 32px;
    height: 32px;
    max-width: 32px;
    max-height: 32px;
    min-width: 32px;
  }

  .img {
    fill: var(--waterloo);
    background: var(--porcelain);
    border-radius: 50%;
    overflow: hidden;
  }

  a {
    color: var(--black);
  }
  a:hover {
    color: var(--green);
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
