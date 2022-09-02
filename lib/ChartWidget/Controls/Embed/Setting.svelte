<script context="module">
  export const PRO = 'PRO'
  export const PRO_PLUS = 'PRO+'
</script>

<script lang="ts">
  import Toggle from 'san-webkit/lib/ui/Toggle.svelte'
  export let isActive = false
  export let disabled = false
  export let access = PRO
  export let disabledToggle = false
</script>

<div class="row btn mrg-m mrg--b justify" class:disabled on:click={() => (isActive = !isActive)}>
  <slot />

  {#if disabled && !disabledToggle}
    <a href="/pricing" class="label" class:plus={access === PRO_PLUS}>{access}</a>
  {:else}
    <Toggle {isActive} {disabled} />
  {/if}
</div>

<style>
  .label {
    font-size: 12px;
    color: #fff;
    background: var(--orange);
    padding: 0 7px;
    border-radius: 4px;
    margin-left: 12px;
  }
  .label:hover {
    background: var(--orange-hover);
  }

  .disabled {
    background: none !important;
  }

  a {
    pointer-events: all;
  }

  .plus {
    background: var(--yellow);
  }
  .plus:hover {
    background: var(--yellow-hover);
  }
</style>
