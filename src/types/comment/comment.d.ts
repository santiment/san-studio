declare namespace SAN {
  type CommentsType = import('./index').CommentsType

  type Comment = {
    id: number
    content: string
    insertedAt: string
    editedAt: null | string
    user: SAN.Author
  }
}
