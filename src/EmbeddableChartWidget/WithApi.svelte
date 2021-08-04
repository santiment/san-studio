<script lang="ts">
  import { newHistoryContext } from 'webkit/ui/history'
  import { setAdapterController } from '@/adapter/context'
  import ChartWidget from '@/ChartWidget/index.svelte'

  newHistoryContext({ add: () => {} })
  setAdapterController({
    noWidgetControls: true,
    isOnlyChartEmbedded: true,
    isEmbedded: true,
  })

  export let widget = {}
</script>

<ChartWidget {widget} />
