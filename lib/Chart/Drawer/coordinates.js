import { linearScale, valueByY } from '@santiment-network/chart/scales';
import { linearDatetimeScale } from '../utils';
function newDatetimeRelativeScaler(chart) {
    const { data, left, width } = chart;
    const firstDatetime = data[0].datetime;
    const lastDatetime = data[data.length - 1].datetime;
    const factor = (lastDatetime - firstDatetime) / width;
    return (x) => Math.round(factor * (x - left)) + firstDatetime;
}
const newCoordinatesResetter = (resetter) => (drawer) => drawer.drawings.forEach(resetter);
export const resetDrawingRatioCoordinates = ({ ratioCoor, relCoor }) => relCoor.length && (ratioCoor.length = 0);
export const resetRatioCoordinates = newCoordinatesResetter(resetDrawingRatioCoordinates);
export const resetDrawingRelativeCoordinates = ({ ratioCoor, relCoor }) => ratioCoor.length && (relCoor.length = 0);
export const resetRelativeCoordinates = newCoordinatesResetter(resetDrawingRelativeCoordinates);
export const resetDrawingAbsoluteCoordinates = ({ absCoor, relCoor, ratioCoor, }) => (relCoor.length || ratioCoor.length) && (absCoor.length = 0);
export const resetAbsoluteCoordinates = newCoordinatesResetter(resetDrawingAbsoluteCoordinates);
export function correctAbsoluteCoordinatesRatio({ drawings }, width, height) {
    for (let i = 0, len = drawings.length; i < len; i++) {
        const { absCoor, ratioCoor } = drawings[i];
        for (let j = 0, coorLen = ratioCoor.length; j < coorLen; j += 2) {
            absCoor[j] *= ratioCoor[j] && ratioCoor[j] * width;
            absCoor[j + 1] *= ratioCoor[j + 1] * height;
        }
    }
}
export function setupDrawingsCoordinatesUpdater(chart, minMax) {
    const { drawer } = chart;
    drawer.updateAbsoluteByRelativeCoordinates = newRelativeToAbsoluteCoordinatesUpdater(chart, minMax);
    drawer.updateRelativeByAbsoluteCoordinates = newAbsoluteToRelativeCoordinatesUpdater(chart, minMax);
}
export function absoluteToRatioCoordinates(absCoor, ratioCoor, width, height) {
    for (let i = 0, len = absCoor.length; i < len; i += 2) {
        ratioCoor[i] = absCoor[i] && absCoor[i] / width;
        ratioCoor[i + 1] = absCoor[i + 1] / height;
    }
}
export function ratioToAbsoluteCoordinates(ratioCoor, absCoor, width, height) {
    for (let i = 0, len = ratioCoor.length; i < len; i += 2) {
        absCoor[i] = ratioCoor[i] && ratioCoor[i] * width;
        absCoor[i + 1] = ratioCoor[i + 1] * height;
    }
}
function relativeToAbsoluteCoordinates(relCoor, absCoor, scaleX, scaleY) {
    for (let i = 0, len = relCoor.length; i < len; i += 2) {
        absCoor[i] = relCoor[i] && scaleX(relCoor[i]);
        absCoor[i + 1] = scaleY(relCoor[i + 1]);
    }
}
function absoluteToRelativeCoordinates(absCoor, relCoor, scaleDatetime, scaleValue) {
    for (let i = 0, len = absCoor.length; i < len; i += 2) {
        relCoor[i] = absCoor[i] && scaleDatetime(absCoor[i]);
        relCoor[i + 1] = scaleValue(absCoor[i + 1]);
    }
}
export function newAbsoluteToRelativeCoordinatesUpdater(chart, { min, max }) {
    const scaleDatetime = newDatetimeRelativeScaler(chart);
    const scaleValue = (y) => valueByY(chart, y, min, max);
    return (absCoor, relCoor) => absoluteToRelativeCoordinates(absCoor, relCoor, scaleDatetime, scaleValue);
}
export function newRelativeToAbsoluteCoordinatesUpdater(chart, { min, max }) {
    const scaleX = linearDatetimeScale(chart);
    const scaleY = linearScale(chart, min, max);
    return (relCoor, absCoor) => relativeToAbsoluteCoordinates(relCoor, absCoor, scaleX, scaleY);
}
//# sourceMappingURL=coordinates.js.map