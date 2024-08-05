<script>import 'san-webkit/lib/analytics';
import { globals } from './../../stores/globals';
import { trackUpgrade } from './utils';
export let upgradeClass = '';
export let restrictions;
export let restrictedMetrics;
function onUpgradeClick(e) {
    trackUpgrade({
        e,
        restrictedMetrics,
        isLoggedIn: $globals.isLoggedIn,
        location: 'banner',
    });
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
