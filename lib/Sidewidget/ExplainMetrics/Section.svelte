<script>
  export let title
  export let loading = false
</script>

<h4 class="mrg-xl mrg--t">{title}</h4>
<p class="mrg-s mrg--t c-waterloo" class:loading>
  <slot />
</p>

<style>
  p {
    --loading-color: var(--black);
  }

  p :global(a) {
    --color: var(--green);
    --color-hover: var(--green-hover);
  }
</style>
