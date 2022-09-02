<script lang="ts">var _a;

import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { selectedItems } from './../../lib/stores/selector';
import { getSidewidget } from './../../lib/stores/widgets';
import { getAdapterController } from './../../lib/adapter/context';
const {
  InsightsContextStore
} = getAdapterController();
const Sidewidget = getSidewidget();
export let item;
export let active = false;

$: active = $selectedItems.has(item) || ((_a = item.checkIsActive) === null || _a === void 0 ? void 0 : _a.call(item, $Sidewidget)) || item === $InsightsContextStore.insight;

$: removeClass = active ? 'remove-vcI1tz' : '';</script>

<Svg id="plus" w="9" class="plus-UEtCMP mrg-s mrg--r {removeClass}" />
{item.label}

<style>
  :global(.plus-UEtCMP) {
    background: var(--bg, var(--porcelain));
    fill: var(--fill, var(--waterloo));
    padding: 3.5px;
    border-radius: 50%;
    min-width: 9px;
    min-height: 9px;
  }

  :global(.remove-vcI1tz) {
    transform: rotate(45deg);
  }
</style>
