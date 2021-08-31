<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'

  export let searchTerm = ''
  export let placeholder = 'Search metrics'

  let input = ''
  $: searchTerm = input.toLowerCase()

  let timer: number
  function onInput({ target }) {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      input = target.value
    }, 200)
  }
</script>

<div class="border mrg-s mrg--t row v-center fluid">
  <Svg id="search" w="12" class="$style.search" />
  <input type="text" on:input={onInput} {placeholder} />
</div>

<style>
  div {
    position: relative;
    fill: var(--casper);
  }
  div:hover,
  div:focus-within {
    border-color: var(--green);
    fill: var(--green);
  }

  input {
    height: 32px;
    flex: 1;
    padding: 6px 6px 6px 36px;
    border-radius: 4px;
    color: var(--black);
  }

  .search {
    position: absolute;
    left: 14px;
  }
</style>
