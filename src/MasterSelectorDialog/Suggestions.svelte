<script>
  import ProjectIcon from 'webkit/ui/ProjectIcon.svelte'
</script>

<div class="suggestions">
  <div class="caption txt-m c-waterloo">Recent</div>

  <div class="suggestion btn row v-center nowrap mrg-s mrg--t">
    <ProjectIcon slug="bitcoin" size={32} class="mrg-s mrg--r" />
    <span class="mrg-xs mrg--r">Bitcoin</span>
    <span class="c-waterloo mrg-xl mrg--r">BTC</span>

    <div class="c-waterloo mrg-a mrg--l">$0.833034</div>
  </div>
</div>

<style lang="scss">
  .suggestions {
    padding: 16px 24px;
    border-top: 1px solid var(--porcelain);
  }

  .suggestion {
    padding: 8px;
    --bg-hover: var(--athens);
  }
</style>
