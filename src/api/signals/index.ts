import type { Query, QueryRecord } from 'webkit/api'
import { query } from 'webkit/api'

const PROJECT_AVAILABLE_SIGNALS_QUERY = (slug: string): string => `
  {
    projectBySlug(slug:"${slug}") {
      availableSignals
    }
  }
`
type ProjectMetrics = Query<'projectBySlug', { availableSignals: string[] }>

const dataAccessor = ({ projectBySlug }: QueryRecord<ProjectMetrics>) =>
  projectBySlug.availableSignals
export const queryProjectSignals = (slug: string): Promise<string[]> =>
  query<ProjectMetrics>(PROJECT_AVAILABLE_SIGNALS_QUERY(slug)).then(
    dataAccessor,
  )

function newNotablesQuery(availableSignals) {
  let query =
    'query getSignal($slug: String, $from: DateTime, $to: DateTime, $interval: interval){'
  for (let i = 0, len = availableSignals.length; i < len; i++) {
    query += `
  ${availableSignals[i]}: getSignal(signal: "${availableSignals[i]}"){
    timeseriesData(
      slug: $slug
      from: $from
      to: $to
      interval: $interval){
        d: datetime
        v: value
      }
  }
`
  }

  return query + '}'
}

function precacher() {
  return (response: any) => {
    const result = {}
    Object.keys(response).forEach((key) => {
      const rawData = response[key].timeseriesData
      const data = new Array(rawData.length)
      for (let i = rawData.length - 1; i > -1; i--) {
        const { d, v } = rawData[i]
        data[i] = { datetime: +new Date(d), value: v }
      }

      result[key] = data
    })
    return result
  }
}

export const queryProjectNotables = ({
  slug,
  from,
  to,
  interval,
}): Promise<string[]> =>
  queryProjectSignals(slug).then((availableSignals) =>
    query(newNotablesQuery(availableSignals), {
      variables: { slug, from, to, interval },
      precacher,
    }),
  )

const SIGNAL_QUERY = `
  query getSignal(
    $signal: String
    $slug: String
    $from: DateTime
    $to: DateTime
    $interval: interval
  ) {
    getSignal(signal: $signal) {
      timeseriesData(slug: $slug, from: $from, to: $to, interval: $interval) {
        d: datetime
        v: value
      }
    }
  }
`

function signalTimeseriesPrecacher() {
  return ({ getSignal }) => {
    const rawData = getSignal.timeseriesData
    const data = new Array(rawData.length)
    for (let i = rawData.length - 1; i > -1; i--) {
      const { d, v } = rawData[i]
      data[i] = { datetime: +new Date(d), value: v }
    }

    return data
  }
}

export const querySignalTimeseries = (
  signal: string,
  { slug, from, to, interval },
) =>
  query(SIGNAL_QUERY, {
    variables: { signal, slug, from, to, interval },
    precacher: signalTimeseriesPrecacher,
  })
