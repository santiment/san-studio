import { query } from 'san-webkit/lib/api';
import { Cache } from 'san-webkit/lib/api/cache';
import { layoutAccessor } from './utils.js';
// --------------------
// ------ LAYOUT ------
// --------------------
export const LAYOUT_QUERY_FIELDS = `id
			title
			options
			metrics
      description
			project {
        projectId: id
				name
				slug
				ticker
			}
			user {
				id
				username
				email
				avatarUrl
			}`;
const LAYOUT_QUERY = (id) => `
  {
    layout:chartConfiguration(id:${id}){
      ${LAYOUT_QUERY_FIELDS}
      isPublic
	  }
  }
`;
export const queryLayout = (id) => query(LAYOUT_QUERY(id)).then(layoutAccessor);
export const updateLayoutCache = (layout) => Cache.set(LAYOUT_QUERY(layout.id), { layout });
// --------------------------
// ------ SHORT LAYOUT ------
// --------------------------
const SHORT_LAYOUT_QUERY = (id) => `
  {
    layout:chartConfiguration(id:${id}){
			id
			title
    }
  }
`;
export const queryShortLayout = (id) => query(SHORT_LAYOUT_QUERY(id)).then(layoutAccessor);
//# sourceMappingURL=layout.js.map