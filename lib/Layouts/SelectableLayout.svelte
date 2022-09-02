<script lang="ts">import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { showLayoutInfoDialog } from './LayoutInfoDialog.svelte';
export let layout;
export let isAuthor = false;
export let closeDialog;
export let onClick;

$: ({
  title,
  isPublic = true,
  project,
  metrics
} = layout);</script>

<div class="layout btn-ghost column h-center" on:click={() => onClick(layout)}>
  <div class="body-2 txt-m mrg-xs mrg--b">
    {title}
  </div>
  <div class="info row v-center">
    {#if isPublic}
      <Svg id="eye" w="14" h="10" class="mrg-s mrg--r eye-zbMDOh" /> Public
    {:else}
      <Svg id="eye-crossed" w="14" h="15" class="mrg-s mrg--r eye-zbMDOh" />
      Private
    {/if}
    ·
    {project.name}
    ·
    {metrics.length} metric(s)
  </div>
  <div
    class="details btn border"
    on:click|stopPropagation={() =>
      showLayoutInfoDialog({
        layout,
        isAuthor,
        closeLoadDialog: closeDialog,
      })}
  >
    See details
  </div>
</div>

<style>
  .layout {
    --color-hover: var(--black);
    position: relative;
    padding: 12px 16px;
  }

  .info {
    color: var(--waterloo);
    fill: var(--casper);
  }

  .details {
    display: none;
    position: absolute;
    right: 24px;
    padding: 5px 20px;
    --bg: var(--white);
    --bg-hover: var(--white);
    --color: var(--waterloo);
    --color-hover: var(--green);
  }

  :global(.eye-zbMDOh) {
    min-width: 14px;
  }

  .layout:hover .details {
    display: block;
  }
</style>
