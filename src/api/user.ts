import { query } from 'webkit/api'

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

export type CurrentUser = { id: number; following: { users: { id: number }[] } } | null
type CurrentUserQuery = SAN.API.Query<'currentUser', CurrentUser>

const accessor = ({ currentUser }: CurrentUserQuery) => currentUser
export const queryCurrentUser = (): Promise<CurrentUser> =>
  query<CurrentUserQuery>(CURRENT_USER_QUERY).then(accessor)
