<script lang="ts">
  import { onDestroy } from 'svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import { selectedLayout } from '@/stores/layout'
  import { currentUser } from '@/stores/user'

  export let isEditVisible = false

  let width = 0
  let timer
  let node
  let trigger

  $: node && trigger && trigger.after(node)
  $: layout = $selectedLayout
  $: isAuthor = $currentUser && layout && +layout.user.id === +$currentUser.id

  export function showEdit({ currentTarget }) {
    trigger = currentTarget
    timer = setTimeout(() => (isEditVisible = true), 100)
    width = currentTarget.clientWidth
  }
  export function hideEdit() {
    clearTimeout(timer)
    isEditVisible = false
  }

  function onEditClick() {
    if (!$currentUser) return

    const handler = layout
      ? isAuthor
        ? window.onLayoutEdit
        : window.saveAsNewLayout
      : window.saveLayout

    return handler?.()
  }

  onDestroy(() => clearTimeout(timer))
</script>

{#if isEditVisible}
  <div
    bind:this={node}
    class="edit mrg-s mrg--l"
    style="--width:{width}px"
    on:mouseleave={hideEdit}
    on:click={onEditClick}>
    <div class="btn-3">
      <Svg id="pencil" w="16" />
    </div>
  </div>
{/if}

<style>
  .edit {
    position: relative;
  }
  .edit::before {
    content: '';
    position: absolute;
    width: calc(var(--width) + 40px);
    height: 25px;
    top: 2px;
    right: 0;
    cursor: pointer;
  }
  .btn-3 {
    --color: var(--waterloo);
    z-index: 2;
    position: relative;
  }
</style>
