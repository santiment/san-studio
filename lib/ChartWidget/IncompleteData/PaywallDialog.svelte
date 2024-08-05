<script lang="ts" context="module">
  import type { RestrictionInfo } from './utils'

  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import Component from './PaywallDialog.svelte'
  import { trackUpgrade } from './utils'

  export const showPaywallDialog = (
    restrictionsInfo: RestrictionInfo[],
    restrictedMetrics: Studio.Metric[],
  ) => dialogs.show(Component, { restrictionsInfo, restrictedMetrics })
</script>

<script lang="ts">
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import { globals } from './../../stores/globals'

  export let restrictionsInfo: RestrictionInfo[]
  export let restrictedMetrics: Studio.Metric[]

  function onUpgradeClick(e) {
    trackUpgrade({ e, restrictedMetrics, isLoggedIn: $globals.isLoggedIn, location: 'dialog' })
  }
</script>

<Dialog {...$$props} title="Incomplete data">
  <dialog-content class="column">
    <table class="fluid border">
      <thead>
        <tr class="c-fiord">
          <th>Metric</th>
          <th>Period of hidden data</th>
        </tr>
      </thead>

      <tbody>
        {#each restrictionsInfo as { metric, date }}
          <tr>
            <td>{metric}</td>
            <td>{date}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <p class="c-fiord mrg-l mrg--t">
      Your plan currently is restricted to limited data for this metric. To unlock the full range of
      Santiment metrics, click the button below to Upgrade your account to PRO
    </p>

    <a href="/pricing" class="btn-1 btn--orange" on:click={onUpgradeClick}>Learn more</a>
  </dialog-content>
</Dialog>

<style>
  dialog-content {
    padding: 20px 24px;
    align-items: flex-start;
  }

  table {
    border-radius: 6px;
    border-spacing: 0;
  }

  tr {
    white-space: nowrap;
  }

  th {
    padding: 6px 16px;
    background: var(--athens);
    text-align: start;
  }

  td {
    padding: 16px;
  }

  p {
    max-width: 432px;
  }

  a {
    display: block;
    margin-top: 20px;
  }
</style>
