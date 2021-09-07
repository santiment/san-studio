<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import { showNewLayoutDialog } from './NewLayoutDialog.svelte'
  import { showLoadLayoutDialog } from './LoadLayoutDialog.svelte'
</script>

<div class="layout border btn row">
  <div class="action btn">Save as</div>
  <Tooltip on="click" duration={0} align="center" class="$style.tooltip">
    <div class="menu btn" slot="trigger">
      <Svg id="arrow" w="8" h="5" class="$style.arrow" />
    </div>

    <div slot="tooltip">
      <div class="btn btn--ghost" on:click={showLoadLayoutDialog}>Load</div>
      <div class="btn btn--ghost" on:click={showNewLayoutDialog}>New</div>
    </div>
  </Tooltip>
</div>

<style>
  .layout {
    position: relative;
  }

  .action,
  .menu {
    --color-hover: var(--green);
    height: 32px;
    padding: 6px 12px;
  }

  .menu {
    border-left: 1px solid var(--porcelain);
    border-radius: 0;
    --color: var(--waterloo);
  }

  .arrow {
    transform: rotate(180deg);
  }

  .tooltip {
    left: 0px !important;
    width: 200px;
    padding: 8px;
  }
</style>
