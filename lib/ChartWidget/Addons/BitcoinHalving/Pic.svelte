<script>
  import { RANDOM_HALVING_PIC } from './index'

  let className = ''
  export { className as class }
</script>

<div class={className}>
  <img src={RANDOM_HALVING_PIC} alt="Halving" />
</div>

<style>
  div {
    width: 22px;
    height: 22px;
    min-width: 18px;
    border-radius: 50%;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
  }
</style>
