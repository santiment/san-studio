import { mutate } from 'san-webkit/lib/api';
import { updateCurrentUserLayoutsCache, updateCurrentUserShortLayoutsCache } from './user';
import { LAYOUT_QUERY_FIELDS, updateLayoutCache } from './layout';
import { dateSorter } from './utils';
const newLayoutMutation = (mutation, argTypes = '', args = '') => `
  mutation(
    $settings: ProjectChartInputObject! ${argTypes}
  ) {
    layout:${mutation}(settings: $settings${args}) {
      ${LAYOUT_QUERY_FIELDS}
      isPublic
      updatedAt
    }
  }
`;
function normalizeSettings(settings) {
    const variables = Object.assign({}, settings);
    const { projectId, options, metricsJson } = variables;
    if (projectId)
        variables.projectId = +projectId;
    if (options) {
        if (typeof options === 'string') {
            settings.options = JSON.parse(options);
        }
        else {
            variables.options = JSON.stringify(options);
        }
    }
    if (metricsJson) {
        variables.metricsJson = JSON.stringify(metricsJson);
    }
    return variables;
}
// ------------------------------
// ------- UPDATE LAYOUT --------
// ------------------------------
const UPDATE_LAYOUT_MUTATION = newLayoutMutation('updateChartConfiguration', '$id: ID!', ',id: $id');
function mutateLayoutsCacheOnUpdate(newLayout) {
    const id = +newLayout.id;
    const updateLayout = (cachedLayout) => +cachedLayout.id === id && Object.assign(cachedLayout, newLayout);
    function updateCache(cached) {
        if (!cached.currentUser)
            return cached;
        const { layouts } = cached.currentUser;
        layouts.some(updateLayout);
        layouts.sort(dateSorter);
        return cached;
    }
    updateCurrentUserLayoutsCache(updateCache);
    updateCurrentUserShortLayoutsCache(updateCache);
    updateLayoutCache(newLayout);
    return newLayout;
}
export const updateUserLayout = (id, settings) => mutate(UPDATE_LAYOUT_MUTATION, {
    variables: { id, settings: normalizeSettings(settings) },
}).then(({ layout }) => mutateLayoutsCacheOnUpdate(layout));
// ------------------------------
// ------- CREATE LAYOUT --------
// ------------------------------
const CREATE_LAYOUT_MUTATION = newLayoutMutation('createChartConfiguration');
function mutateLayoutsCacheOnCreation(newLayout) {
    function updateCache(cached) {
        if (!cached.currentUser)
            return cached;
        cached.currentUser.layouts.unshift(newLayout);
        return cached;
    }
    updateCurrentUserLayoutsCache(updateCache);
    updateCurrentUserShortLayoutsCache(updateCache);
    updateLayoutCache(newLayout);
    return newLayout;
}
export const createUserLayout = (settings) => mutate(CREATE_LAYOUT_MUTATION, {
    variables: { settings: normalizeSettings(settings) },
}).then(({ layout }) => mutateLayoutsCacheOnCreation(layout));
// ------------------------------
// ------- DELETE LAYOUT --------
// ------------------------------
export const DELETE_LAYOUT_MUTATION = `
  mutation ($id: ID!) {
    deleteChartConfiguration(id: $id) {
      id
    }
  }
`;
function mutateLayoutsCacheOnDeletion(id) {
    const indexFinder = (layout) => +layout.id === +id;
    function updateCache(cached) {
        if (!cached.currentUser)
            return cached;
        const { layouts } = cached.currentUser;
        const index = layouts.findIndex(indexFinder);
        if (index > -1)
            layouts.splice(index, 1);
        return cached;
    }
    updateCurrentUserLayoutsCache(updateCache);
    updateCurrentUserShortLayoutsCache(updateCache);
}
export const deleteUserLayout = (id) => mutate(DELETE_LAYOUT_MUTATION, {
    variables: { id },
}).then(() => mutateLayoutsCacheOnDeletion(id));
//# sourceMappingURL=mutate.js.map