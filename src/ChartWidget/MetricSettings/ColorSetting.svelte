<script lang="ts">
  import Icon from 'webkit/ui/Icon.svelte'
  import Setting from './Setting.svelte'
  import { getWidget } from '@/ChartWidget/context'
  const { ChartColors } = getWidget()

  export let metric: Studio.Metric

  let node
  let timer

  $: color = $ChartColors[metric.key]

  function onChange({ target: { value } }) {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      color = value
      ChartColors.set(metric.key, value)
    }, 150)
  }
</script>

<Setting on:click={() => node.click()}>
  <div class="color" style="--color:{color}" />
  <input type="color" on:input={onChange} value={color} bind:this={node} />
  <Icon id="arrow" w="8" h="4.5" class="mrg-s mrg--l $style.arrow" />
</Setting>

<style>
  input {
    visibility: hidden;
    width: 0;
    height: 0;
    padding: 0;
    border: 0;
  }

  div {
    background: var(--color);
    border-radius: 2px;
    width: 10px;
    height: 10px;
  }

  .arrow {
    transform: rotate(180deg);
  }
</style>
