<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import Svg from 'webkit/ui/Svg.svelte'
  import LayoutActions from '@/Layouts/index.svelte'
  import LayoutInfo from '@/Layouts/LayoutInfo.svelte'
  import { selectedLayout } from '@/stores/layout'

  $: layout = $selectedLayout
</script>

<div class="border header panel row v-center">
  {#if layout}
    <Tooltip on="click" duration={0}>
      <div slot="trigger" class="row v-center mrg-l mrg--r">
        <div class="btn info mrg-s mrg--r row v-center">
          <Svg id="info" w="16" />
        </div>
        {layout.title}
      </div>

      <div slot="tooltip" class="tooltip">
        <LayoutInfo {layout} />
      </div>
    </Tooltip>
  {/if}
  <LayoutActions />
</div>

<style>
  .panel {
    padding: 14px 16px;
  }

  .header {
    background: var(--white);
    position: sticky;
    top: 0;
    z-index: 24;
    margin: 0 0 13px;
    transition: transform 0.3s ease-out;
    min-height: 64px;
  }

  .info {
    --fill: var(--casper);
    --fill-hover: var(--green);
  }

  .tooltip {
    padding: 24px;
    width: 484px;
  }
</style>
