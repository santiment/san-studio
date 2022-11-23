import { get } from 'svelte/store';
import { track } from 'san-webkit/lib/analytics';
import { Event } from './../../../../lib/analytics';
import { studio } from './../../../../lib/stores/studio';
import { downloadPng } from './png';
export function download(widget, downloader) {
    track.event(Event.Download, { type: downloader === downloadPng ? 'png' : 'csv' });
    downloader(widget, get(studio));
}
export { downloadCsv } from './csv';
export { downloadPng } from './png';
//# sourceMappingURL=index.js.map