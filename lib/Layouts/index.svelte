<script lang="ts">import { tick, onDestroy } from 'svelte';
import { track } from 'san-webkit/lib/analytics';
import { CMD } from 'san-webkit/lib/utils/os';
import { newGlobalShortcut } from 'san-webkit/lib/utils/events';
import { getHistoryContext } from 'san-webkit/lib/ui/history';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte';
import { Event } from './../../lib/analytics';
import { studio } from './../../lib/stores/studio';
import { getWidgets } from './../../lib/stores/widgets';
import { selectedLayout } from './../../lib/stores/layout';
import { currentUser } from './../../lib/stores/user';
import { widgetsListener } from './../../lib/stores/widgetsListener';
import { updateUserLayout, createUserLayout } from './../../lib/api/layouts/mutate';
import { showNewLayoutDialog, Mode } from './NewLayoutDialog.svelte';
import { showLoadLayoutDialog } from './LoadLayoutDialog.svelte';
import { showDeleteLayoutDialog } from './DeleteLayoutDialog.svelte';
import { getScheduledLayout, deleteScheduledLayout, getAllWidgetsMetricsKeys, getLayoutMetrics } from './utils';
const Widgets = getWidgets();
const History = getHistoryContext();
let widgetsHash = '';
let changed = false;

$: layout = $selectedLayout;

$: isAuthor = $currentUser && layout && +layout.user.id === +$currentUser.id; // @ts-ignore


$: layout, isAuthor, hashWidgets();

const getWidgetsHash = (widgets = Widgets.get()) => {
  var _a;

  return JSON.stringify((_a = window.shareLayoutWidgets) === null || _a === void 0 ? void 0 : _a.call(window, widgets));
};

function hashWidgets() {
  if (!layout || !isAuthor) return widgetsHash = '';
  tick().then(() => {
    widgetsHash = getWidgetsHash(window.parseLayoutWidgets(layout));
    checkIsChanged();
  });
}

function checkIsChanged() {
  changed = isAuthor ? widgetsHash !== getWidgetsHash() : false;
}

const unsubWidgets = widgetsListener.subscribe(checkIsChanged);

const selectLayout = layout => layout && selectedLayout.set(layout);

const callIfRegistered = clb => () => {
  var _a;

  return (_a = $currentUser ? clb : window.showLoginPrompt) === null || _a === void 0 ? void 0 : _a();
};

function onSave() {
  var _a;

  let promise;

  if (layout) {
    const projectId = +$studio.projectId;
    const {
      id,
      title,
      description
    } = layout;
    const settings = {
      title,
      description,
      projectId,
      metrics: getAllWidgetsMetricsKeys($Widgets),
      metricsJson: getLayoutMetrics($Widgets),
      options: {
        widgets: (_a = window.shareLayoutWidgets) === null || _a === void 0 ? void 0 : _a.call(window, $Widgets)
      }
    };
    promise = (isAuthor ? updateUserLayout(id, settings) : createUserLayout(settings)).then(layout => {
      var _a;

      (_a = window.notifyLayoutSave) === null || _a === void 0 ? void 0 : _a.call(window);
      return layout;
    });
  } else {
    promise = showNewLayoutDialog();
  }

  promise.then(selectLayout);
}

window.saveLayout = callIfRegistered(onSave);

const onSaveAsNew = () => layout && showNewLayoutDialog({
  layout,
  title: 'Save Chart Layout as ...'
}).then(selectLayout);

window.saveAsNewLayout = callIfRegistered(onSaveAsNew);

const onEdit = () => layout && showNewLayoutDialog({
  layout,
  title: 'Edit Chart Layout',
  mode: Mode.Edit
}).then(selectLayout);

window.onLayoutEdit = callIfRegistered(onEdit);

const onNew = () => showNewLayoutDialog().then(selectLayout);

window.onLayoutCreationOpen = () => {
  onNew();
};

