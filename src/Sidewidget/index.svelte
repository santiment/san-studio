<script lang="ts">
  import Icon from 'webkit/ui/Icon.svelte'
  import { getSidewidget } from '@/stores/widgets'
  const Sidewidget = getSidewidget()
</script>

<div class="sidewidget border mrg-l mrg--l column">
  <div class="toggle">
    <Icon
      id="sidebar"
      w="12"
      h="10"
      class="btn $style.icon"
      on:click={() => ($Sidewidget = null)} />
  </div>

  <div class="studio-sidewidget" />
</div>

<style>
  .sidewidget {
    flex: 1 0 355px;
    max-width: 355px;
    position: sticky;
    top: 77px;
    max-height: calc(100vh - 99px);
    padding: 20px;
  }

  .toggle {
    position: absolute;
    top: 15px;
    left: -13px;
    width: 13px;
    border: 1px solid var(--porcelain);
    border-right: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .icon {
    --fill: var(--casper);
    --fill-hover: var(--green);
    --bg: var(--white);
    padding: 10px 4px;
  }

  .studio-sidewidget {
    flex: 1;
  }
</style>
