<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import Author from 'webkit/ui/Author/svelte'
  import { selectedLayout } from '@/stores/layout'
  import LayoutInfo from '@/Layouts/LayoutInfo.svelte'
  import LayoutCommentsToggle from '@/Sidewidget/LayoutComments/Toggle.svelte'
  import LayoutLikeButton from './LayoutLikeButton.svelte'

  $: layout = $selectedLayout
</script>

{#if layout}
  <div class="layout row v-center mrg-l mrg--r">
    <Author user={layout.user} class="$style.author" />

    <div class="divider" />

    <span class="title body-2">
      {layout.title}
    </span>

    <Tooltip duration={0} openDelay={110}>
      <div slot="trigger" class="btn info mrg-s mrg--l row v-center">
        <Svg id="info" w="16" />
      </div>
      <div slot="tooltip" class="tooltip">
        <LayoutInfo {layout} />
      </div>
    </Tooltip>
  </div>

  <LayoutCommentsToggle {layout} class="mrg-s mrg--r $style.action" />
  <LayoutLikeButton {layout} class="mrg-xxl mrg--r $style.action" />
{:else}
  <div class="img mrg-m mrg--r row hv-center">
    <Svg id="user" w="16" class="$style.svg" />
  </div>
  Unsaved layout
{/if}

<style>
  .layout {
    overflow: hidden;
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
    min-width: fit-content;
  }
  .author :global(span) {
    max-width: 140px;
  }

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .action {
    background: var(--white) !important;
    --color: var(--waterloo);
    --color-hover: var(--green);
    --fill-hover: var(--waterloo);
  }
  .action.voted {
    --fill-hover: var(--green-hover);
  }

  .img {
    fill: var(--waterloo);
    background: var(--porcelain);
    border-radius: 50%;
    overflow: hidden;
    width: 32px;
    height: 32px;
    min-width: 32px;
  }
</style>
