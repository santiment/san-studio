<script>import ProjectIcon from 'san-webkit/lib/ui/ProjectIcon.svelte';
import { usdFormatter } from './../../metrics/formatters';
import Suggestion from './Suggestion.svelte';
export let item;
export let cursored = false;

$: ({
  slug,
  name,
  ticker,
  priceUsd,
  logoUrl
} = item);</script>

<Suggestion {cursored} on:click>
  <ProjectIcon {slug} {logoUrl} size={32} class="mrg-s mrg--r" />
  <span class="mrg-xs mrg--r">{name}</span>
  <span class="c-waterloo mrg-xl mrg--r">{ticker}</span>

  <div class="c-waterloo mrg-a mrg--l">{usdFormatter(priceUsd)}</div>
</Suggestion>
