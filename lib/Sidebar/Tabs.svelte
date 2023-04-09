<script>export let tab;
export let tabs;</script>

<div class="tabs row txt-m">
  {#each tabs as id}
    <div class="tab btn" class:active={tab === id} on:click={() => (tab = id)}>
      {id}
    </div>
  {/each}
</div>

<style>
  .tabs {
    color: var(--casper);
  }

  .tab {
    padding: 0 0 8px;
    flex: 1;
    text-align: center;
    border-bottom: 2px solid var(--porcelain);
    border-radius: 0;
    --color-hover: var(--green);
  }
  .active {
    --color: var(--black);
    border-color: var(--green);
    font-weight: 600;
  }
</style>
