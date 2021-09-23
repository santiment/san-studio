<script lang="ts">
  import rocketPng from './rocket.png'

  export let drawer, chart

  var img = new Image() // Create new img element
  img.addEventListener('load', () =>
    drawer.ctx.drawImage(img, 100, 100, 50, 50),
  )

  img.src = rocketPng
</script>

<style>
</style>
