<script lang="ts">
  import type { DetailedLayout } from '@/api/layouts'
  import { getHistoryContext } from 'webkit/ui/history'
  import { queryLayout } from '@/api/layouts'
  import { getAdapterController } from '@/adapter/context'
  import { getWidgets } from '@/stores/widgets'
  import HoverItem from './HoverItem.svelte'
  import Item from '../Item.svelte'

  // @ts-ignore
  const selectLayout = window.selectLayout || (() => {})
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

    const redo = () => (Widgets.set(newWidgets), selectLayout(layout))
    History.add('Apply layout', () => Widgets.set(oldWidgets), redo)
    redo()
  }
</script>

<Item {item} {HoverItem} on:click={onClick}>
  {item.title}
</Item>
