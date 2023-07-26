import { query } from 'san-webkit/lib/api';
import { sortableLayoutsOptions, layoutsAccessor } from './utils.js';
import { LAYOUT_QUERY_FIELDS } from './layout.js';
// --------------------------------------------
// ------ FEATURED/PROJECT SHORT LAYOUTS ------
// --------------------------------------------
const FEATURED_SHORT_LAYOUTS_QUERY = `
  {
    layouts:featuredChartConfigurations{
			id
			title
    }
  }
`;
const SHORT_LAYOUTS_QUERY = (slug) => `
  {
    layouts:chartConfigurations(projectSlug:"${slug}") {
			id
			title
			updatedAt
    }
  }
`;
export const queryFeaturedShortLayouts = () => query(FEATURED_SHORT_LAYOUTS_QUERY).then(layoutsAccessor);
export const queryShortLayouts = (slug) => query(SHORT_LAYOUTS_QUERY(slug), sortableLayoutsOptions).then(layoutsAccessor);
// -----------------------------
// ------ PROJECT LAYOUTS ------
// -----------------------------
const PROJECT_LAYOUTS_QUERY = (slug) => `
  {
    layouts:chartConfigurations(projectSlug:"${slug}") {
      ${LAYOUT_QUERY_FIELDS}
			updatedAt
      isPublic
    }
  }
`;
export const queryLayouts = (slug) => query(PROJECT_LAYOUTS_QUERY(slug), sortableLayoutsOptions).then(layoutsAccessor);
//# sourceMappingURL=layouts.js.map