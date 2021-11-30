import { query } from 'webkit/api'

const LAYOUT_VOTES_QUERY = (id: number) => `
  {
    layout:chartConfiguration(id:${id}){
      votes {
        userVotes:currentUserVotes
        totalVotes
      }
    }
  }
`

type LayoutVotesQuery = SAN.API.Query<
  'layout',
  {
    votes: {
      userVotes: number
      totalVotes: number
    }
  }
>

const accessor = ({ layout }: LayoutVotesQuery) => layout.votes
const options = { cacheTime: 120 } // 2 mins cache time
export const queryLayoutVotes = (id: number) =>
  query<LayoutVotesQuery>(LAYOUT_VOTES_QUERY(id), options).then(accessor)
