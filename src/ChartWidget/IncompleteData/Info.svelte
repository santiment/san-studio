<script lang="ts">
  import { track } from 'webkit/analytics'
  import { showPaymentDialog } from 'webkit/ui/PaymentDialog/index.svelte'
  import { Event } from '@/analytics'
  import { globals } from '@/stores/globals'
  import { closeBanners } from './utils'

  export let upgradeClass = ''
  export let restrictions: string[]
  export let isBanner = false
  export let restrictedMetrics: Studio.Metric[]

  function onUpgradeClick(e) {
    track.event(Event.IncompleteDataUpgrade, {
      location: isBanner ? 'banner' : 'tooltip',
      metrics: Array.from(new Set(restrictedMetrics.map(({ key, queryKey = key }) => queryKey))),
    })
    closeBanners()

    if ($globals.isLoggedIn) {
      e.preventDefault()
      return showPaymentDialog({
        source: 'charts_incomplete_data_upgrade',
      })
    }

    window.__onLinkClick?.(e)
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
  on:click={onUpgradeClick}>Upgrade</a
>

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
</style>
