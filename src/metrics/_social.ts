import { MetricCategory, MetricGroup } from './graph'
import { each } from './utils'
import { percentFormatter, axisPercentFormatter } from './formatters'
import { Node } from '@/Chart/nodes'

const hidden = () => false

const TotalSentimentMetric = each(
  {
    sentiment_positive_total: {
      label: 'Positive sentiment (Total)',
    },
    sentiment_negative_total: {
      label: 'Negative sentiment (Total)',
    },
    sentiment_balance_total: {
      node: 'filledLine',
      label: 'Average Sentiment (Total)',
      checkIsVisible: hidden,
    },
    sentiment_volume_consumed_total: {
      node: 'filledLine',
      label: 'Weighted sentiment (Total)',
    },
  },
  (metric: Studio.Metric) => {
    metric.group = MetricGroup.TotalSentiment
    metric.reqMeta = {
      includeIncompleteData: false,
    }
  },
)

const TelegramSentimentMetric = each(
  {
    sentiment_positive_telegram: {
      label: 'Positive sentiment (Telegram)',
      checkIsVisible: hidden,
    },
    sentiment_negative_telegram: {
      label: 'Negative sentiment (Telegram)',
      checkIsVisible: hidden,
    },
    sentiment_balance_telegram: {
      node: 'filledLine',
      label: 'Average Sentiment (Telegram)',
      checkIsVisible: hidden,
    },
    sentiment_volume_consumed_telegram: {
      node: 'filledLine',
      label: 'Weighted sentiment (Telegram)',
      checkIsVisible: hidden,
    },
  },
  (metric: Studio.Metric) => (metric.group = MetricGroup.TelegramSentiment),
)

const TwitterSentimentMetric = each(
  {
    sentiment_positive_twitter: {
      label: 'Positive sentiment (Twitter)',
      checkIsVisible: hidden,
    },
    sentiment_negative_twitter: {
      label: 'Negative sentiment (Twitter)',
      checkIsVisible: hidden,
    },
    sentiment_balance_twitter: {
      node: 'filledLine',
      label: 'Average Sentiment (Twitter)',
      checkIsVisible: hidden,
    },
    sentiment_volume_consumed_twitter: {
      node: 'filledLine',
      label: 'Weighted sentiment (Twitter)',
      checkIsVisible: hidden,
    },
  },
  (metric: Studio.Metric) => (metric.group = MetricGroup.TwitterSentiment),
)

const RedditSentimentMetric = each(
  {
    sentiment_positive_reddit: {
      label: 'Positive sentiment (Reddit)',
      checkIsVisible: hidden,
    },
    sentiment_negative_reddit: {
      label: 'Negative sentiment (Reddit)',
      checkIsVisible: hidden,
    },
    sentiment_balance_reddit: {
      node: 'filledLine',
      label: 'Average Sentiment (Reddit)',
      checkIsVisible: hidden,
    },
    sentiment_volume_consumed_reddit: {
      node: 'filledLine',
      label: 'Weighted sentiment (Reddit)',
      checkIsVisible: hidden,
    },
  },
  (metric: Studio.Metric) => (metric.group = MetricGroup.RedditSentiment),
)

const newTwitterFollowers = (interval: string) => ({
  queryKey: 'twitter_followers',
  label: `Twitter Followers ${interval}`,
  reqMeta: {
    interval,
    transform: { type: 'changes' },
  },
})

const newSocialActiveUsers = (channel: string, label: string, source = channel) => ({
  queryKey: 'social_active_users',
  label: `Active social users (${label})`,
  noProject: true,
  reqMeta: {
    channel,
    source,
  },
})

export const SocialMetric = each(
  {
    social_dominance_total: {
      label: 'Social Dominance',
      formatter: percentFormatter,
      axisFormatter: axisPercentFormatter,
      reqMeta: {
        aggregation: 'AVG',
      },
    },
    social_dominance_twitter_news: {
      label: 'Social Dominance Twitter News',
      formatter: percentFormatter,
      axisFormatter: axisPercentFormatter,
    },

    social_volume_total: {
      node: Node.BAR,
      label: 'Social Volume',
    },
    social_volume_ai_total: {
      node: Node.BAR,
      label: 'Social Volume AI',
    },

    nft_social_volume: {
      node: Node.BAR,
      label: 'NFT Social Volume',
    },

    social_volume_twitter_news: {
      label: 'Social Volume Twitter News',
    },

    social_active_users_telegram: newSocialActiveUsers('telegram', 'Telegram'),
    social_active_users_twitter: newSocialActiveUsers('twitter', 'Twitter', 'twitter_crypto'),

    twitter_followers: {
      label: 'Twitter Followers',
    },
    twitter_followers_24h: newTwitterFollowers('24h'),
    twitter_followers_7d: newTwitterFollowers('7d'),

    trending_words_rank: {
      label: 'Trending Social Rank',
      tooltipLabel: (ticker, { project }) => `Soc Ranking (${project?.ticker ?? ticker})`,
      node: Node.REFERENCE,
      references: 'price_usd',
      formatter: (value: number) => `${ordinalFormat(value)} place in Social trends`,
      getColor: getTrendingColor,
      marker(ctx, _key, value, x, y) {
        ctx.beginPath()
        ctx.arc(x + 4, y + 1.5, 3, 0, 2 * Math.PI)
        ctx.fillStyle = getTrendingColor(value)
        ctx.fill()
      },
      precacher: (metric) => (data) => {
        const result = data.getMetric.timeseriesData
          // .slice()
          // .filter((item) => item.v <= 10)
          .map((item) => ({
            datetime: Date.parse(item.d),
            [metric.key]: item.v <= 10 ? item.v : 0,
          }))

        data.getMetric.timeseriesData = result

        return data
      },
    },

    ...TotalSentimentMetric,
    ...TwitterSentimentMetric,
    ...TelegramSentimentMetric,
    ...RedditSentimentMetric,
  },
  (metric: Studio.Metric) => {
    metric.category = MetricCategory.Social
  },
)

function getTrendingColor(value: number) {
  if (value > 3) return '#5C9DFF'
  if (value > 1) return '#FFDB00'
  return '#FF6363'
}

function ordinalFormat(value: number) {
  const last = value.toString().slice(0, -1)

  switch (last === '' ? value : +last) {
    case 1:
      return value + 'st'
    case 2:
      return value + 'nd'
    case 3:
      return value + 'rd'

    default:
      return value + 'th'
  }
}
