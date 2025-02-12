export const layoutAccessor = ({ layout }) => layout;
export const layoutsAccessor = ({ layouts }) => Array.isArray(layouts) ? layouts.filter((item) => Boolean(item.title)) : layouts;
export const currentUserLayoutsAccessor = ({ currentUser, }) => ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.layouts) || []).map((item) => {
    if (!item.title)
        item.title = '';
    return item;
});
export const dateSorter = ({ updatedAt: a }, { updatedAt: b }) => +new Date(b) - +new Date(a);
function dataSorter(data) {
    data.layouts.sort(dateSorter);
    return data;
}
export const sortableLayoutsOptions = { precacher: () => dataSorter };
function currentUserDataSorter(data) {
    var _a;
    (_a = data.currentUser) === null || _a === void 0 ? void 0 : _a.layouts.sort(dateSorter);
    return data;
}
export const currentUserSortableLayoutsOptions = {
    precacher: () => currentUserDataSorter,
};
//# sourceMappingURL=utils.js.map