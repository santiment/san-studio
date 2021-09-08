<script lang="ts">
  import type { DetailedLayout } from '@/api/layouts'
  import { track } from 'webkit/analytics'
  import { getHistoryContext } from 'webkit/ui/history'
  import { Event } from '@/analytics'
  import { queryLayout } from '@/api/layouts'
  import { getAdapterController } from '@/adapter/context'
  import { getWidgets } from '@/stores/widgets'
  import { selectedLayout } from '@/stores/layout'
  import HoverItem from './HoverItem.svelte'
  import Item from '../Item.svelte'

  const { parseLayoutWidgets = () => [] } = getAdapterController()
  const Widgets = getWidgets()
  const History = getHistoryContext()

  export let item

  $: isActive = $selectedLayout && +item.id === +$selectedLayout?.id

  function onClick() {
    queryLayout(item.id).then(onLayoutSelect)
  }

  function onLayoutSelect(layout: DetailedLayout) {
    if (isActive) return

    const newWidgets = parseLayoutWidgets(layout)
    const oldWidgets = $Widgets
    const oldLayout = $selectedLayout

    const redo = () => (Widgets.set(newWidgets), selectedLayout.set(layout))
    History.add(
      'Apply layout',
      () => (Widgets.set(oldWidgets), selectedLayout.set(oldLayout)),
      redo,
    )
    redo()

    track.event(Event.LoadLayout, { id: layout.id })
  }
</script>

<Item {item} {HoverItem} active={isActive} on:click={onClick}>
  {item.title}
</Item>
