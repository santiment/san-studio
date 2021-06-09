<script context="module">
  export const SHORTCUTS_SIDEWIDGET = 'SHORTCUTS_SIDEWIDGET'
</script>

<script lang="ts">
  import { isMac } from 'webkit/utils/os'

  const CMD = 'CMD'

  function newShortcut(keys: string[], description: string) {
    return { keys, description }
  }

  const SHORTCUTS = [
    newShortcut(
      [CMD, 'Click'],
      'Hover over any metric on the left-side menu to add it to the first chart',
    ),

    newShortcut(
      [CMD, 'Shift', 'Click'],
      'Hover over any metric on the left-side menu to create a new chart with this metric selected',
    ),

    newShortcut(
      [CMD, 'Click'],
      'For Holder Distribution metrics - select only a single group of holders (deselect all others)',
    ),

    newShortcut([CMD, '\\'], 'Collapse the tree of metrics (left-side menu)'),

    newShortcut([CMD, 'M'], 'Open Mapview'),

    newShortcut([CMD, 'L'], 'Open Chart layout explorer'),

    newShortcut([CMD, 'S'], 'Save Chart layout'),

    newShortcut(['L'], 'Start drawing'),
  ]
</script>

<div class="shortcuts">
  <div class="body-1 txt-b">Keyboard Shortcuts</div>

  {#each SHORTCUTS as { keys, description }}
    <div class="txt-b row v-center mrg-xl mrg--t">
      {#each keys as key, i}
        {#if i !== 0}
          <div class="plus mrg-s mrg--l mrg--r">+</div>
        {/if}
        <div class="border" class:cmd={isMac && key === CMD}>
          {#if i === 0 && key === CMD}
            {isMac ? '⌘' : 'Ctrl'}
          {:else}
            {key}
          {/if}
        </div>
      {/each}
    </div>
    <div class="desc txt-m mrg-s mrg--t">{description}</div>
  {/each}
</div>

<style>
  .shortcuts {
    overflow: auto;
    flex: 1;
    margin: -20px;
    padding: 20px;
  }

  .border {
    padding: 8px 12px;
  }

  .cmd {
    font-size: 18px;
  }

  .desc {
    color: var(--waterloo);
  }
</style>
