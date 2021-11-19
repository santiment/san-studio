<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'

  let className = ''
  export { className as class }
  export let user: SAN.Author
</script>

<a class="row v-center {className}" href="/profile/{user.id}">
  <div class="img mrg-s mrg--r row hv-center">
    {#if user.avatarUrl}
      <img alt="Avatar" src={user.avatarUrl} />
    {:else}
      <Svg id="user" w="16" />
    {/if}
  </div>
  <span>
    {user.username || user.email}
  </span>
</a>

<style>
  .img,
  img {
    width: 32px;
    height: 32px;
    max-width: 32px;
    max-height: 32px;
    min-width: 32px;
  }

  .img {
    fill: var(--waterloo);
    background: var(--porcelain);
    border-radius: 50%;
    overflow: hidden;
  }

  a {
    color: var(--black);
  }
  a:hover {
    color: var(--green);
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
