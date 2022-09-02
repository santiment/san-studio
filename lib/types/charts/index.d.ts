declare namespace SAN {
  namespace Charts {
    type MinMax = { min: number; max: number }

    type Offset = {
      top: number
      right: number
      bottom: number
      left: number
    }

    type Data = { datetime: number }[]

    type Chart = Offset & {
      canvas: HTMLCanvasElement
      dpr: number
      width: number
      height: number
      canvasWidth: number
      plotManager: Map<string, any>
      theme: any
      scale: any
      metricSettings: any
      axesMetricKeys: string[]
      minMaxes: { [metric: string]: undefined | MinMax }
      data: Data
      rightAxisMargin?: number
      drawer: Drawer
      redraw: () => void
    }

    type DrawingTypes = 'line' | 'hray' | 'emoji' | 'note'
    type NewDrawingType = 'line' | 'hray' | null

    interface Drawing {
      type: DrawingTypes
      /** [chart x, chart y, ... x(i), y(i+1), ...] */
      absCoor: number[]
      /** [width/chart x, height/chart y, ... x(i), y(i+1), ...] */
      ratioCoor: number[]
      /** [datetime, metric's value, ... x(i), y(i+1), ...]] */
      relCoor: number[]
      handlers: Path2D[]
    }

    type Drawer = {
      canvas: HTMLCanvasElement
      ctx: CanvasRenderingContext2D
      drawings: Drawing[]
      metricKey: string
      minMax?: MinMax
      hovered?: Drawing
      selected?: Drawing
      isHidden?: boolean
      redraw: () => void
      drawSelection: undefined | (() => void)
      updateAbsoluteByRelativeCoordinates: (relCoor: number[], absCoor: number[]) => void
      updateRelativeByAbsoluteCoordinates: (absCoor: number[], relCoor: number[]) => void
      addDrawing: (drawing: Drawing) => void
      deleteDrawing: (drawing: Drawing) => void
    }

    interface Line extends Drawing {
      type: 'line'
      /** [x1, y1, x2, y2] */
      absCoor: [number, number, number, number]
      /** [x1, y1, x2, y2] */
      relCoor: [number, number, number, number]
      /** [x1, y1, x2, y2] */
      ratioCoor: [number, number, number, number]
      handlers: [Path2D, Path2D]
      shape: Path2D
    }

    interface HorizontalRay extends Drawing {
      type: 'hray'
      absCoor: [0, number]
      relCoor: [0, number]
      ratioCoor: [0, number]
      shape: Path2D
    }

    type EmojiIds = 'rocket' | 'fire' | 'bear' | 'stop' | 'unicorn' | 'bell' | 'poo' | 'rock'

    interface Emoji extends Drawing {
      type: 'emoji'
      id: EmojiIds
      size: number
      /** [x, y] */
      absCoor: [number, number]
      /** [x, y] */
      relCoor: [number, number]
      /** [x, y] */
      ratioCoor: [number, number]
      hitbox: Path2D
      handlers: [Path2D, Path2D, Path2D, Path2D]
    }

    interface Note extends Drawing {
      type: 'note'
      text: string
      width: number
      height: number
      hidden?: boolean
      /** [x, y] */
      absCoor: [number, number]
      /** [x, y] */
      relCoor: [number, number]
      /** [x, y] */
      ratioCoor: [number, number]
      handlers: []
    }
  }
}
