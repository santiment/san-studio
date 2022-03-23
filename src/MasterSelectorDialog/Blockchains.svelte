<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
</script>

<Tooltip on="click" offsetY={4} align="center" activeClass="$style.active">
  <button slot="trigger" class="btn-2 btn--s mrg-l mrg--r row v-center"
    >All blockchains
    <Svg id="arrow" w="8" h="5" class="$style.arrow mrg-s mrg--l" />
  </button>

  <div slot="tooltip" class="tooltip">
    <div class="btn-ghost">All blockchains</div>
  </div>
</Tooltip>

<style>
  button {
    fill: var(--waterloo);
  }

  .active {
    --border: var(--green);
  }

  .arrow {
    transform: rotate(180deg);
  }

  .tooltip {
    padding: 8px;
    width: 100%;
  }
</style>
