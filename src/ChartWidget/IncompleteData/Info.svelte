<script lang="ts">
  import { globals } from '@/stores/globals'
  import { trackUpgrade } from './utils'
  import { getWidget } from '../context'

  export let upgradeClass = ''
  export let restrictions: string[]
  export let restrictedMetrics: Studio.Metric[]

  const { HiddenMetrics } = getWidget()

  function onUpgradeClick(e) {
    trackUpgrade({
      e,
      restrictedMetrics,
      isLoggedIn: $globals.isLoggedIn,
      location: 'banner',
    })
  }

  function hideRestrictedMetrics(restrictedMetrics: Studio.Metric[]) {
    restrictedMetrics.forEach((metric) => HiddenMetrics.hide(metric))
  }
</script>

Your plan has limited data period for:

<div class="mrg-m mrg--b mrg--t">
  {#each restrictions as restriction}
    <div class="restriction">{restriction}</div>
  {/each}
</div>

To unlock the full potential of Santiment metrics you need to upgrade your account to PRO

<a
  href="/pricing"
  class="btn-1 btn--orange row h-center fluid body-3 mrg-l mrg--t {upgradeClass}"
  data-type="upgrade"
  data-source="chart_incomplete_data"
  on:click={onUpgradeClick}
>
  Upgrade
</a>

<button
  class="hide-btn fluid btn-1 btn-l"
  on:click={() => hideRestrictedMetrics(restrictedMetrics)}
>
  Hide Pro Metrics
</button>

<style>
  .restriction {
    text-align: left;
  }
  .restriction::before {
    content: '●';
    margin-right: 8px;
  }

  .btn-1 {
    text-align: center;
  }

  .hide-btn {
    --bg: var(--white);
    --bg-hover: var(--athens);
    --color: var(--black);
    --color-hover: var(--black);

    margin-top: 16px;
  }
</style>
