<script lang="ts">import { track } from 'san-webkit/lib/analytics';
import { showPaymentDialog } from 'san-webkit/lib/ui/PaymentDialog/index.svelte';
import { Event } from './../../../lib/analytics';
import { globals } from './../../../lib/stores/globals';
import { closeBanners } from './utils';
export let upgradeClass = '';
export let restrictions;
export let isBanner = false;
export let restrictedMetrics;

function onUpgradeClick(e) {
  var _a;

  track.event(Event.IncompleteDataUpgrade, {
    location: isBanner ? 'banner' : 'tooltip',
    metrics: Array.from(new Set(restrictedMetrics.map(({
      key,
      queryKey = key
    }) => queryKey)))
  });
  closeBanners();

  if ($globals.isLoggedIn && window.showPaymentDialog) {
    return showPaymentDialog();
  }

  (_a = window.__onLinkClick) === null || _a === void 0 ? void 0 : _a.call(window, e);
}</script>

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
  on:click|preventDefault={onUpgradeClick}>Upgrade</a
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
