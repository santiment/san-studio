<script lang="ts">
  import { withScroll } from 'webkit/ui/history'
  import { getHistoryContext } from '@/history/ctx'
  import { getWidget } from '@/ChartWidget/context'
  import Setting from './Setting.svelte'

  const History = getHistoryContext()
  const widget = getWidget()
  const { MetricSettings } = widget

  export let metric: Studio.Metric

  $: metricSettings = $MetricSettings[metric.key]
  $: text = metricSettings?.selector === 'text' ? metricSettings?.slug || '' : ''

  function onChange({ target: { value } }) {
    const oldText = text
    const newText = value.trim() || undefined
    const redo = () => setTrendText(metric, newText)

    redo()
    History.add(
      'Social Volume query changed',
      withScroll(widget, () => setTrendText(metric, oldText)),
      withScroll(widget, redo),
    )
  }

  function setTrendText({ key }: Studio.Metric, value?: string) {
    if (!value) {
      MetricSettings.delete(key, 'selector')
      return MetricSettings.delete(key, 'slug')
    }
    MetricSettings.set(key, { slug: value, selector: 'text' })
  }

  function onClick({ currentTarget }) {
    currentTarget.firstElementChild.focus()
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<Setting on:click={onClick}>
  Query:

  <input class="mrg-xs mrg--l" type="text" value={text} on:blur={onChange} />
</Setting>

<style>
  input {
    width: 30ch;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input {
    -moz-appearance: textfield;
  }
</style>
