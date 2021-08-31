<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'
  import HoverItem from '../HoverItem.svelte'

  export let item: any
  export let node: HTMLElement
  export let hoverNode: HTMLElement
</script>

<HoverItem {node} {hoverNode}>
  {item.title}
</HoverItem>
