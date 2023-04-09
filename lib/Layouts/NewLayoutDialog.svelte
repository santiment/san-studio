<script context="module">import { dialogs } from 'san-webkit/lib/ui/Dialog';
import NewLayoutDialog from './NewLayoutDialog.svelte';
export const showNewLayoutDialog = props => dialogs.show(NewLayoutDialog, props);
export const Mode = {
  New: 0,
  Save: 1,
  Edit: 2
};</script>

<script>import { track } from 'san-webkit/lib/analytics';
import Dialog from 'san-webkit/lib/ui/Dialog';
import Toggle from 'san-webkit/lib/ui/Toggle.svelte';
import { Event } from './../analytics';
import { studio } from './../stores/studio';
import { globals } from './../stores/globals';
import { getWidgets } from './../stores/widgets';
import { createUserLayout, updateUserLayout } from './../api/layouts/mutate';
import { saveScheduledLayout, getAllWidgetsMetricsKeys, getLayoutMetrics } from './utils';
const Widgets = getWidgets();
export let DialogPromise;
export let title = 'New Chart Layout';
export let mode = Mode.New;
export let layout;
let closeDialog;
let {
  title: layoutTitle = '',
  description = '',
  isPublic = false
} = layout || {};

function onSubmit({
  currentTarget
}) {
  var _a, _b;

  const title = currentTarget.title.value;
  const description = currentTarget.description.value;
  const {
    id,
    metrics,
    project,
    options
  } = layout || {};
  const isEditMode = mode === Mode.Edit;
  const settings = {
    title,
    description,
    isPublic,
    metrics: metrics || getAllWidgetsMetricsKeys($Widgets),
    metricsJson: getLayoutMetrics($Widgets),
    projectId: (project === null || project === void 0 ? void 0 : project.projectId) || $studio.projectId,
    options: options || {
      widgets: (_a = window.shareLayoutWidgets) === null || _a === void 0 ? void 0 : _a.call(window, $Widgets)
    }
  };

  if (!$globals.isLoggedIn) {
    saveScheduledLayout(settings);
    closeDialog();
    return (_b = window.notifyLayoutAnonCreation) === null || _b === void 0 ? void 0 : _b.call(window);
  }

  const mutation = isEditMode ? updateUserLayout(id, settings) : createUserLayout(settings);
  mutation.then(layout => {
    var _a, _b;

    track.event(mode === Mode.New ? Event.NewLayout : Event.SaveLayout, {
      id: layout.id
    });
    DialogPromise.resolve(layout);
    closeDialog();

    if (isEditMode) {
      (_a = window.notifyLayoutEdit) === null || _a === void 0 ? void 0 : _a.call(window);
    } else {
      (_b = window.notifyLayoutCreation) === null || _b === void 0 ? void 0 : _b.call(window);
    }
  });
}

function toggleLayoutPublicity() {
  isPublic = !isPublic;
}</script>

<Dialog {...$$props} {title} bind:closeDialog>
  <form class="dialog-body column" on:submit|preventDefault={onSubmit}>
    <input
      required
      type="text"
      name="title"
      value={layoutTitle}
      placeholder="Name of the layout"
      class="input border row"
    />

    <textarea
      class="input border mrg-l mrg--t mrg--b"
      name="description"
      rows="4"
      value={description}
      placeholder="Description"
    />

    <div class="row v-center">
      <button class="btn btn-1 btn--green mrg-a mrg--r" type="submit">
        {mode === Mode.New ? 'Create' : 'Save'}</button
      >

      Public
      <Toggle class="mrg-m mrg--l" isActive={isPublic} on:click={toggleLayoutPublicity} />
    </div>
  </form>
</Dialog>

<style>
  .input {
    color: var(--black);
    width: 100%;
    padding: 9px 16px;
    min-width: 460px;
    --border-hover: var(--green);
  }
  .input:focus {
    --border: var(--green);
  }
  .btn {
    width: 116px;
    height: 40px;
    padding: 10px 16px;
    text-align: center;
  }
</style>
