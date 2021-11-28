<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import Svg from 'webkit/ui/Svg.svelte'
  import Author from 'webkit/ui/Author/svelte'
  import { selectedLayout } from '@/stores/layout'
  import LayoutInfo from '@/Layouts/LayoutInfo.svelte'
  import LayoutCommentsToggle from '@/Sidewidget/LayoutComments/Toggle.svelte'

  $: layout = $selectedLayout
</script>

{#if layout}
  <div class="layout row v-center mrg-l mrg--r">
    <Author user={layout.user} class="$style.author" />

    <div class="divider" />

    <span class="title body-2">
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

  <LayoutCommentsToggle {layout} />
{/if}

<style>
  .layout {
    max-width: 50%;
  }

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

  .author {
    overflow: hidden;
    max-width: 200px;
  }

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
