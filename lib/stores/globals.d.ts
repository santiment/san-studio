declare const GLOBALS: {
  isPro: boolean
  isProPlus: boolean
  isTrial: boolean
  isNightMode: boolean
  isLoggedIn: boolean
  isBeta: boolean
  isPresenterMode: boolean
}
export declare const globals: {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<{
      isPro: boolean
      isProPlus: boolean
      isTrial: boolean
      isNightMode: boolean
      isLoggedIn: boolean
      isBeta: boolean
      isPresenterMode: boolean
    }>,
    invalidate?:
      | ((
          value?:
            | {
                isPro: boolean
                isProPlus: boolean
                isTrial: boolean
                isNightMode: boolean
                isLoggedIn: boolean
                isBeta: boolean
                isPresenterMode: boolean
              }
            | undefined,
        ) => void)
      | undefined,
  ) => import('svelte/store').Unsubscriber
  set: (
    this: void,
    value: {
      isPro: boolean
      isProPlus: boolean
      isTrial: boolean
      isNightMode: boolean
      isLoggedIn: boolean
      isBeta: boolean
      isPresenterMode: boolean
    },
  ) => void
  toggle(name: keyof typeof GLOBALS, value?: boolean): void
}
export {}
