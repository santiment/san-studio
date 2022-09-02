import { query } from 'san-webkit/lib/api'
const GET_TOKEN_QUERY = (id) => `{
  data:getChartConfigurationSharedAccessToken(chartConfigurationId: ${id}){
    uuid
  }
}`
const accessor = ({ data }) => data.uuid
export const queryLayoutToken = (id) => query(GET_TOKEN_QUERY(id)).then(accessor)
//# sourceMappingURL=token.js.map
