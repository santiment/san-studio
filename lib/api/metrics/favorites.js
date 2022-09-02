import { query, mutate } from 'san-webkit/lib/api'
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
const accessor = ({ currentUser }) => (currentUser ? currentUser.settings.favoriteMetrics : [])
export const queryFavoriteMetrics = () => query(FAVORITE_METRICS_QUERY).then(accessor)
export const mutateFavoriteMetrics = (metrics) =>
  mutate(UPDATE_FAVORITES_MUTATION, {
    variables: {
      metrics,
    },
  })
//# sourceMappingURL=favorites.js.map
