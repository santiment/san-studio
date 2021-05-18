import type { Query, QueryRecord } from 'webkit/api'
import { query, mutate } from 'webkit/api'

export const FAVORITE_METRICS_QUERY = `
  {
    currentUser {
      settings {
        favoriteMetrics
      }
    }
  }
`

const UPDATE_FAVORITES_MUTATION = `
  mutation updateUserSettings($metrics: [String]!) {
    updateUserSettings(settings: { favoriteMetrics: $metrics }) {
      favoriteMetrics
    }
  }
`

export type FavoriteMetrics = string[]
type FavoriteMetricsQuery = Query<
  'currentUser',
  null | {
    settings: {
      favoriteMetrics: FavoriteMetrics
    }
  }
>

const accessor = ({ currentUser }: QueryRecord<FavoriteMetricsQuery>) =>
  currentUser ? currentUser.settings.favoriteMetrics : []
export const queryFavoriteMetrics = () =>
  query<FavoriteMetricsQuery>(FAVORITE_METRICS_QUERY).then(accessor)

export const mutateFavoriteMetrics = (metrics: string[]) =>
  mutate<any>(UPDATE_FAVORITES_MUTATION, {
    variables: {
      metrics,
    },
  })
