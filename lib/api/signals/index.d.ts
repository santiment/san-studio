export declare const querySignalTimeseries: (
  signal: string,
  {
    slug,
    from,
    to,
    interval,
  }: {
    slug: any
    from: any
    to: any
    interval: any
  },
) => Promise<any>
export declare const queryRawSignal: (slug: any, from: any, to: any) => Promise<any>
