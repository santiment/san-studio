import type { Query, QueryRecord } from 'webkit/api'
import { query } from 'webkit/api'

export const USER_QUERY = `
  {
    currentUser {
      id
    }
  }
`

type CurrentUser = null | { id: number }
export type CurrentUserQuery = Query<'currentUser', CurrentUser>

const accessor = ({ currentUser }: QueryRecord<CurrentUserQuery>) => currentUser
export const queryCurrentUser = (): Promise<CurrentUser> =>
  query<CurrentUserQuery>(USER_QUERY).then(accessor)
