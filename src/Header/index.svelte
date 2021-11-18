<script lang="ts">
  import LayoutActions from '@/Layouts/index.svelte'
  import Layout from './Layout.svelte'
</script>

<div class="border header panel row v-center">
  <Layout />

  <LayoutActions />

  <div class="copy btn btn-1 btn--green">Copy</div>
  <div class="mapview btn border">Mapview</div>
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

  .btn {
    margin-left: 8px;
  }

  .mapview {
    padding: 5px 20px;
    --color-hover: var(--green);
  }

  .copy {
    padding: 6px 14px;
  }
</style>
