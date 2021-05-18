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

export function transformMessage(errorMsg: string): string {
  const error = ERRORS.find(({ anchor }) => errorMsg.includes(anchor))
  return error ? error.msg : errorMsg
}
