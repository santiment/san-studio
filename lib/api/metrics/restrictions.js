import { query } from 'san-webkit/lib/api';
const newQuery = (data) => `{ getAccessRestrictions {
      name
      ${data}
    }}`;
const MIN_INTERVAL_QUERY = newQuery('minInterval');
function precacher() {
    return ({ getAccessRestrictions: data }) => {
        const MetricMinInterval = {};
        const { length } = data;
        for (let i = 0; i < length; i++) {
            const restriction = data[i];
            MetricMinInterval[restriction.name] = restriction;
        }
        return MetricMinInterval;
    };
}
const options = { precacher };
export const queryMinInterval = () => query(MIN_INTERVAL_QUERY, options).catch(() => ({}));
export const getMetricKeyMinInterval = (metricKey) => queryMinInterval().then((MetricMinInterval) => { var _a; return (_a = MetricMinInterval[metricKey]) === null || _a === void 0 ? void 0 : _a.minInterval; });
export const getMetricMinInterval = ({ key, queryKey = key }) => getMetricKeyMinInterval(queryKey);
const RESTRICTED_DATES_QUERY = newQuery('restrictedFrom restrictedTo');
export const queryRestrictedDates = () => query(RESTRICTED_DATES_QUERY, options);
//# sourceMappingURL=restrictions.js.map