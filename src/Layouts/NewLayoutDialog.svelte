<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import NewLayoutDialog from './NewLayoutDialog.svelte'

  export const showNewLayoutDialog = (): Promise<unknown> =>
    dialogs.show(NewLayoutDialog)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'

  function onSubmit({ currentTarget }) {
    const title = currentTarget.title.value
    const description = currentTarget.description.value
    console.log(title, description)
  }
</script>

<Dialog {...$$props} title="New Chart Layout">
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
