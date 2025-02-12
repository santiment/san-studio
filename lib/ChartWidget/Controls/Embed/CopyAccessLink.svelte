<script context="module">
  const COPY_ACCESS_LINK_CACHE = {}
</script>

<script>
  import { onDestroy } from 'svelte'
  import { copy } from 'san-webkit/lib/utils'
  import { studio } from './../../../stores/studio'
  import { currentUser as currentUser$ } from './../../../stores/user'
  import { shareMetrics } from './../../../sharing'
  import { getLayoutMetrics } from './../../../Layouts/utils'
  import { createUserLayout } from './../../../api/layouts/mutate'
  import { queryLayoutToken } from './../../../api/layouts/token'
  import { shareEmbeded, getChartWidgetLabel } from './utils'

  export let widget

  let loading = false
  let copyLabel = ''
  let clearTimer = () => {}

  $: currentUser = $currentUser$

  function onClick() {
    const settings = $studio
    const options = {
      isCartesianGrid: true,
      isNightMode: false,
      isWithMetricSettings: false,
      isWatermarkHidden: false,
      isAutoUpdated: false,
    }

    const metrics = shareMetrics(widget.metrics)
    const hash = shareEmbeded(widget, settings, options)

    const cached = COPY_ACCESS_LINK_CACHE[hash]
    if (cached) {
      copyLabel = 'Copied!'
      clearTimer = copy(cached, () => (copyLabel = ''))

      return
    }

    if (loading) {
      return
    }

    const isConfirmed = confirm('Create a new chart layout with shared data access?')
    if (!isConfirmed) {
      return
    }

    loading = true

    createUserLayout({
      title: '',
      metrics,
      metricsJson: getLayoutMetrics([widget]),
      options: { widgets: window.shareLayoutWidgets?.([widget]) },
      projectId: settings.projectId,
      isPublic: true,
      description: 'Auto generated layout for a embedded chart',
    })
      .then((layout) => {
        return queryLayoutToken(layout.id)
      })
      .then((dataToken) => {
        const qs = shareEmbeded(widget, settings, { ...options, dataToken })
        const link = `https://embed.santiment.net/chart?${qs}`

        loading = false
        copyLabel = 'Copied!'
        clearTimer = copy(link, () => (copyLabel = ''), 3000)

        COPY_ACCESS_LINK_CACHE[hash] = link
      })
  }

  onDestroy(() => {
    if (process.browser) clearTimer()
  })
</script>

{#if currentUser && (currentUser.email || '').endsWith('@santiment.net')}
  <div class="btn-1 btn--orange row h-center mrg-m mrg--t" class:loading on:click={onClick}>
    {copyLabel || 'Copy embed link'}
  </div>
{/if}
