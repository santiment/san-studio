<script lang="ts">
  import { dateDifferenceInWords } from 'webkit/utils/dates'
  import { currentUser } from '@/stores/user'
  import { selectedLayout } from '@/stores/layout'
  import Author from '@/Layouts/LayoutAuthor.svelte'
  import Menu from './Menu.svelte'
  import RepliedTo from './RepliedTo.svelte'
  import { DELETE_MSG } from './DeleteDialog.svelte'
  import { showCommentReplyDialog } from './ReplyDialog.svelte'

  export let comment: SAN.Comment
  export let authorId: number
  export let updateComments: any

  $: ({ content, insertedAt, editedAt, user, parentId } = comment)

  $: edited = editedAt ? 'Edited ' : ''
  $: time =
    edited +
    dateDifferenceInWords(new Date(edited ? (editedAt as string) : insertedAt))

  function onReply() {
    if (!$selectedLayout) return

    showCommentReplyDialog($selectedLayout.id, comment.id).then(
      (newComment) => {
        if (!newComment) return
        updateComments((comments) => (comments.push(newComment), comments))
      },
    )
  }
</script>

{#if parentId}
  <RepliedTo id={comment.parentId} />
{/if}

<div class="comment mrg-l mrg--b" id="comment-{comment.id}">
  <div class="row v-center">
    <Author {user} class="mrg-a mrg--r $style.user">
      {#if comment.user.id === authorId}
        <br />
        <span class="author">Author</span>
      {/if}
    </Author>

    <div class="caption">{time}</div>
  </div>
  <div class="content mrg-s mrg--t">{content}</div>
  <div class="actions row v-center txt-m">
    {#if content !== DELETE_MSG}
      <button class="reply btn" on:click={onReply}>Reply</button>
    {/if}

    {#if $currentUser && $currentUser.id === user.id}
      <Menu bind:comment />
    {/if}
  </div>
</div>

<style>
  .content {
    padding: 16px;
    background: var(--athens);
    border-radius: 8px;
    white-space: pre;
    word-break: break-word;
    transition: background 700ms;
    scroll-margin: 50px;
  }

  .actions {
    --color: var(--waterloo);
    --color-hover: var(--green);
  }

  .user {
    max-width: 60%;
  }
  .author {
    font-size: 10px;
    line-height: 12px;
    color: var(--orange);
    padding: 3px 4px;
    border-radius: 4px;
    background: var(--orange-light-1);
  }

  .reply {
    padding: 6px 12px;
  }
</style>
