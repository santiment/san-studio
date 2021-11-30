<script lang="ts">
  import { track } from 'webkit/analytics'
  import { vote, VoteType } from 'webkit/api/vote'
  import LikeButton from 'webkit/ui/LikeButton/svelte'
  import { Event } from '@/analytics'
  import { currentUser } from '@/stores/user'
  import { queryLayoutVotes } from '@/api/layouts/votes'

  const newVotes = () => ({ totalVotes: 0, userVotes: 0 })

  let className = ''
  export { className as class }
  export let layout: Pick<SAN.Layout, 'id'>

  let votes = newVotes()

  $: getVotes(layout.id)

  const setVotes = (data) => (votes = data)
  function getVotes(id: number) {
    votes = newVotes()
    queryLayoutVotes(id).then(setVotes)
  }

  function onVote() {
    track.event(Event.LikeLayout, { id: layout.id })
    vote(layout.id, VoteType.Layout).catch(() => {
      votes.totalVotes -= 1
      votes.userVotes -= 1
    })
  }
</script>

<LikeButton
  class={className}
  {onVote}
  disabled={!$currentUser}
  bind:userVotes={votes.userVotes}
  bind:totalVotes={votes.totalVotes} />
