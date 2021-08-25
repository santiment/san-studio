<script lang="ts">
  import { newHistoryContext } from 'webkit/ui/history'
  import { setAdapterController } from '@/adapter/context'
  import ChartWidget from '@/ChartWidget/index.svelte'

  export let widget = {}
  export let isWithMetricSettings = false

  newHistoryContext({ add: () => {} })
  setAdapterController({
    isWithMetricSettings,
    noWidgetControls: true,
    isOnlyChartEmbedded: true,
    isEmbedded: true,
  })
</script>

<ChartWidget {widget} />
