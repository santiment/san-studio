<script context="module">import { Infrastructure, getAddressInfrastructure } from 'san-webkit/lib/utils/address';
const InfrastructureAsset = {
    [Infrastructure.ETH]: 'ethereum',
    [Infrastructure.BTC]: 'bitcoin',
    [Infrastructure.BCH]: 'bitcoin-cash',
    [Infrastructure.XRP]: 'xrp',
    [Infrastructure.LTC]: 'litecoin',
};
</script>

<script>
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import ProjectIcon from 'san-webkit/lib/ui/ProjectIcon.svelte'

  export let address

  $: infrastructure = getAddressInfrastructure(address)
  $: infrastructureAsset = InfrastructureAsset[infrastructure]
</script>

<div class="relative row hv-center mrg-s mrg--r">
  <Svg id="report" w="16" />
  <ProjectIcon slug={infrastructureAsset} size={16} class="project-UWtrAC" />
</div>

<style>
  div {
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    background: var(--casper);
    fill: var(--white);
  }

  :global(.project-UWtrAC) {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
