import { query } from 'webkit/api'

const GET_TOKEN_QUERY = (id: number) => `{
  data:getChartConfigurationSharedAccessToken(chartConfigurationId: ${id}){
    uuid
  }
}`

type Query = SAN.API.Query<'data', { uuid: string }>

const accessor = ({ data }: Query) => data.uuid
export const queryLayoutToken = (id: number): Promise<string> =>
  query<Query>(GET_TOKEN_QUERY(id)).then(accessor)
