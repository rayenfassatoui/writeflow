import { WPAPI } from 'wpapi'

export interface WordPressConfig {
  endpoint: string
  username: string
  password: string
}

export class WordPressService {
  private wp: WPAPI

  constructor(config: WordPressConfig) {
    this.wp = new WPAPI({
      endpoint: config.endpoint,
      username: config.username,
      password: config.password,
    })
  }

  async publishPost(title: string, content: string, options: {
    status?: 'publish' | 'draft' | 'private'
    categories?: number[]
    tags?: number[]
    featured_media?: number
  } = {}) {
    try {
      const post = await this.wp.posts().create({
        title,
        content,
        status: options.status || 'draft',
        categories: options.categories,
        tags: options.tags,
        featured_media: options.featured_media,
      })

      return post
    } catch (error) {
      console.error('Error publishing to WordPress:', error)
      throw error
    }
  }

  async updatePost(postId: number, title: string, content: string, options: {
    status?: 'publish' | 'draft' | 'private'
    categories?: number[]
    tags?: number[]
    featured_media?: number
  } = {}) {
    try {
      const post = await this.wp.posts().id(postId).update({
        title,
        content,
        status: options.status,
        categories: options.categories,
        tags: options.tags,
        featured_media: options.featured_media,
      })

      return post
    } catch (error) {
      console.error('Error updating WordPress post:', error)
      throw error
    }
  }
}