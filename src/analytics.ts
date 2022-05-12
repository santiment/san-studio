export const Event = {
  ChartsUsage: 'charts_usage',

  ChangeAsset: 'charts_change_asset',
  ChangeLockAsset: 'charts_change_lock_asset',

  NewLayout: 'charts_new_layout',
  LoadLayout: 'charts_load_layout',
  SaveLayout: 'charts_save_layout',

  LikeLayout: 'charts_like_layout',

  Fullscreen: 'charts_fullscreen',
  Embed: 'charts_embed',
  Scale: 'charts_scale',
  Download: 'charts_download',

  DrawingsVisibility: 'charts_drawings_visibility',
  NewDrawing: 'charts_new_drawing',
  ShowEmojis: 'charts_show_emojis',

  AddMetric: 'charts_add_metric',
  AddMetrics: 'charts_add_metrics',
  RemoveMetric: 'charts_remove_metric',

  CombineOpened: 'charts_combine_opened',
  CombineMetrics: 'charts_combine_metrics',

  LockMetric: 'charts_lock_metric',
  UnlockMetric: 'charts_unlock_metric',

  FavoriteMetric: 'charts_favorite_metric',
  UnfavoriteMetric: 'charts_unfavorite_metric',

  MetricSettings: 'charts_metric_settings',

  MetricNode: 'charts_metric_visualisation',
  MetricColor: 'charts_metric_color',
  MetricExchange: 'charts_metric_exchange',
  MetricInterval: 'charts_metric_interval',
  MetricAxisMaxMin: 'charts_metric_axis_max_min',

  ShowMetricAxis: 'charts_show_metric_axis',
  HideMetricAxis: 'charts_hide_metric_axis',

  NewWidget: 'charts_new_widget',
  Sidewidget: 'charts_sidewidget',

  AutoUpdate: 'charts_auto_update',

  Insights: 'charts_insights',

  Sidebar: 'charts_sidebar',

  Share: 'charts_share',
  CopyLink: 'charts_copy_link',

  Shortcuts: 'charts_shortcuts',

  HelpFeedback: 'charts_help_feedback',

  IncompleteDataUpgrade: 'charts_incomplete_data_upgrade',

  AlertsUsage: 'alerts_usage',
  ClickShareAlert: 'alerts_share',
  ClickCopyAlertLink: 'alerts_copy_link',
  ClickCopyAlert: 'alerts_copy',
  OpenAlert: 'alerts_open',
  ClickCreateAlert: 'alerts_create',
  ChangeAlertAbility: 'alerts_change_ability',
  ChangeAlertVisibility: 'alerts_change_visibility',
  ClickEditAlert: 'alerts_edit',
  SetAlertType: 'alerts_set_type',
  SetAlertAsset: 'alerts_set_asset',
  SetAlertWatchlist: 'alerts_set_watchlist',
  SetAlertScreener: 'alerts_set_screener',
  SetAlertAddress: 'alerts_set_address',
  SetAlertWalletAsset: 'alerts_set_address_asset',
  SetAlertSocialTrend: 'alerts_set_social',
  SetAlertMetric: 'alerts_set_metric',
  SetAlertCondition: 'alerts_set_condition',
  SetAlertChannel: 'alerts_set_channel',
  CreateAlert: 'alerts_save_new',
  EditAlert: 'alerts_save_old',
} as const
