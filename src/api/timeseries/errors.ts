export const NO_DATA_MSG = 'No data for the requested period'

const SUBSCRIPTION_INTERVAL = {
  anchor: 'outside the allowed interval',
  msg: 'Requested dates are outside of the allowed interval for your subscription',
}

const PROJECT_FETCH = {
  anchor: 'for project with slug',
  msg: "Can't fetch data for this project",
}

const ERRORS = [SUBSCRIPTION_INTERVAL, PROJECT_FETCH]

export function transformMessage(errorMsg: string | any[]): string {
  const unpacked = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg
  const msg = unpacked && (unpacked.message || unpacked.details)
  const error = msg && ERRORS.find(({ anchor }) => msg.includes(anchor))
  return error ? error.msg : msg
}
