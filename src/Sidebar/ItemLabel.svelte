<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'
  import { selectedItems } from '@/stores/selector'
  import { getSidewidget } from '@/stores/widgets'
  import { getAdapterController } from '@/adapter/context'
  const { InsightsContextStore } = getAdapterController()
  const Sidewidget = getSidewidget()

  export let item: any
  export let active = false

  $: active =
    $selectedItems.has(item) ||
    item.checkIsActive?.($Sidewidget) ||
    item === $InsightsContextStore.insight
  $: removeClass = active ? '$style.remove' : ''
</script>

<Svg id="plus" w="9" class="$style.plus mrg-s mrg--r {removeClass}" />
{item.label}

<style>
  .plus {
    background: var(--bg, var(--porcelain));
    fill: var(--fill, var(--waterloo));
    padding: 3.5px;
    border-radius: 50%;
    min-width: 9px;
    min-height: 9px;
  }

  .remove {
    transform: rotate(45deg);
  }
</style>
