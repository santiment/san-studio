<script lang="ts">import Svg from 'san-webkit/lib/ui/Svg/svelte';
let className = 'mrg-s mrg--t';
export { className as class };
export let searchTerm = '';
export let placeholder = 'Search metrics';
export let autofocus = false;
let input = '';

$: searchTerm = input.toLowerCase();

let timer;

function onInput({
  target
}) {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    input = target.value;
  }, 200);
}</script>

<!-- svelte-ignore a11y-autofocus -->
<div class="border row v-center fluid {className}">
  <Svg id="search" w="12" class="search-V1O5CC" />
  <input type="text" on:input={onInput} {placeholder} {autofocus} />
</div>

<style>
  div {
    position: relative;
    fill: var(--casper);
    height: 32px;
  }
  div:hover,
  div:focus-within {
    border-color: var(--green);
    fill: var(--green);
  }

  input {
    height: 100%;
    flex: 1;
    padding: 6px 6px 6px 36px;
    border-radius: 4px;
    color: var(--black);
  }

  :global(.search-V1O5CC) {
    position: absolute;
    left: 14px;
  }
</style>
