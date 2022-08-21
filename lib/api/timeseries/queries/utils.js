const defaultModifier = (key, datetime, value) => ({
    datetime,
    [key]: value,
});
export function newPrecacher(dataAccessor, modifyData = defaultModifier, prepareResult) {
    return ({ key }) => (response) => {
        const data = dataAccessor(response);
        const result = new Array(data.length);
        for (let i = result.length - 1; i > -1; i--) {
            const { d, v } = data[i];
            result[i] = modifyData(key, +new Date(d), v);
        }
        return prepareResult ? prepareResult(result) : result;
    };
}
//# sourceMappingURL=utils.js.map