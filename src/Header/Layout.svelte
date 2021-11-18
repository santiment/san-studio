<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import Svg from 'webkit/ui/Svg.svelte'
  import LayoutInfo from '@/Layouts/LayoutInfo.svelte'
  import LayoutAuthor from '@/Layouts/LayoutAuthor.svelte'
  import { selectedLayout } from '@/stores/layout'
  import { SidewidgetType, getSidewidget } from '@/stores/widgets'

  const Sidewidget = getSidewidget()

  $: layout = $selectedLayout
</script>

{#if layout}
  <div class="row v-center mrg-l mrg--r">
    <LayoutAuthor user={layout.user} />

    <div class="divider" />

    <span class="body-2">
      {layout.title}
    </span>

    <Tooltip on="click" duration={0}>
      <div slot="trigger" class="btn info mrg-s mrg--l row v-center">
        <Svg id="info" w="16" />
      </div>
      <div slot="tooltip" class="tooltip">
        <LayoutInfo {layout} />
      </div>
    </Tooltip>
  </div>

  <div
    class="action btn border txt-m"
    class:active={$Sidewidget === SidewidgetType.LAYOUT_COMMENTS}
    on:click={() => Sidewidget.set(SidewidgetType.LAYOUT_COMMENTS)}>
    <Svg id="comment" w="16" h="14" class="mrg-xs mrg--r" />
    0
  </div>
{/if}

<style>
  .info {
    --fill: var(--casper);
    --fill-hover: var(--green);
  }

  .tooltip {
    padding: 24px;
    width: 484px;
  }

  .divider {
    height: 32px;
    width: 1px;
    background: var(--mystic);
    margin: 0 12px;
  }

  .action {
    padding: 5px 12px;
    border-radius: 20px;
    --color: var(--waterloo);
    --border-hover: var(--green);
  }

  .active {
    --color: var(--green);
    --border: var(--green);
    --color-hover: var(--green-hover);
    --border-hover: var(--green-hover);
  }
</style>
