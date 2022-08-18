export declare const MAX_DATE: Date
export declare const MAX_FREE_DATE: Date
export declare function getCoinCostDate(
  settings:
    | undefined
    | {
        from?: string
        to?: string
      },
  isPro?: boolean,
): Date[]
export declare const checkAreSameDay: (a: Date, b: Date) => boolean
