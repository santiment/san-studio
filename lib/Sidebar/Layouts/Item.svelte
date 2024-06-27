<script>import { queryLayout } from './../../api/layouts';
import { selectedLayout } from './../../stores/layout';
import HoverItem from './HoverItem.svelte';
import Item from '../Item.svelte';
export let item;
$: isActive = $selectedLayout && +item.id === +($selectedLayout === null || $selectedLayout === void 0 ? void 0 : $selectedLayout.id);
function onClick() {
    queryLayout(item.id).then(window.onLayoutSelect);
}
</script>

<Item {item} {HoverItem} active={isActive} on:click={onClick} class="item-xdRBHP">
  {item.title}
</Item>

<style>
  :global(.item-xdRBHP) {
    --color-active-hover: var(--green) !important;
  }
</style>
