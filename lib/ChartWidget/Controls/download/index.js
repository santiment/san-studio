import { get } from 'svelte/store';
import { track } from 'san-webkit/lib/analytics';
import { Event } from './../../../analytics.js';
import { studio } from './../../../stores/studio.js';
import { downloadPng } from './png.js';
export function download(widget, downloader) {
    track.event(Event.Download, { type: downloader === downloadPng ? 'png' : 'csv' });
    downloader(widget, get(studio));
}
export { downloadCsv } from './csv';
export { downloadPng } from './png';
//# sourceMappingURL=index.js.map