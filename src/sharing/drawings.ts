import { newDrawing } from '@/Chart/Drawer/utils'

type DrawingTypes = SAN.Charts.DrawingTypes
type Shares = typeof DrawingShare

const DrawingShare = {
  emoji: ({ id, size }: SAN.Charts.Emoji) => [id, size],
  note: ({ text }: SAN.Charts.Note) => [text],
} as const
// TYPE GUARDS
DrawingShare as keyof Shares extends DrawingTypes ? Shares : void
DrawingShare as Partial<Record<DrawingTypes, (drawing: any) => any[]>>

const shareBasicDrawing = ({ type, relCoor }: SAN.Charts.Drawing) => [type, relCoor]
export function shareDrawings(drawings = []): any[] {
  return drawings.map((drawing) => {
    const { type } = drawing as SAN.Charts.Drawing
    let data = shareBasicDrawing(drawing) as any[]

    const sharer = DrawingShare[type]
    if (sharer) data = data.concat(sharer(drawing))

    return data
  })
}

const DrawingParse = {
  emoji: ([id, size]) => ({ id, size }),
  note: ([text]) => ({ text }),
} as Record<keyof Shares, (data: any[]) => { [key: string]: any }>

export function parseDrawings(drawings: any[][] = []): any[] {
  return drawings.map(([type, relCoor, ...data]) => {
    const drawing = { type, relCoor }

    const parser = DrawingParse[type as DrawingTypes]
    if (parser) Object.assign(drawing, parser(data))

    return newDrawing(drawing)
  })
}
