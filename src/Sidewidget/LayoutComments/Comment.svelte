<script lang="ts">
  import Author from '@/Layouts/LayoutAuthor.svelte'

  export let comment: SAN.Comment
</script>

<div class="comment mrg-l mrg--b">
  <div class="row v-center">
    <Author user={comment.user} class="mrg-a mrg--r" />
    <div class="caption">12 days ago</div>
  </div>
  <div class="content mrg-s mrg--t">{comment.content}</div>
  <div class="actions row v-center txt-m">
    <button class="btn mrg-s mrg--t">Reply</button>
  </div>
</div>

<style>
  .content {
    padding: 16px;
    background: var(--athens);
    border-radius: 8px;
  }

  .actions {
    color: var(--waterloo);
    padding: 0 16px;
    --color-hover: var(--green);
  }
</style>
