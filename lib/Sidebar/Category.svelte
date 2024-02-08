<script>import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { MetricCategory } from './../metrics/graph';
import Item from './Item.svelte';
let className = '';
export { className as class };
export let category;
export let items = [];
export let HoverItem = undefined;
export let VisibleGroup = {};
export let isFiltering;
export let isOpened = false;
export let onItemClick = undefined;
export let arrowClass = 'mrg-a';
let visible = isOpened || category === MetricCategory.Financial || category === MetricCategory.OnChain;
$: GroupIndex = prepareGroups(items);
function prepareGroups(items) {
    const GroupIndex = {};
    let _group;
    for (let i = 0; i < items.length; i++) {
        const { group } = items[i];
        if (_group === group)
            continue;
        _group = group;
        GroupIndex[i] = true;
    }
    return GroupIndex;
}
const toggleGroup = ({ group }) => group && (VisibleGroup[group] = !VisibleGroup[group]);
</script>

{#if items.length || $$slots.default}
  <div class="category {className}" on:mouseleave>
    <h3 on:click={() => (visible = !visible)} class="row v-center" class:hidden={!visible}>
      <slot name="pre-title" />
      {category}

      <slot name="post-title" />
      <Svg id="arrow" w="8" h="5" class="arrow-o0gbIu mrg--l {arrowClass}" />
    </h3>

    {#if visible || isFiltering}
      <div class="items mrg-m mrg--t">
        {#if $$slots.default}
          <slot />
        {:else}
          {#each items as metric, i (metric.key || metric.id)}
            {#if GroupIndex[i]}
              <h4
                on:click={() => toggleGroup(metric)}
                class="row justify v-center"
                class:hidden={!VisibleGroup[metric.group]}
              >
                {metric.group}
                <Svg id="arrow" w="8" h="5" class="arrow-o0gbIu" />
              </h4>
            {/if}
            {#if !metric.group || isFiltering || VisibleGroup[metric.group]}
              <Item
                {HoverItem}
                item={metric}
                on:click={(e) => onItemClick && onItemClick(e, metric)}
              />
            {/if}
          {/each}
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  .category {
    padding: 22px 8px 16px;
    border-bottom: 1px solid var(--porcelain);
    user-select: none;
  }

  h3 {
    font-weight: 600;
    padding: 0 8px;
  }
  .hidden :global(.arrow-o0gbIu) {
    transform: rotate(180deg);
  }

  h4 {
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: var(--waterloo);
    fill: var(--waterloo);
    margin: 14px 8px 8px;
  }

  h3,
  h4 {
    cursor: pointer;
  }

  h3:hover,
  h4:hover {
    fill: var(--green);
  }
</style>
