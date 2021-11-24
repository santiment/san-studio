import type { Query } from 'webkit/api'
import { CommentsType } from '@/types/comment'
import { query } from 'webkit/api'

export const COMMENT_FIELDS = `id
  content
  insertedAt
  editedAt
  parentId
  user {
    id
    username
    email
    avatarUrl
  }
`

const COMMENTS_QUERY = `
  query($id: ID, $type: CommentEntityTypeEnum){
    comments(id: $id, entityType:$type){
      ${COMMENT_FIELDS}
    }
  }
`

type CommentsQuery = Query<'comments', SAN.Comment[]>

export type CommentsQueryVariables = {
  id: number
  type?: SAN.CommentsType
}

const accessor = ({ comments }: CommentsQuery) => comments
export const queryComments = (
  variables: CommentsQueryVariables,
): Promise<SAN.Comment[]> =>
  query<CommentsQuery>(COMMENTS_QUERY, { variables }).then(accessor)

export const queryLayoutComments = (layoutId: number) =>
  queryComments({
    id: layoutId,
    type: CommentsType.Layout,
  })
