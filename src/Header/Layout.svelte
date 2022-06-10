<script lang="ts">
  import { track } from 'webkit/analytics'
  import CreationInfo from 'webkit/ui/CreationInfo/svelte'
  import { newVotes } from 'webkit/ui/CreationInfo/VoteButton.svelte'
  import { CreationType } from 'webkit/ui/Profile/types'
  import { Event } from '@/analytics'
  import { selectedLayout } from '@/stores/layout'
  import { currentUser } from '@/stores/user'
  import { SidewidgetType, getSidewidget } from '@/stores/widgets'
  import LayoutInfo from '@/Layouts/LayoutInfo.svelte'
  import { queryLayoutVotes } from '@/api/layouts/votes'
  import {
    queryLayoutCommentsCount,
    subscribeLayoutCommentsCountCache,
  } from '@/api/layouts/comments'

  const Sidewidget = getSidewidget()
  let votes = newVotes()
  let commentsCount = 0
  let unsubscribe: ReturnType<typeof subscribeLayoutCommentsCountCache>

  $: layout = $selectedLayout
  $: ({ id, title, user } = layout || {})
  $: isAuthor = $currentUser && layout && +layout.user.id === +$currentUser.id
  $: if (process.browser && id) {
    getVotes(id)
    getCommentsCount(id)
  }

  const setCount = (count: number) => (commentsCount = count)
  function getCommentsCount(id: number) {
    queryLayoutCommentsCount(id).then(setCount)
    unsubscribe?.()
    unsubscribe = subscribeLayoutCommentsCountCache(id, setCount)
  }

  const setVotes = (data) => (votes = data)
  function getVotes(id: number) {
    votes = newVotes()
    queryLayoutVotes(id).then(setVotes)
  }

  function onVote() {
    track.event(Event.LikeLayout, { id })
  }

  function onEditClick() {
    if (!$currentUser) return

    const handler = layout
      ? isAuthor
        ? window.onLayoutEdit
        : window.saveAsNewLayout
      : window.saveLayout

    return handler?.()
  }
</script>

<CreationInfo
  type={CreationType.Layout}
  {id}
  {title}
  {user}
  {votes}
  currentUser={$currentUser}
  editLabel={isAuthor ? 'Edit layout' : 'Save as'}
  comments={{
    count: commentsCount,
    active: $Sidewidget === SidewidgetType.LAYOUT_COMMENTS,
    onClick: () => Sidewidget.set(SidewidgetType.LAYOUT_COMMENTS),
  }}
  {onEditClick}
  {onVote}
>
  <svelte:fragment slot="info">
    <LayoutInfo {layout} />
  </svelte:fragment>
</CreationInfo>