window.onLayoutSelect = layout => {
  if ($selectedLayout && +layout.id === +$selectedLayout.id) return;
  const newWidgets = window.parseLayoutWidgets(layout);
  const oldWidgets = $Widgets;
  const oldLayout = $selectedLayout;

  const redo = () => (Widgets.set(newWidgets), selectedLayout.set(layout));

  History.add('Apply layout', () => (Widgets.set(oldWidgets), selectedLayout.set(oldLayout)), redo);
  redo();
  track.event(Event.LoadLayout, {
    id: layout.id
  });
};

window.onChartsLayoutMount = () => {
  const settings = getScheduledLayout();

  if (settings) {
    createUserLayout(settings).then(layout => {
      var _a;

      track.event(Event.NewLayout, {
        id: layout.id
      });
      window.onLayoutSelect(layout);
      deleteScheduledLayout();
      (_a = window.notifyLayoutCreation) === null || _a === void 0 ? void 0 : _a.call(window);
    });
  }
};

const unsubSave = newGlobalShortcut('CMD+S', callIfRegistered(onSave));
const unsubLoad = newGlobalShortcut('CMD+L', showLoadLayoutDialog);
onDestroy(() => {
  // @ts-ignore
  delete window.onLayoutSelect;
  delete window.onLayoutCreationOpen;
  delete window.onChartsLayoutMount;
  delete window.onLayoutEdit;
  delete window.saveLayout;
  delete window.saveAsNewLayout;
  unsubSave();
  unsubLoad();
  unsubWidgets();
});</script>

<div class="layout btn row mrg-a mrg--l">
  <div class="action btn border" class:changed on:click={callIfRegistered(onSave)}>
    {layout ? 'Save' : 'Save as'}
  </div>
  <Tooltip on="click" duration={0} align="center" class="tooltip-0jwzek">
    <div class="menu btn border" slot="trigger">
      <Svg id="arrow" w="8" h="5" class="arrow-gBKs0S" />
    </div>

    <div slot="tooltip">
      {#if layout}
        <div class="btn-ghost row v-center" on:click={callIfRegistered(onSave)}>
          Save
          <span class="caption mrg-a mrg--l">{CMD} + S</span>
        </div>
        <div class="btn-ghost" on:click={callIfRegistered(onSaveAsNew)}>Save as new</div>
      {/if}

      {#if isAuthor}
        <div class="btn-ghost" on:click={onEdit}>Edit</div>
      {/if}

      {#if layout}
        <div class="divider" />
      {/if}

      <div class="btn-ghost" on:click={showLoadLayoutDialog}>Load</div>
      <div class="btn-ghost" on:click={callIfRegistered(onNew)}>New</div>

      {#if isAuthor}
        <div
          class="delete btn-ghost"
          on:click={() =>
            showDeleteLayoutDialog({ layout }).then(
              (wasDeleted) => wasDeleted && selectedLayout.set(undefined),
            )}
        >
          Delete
        </div>
      {/if}
    </div>
  </Tooltip>
</div>

<style>
  .layout {
    position: relative;
  }

  .action,
  .menu {
    --color-hover: var(--green);
    height: 32px;
    padding: 6px 12px;
  }

  .action {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .menu {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    --color: var(--waterloo);
  }

  :global(.arrow-gBKs0S) {
    transform: rotate(180deg);
  }

  :global(.tooltip-0jwzek) {
    left: 0px !important;
    width: 200px;
    padding: 8px;
  }

  .divider {
    margin: 8px -8px;
    border-bottom: 1px solid var(--porcelain);
  }

  .delete {
    --color: var(--red);
    --color-hover: var(--red-hover);
  }

  .caption {
    color: var(--waterloo);
  }

  .changed {
    --color: var(--orange);
    --border: var(--orange);
    --color-hover: var(--orange-hover);
    --border-hover: var(--orange-hover);
  }
</style>
