import { query } from 'san-webkit/lib/api'
const LAYOUT_VOTES_QUERY = (id) => `
  {
    layout:chartConfiguration(id:${id}){
      votes {
        userVotes:currentUserVotes
        totalVotes
      }
    }
  }
`
const accessor = ({ layout }) => layout.votes
const options = { cacheTime: 120 } // 2 mins cache time
export const queryLayoutVotes = (id) => query(LAYOUT_VOTES_QUERY(id), options).then(accessor)
//# sourceMappingURL=votes.js.map
