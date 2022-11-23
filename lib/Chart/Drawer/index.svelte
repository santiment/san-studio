<svelte:options immutable />

<script lang="ts">import { onDestroy } from 'svelte';
import { getChartDrawer } from './context';
import { newDrawer } from './drawer';
import { newMouseHoverHandler, getDrawingHoverPainter } from './hovered';
import { newDoubleClickHandler, newDrawingSelectHandler, newDrawingDeleteHandler } from './selectAndDrag';
import { newDrawingAxesPainter } from './axes';
import { newLineCreationHandler } from './newLine';
import { newHorizontalRayCreationHandler } from './drawings/horizontalRay';
import { hook } from './utils';
import { getChart } from '../context';
import { clearCtx } from '../utils';
const chart = getChart();
const ChartDrawer = getChartDrawer();
const drawer = newDrawer(chart, onSelectionChange);
const {
  redraw
} = drawer;

const clear = () => clearCtx(chart, drawer.ctx);

const drawingDeleteHandler = newDrawingDeleteHandler(drawer);
const drawingHoverHandler = newMouseHoverHandler(chart, setHovered);
const drawingSelectHandler = newDrawingSelectHandler(chart, {
  selectDrawing,
  startDrawing,
  stopDrawing,
  onDrawingDragEnd
});
const drawingDblClickHandler = newDoubleClickHandler(chart, onDrawingDragEnd);
const deleteDrawer = ChartDrawer.addDrawer(drawer);
const NewDrawingHandler = {
  line: newLineCreationHandler(chart, onNewDrawingStart, onNewDrawingEnd),
  hray: newHorizontalRayCreationHandler(chart, onNewDrawingStart, onNewDrawingEnd)
};
export let metricKey;
let isNewDrawing = null;
drawer.drawings = $ChartDrawer.drawings;
drawer.addDrawing = addDrawing;
drawer.deleteDrawing = deleteDrawing;

$: drawer.metricKey = metricKey;

$: cleanup = hookDrawer(isNewDrawing);

const unsubscribeStore = ChartDrawer.subscribe(store => {
  drawer.drawings = store.drawings;
  isNewDrawing = store.isNewDrawing;
  const {
    isHidden,
    selectedLine
  } = store;
  if (drawer.selected !== selectedLine) onSelectionChange(selectedLine);
  const redrawer = isHidden ? clear : redraw;

  if (drawer.redraw !== redrawer) {
    drawer.redraw = redrawer;
    drawer.isHidden = isHidden;
    if (isHidden) cleanup === null || cleanup === void 0 ? void 0 : cleanup();else cleanup = hookDrawer(null);
  }
});

function addDrawing(drawing) {
  ChartDrawer.addDrawing(drawing);
  ChartDrawer.dispatch({
    type: 'new line',
    data: drawing
  });
}

function deleteDrawing(drawing) {
  ChartDrawer.deleteDrawing(drawing);
  ChartDrawer.dispatch({
    type: 'delete',
    data: drawing
  });
}

function onDrawingDragEnd(drawing, oldRatioCoor, data) {
  ChartDrawer.dispatch({
    type: 'modified',
    data: {
      drawing,
      oldRatioCoor,
      data
    }
  });
}

const setIsDrawing = value => ChartDrawer.setIsDrawing(chart.isDrawing = value);

function startDrawing() {
  setIsDrawing(true);
}

function stopDrawing() {
  setIsDrawing(false);
}

function setHovered(drawing) {
  if (drawer.hovered !== drawing) updateCursor(drawing && 'pointer');
  drawer.hovered = drawing;
}

function updateCursor(cursor) {
  const {
    canvas
  } = chart.tooltip || chart;
  canvas.style.cursor = cursor || 'initial';
}

function selectDrawing(drawing) {
  if (drawer.selected === drawing) return;
  ChartDrawer.selectDrawing(drawing);
  onSelectionChange(drawing);
}

function onSelectionChange(drawing) {
  if (drawer.selected === drawing) return;
  drawer.selected = drawing;

  if (drawing) {
    const hoverPainter = getDrawingHoverPainter(drawing);
    if (!hoverPainter) return;
    const {
      minMax
    } = drawer;
    if (!minMax) return;
    const drawingAxesPainter = newDrawingAxesPainter(chart, drawing);

    drawer.drawSelection = () => {
      hoverPainter(chart, drawing);
      drawingAxesPainter();
    };

    window.addEventListener('keydown', drawingDeleteHandler);
  } else {
    drawer.drawSelection = undefined;
    window.removeEventListener('keydown', drawingDeleteHandler);
  }
}

function onNewDrawingStart(drawing) {
  ChartDrawer.addDrawing(drawing);
  selectDrawing(drawing);
  startDrawing();
}

function onNewDrawingEnd(drawing) {
  stopDrawing();
  ChartDrawer.dispatch({
    type: 'new line',
    data: drawing
  });
}

function hookDrawer(isNewDrawing) {
  if (process.browser === false) return;
  if (cleanup) cleanup();
  const parent = chart.canvas.parentNode;

  if (isNewDrawing) {
    const newDrawing = NewDrawingHandler[isNewDrawing];
    return newDrawing && hook(parent, 'mousedown', newDrawing);
  }

  const removeDrawingHoverHandler = hook(parent, 'mousemove', drawingHoverHandler);
  const removeDrawingSelectHandler = hook(parent, 'mousedown', drawingSelectHandler);
  const removeDrawingDblClickHandler = hook(parent, 'dblclick', drawingDblClickHandler);
  return () => {
    removeDrawingHoverHandler();
    removeDrawingSelectHandler();
    removeDrawingDblClickHandler();
  };
}

onDestroy(() => {
  if (!process.browser) return;
  unsubscribeStore();
  cleanup();
  window.removeEventListener('keydown', drawingDeleteHandler);
  deleteDrawer();
  chart.plotManager.delete('Drawer');
  drawer.canvas.remove();
  delete chart.drawer;
});</script>
