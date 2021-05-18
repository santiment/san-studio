<script lang="ts">
  export let isMetricTab = true
</script>

<div class="tabs row txt-m">
  <div
    class:active={isMetricTab}
    class="tab btn"
    on:click={() => (isMetricTab = true)}>
    Metrics
  </div>
  <div
    class:active={!isMetricTab}
    class="tab btn"
    on:click={() => (isMetricTab = false)}>
    Insights
  </div>
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
