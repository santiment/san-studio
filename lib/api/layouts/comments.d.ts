export declare const queryLayoutCommentsCount: (id: number) => Promise<number>
export declare const subscribeLayoutCommentsCountCache: (
  id: number,
  clb: SAN.API.Subscriber<any>,
) => SAN.API.Unsubscriber
export declare const updateLayoutCommentsCountCache: (id: number, commentsCount: number) => void
