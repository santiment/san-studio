import { query } from 'san-webkit/lib/api'
export const CURRENT_USER_QUERY = `{
  currentUser {
    id
    following {
      users {
        id
      }
    }
  }
}`
const accessor = ({ currentUser }) => currentUser
export const queryCurrentUser = () => query(CURRENT_USER_QUERY).then(accessor)
//# sourceMappingURL=user.js.map
