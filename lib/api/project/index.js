import { query } from 'san-webkit/lib/api';
const PROJECT_NAME_QUERY = (slug) => `
  {
    projectBySlug(slug:"${slug}") {
      name
      ticker
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
const ALL_PROJECTS = `
  {
    allProjects(minVolume:0){
      slug
      ticker
      name
      priceUsd
      infrastructure
      logoUrl
    }
  }
`;
const projectsAccessor = ({ allProjects }) => allProjects;
export const queryAllProjects = () => query(ALL_PROJECTS).then(projectsAccessor);
//# sourceMappingURL=index.js.map