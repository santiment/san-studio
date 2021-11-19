<script lang="ts">
  import { onDestroy, setContext } from 'svelte'
  import { globals } from '@/stores/globals'
  import { selectedLayout } from '@/stores/layout'
  import { queryLayoutComments } from '@/api/comments'
  import { createLayoutComment } from '@/api/comments/mutate'
  import Comment from './Comment.svelte'

  let comments = [] as SAN.Comment[]
  let loading = false
  let commentsNode

  const setComments = (data: SAN.Comment[]) => (comments = data)
  const updateComments = (clb: (comments: SAN.Comment[]) => SAN.Comment[]) =>
    setComments(clb(comments))

  $: layout = $selectedLayout
  $: layout && queryLayoutComments(layout.id).then(setComments)
  $: authorId = layout?.user.id

  $: console.log(layout)
  $: console.log(comments)

  function onSubmit({ currentTarget }: Event) {
    if (!layout || !$globals.isLoggedIn || loading) return

    loading = true
    const commentNode = (currentTarget as HTMLFormElement)
      .comment as HTMLTextAreaElement

    createLayoutComment(layout.id, commentNode.value).then((comment) => {
      comments.push(comment)
      comments = comments.slice()
      commentNode.value = ''
      loading = false
    })
  }

  setContext('getRepliedToComment', getRepliedToComment)
  function getRepliedToComment(id: number) {
    return comments.find((comment) => comment.id === id)
  }

  let removeHighlight: () => void
  setContext('scrollToReply', scrollToReply)
  function scrollToReply(e: MouseEvent) {
    e.preventDefault()
    e.stopImmediatePropagation()
    removeHighlight?.()

    const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href')
    const comment = commentsNode.querySelector(`${href} .content`)
    if (!comment) return

    comment.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
    comment.classList.add('$style.highlight')

    const timer = setTimeout(undo, 900)
    removeHighlight = undo

    function undo() {
      comment?.classList.remove('$style.highlight')
      clearTimeout(timer)
    }
  }

  onDestroy(() => {
    removeHighlight?.()
  })
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

<div bind:this={commentsNode} class="comments mrg-l mrg--t">
  {#each comments as comment (comment.id)}
    <Comment {comment} {authorId} {updateComments} />
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
    margin-right: -8px;
    padding-right: 8px;
  }

  .highlight {
    background: var(--green-light-2) !important;
  }
</style>
