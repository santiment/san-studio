declare type SelectedLayout = undefined | SAN.Layout
export declare const selectedLayout: {
  set(layout: SelectedLayout): void
  update(this: void, updater: import('svelte/store').Updater<SelectedLayout>): void
  subscribe(
    this: void,
    run: import('svelte/store').Subscriber<SelectedLayout>,
    invalidate?: ((value?: SelectedLayout) => void) | undefined,
  ): import('svelte/store').Unsubscriber
}
export {}
