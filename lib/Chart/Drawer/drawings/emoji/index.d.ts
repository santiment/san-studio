declare type NewEmoji = Partial<
  Pick<SAN.Charts.Emoji, 'size' | 'absCoor' | 'relCoor' | 'ratioCoor'>
> & {
  id: SAN.Charts.EmojiIds
}
export declare function newEmoji(drawing: NewEmoji): SAN.Charts.Emoji
export declare const EmojiSrc: Record<SAN.Charts.EmojiIds, string>
export declare const EMOJIS: [SAN.Charts.EmojiIds, string][]
export declare const CachedEmoji: Map<SAN.Charts.EmojiIds, HTMLImageElement | null | undefined>
export declare function paintEmoji(chart: SAN.Charts.Chart, drawing: SAN.Charts.Emoji): void
export declare function loadEmoji(chart: SAN.Charts.Chart, drawing: SAN.Charts.Emoji): void
export declare function updateEmoji(_: any, drawing: SAN.Charts.Emoji): void
export declare function checkEmojiIsHovered(
  ctx: CanvasRenderingContext2D,
  drawing: SAN.Charts.Emoji,
  mouseXY: [number, number],
  dpr: number,
): boolean
export declare function paintEmojiHover(
  { drawer }: SAN.Charts.Chart,
  drawing: SAN.Charts.Emoji,
): void
declare type EmojiDragData = [SAN.Charts.Emoji['size'], boolean, boolean]
export declare function getEmojiDragData(
  ctx: CanvasRenderingContext2D,
  drawing: SAN.Charts.Emoji,
  x: number,
  y: number,
): EmojiDragData
export declare function emojiDragModifier(
  drawing: SAN.Charts.Emoji,
  initialAbsCoor: SAN.Charts.Emoji['absCoor'],
  [initialSize, isResize, areLeftHandlers]: EmojiDragData,
  xDiff: number,
  yDiff: number,
): void
export {}
