import { query } from 'san-webkit/lib/api';
import { Cache } from 'san-webkit/lib/api/cache';
import { currentUserLayoutsAccessor, currentUserSortableLayoutsOptions } from './utils.js';
import { LAYOUT_QUERY_FIELDS } from './layout.js';
const newCurrentUserShortLayoutsCacheUpdater = (query) => (updateCache) => Cache.set$(query, updateCache);
const newCurrentUserShortLayoutsCacheSubscriber = (query) => (clb) => Cache.get$(query, clb);
export const USER_LAYOUTS_QUERY = `
  {
    currentUser {
			layouts: chartConfigurations{
        ${LAYOUT_QUERY_FIELDS}
			  updatedAt
				isPublic
			}
    }
  }
`;
export const queryCurrentUserLayouts = () => query(USER_LAYOUTS_QUERY, currentUserSortableLayoutsOptions).then(currentUserLayoutsAccessor);
export const updateCurrentUserLayoutsCache = newCurrentUserShortLayoutsCacheUpdater(USER_LAYOUTS_QUERY);
export const subscribeCurrentUserLayoutsCache = newCurrentUserShortLayoutsCacheSubscriber(USER_LAYOUTS_QUERY);
// ----------------------------------------
// ------ CURRENT USER SHORT LAYOUTS ------
// ----------------------------------------
export const CURRENT_USER_SHORT_LAYOUTS_QUERY = `
  {
    currentUser {
			layouts:chartConfigurations{
				id
				title
			  updatedAt
			}
    }
  }
`;
export const queryCurrentUserShortLayouts = () => query(CURRENT_USER_SHORT_LAYOUTS_QUERY, currentUserSortableLayoutsOptions).then(currentUserLayoutsAccessor);
export const updateCurrentUserShortLayoutsCache = newCurrentUserShortLayoutsCacheUpdater(CURRENT_USER_SHORT_LAYOUTS_QUERY);
export const subscribeCurrentUserShortLayoutsCache = newCurrentUserShortLayoutsCacheSubscriber(CURRENT_USER_SHORT_LAYOUTS_QUERY);
//# sourceMappingURL=user.js.map