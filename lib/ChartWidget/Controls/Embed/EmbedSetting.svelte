<script>import Svg from 'san-webkit/lib/ui/Svg/svelte';
import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte';
import { selectedLayout } from './../../../stores/layout';
import { currentUser } from './../../../stores/user';
import { queryLayoutToken } from './../../../api/layouts/token';
import Setting from './Setting.svelte';
export let isPro = false;
export let dataToken = '';
let isActive = false;

$: layout = $selectedLayout;

$: isAuthor = $currentUser && layout && +layout.user.id === +$currentUser.id;

$: disabled = !isAuthor || !isPro;

const setToken = token => dataToken = token;

$: if (!disabled && isActive) {
  queryLayoutToken(layout.id).then(setToken);
} else {
  dataToken = '';
}</script>

<Setting bind:isActive {disabled} disabledToggle={isPro}>
  <div class="row v-center">
    Share data access
    <Tooltip align="start" offsetY={4} closeTimeout={0}>
      <div slot="trigger" class="btn">
        <Svg id="info" w="16" class="mrg-s mrg--l" />
      </div>
      <div slot="tooltip" class="tooltip c-black">
        The embedded chart's data will be linked to the current layout.
        <br />
        If the metric has been removed from the layout, the embedded chart's Pro-only metric is subject
        to potentially not include full historical and/or present-day data.
      </div>
    </Tooltip>
  </div>
</Setting>

<style>
  .btn {
    --bg: none;
    --color: var(--waterloo);
    --color-hover: var(--green);
    pointer-events: all;
  }

  .tooltip {
    padding: 8px 12px;
    max-width: 280px;
    cursor: text;
  }
</style>
