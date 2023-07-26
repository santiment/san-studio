<script>export let src;
</script>

<div class="chart mrg-l mrg--l">
  <iframe title="Preview" scrolling="no" {src} />
</div>

<style>
  .chart {
    padding: 0 0 0 16px;
    border-left: 1px solid var(--porcelain);
  }

  .chart :global(iframe) {
    outline: none;
    border: 0;
    width: 630px;
    height: calc(100% - 6px);
  }
</style>
