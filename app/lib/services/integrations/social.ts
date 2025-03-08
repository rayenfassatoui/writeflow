import { TwitterApi } from 'twitter-api-v2'
import { Client } from '@linkedin/client'

export interface TwitterConfig {
  apiKey: string
  apiSecret: string
  accessToken: string
  accessSecret: string
}

export interface LinkedInConfig {
  clientId: string
  clientSecret: string
  accessToken: string
}

export class SocialMediaService {
  private twitter: TwitterApi | null = null
  private linkedin: Client | null = null

  constructor(config?: { twitter?: TwitterConfig; linkedin?: LinkedInConfig }) {
    if (config?.twitter) {
      this.twitter = new TwitterApi({
        appKey: config.twitter.apiKey,
        appSecret: config.twitter.apiSecret,
        accessToken: config.twitter.accessToken,
        accessSecret: config.twitter.accessSecret,
      })
    }

    if (config?.linkedin) {
      this.linkedin = new Client({
        clientId: config.linkedin.clientId,
        clientSecret: config.linkedin.clientSecret,
        accessToken: config.linkedin.accessToken,
      })
    }
  }

  async postToTwitter(content: string, options: {
    media?: Buffer[]
    reply_to?: string
  } = {}) {
    if (!this.twitter) {
      throw new Error('Twitter client not configured')
    }

    try {
      let mediaIds = []
      if (options.media?.length) {
        mediaIds = await Promise.all(
          options.media.map(media => this.twitter!.v1.uploadMedia(media))
        )
      }

      const tweet = await this.twitter.v2.tweet({
        text: content,
        media: mediaIds.length ? { media_ids: mediaIds } : undefined,
        reply: options.reply_to ? { in_reply_to_tweet_id: options.reply_to } : undefined,
      })

      return tweet
    } catch (error) {
      console.error('Error posting to Twitter:', error)
      throw error
    }
  }

  async postToLinkedIn(content: string, options: {
    title?: string
    url?: string
    imageUrl?: string
  } = {}) {
    if (!this.linkedin) {
      throw new Error('LinkedIn client not configured')
    }

    try {
      const post = await this.linkedin.post('/v2/shares', {
        owner: 'urn:li:person:me',
        subject: options.title,
        text: content,
        content: options.url ? {
          contentEntities: [{
            entityLocation: options.url,
            thumbnails: options.imageUrl ? [{ resolvedUrl: options.imageUrl }] : undefined,
          }],
        } : undefined,
      })

      return post
    } catch (error) {
      console.error('Error posting to LinkedIn:', error)
      throw error
    }
  }
} 