<script>import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { SidewidgetType, getSidewidget } from './../stores/widgets';
import LayoutComment from './LayoutComments/index.svelte';
import ExplainMetrics from './ExplainMetrics/index.svelte';
const Sidewidget = getSidewidget();
const closeSidewidget = () => ($Sidewidget = null);
</script>

<div class="sidewidget border mrg-l mrg--l column">
  <div class="toggle">
    <Svg id="sidebar" w="12" h="10" class="btn icon-8qigu4" on:click={closeSidewidget} />
  </div>

  {#if $Sidewidget === SidewidgetType.LAYOUT_COMMENTS}
    <LayoutComment {closeSidewidget} />
  {:else if $Sidewidget === SidewidgetType.EXPLAIN_METRICS}
    <ExplainMetrics />
  {:else}
    <div class="studio-sidewidget row" />
  {/if}
</div>

<style>
  .sidewidget {
    flex: 1 0 355px;
    max-width: 355px;
    position: sticky;
    top: 77px;
    max-height: calc(100vh - 99px);
    padding: 20px;
  }

  .toggle {
    position: absolute;
    top: 15px;
    left: -13px;
    width: 13px;
    border: 1px solid var(--porcelain);
    border-right: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  :global(.icon-8qigu4) {
    --fill: var(--waterloo);
    --fill-hover: var(--green);
    --bg: var(--white);
    padding: 10px 7px;
    transform: rotate(180deg);
  }

  .studio-sidewidget {
    flex: 1;
    max-height: 100%;
  }
</style>
