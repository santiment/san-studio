export const dateSorter = ({ updatedAt: a }, { updatedAt: b }) =>
  +new Date(b) - +new Date(a)
