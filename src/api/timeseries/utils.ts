import type { MetricTimeseries } from './index'

const OLD_DATE = { datetime: 0 }
function findDatetimeBorder(baseTs, cursor, targetDatetime) {
  const baseTsLength = baseTs.length

  do {
    cursor++
  } while (
    cursor < baseTsLength &&
    targetDatetime > new Date(baseTs[cursor].datetime)
  )

  return cursor
}

const newDataMapper = (data) => Object.assign({}, data)

export function mergeTimeseries(ts1: MetricTimeseries, ts2: MetricTimeseries) {
  const longestTS = ts1.length > ts2.length ? ts1 : ts2
  const timeserie = longestTS === ts2 ? ts1 : ts2

  let baseTs = longestTS.map(newDataMapper)
  const tsLength = timeserie.length

  for (
    let timeserieCursor = 0, baseTsCursor = 0;
    timeserieCursor < tsLength;
    timeserieCursor++, baseTsCursor++
  ) {
    const isBaseInBounds = baseTsCursor < baseTs.length
    const timeserieData = timeserie[timeserieCursor]
    const baseTsData = isBaseInBounds ? baseTs[baseTsCursor] : OLD_DATE

    const timeserieDatetime = timeserieData.datetime
    const baseTsDatetime = baseTsData.datetime

    if (timeserieDatetime === baseTsDatetime) {
      Object.assign(baseTsData, timeserieData)
      continue
    }

    if (timeserieDatetime > baseTsDatetime) {
      // current timeserie's datetime is greater than the base

      baseTsCursor = findDatetimeBorder(baseTs, baseTsCursor, timeserieDatetime)

      if (baseTsCursor >= baseTs.length) {
        // Base doesn't have data after this datetime
        baseTs = baseTs.concat(
          timeserie.slice(timeserieCursor).map(newDataMapper),
        )
        break
      } else {
        // Found potentially similar base to datetime
        const foundBaseTs = baseTs[baseTsCursor]
        if (timeserieDatetime === foundBaseTs.datetime) {
          // Merging timeseries with same datetime
          Object.assign(foundBaseTs, timeserieData)
        } else {
          // Inserting it before found base
          baseTs.splice(baseTsCursor, 0, newDataMapper(timeserieData))
        }
      }
    } else {
      // current timeserie's datetime is less than the base
      const timeserieLeftCursor = timeserieCursor

      timeserieCursor = findDatetimeBorder(
        timeserie,
        timeserieCursor,
        baseTsDatetime,
      )

      if (timeserieCursor >= timeserie.length) {
        // No base found with similar datetime
        baseTs.splice(
          baseTsCursor,
          0,
          ...timeserie.slice(timeserieLeftCursor).map(newDataMapper),
        )
        break
      } else {
        // Found potentially similar datetime to base
        baseTs.splice(
          baseTsCursor,
          0,
          ...timeserie
            .slice(timeserieLeftCursor, timeserieCursor)
            .map(newDataMapper),
        )

        const foundTimeserieData = timeserie[timeserieCursor]
        if (baseTsData.datetime === foundTimeserieData.datetime) {
          Object.assign(baseTsData, foundTimeserieData)
        }
      }
    }
  }

  return baseTs
}
