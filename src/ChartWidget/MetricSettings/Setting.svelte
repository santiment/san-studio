<script>
  let className = ''
  export { className as class }
</script>

<div class="setting row v-center mrg-l mrg--l btn {className}" on:click>
  <slot />
</div>

<style>
  .setting {
    height: 22px;
    border-bottom: 1px dashed var(--mystic);
    --color: var(--waterloo);
    --fill-hover: var(--green);
  }
</style>
