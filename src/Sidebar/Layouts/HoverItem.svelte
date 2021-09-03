<script lang="ts">
  import type { DetailedLayout } from '@/api/layouts'
  import { onMount, onDestroy } from 'svelte'
  import Svg from 'webkit/ui/Svg.svelte'
  import { Metric } from '@/metrics'
  import { queryLayout } from '@/api/layouts'
  import HoverItem from '../HoverItem.svelte'

  export let item: any
  export let node: HTMLElement
  export let hoverNode: HTMLElement

  let timer
  let layout = {} as DetailedLayout
  let destroyed = false

  $: ({ title, project, user, metrics } = layout)

  const listMetrics = (metricKey: string) => Metric[metricKey]?.label

  const showPreview = () =>
    queryLayout(item.id).then((data) => destroyed || (layout = data))

  function startPreviewTimer() {
    window.clearTimeout(timer)
    timer = window.setTimeout(showPreview, 150)
  }
  function closePreview() {
    destroyed = true
    window.clearTimeout(timer)
  }

  onMount(startPreviewTimer)
  onDestroy(closePreview)
</script>

<HoverItem {node} {hoverNode}>
  {item.title}

  <svelte:fragment slot="right">
    {#if title}
      <div class="preview border">
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
      </div>
    {/if}
  </svelte:fragment>
</HoverItem>

<style>
  .preview {
    position: absolute;
    left: 100%;
    min-width: 350px;
    max-width: 400px;
    cursor: initial;
    color: var(--black);
    margin-left: 2px;
    padding: 20px;
  }
  .preview::before {
    content: '';
    position: absolute;
    left: -5px;
    width: 5px;
    top: 0;
    bottom: 0;
  }

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