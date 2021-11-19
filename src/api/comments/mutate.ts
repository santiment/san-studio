import { CommentsType } from '@/types/comment'
import type { Query } from 'webkit/api'
import { mutate } from 'webkit/api'
import { COMMENT_FIELDS } from './index'

const CREATE_COMMENT_MUTATION = `
  mutation(
    $id: Int
    $parentId: Int 
    $content: String!
    $type: CommentEntityTypeEnum 
  ) {
    comment:createComment(id:$id, parentId:$parentId, content:$content, entityType:$type) {
      ${COMMENT_FIELDS}
    }
  }
`
type CreateCommentMutation = Query<'comment', SAN.Comment>

type CreateCommentVariables = {
  id: number
  content: string
  type: SAN.CommentsType
  parentId?: number
}

const accessor = ({ comment }: CreateCommentMutation) => comment
export const createComment = (variables: CreateCommentVariables) =>
  mutate<CreateCommentMutation>(CREATE_COMMENT_MUTATION, {
    variables,
  }).then(accessor)

export function createLayoutComment(
  id: number,
  content: string,
  parentId?: number,
) {
  const variables = { id, content, parentId, type: CommentsType.Layout }
  return createComment(variables)
}
