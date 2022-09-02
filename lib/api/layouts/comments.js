import { query } from 'san-webkit/lib/api';
import { Cache } from 'san-webkit/lib/api/cache';
const LAYOUT_QUERY = (id) => `
  {
    layout:chartConfiguration(id:${id}){commentsCount}
  }
`;
const precacher = () => ({ layout }) => layout.commentsCount;
const options = { precacher };
export const queryLayoutCommentsCount = (id) => query(LAYOUT_QUERY(id), options);
// ------------
// CACHE
// ------------
export const subscribeLayoutCommentsCountCache = (id, clb) => Cache.get$(LAYOUT_QUERY(id), clb);
export const updateLayoutCommentsCountCache = (id, commentsCount) => Cache.set$(LAYOUT_QUERY(id), (() => commentsCount));
//# sourceMappingURL=comments.js.map