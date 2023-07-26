import { newPrecacher } from './utils.js';
const dataAccessor = ({ getMetric }) => getMetric.timeseriesData;
const dataModifier = (key, datetime, value) => ({
    datetime,
    [key]: value - 1,
});
const prepareResult = (data) => ({
    getMetric: {
        timeseriesData: data,
    },
});
export const mvrvPrecacher = newPrecacher(dataAccessor, dataModifier, prepareResult);
//# sourceMappingURL=mvrv.js.map