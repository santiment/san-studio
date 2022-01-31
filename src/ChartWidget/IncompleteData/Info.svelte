<script lang="ts">
  export let upgradeClass = ''
  export let restrictions: string[]
</script>

Your plan has limited data period for:

<div class="mrg-m mrg--b mrg--t">
  {#each restrictions as restriction}
    <div class="restriction">{restriction}</div>
  {/each}
</div>

To unlock the full potential of Santiment metrics you need to upgrade your account to PRO

<div class="btn-1 btn--orange fluid body-3 mrg-l mrg--t {upgradeClass}">Upgrade</div>

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
