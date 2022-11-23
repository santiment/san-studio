import type { downloadCsv } from './csv';
import { downloadPng } from './png';
export declare function download(widget: any, downloader: typeof downloadCsv | typeof downloadPng): void;
export { downloadCsv } from './csv';
export { downloadPng } from './png';
