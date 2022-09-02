<script>
  export let cursored = false
</script>

<div class="suggestion btn row v-center nowrap mrg-s mrg--t" class:cursored on:click>
  <slot />
</div>

<style>
  .suggestion {
    padding: 8px;
    --bg-hover: var(--athens);
  }

  .cursored {
    background: var(--porcelain);
  }
</style>
