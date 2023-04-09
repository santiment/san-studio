<script>import { mapview } from './../stores/mapview';
export let isOpened;
export let isLocked;
export let isPeeked;
let leaving;

function onEnter() {
  isPeeked = true;
  window.clearTimeout(leaving);
  leaving = undefined;
}

function onLeave() {
  isPeeked = false;
  leaving = window.setTimeout(() => leaving = undefined, 200);
}</script>

{#if !(isLocked || $mapview)}
  <div class="filler" />
{/if}

<aside
  class="row"
  class:leaving
  class:locked={isLocked || $mapview}
  class:opened={isOpened}
  on:mouseenter={onEnter}
  on:mouseleave={onLeave}
>
  <slot name="left" />
  <div class="content column">
    <slot />
  </div>
</aside>

<style>
  .filler {
    width: 32px;
  }

  aside {
    background: var(--white);
    z-index: 25;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 32px;
  }

  .content {
    position: sticky;
    top: 0;
    height: 100vh;
    flex: 1;
    min-width: 259px;
    transform: translate(-263px);
    background: var(--white);
    border-right: 1px solid var(--porcelain);
  }

  .opened .content,
  .locked .content {
    transform: translate(0, 0);
    transition: transform 250ms ease-out;
  }

  .locked {
    width: auto;
    position: sticky;
  }
  .locked .content {
    transition: none;
  }

  .locked > :global(.nav) {
    margin-top: -65px;
  }

  .leaving .content {
    transition: transform 200ms;
  }

  /* Used to overlay the scrollbar */
  .content::after {
    content: '';
    display: block;
    width: 12px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: -1px;
  }
</style>
