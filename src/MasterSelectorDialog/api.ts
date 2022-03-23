import { query } from 'webkit/api'

const BLOCKCHAINS_QUERY = `{
  getAvailableBlockchains {
    slug
    infrastructure
  }
}`
