<script lang="ts">import { queryLayout } from './../../../lib/api/layouts';
import { selectedLayout } from './../../../lib/stores/layout';
import HoverItem from './HoverItem.svelte';
import Item from '../Item.svelte';
export let item;

$: isActive = $selectedLayout && +item.id === +($selectedLayout === null || $selectedLayout === void 0 ? void 0 : $selectedLayout.id);

function onClick() {
  queryLayout(item.id).then(window.onLayoutSelect);
}</script>

<Item {item} {HoverItem} active={isActive} on:click={onClick} class="item-aDsWPO">
  {item.title}
</Item>

<style>
  :global(.item-aDsWPO) {
    --color-active-hover: var(--green) !important;
  }
</style>
