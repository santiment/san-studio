<script context="module">
  import { getContext } from 'svelte'

  const ID = 'OptionsMenuTooltipCtx'
  export const getOptionsMenuTooltip = () => getContext(ID)
</script>

<script>
  import Context from 'webkit/ui/Tooltip/Context.svelte'
  import OptionsMenu from './Controls/OptionsMenu.svelte'

  const settings = {
    on: 'click',
    align: 'end',
    activeClass: 'active',
  }
</script>

<Context id={ID} {settings}>
  <slot />

  <svelte:fragment slot="tooltip" let:props>
    <OptionsMenu {...props} />
  </svelte:fragment>
</Context>
