<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import NewLayoutDialog from './NewLayoutDialog.svelte'

  export const showNewLayoutDialog = (props?: any) =>
    dialogs.show<DetailedLayout>(NewLayoutDialog, props)

  export const Mode = {
    New: 0,
    Save: 1,
    Edit: 2,
  } as const
</script>

<script lang="ts">
  import type { DialogController } from 'webkit/ui/Dialog/dialogs'
  import type { DetailedLayout } from '@/api/layouts'
  import { track } from 'webkit/analytics'
  import Dialog from 'webkit/ui/Dialog'
  import { Event } from '@/analytics'
  import { studio } from '@/stores/studio'
  import { getWidgets } from '@/stores/widgets'
  import { createUserLayout, updateUserLayout } from '@/api/layouts/user/mutate'
  import { getAllWidgetsMetricsKeys } from './utils'

  const Widgets = getWidgets()

  export let DialogPromise: DialogController
  export let title = 'New Chart Layout'
  export let mode: typeof Mode[keyof typeof Mode] = Mode.New
  export let layout: undefined | DetailedLayout

  let closeDialog

  const { title: layoutTitle = '', description = '' } = layout || {}

  function onSubmit({ currentTarget }) {
    const title: string = currentTarget.title.value
    const description: string = currentTarget.description.value
    const { id, metrics, project, options } = layout || {}

    const isEditMode = mode === Mode.Edit
    const settings = {
      title,
      description,
      metrics: metrics || getAllWidgetsMetricsKeys($Widgets),
      projectId: project?.projectId || $studio.projectId,
      options: options || {
        widgets: window.shareLayoutWidgets?.($Widgets),
      },
    }

    const mutation = isEditMode
      ? updateUserLayout(id as number, settings)
      : createUserLayout(settings)

    mutation.then((layout) => {
      track.event(mode === Mode.New ? Event.NewLayout : Event.SaveLayout, {
        id: layout.id,
      })
      DialogPromise.resolve(layout)
      closeDialog()
    })
  }
</script>

<Dialog {...$$props} {title} bind:closeDialog>
  <form class="dialog-body column" on:submit|preventDefault={onSubmit}>
    <input
      required
      type="text"
      name="title"
      value={layoutTitle}
      placeholder="Name of the layout"
      class="input border row" />

    <textarea
      class="input border mrg-l mrg--t mrg--b"
      name="description"
      rows="4"
      value={description}
      placeholder="Description" />

    <button class="btn btn-1 btn--green" type="submit">
      {mode === Mode.New ? 'Create' : 'Save'}</button>
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
