<script>var _a;
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { selectedItems } from './../stores/selector';
import { getSidewidget } from './../stores/widgets';
import { getAdapterController } from './../adapter/context';
const { InsightsContextStore } = getAdapterController();
const Sidewidget = getSidewidget();
export let item;
export let active = false;
$: active =
    $selectedItems.has(item) ||
        ((_a = item.checkIsActive) === null || _a === void 0 ? void 0 : _a.call(item, $Sidewidget)) ||
        item === $InsightsContextStore.insight;
$: removeClass = active ? 'remove-UH8s71' : '';
</script>

<Svg id="plus" w="9" class="plus-hv0Ix4 mrg-s mrg--r {removeClass}" />
{item.label}

<style>
  :global(.plus-hv0Ix4) {
    background: var(--bg, var(--porcelain));
    fill: var(--fill, var(--waterloo));
    padding: 3.5px;
    border-radius: 50%;
    min-width: 9px;
    min-height: 9px;
  }

  :global(.remove-UH8s71) {
    transform: rotate(45deg);
  }
</style>
