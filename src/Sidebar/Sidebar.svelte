<script lang="ts">
  import { mapview } from '@/stores/mapview'

  export let isOpened
  export let isLocked
  export let isPeeked

  let leaving

  function onEnter() {
    isPeeked = true
    window.clearTimeout(leaving)
    leaving = undefined
  }

  function onLeave() {
    isPeeked = false
    leaving = window.setTimeout(() => (leaving = undefined), 200)
  }
</script>

<aside
  class:leaving
  class:locked={isLocked || $mapview}
  class:opened={isOpened}
  on:mouseenter={onEnter}
  on:mouseleave={onLeave}>
  <div class="content column">
    <slot />
  </div>
</aside>

<style>
  aside {
    width: 260px;
    min-width: 260px;
    background: var(--white);
    border-right: 1px solid var(--porcelain);
    z-index: 22;
    position: absolute;
    transform: translate(-248px);
    top: 0;
    bottom: 0;
  }

  .content {
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .opened,
  .locked {
    transform: translate(0, 0);
    transition: transform 250ms ease-out;
  }

  .locked {
    transition: none;
    position: sticky;
    top: 0;
  }

  .leaving {
    transition: transform 200ms;
  }
</style>
