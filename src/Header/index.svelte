<script lang="ts">
  import LayoutActions from '@/Layouts/index.svelte'
</script>

<div class="border header panel row">
  <LayoutActions />
</div>

<style>
  .panel {
    padding: 14px 16px;
  }

  .header {
    background: var(--white);
    position: sticky;
    top: 0;
    z-index: 24;
    margin: 0 0 13px;
    transition: transform 0.3s ease-out;
    min-height: 64px;
  }
</style>
