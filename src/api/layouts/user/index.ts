import type { Query, QueryRecord } from 'webkit/api'
import { query } from 'webkit/api'
import { dateSorter } from '../utils'

export const USER_LAYOUTS_QUERY = `
  {
    currentUser {
			layouts: chartConfigurations{
				id
				title
			  updatedAt
				isPublic
				project {
					projectId: id
					slug
					ticker
					name
				}
				metrics
				options
        user {
	        id
	        username
	        email
	        avatarUrl
        }
			}
    }
  }
`
export type Layout = {
  id: number
  title: number
  updatedAt: string
  isPublic: boolean
  project: {
    projectId: string
    slug: string
    ticker: string
    name: string
  }
  metrics: string[]
  options: any
  user: {
    id: number
    username: null | string
    email: null | string
    avatarUrl: null | string
  }
}
type UserLayoutsTemplate = Query<'currentUser', null | { layouts: Layout[] }>

function userLayoutsPrecacher() {
  return (data: QueryRecord<UserLayoutsTemplate>) => {
    if (data.currentUser) data.currentUser.layouts.sort(dateSorter)
    return data
  }
}
const userLayoutsOptions = { precacher: userLayoutsPrecacher }
const userLayoutsAccessor = ({
  currentUser,
}: QueryRecord<UserLayoutsTemplate>) => currentUser?.layouts || []
export const queryUserLayouts = (): Promise<Layout[]> =>
  query<UserLayoutsTemplate>(USER_LAYOUTS_QUERY, userLayoutsOptions).then(
    userLayoutsAccessor,
  )
