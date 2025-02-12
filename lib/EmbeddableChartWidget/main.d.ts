/// <reference types="svelte" />
import 'webkit/styles/main.css';
import App from './../EmbeddableChartWidget/WithApi.svelte';
declare const app: App<{
    sharedAccessToken: any;
    isWithMetricSettings: any;
    isMinimapEmbedded: any;
    isCalendarEnabled: any;
    widget: any;
}, any, any>;
export default app;
