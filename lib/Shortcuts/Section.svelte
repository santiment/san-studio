<script>let className = '';
export { className as class };
export let title;
export let shortcuts;
</script>

<div class="body-2 txt-m">{title}</div>
<div class={className}>
  {#each shortcuts as { keys, description }}
    <div class="row justify v-center">
      <div class="desc">
        {description}
      </div>
      <div class="keys body-2">
        {#each keys as key, i}
          {i !== 0 ? ' + ' : ''}{key}
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .keys {
    color: var(--black);
    padding-left: 24px;
    min-width: 135px;
  }

  .desc {
    color: var(--waterloo);
    min-width: 210px;
  }

  .row {
    padding: 2px 0;
  }
</style>
