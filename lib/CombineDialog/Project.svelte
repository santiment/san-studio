<script lang="ts">
  import Svg from 'san-webkit/lib/ui/Svg/svelte'

  export let project

  let error = false

  $: ({ name, ticker, slug } = project)
</script>

<div class="img row hv-center mrg-s mrg--r" class:error>
  {#if error}
    <Svg id="asset-small" w="12" class="$style.placeholder" />
  {:else}
    <img
      alt="Project"
      loading="lazy"
      on:error={() => (error = true)}
      src="https://production-sanbase-images.s3.amazonaws.com/uploads/logo64_{slug}.png"
    />
  {/if}
</div>

{name} ({ticker})

<style>
  .img,
  img {
    height: 16px;
    width: 16px;
    min-width: 16px;
  }
</style>
