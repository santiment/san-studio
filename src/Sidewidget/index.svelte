<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'
  import { currentUser } from '@/stores/user'
  import { selectedLayout } from '@/stores/layout'
  import { SidewidgetType, getSidewidget } from '@/stores/widgets'
  import { CommentsType } from '@/api/comments'
  import { updateLayoutCommentsCountCache } from '@/api/layouts/comments'
  import LayoutComment from './LayoutComments/index.svelte'

  const Sidewidget = getSidewidget()

  function onNewComment(layout: SAN.Layout, comments: SAN.Comment[]) {
    updateLayoutCommentsCountCache(layout.id, comments.length)
  }
</script>

<div class="sidewidget border mrg-l mrg--l column">
  <div class="toggle">
    <Svg
      id="sidebar"
      w="12"
      h="10"
      class="btn $style.icon"
      on:click={() => ($Sidewidget = null)} />
  </div>

  {#if $Sidewidget === SidewidgetType.LAYOUT_COMMENTS}
    {#if $selectedLayout}
      <LayoutComment
        type={CommentsType.Layout}
        commentsFor={$selectedLayout}
        currentUser={$currentUser}
        {onNewComment} />
    {/if}
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

  .icon {
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
