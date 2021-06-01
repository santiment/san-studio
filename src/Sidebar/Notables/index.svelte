<script lang="ts">
  import Svg from 'webkit/ui/Icon.svelte'
  import Item from './Item.svelte'
  import Category from '../Category.svelte'
  import { queryProjectNotables } from '@/api/signals'
  import { studio } from '@/stores/studio'
  import { NotableMetric } from '@/metrics/_notables'
  import { SelectorType } from '@/metrics/selector/types'
  import { checkIsFilterMatch } from '@/metrics/selector/utils'

  export let searchTerm = ''
  export let isFiltering = false
  export let onItemEnter

  let signals = {}

  $: settings = getVariables($studio)
  $: queryProjectNotables(settings).then((res) => (signals = res))
  $: notables = getNotableMetrics(signals, searchTerm)

  const getVariables = ({ slug, from, to }) => ({
    slug,
    from,
    to,
    interval: '2d',
  })

  // const getVariables = ({ slug }) => ({
  //     slug,
  //     from: 'utc_now-1w',
  //     to: 'utc_now',
  //     interval: '1h',
  // })
  //

  function getNotableMetrics(signals, searchTerm) {
    return Object.keys(signals)
      .map((key) => {
        const metric = NotableMetric[key]
        if (!metric) return
        if (searchTerm && !checkIsFilterMatch(searchTerm, metric)) return

        return {
          key,
          metric: NotableMetric[key],
          signals: signals[key],
          selectorType: SelectorType.Notable,
        }
      })
      .filter(Boolean)
  }
</script>

{#if !isFiltering || (isFiltering && notables.length)}
  <Category category="Notables" {isFiltering} isOpened>
    <Svg
      slot="pre-title"
      id="star-filled"
      w="16"
      class="mrg-s mrg--r $style.star" />

    {#each notables as notable}
      <Item {notable} {settings} />
    {/each}
  </Category>
{/if}

<style>
  .star {
    fill: var(--orange);
  }
</style>
