<script lang="ts">
  import type { DetailedLayout } from '@/api/layouts'
  import { getHistoryContext } from 'webkit/ui/history'
  import { queryLayout } from '@/api/layouts'
  import { getAdapterController } from '@/adapter/context'
  import { getWidgets } from '@/stores/widgets'
  import HoverItem from './HoverItem.svelte'
  import Item from '../Item.svelte'

  const { parseLayoutWidgets = () => [] } = getAdapterController()
  const Widgets = getWidgets()
  const History = getHistoryContext()

  export let item

  function onClick() {
    queryLayout(item.id).then(onLayoutSelect)
  }

  function onLayoutSelect(layout: DetailedLayout) {
    const newWidgets = parseLayoutWidgets(layout)
    const oldWidgets = $Widgets

    Widgets.set(newWidgets)
    History.add(
      'Apply layout',
      () => Widgets.set(oldWidgets),
      () => Widgets.set(newWidgets),
    )
  }
</script>

<Item {item} {HoverItem} on:click={onClick}>
  {item.title}
</Item>
