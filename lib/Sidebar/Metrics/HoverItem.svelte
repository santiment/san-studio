<script>import { tick } from 'svelte';
import { getHistoryContext } from 'san-webkit/lib/ui/history';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { favoriteMetrics } from './../../stores/favoriteMetrics';
import { globals } from './../../stores/globals';
import { getAdapterController } from './../../adapter/context';
import HoverItem from './../../Sidebar/HoverItem.svelte';
import ItemLabel from '../ItemLabel.svelte';
import ItemDescription from '../ItemDescription.svelte';
const History = getHistoryContext();
const {
  onAnonFavoriteClick
} = getAdapterController();
export let item;
export let node;
export let hoverNode;
let active = false;

$: isFavorited = item && $favoriteMetrics.has(item.key);

function onFavoriteClick(e) {
  e.stopImmediatePropagation();

  if ($globals.isLoggedIn) {
    const {
      key
    } = item;
    favoriteMetrics.toggle(key);
    History.add('Toggle favorite', () => favoriteMetrics.toggle(key));
    const {
      offsetTop
    } = node;
    const category = node.closest('.category');
    return tick().then(() => {
      var _a;

      const container = category.parentNode;

      if (container.scrollTop < ((_a = container.firstElementChild) === null || _a === void 0 ? void 0 : _a.offsetHeight)) {
        container.scrollTop += node.offsetTop - offsetTop;
      }
    });
  }

  if (onAnonFavoriteClick) onAnonFavoriteClick();
}</script>

<HoverItem {node} {hoverNode}>
  <ItemLabel {item} bind:active />

  <svelte:fragment slot="right">
    <ItemDescription {item} class="icon-k7HJJA" />

    {#if item.selectorType === undefined}
      <Svg
        id="star{isFavorited ? '-filled' : ''}"
        class="icon-k7HJJA star-oMiRDR mrg-m mrg--l {isFavorited ? 'favorited-LtbxbS' : ''}"
        on:click={onFavoriteClick}
      />
    {/if}
  </svelte:fragment>
</HoverItem>

<style>
  :global(.icon-k7HJJA) {
    width: 16px;
    height: 16px;
    fill: var(--waterloo);
  }

  :global(.star-oMiRDR:hover) {
    fill: var(--orange);
  }

  :global(.favorited-LtbxbS) {
    fill: var(--orange);
  }
  :global(.favorited-LtbxbS:hover) {
    fill: var(--orange-hover);
  }
</style>
