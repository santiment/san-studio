export const Event = {
  ChartsUsage: 'charts_usage',

  ChangeAsset: 'charts_change_asset',
  ChangeLockAsset: 'charts_change_lock_asset',

  NewLayout: 'charts_new_layout',
  LoadLayout: 'charts_load_layout',
  SaveLayout: 'charts_save_layout',

  Fullscreen: 'charts_fullscreen',
  Embed: 'charts_embed',
  Scale: 'charts_scale',
  Download: 'charts_download',

  NewDrawing: 'charts_new_drawing',

  AddMetric: 'charts_add_metric',
  AddMetrics: 'charts_add_metrics',
  RemoveMetric: 'charts_remove_metric',

  LockMetric: 'charts_lock_metric',
  UnlockMetric: 'charts_unlock_metric',

  FavoriteMetric: 'charts_favorite_metric',
  UnfavoriteMetric: 'charts_unfavorite_metric',

  MetricNode: 'charts_metric_visualisation',
  MetricColor: 'charts_metric_color',
  MetricExchange: 'charts_metric_exchange',
  MetricInterval: 'charts_metric_interval',

  ShowMetricAxis: 'charts_show_metric_axis',
  HideMetricAxis: 'charts_hide_metric_axis',

  NewWidget: 'charts_new_widget',
  Sidewidget: 'charts_sidewidget',

  AutoUpdate: 'charts_auto_update',

  Insights: 'charts_insights',

  Share: 'charts_share',
  CopyLink: 'charts_copy_link',
} as const
