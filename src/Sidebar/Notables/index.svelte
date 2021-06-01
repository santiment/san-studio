<script lang="ts">
  import Svg from 'webkit/ui/Icon.svelte'
  import Item from './Item.svelte'
  import Category from '../Category.svelte'
  import { queryRawSignal, queryProjectNotables } from '@/api/signals'
  import { studio } from '@/stores/studio'
  import { NotableSignal } from '@/metrics/_notables'
  import { SelectorType } from '@/metrics/selector/types'
  import { checkIsFilterMatch } from '@/metrics/selector/utils'
  import { debounced } from '@/ChartWidget/utils'

  export let searchTerm = ''
  export let isFiltering = false
  export let onItemEnter

  let signals = []

  $: settings = getVariables($studio)
  // $: queryProjectNotables(settings).then((res) => (signals = res))
  $: getRawSignals(settings)
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
  // getRawSignals($studio)

  const getRawSignals = debounced(({ slug, from, to }) => {
    queryRawSignal(slug, 'utc_now-4d', 'utc_now').then((res) => (signals = res))
  })

  function getNotableMetrics(signals, searchTerm) {
    return signals
      .map((key) => {
        const signal = NotableSignal[key]

        if (!signal) return
        if (searchTerm && !checkIsFilterMatch(searchTerm, signal.metric)) return

        return {
          key: signal.key,
          metric: signal.metric,
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
