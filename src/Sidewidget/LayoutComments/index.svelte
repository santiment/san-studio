<script lang="ts">
  import { onDestroy, setContext } from 'svelte'
  import Svg from 'webkit/ui/Svg.svelte'
  import { globals } from '@/stores/globals'
  import { selectedLayout } from '@/stores/layout'
  import { queryLayoutComments } from '@/api/comments'
  import { createLayoutComment } from '@/api/comments/mutate'
  import { updateLayoutCommentsCountCache } from '@/api/layouts/comments'
  import Comment from './Comment.svelte'

  let comments = [] as SAN.Comment[]
  let loading = false
  let commentsNode

  const updateComments = (clb: (comments: SAN.Comment[]) => SAN.Comment[]) =>
    setComments(clb(comments))

  $: layout = $selectedLayout
  $: layout && queryLayoutComments(layout.id).then(setComments)
  $: authorId = layout?.user.id

  function setComments(data: SAN.Comment[]) {
    comments = data
    updateLayoutCommentsCountCache((layout as SAN.Layout).id, data.length)
  }

  function onSubmit({ currentTarget }: Event) {
    if (!layout || !$globals.isLoggedIn || loading) return

    loading = true
    const commentNode = (currentTarget as HTMLFormElement)
      .comment as HTMLTextAreaElement

    createLayoutComment(layout.id, commentNode.value).then((comment) => {
      comments.push(comment)
      setComments(comments)
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

  function adjustHeight({ currentTarget }) {
    if (!currentTarget.value) {
      currentTarget.style.height = '32px'
      return
    }

    currentTarget.style.height = '1px'
    currentTarget.style.height = currentTarget.scrollHeight + 2 + 'px'
  }

  onDestroy(() => {
    removeHighlight?.()
  })
</script>

<div class="body-2 txt-m">Conversations ({comments.length})</div>

{#if $globals.isLoggedIn}
  <form class="row mrg-l mrg--t" on:submit|preventDefault={onSubmit}>
    <textarea
      name="comment"
      required
      rows="1"
      class="border fluid"
      placeholder="Type your comment here"
      on:input={adjustHeight} />

    <button
      type="submit"
      class:loading
      class="btn btn-1 btn--green mrg-l mrg--l">Post</button>
  </form>
{/if}

<div bind:this={commentsNode} class="comments mrg-l mrg--t">
  {#each comments as comment (comment.id)}
    <Comment {comment} {authorId} {updateComments} />
  {:else}
    <div class="column hv-center">
      <Svg illus id="comment-bubble" w="128" h="98" />
      <div class="body-2 txt-m mrg-xl mrg--t">No comments yet</div>
      Be the first to comment
    </div>
  {/each}
</div>

<style>
  textarea {
    resize: none;
    padding: 5px 10px;
    height: 32px;
  }

  .comments {
    overflow: auto;
    margin-right: -8px;
    padding-right: 8px;
    flex: 1;
  }

  .column {
    height: 100%;
  }

  .highlight {
    background: var(--green-light-2) !important;
  }
</style>
