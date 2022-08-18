<script lang="ts">
  var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P
          ? value
          : new P(function (resolve) {
              resolve(value)
            })
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value))
          } catch (e) {
            reject(e)
          }
        }

        function rejected(value) {
          try {
            step(generator['throw'](value))
          } catch (e) {
            reject(e)
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next())
      })
    }

  import { tick } from 'svelte'
  let className = ''
  export { className as class }
  export let items
  export let key = 'key'
  export let renderAmount = 15
  const delayItems = 3

  const updateListHeight = () =>
    (listHeight = listNode === null || listNode === void 0 ? void 0 : listNode.scrollHeight) // TODO: Think of better way [@vanguard | Sep 15, 2021]

  let viewportNode
  let listNode
  let listHeight = 0

  $: viewportNode && (items, (viewportNode.scrollTop = 0))

  $: offsetTop = (items, 0)

  $: start = (items, 0)

  $: end = (items, renderAmount)

  $: renderItems = items.slice(start, end)

  $: renderHeight = listHeight / renderAmount

  $: scrollHeight = renderHeight * items.length

  $: scrollStop = scrollHeight - listHeight

  $: offsetRenderDelay = renderHeight * delayItems

  $: style = listHeight ? `height:${scrollHeight}px` : ''

  $: listNode && setTimeout(updateListHeight, 300)

  function onScroll() {
    return __awaiter(this, void 0, void 0, function* () {
      const { scrollTop } = viewportNode
      const newOffset = scrollTop < scrollStop ? scrollTop : scrollStop
      const newDelay = newOffset - offsetTop
      const renderOffset = Math.ceil(newOffset / renderHeight) - delayItems
      start = renderOffset > 0 ? renderOffset : 0
      end = newOffset === scrollStop ? items.length : start + renderAmount
      yield tick()

      if (start === 0 && scrollTop === 0) {
        return (offsetTop = 0)
      }

      const diff = offsetRenderDelay - newDelay
      offsetTop = diff <= 0 || diff - renderHeight < offsetTop ? start * renderHeight : offsetTop
    })
  }
</script>

<div class="viewport {className}" bind:this={viewportNode} on:scroll={onScroll}>
  <div class="scroll" {style}>
    <div class="list" style="transform:translateY({offsetTop}px)" bind:this={listNode}>
      {#each renderItems as item (item[key])}
        <slot {item} />
      {/each}
    </div>
  </div>
</div>

<style>
  .viewport {
    position: relative;
    overflow-y: auto;
  }

  .scroll {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
</style>
