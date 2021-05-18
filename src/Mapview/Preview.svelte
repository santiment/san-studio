<script lang="ts">
  let className = ''
  export { className as class }
  export let isBlocked = false
  export let isMetricsPhase = false
</script>

<div
  on:click
  class="preview border {className}"
  class:apply={isMetricsPhase}
  class:blocked={isBlocked}>
  <slot />
</div>

<style>
  .preview {
    height: 250px;
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    position: relative;
  }

  :global(.preview-info),
  .preview::after {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .preview::after {
    opacity: 0;
    content: 'Click to zoom into chart';
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(24, 27, 43, 0.84);
    color: #fff;
    transition: opacity 0.2s ease-in-out;
  }
  .preview:hover::after {
    opacity: 1;
  }

  .apply::after {
    content: 'Click to apply selected metrics';
  }

  .blocked {
    pointer-events: none;
  }
  .blocked::after {
    opacity: 1;
    content: "New metrics can't be added to this widget";
  }
</style>
