<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Svg from 'webkit/ui/Svg.svelte'
  import { currentUser } from '@/stores/user'
  import { queryLayout } from '@/api/layouts'
  import { createUserLayout } from '@/api/layouts/mutate'
  import LayoutInfo from '@/Layouts/LayoutInfo.svelte'
  import { showNewLayoutDialog, Mode } from '@/Layouts/NewLayoutDialog.svelte'
  import HoverItem from '../HoverItem.svelte'

  export let item: any
  export let node: HTMLElement
  export let hoverNode: HTMLElement

  let timer
  let layout = {} as SAN.Layout
  let destroyed = false

  $: isAuthor =
    $currentUser && layout.user && +layout.user.id === +$currentUser.id

  const showPreview = () =>
    queryLayout(item.id).then((data) => destroyed || (layout = data))

  function startPreviewTimer() {
    window.clearTimeout(timer)
    timer = window.setTimeout(showPreview, 150)
  }
  function closePreview() {
    destroyed = true
    window.clearTimeout(timer)
  }

  function onEditClick() {
    showNewLayoutDialog({
      layout,
      title: 'Edit Chart Layout',
      mode: Mode.Edit,
    })
  }

  function onAddClick() {
    if (!$currentUser) return window.showLoginPrompt?.()

    const { title, description, project, metrics, options } = layout
    createUserLayout({
      title,
      description,
      metrics,
      options,
      projectId: project.projectId,
    })
  }

  onMount(startPreviewTimer)
  onDestroy(closePreview)
</script>

<HoverItem {node} {hoverNode}>
  {item.title}

  <svelte:fragment slot="right">
    {#if isAuthor}
      <div class="btn" on:click|stopPropagation={onEditClick}>
        <Svg id="pencil" w="16" />
      </div>
    {:else if layout.id}
      <div class="btn" on:click|stopPropagation={onAddClick}>
        <Svg id="plus-circle" w="16" />
      </div>
    {/if}

    {#if layout.title}
      <div class="preview border">
        <LayoutInfo {layout} />
      </div>
    {/if}
  </svelte:fragment>
</HoverItem>

<style>
  .preview {
    position: absolute;
    left: 100%;
    min-width: 350px;
    max-width: 400px;
    cursor: initial;
    color: var(--black);
    margin-left: 2px;
    padding: 20px;
  }
  .preview::before {
    content: '';
    position: absolute;
    left: -5px;
    width: 5px;
    top: 0;
    bottom: 0;
  }

  .btn {
    --bg: none;
    --fill: var(--waterloo);
    --fill-hover: var(--green);
    margin-left: 12px;
  }
</style>
