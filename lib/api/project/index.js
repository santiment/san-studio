import { query } from 'san-webkit/lib/api';
const PROJECT_NAME_QUERY = (slug) => `
  {
    projectBySlug(slug:"${slug}") {
      name
      ticker
      logoUrl
      projectId: id
    }
  }
`;
const PROJECT_PRICE_AND_CHANGE_QUERY = (slug) => `
  {
    projectBySlug(slug:"${slug}") {
			priceUsd
			percentChange24h
      marketcapUsd
      rank
    }
  }
`;
const accessor = ({ projectBySlug }) => projectBySlug;
export const queryProjectPriceChange = (slug) => query(PROJECT_PRICE_AND_CHANGE_QUERY(slug)).then(accessor);
const projectAccessor = ({ projectBySlug }) => projectBySlug;
export const queryProject = (slug) => query(PROJECT_NAME_QUERY(slug)).then(projectAccessor);
const PROJECT_FIELDS = `slug
      ticker
      name
      priceUsd
      infrastructure
      logoUrl`;
let ALL_PROJECTS = `
  {
    allProjects(minVolume:0){
${PROJECT_FIELDS}
    }
    hardcodedAssets: allProjects(selector:{baseProjects: {slugs: ["chain-key-usdc", "chain-key-usdt"]}}) {
${PROJECT_FIELDS}
    }
  }
`;
export const APPEND_ALL_PROJECTS_QUERY = (scheme) => {
    ALL_PROJECTS = ALL_PROJECTS.replace('logoUrl', 'logoUrl ' + scheme);
};
const projectsAccessor = ({ allProjects, hardcodedAssets }) => {
    const __UNSTABLE_MANUALS = hardcodedAssets.reduce((acc, item) => Object.assign(acc, { [item.slug]: item }), {});
    for (const project of allProjects) {
        if (__UNSTABLE_MANUALS[project.slug]) {
            delete __UNSTABLE_MANUALS[project.slug];
        }
    }
    return allProjects.concat(Object.values(__UNSTABLE_MANUALS));
};
export const queryAllProjects = () => query(ALL_PROJECTS).then(projectsAccessor);
//# sourceMappingURL=index.js.map