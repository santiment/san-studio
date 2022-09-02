export const layoutAccessor = ({ layout }) => layout
export const layoutsAccessor = ({ layouts }) => layouts
export const currentUserLayoutsAccessor = ({ currentUser }) =>
  (currentUser === null || currentUser === void 0 ? void 0 : currentUser.layouts) || []
export const dateSorter = ({ updatedAt: a }, { updatedAt: b }) => +new Date(b) - +new Date(a)
function dataSorter(data) {
  data.layouts.sort(dateSorter)
  return data
}
export const sortableLayoutsOptions = { precacher: () => dataSorter }
function currentUserDataSorter(data) {
  var _a
  ;(_a = data.currentUser) === null || _a === void 0 ? void 0 : _a.layouts.sort(dateSorter)
  return data
}
export const currentUserSortableLayoutsOptions = {
  precacher: () => currentUserDataSorter,
}
//# sourceMappingURL=utils.js.map
