<script lang="ts">
  import { globals } from '@/stores/globals'
  import { selectedLayout } from '@/stores/layout'
  import { queryLayoutComments } from '@/api/comments'
  import { createLayoutComment } from '@/api/comments/mutate'
  import Comment from './Comment.svelte'

  let comments = [] as SAN.Comment[]
  let loading = false

  const setComments = (data: SAN.Comment[]) => (comments = data)

  $: layout = $selectedLayout
  $: layout && queryLayoutComments(layout.id).then(setComments)

  $: console.log(layout)
  $: console.log(comments)

  function onSubmit({ currentTarget }: Event) {
    if (!layout || !$globals.isLoggedIn || loading) return

    loading = true
    const commentNode = (currentTarget as HTMLFormElement)
      .comment as HTMLTextAreaElement

    createLayoutComment(layout.id, commentNode.value).then((comment) => {
      comments = comments.concat(comment)
      commentNode.value = ''
      loading = false
    })
  }
</script>

<h3 class="body-2 txt-m mrg-l mrg--b">Conversations ({comments.length})</h3>

<form class="row" on:submit|preventDefault={onSubmit}>
  <textarea
    name="comment"
    required
    rows="1"
    class="border fluid"
    placeholder="Type your comment here" />

  <button type="submit" class:loading class="btn btn-1 btn--green mrg-l mrg--l"
    >Post</button>
</form>

<div class="comments mrg-l mrg--t">
  {#each comments as comment (comment.id)}
    <Comment {comment} />
  {:else}
    <div class="column hv-center">
      <div class="body-2 txt-m">No comments yet</div>
      Be the first to comment
    </div>
  {/each}
</div>

<style>
  textarea {
    resize: none;
    padding: 5px 10px;
  }

  .column {
    flex: 1;
  }

  .comments {
    overflow: auto;
  }
</style>
