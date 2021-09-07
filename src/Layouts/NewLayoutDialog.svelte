<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import NewLayoutDialog from './NewLayoutDialog.svelte'

  export const showNewLayoutDialog = (): Promise<unknown> =>
    dialogs.show(NewLayoutDialog)
</script>

<script lang="ts">
  import { track } from 'webkit/analytics'
  import Dialog from 'webkit/ui/Dialog'
  import { Event } from '@/analytics'
  import { studio } from '@/stores/studio'
  import { getWidgets } from '@/stores/widgets'
  import { createUserLayout } from '@/api/layouts/user/mutate'

  const Widgets = getWidgets()

  let closeDialog

  function onSubmit({ currentTarget }) {
    const title: string = currentTarget.title.value
    const description: string = currentTarget.description.value
    const metrics = [...new Set($Widgets.map(({ metrics }) => metrics).flat())]

    createUserLayout({
      title,
      description,
      metrics: metrics.map(({ key }) => key),
      projectId: $studio.projectId,
      options: '',
    })
      .then((layout) => track.event(Event.NewLayout, { id: layout.id }))
      .then(closeDialog)
  }
</script>

<Dialog {...$$props} title="New Chart Layout" bind:closeDialog>
  <form class="dialog-body column" on:submit|preventDefault={onSubmit}>
    <input
      required
      type="text"
      name="title"
      placeholder="Name of the layout"
      class="input border row" />

    <textarea
      class="input border mrg-l mrg--t mrg--b"
      name="description"
      rows="4"
      placeholder="Description" />

    <button class="btn btn-1 btn--green" type="submit">Create</button>
  </form>
</Dialog>

<style>
  .input {
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
