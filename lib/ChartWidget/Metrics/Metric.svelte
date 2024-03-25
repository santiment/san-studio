<script>var _a, _b;
import { onDestroy } from 'svelte';
import { track } from 'san-webkit/lib/analytics';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import ProjectIcon from 'san-webkit/lib/ui/ProjectIcon.svelte';
import Tooltip from 'san-webkit/lib/ui/Tooltip';
import { Event } from './../../analytics';
import { queryProjectBlockchain } from './../../api/blockchains';
import MetricButton from './../../MetricButton.svelte';
import { getWidget } from './../../ChartWidget/context';
import { globals } from './../../stores/globals';
import { getAdapterController } from './../../adapter/context';
import { SelectorNode } from './../../metrics/selector';
import { convertBaseProjectMetric } from './utils';
import MoreMenu from './MoreMenu.svelte';
import { getMetricErrorTooltip } from './ErrorTooltipCtx.svelte';
const { isEmbedded, isWithMetricSettings = true } = getAdapterController();
const { Metrics, MetricsSignals } = getWidget();
const metricErrorTooltip = getMetricErrorTooltip();
export let metric;
export let project;
export let colors;
export let error, isLoading, isSettingsOpened, isHidden;
export let onEnter, onLeave, onClick, onDelete, onLock, onSettings;
export let dndContext;
export let isMultipleMetricsOnChart;
export let restricted;
let isMenuOpened = false;
let node;
$: isLocked = !!metric.project;
$: projectSlug = ((_a = metric.project) === null || _a === void 0 ? void 0 : _a.slug) || project.slug;
$: ({ isPresenterMode } = $globals);
$: node && (dndContext === null || dndContext === void 0 ? void 0 : dndContext.addItem(node));
$: node && useErrorTooltip(node, error);
$: address = (_b = metric.reqMeta) === null || _b === void 0 ? void 0 : _b.address;
const onMouseEnter = () => onEnter(metric);
const onMouseLeave = onLeave;
function onLockClick() {
    const settings = Object.assign({}, project);
    if (Metrics.hasConvertedMetric(metric, settings))
        return;
    if (metric.project) {
        track.event(Event.UnlockMetric, { metric: metric.key });
    }
    else {
        track.event(Event.LockMetric, { metric: metric.key, asset: project.slug });
    }
    onLock(metric, convertBaseProjectMetric(metric, settings), $Metrics.indexOf(metric));
}
function useErrorTooltip(node, error) {
    metricErrorTooltip(node, {
        error,
        isEnabled: !!error,
    });
}
onDestroy(onMouseLeave);
</script>

<MetricButton
  bind:node
  {metric}
  {colors}
  {error}
  {isLoading}
  onDelete={isPresenterMode || isEmbedded ? undefined : onDelete}
  ticker={project.ticker}
  active={isMenuOpened}
  highlight={isSettingsOpened && !(isPresenterMode || !isWithMetricSettings)}
  on:click={(e) => onClick(metric, e)}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
>
  {#if !metric.noProject}
    {#if isLocked}
      {#if !isEmbedded}
        <div class="locked row hv-center">
          <Svg id="locked-small" w="8" />
        </div>
      {/if}
    {:else if !metric.indicator && !address}
      ({project.ticker})
    {/if}
  {/if}

  {#if restricted && !isEmbedded}
    <Tooltip let:trigger position="bottom">
      <button use:trigger>
        <Svg id="error" class="error-3zOexx mrg-s mrg--l" w="16" />
      </button>

      <tooltip slot="tooltip" class="caption night-mode c-black">Restricted: PRO required</tooltip>
    </Tooltip>
  {/if}

  {#if $MetricsSignals.includes(metric)}
    <div class="locked signaled row hv-center"><Svg id="flash" w="8" /></div>
  {/if}

  {#if address}
    <div class="address locked row hv-center expl-tooltip" aria-label={address}>
      <Svg id="report" w="9" />
    </div>
  {/if}

  {#if isHidden}
    <div class="locked row hv-center  expl-tooltip" aria-label="Hidden">
      <Svg id="eye-crossed" w="11" />
    </div>
  {/if}

  {#await queryProjectBlockchain(projectSlug) then blockchain}
    {#if blockchain}
      <ProjectIcon slug={blockchain} size={16} class="blockchain-Uc_GFB" />
    {/if}
  {/await}

  {#if !(isPresenterMode || isEmbedded) && metric !== SelectorNode.SPENT_COIN_COST}
    <MoreMenu
      {metric}
      {address}
      {isHidden}
      isLocked={isLocked || address}
      {isSettingsOpened}
      {isMultipleMetricsOnChart}
      bind:isMenuOpened
      {onLockClick}
      {onSettings}
    />
  {/if}
</MetricButton>

<style>
  .locked {
    position: absolute;
    top: -5px;
    left: -5px;
    background: #505573;
    border-radius: 50%;
    fill: #fff;
    width: 16px;
    height: 16px;
  }

  :global(.error-3zOexx) {
    fill: var(--red);
  }

  .signaled {
    background: var(--red);
  }

  .address {
    --expl-position-y: -4px;
    --expl-align-x: 50%;
  }
  .address::before {
    z-index: 11;
  }

  :global(.blockchain-Uc_GFB) {
    position: absolute;
    right: -6px;
    top: -6px;
  }

  tooltip {
    padding: 6px 13px;
    background-color: var(--casper);
    border-radius: 4px;
  }
</style>
