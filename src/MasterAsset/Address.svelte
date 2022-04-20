<script>
  import { getAddressInfrastructure } from 'webkit/utils/address'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import { studio } from '@/stores/studio'
  import { queryAddressLabels } from '@/api/address'
  import AddressIcon from './AddressIcon.svelte'
  import Selector from './Selector.svelte'

  let labels = []
  let hidden = []

  $: ({ address } = $studio)
  $: queryAddressLabels(address, getAddressInfrastructure(address)).then(setLabels)

  function setLabels(data) {
    labels = data.slice(0, 2)
    hidden = data.slice(2)
  }
</script>

<svelte:head>
  <title>Sanbase: {address}</title>
</svelte:head>

<Selector>
  <AddressIcon {address} />
  {address}
</Selector>

<div class="caption row">
  {#each labels as { name }}
    <div class="label mrg-s mrg--l">{name}</div>
  {/each}

  {#if hidden.length}
    <Tooltip align="end" offsetY={4} class="$style.tooltip row" openDelay={110}>
      <div slot="trigger" class="label btn mrg-s mrg--l">
        +{hidden.length}
      </div>

      <svelte:fragment slot="tooltip">
        {#each hidden as { name }}
          <div class="label">{name}</div>
        {/each}
      </svelte:fragment>
    </Tooltip>
  {/if}
</div>

<style>
  .label {
    padding: 3px 8px;
    background: var(--porcelain) !important;
    border-radius: 4px;
  }

  .btn {
    --color-hover: var(--green);
  }

  .tooltip {
    padding: 12px;
    z-index: 999 !important;
    max-width: 430px;
    flex-wrap: wrap;
    gap: 4px 8px;
  }
</style>
