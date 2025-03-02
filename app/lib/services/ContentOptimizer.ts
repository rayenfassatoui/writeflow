export interface OptimizationOptions {
  content: string
  targetKeywords: string[]
  contentType: 'blog' | 'social' | 'ad'
  tone: 'professional' | 'casual' | 'friendly'
}

export interface OptimizationResult {
  optimizedContent: string
  suggestions: string[]
  seoScore: number
  readabilityScore: number
  keywordDensity: {
    [keyword: string]: number
  }
}

export class ContentOptimizer {
  private buildPrompt(options: OptimizationOptions): string {
    return `
      Optimize the following ${options.contentType} content to be more engaging and effective.
      Target keywords: ${options.targetKeywords.join(', ')}
      Desired tone: ${options.tone}

      Original content:
      ${options.content}

      Please provide:
      1. Optimized content that maintains the core message while incorporating target keywords naturally
      2. SEO improvements
      3. Readability enhancements
      4. Tone adjustments to match ${options.tone}
      5. Keyword placement suggestions
    `
  }

  private calculateSEOScore(content: string, keywords: string[]): number {
    let score = 100
    const contentLower = content.toLowerCase()
    
    // Check keyword presence and density
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase()
      const count = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length
      const density = count / content.split(' ').length
      
      if (count === 0) score -= 10
      if (density > 0.05) score -= 5 // Penalize keyword stuffing
    })

    // Check content length
    const wordCount = content.split(' ').length
    if (wordCount < 300) score -= 10
    if (wordCount > 2000) score -= 5

    return Math.max(0, Math.min(100, score))
  }

  private calculateReadabilityScore(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(Boolean)
    const words = content.split(' ').filter(Boolean)
    const avgWordsPerSentence = words.length / sentences.length

    let score = 100

    // Penalize long sentences
    if (avgWordsPerSentence > 20) score -= 10
    if (avgWordsPerSentence > 25) score -= 10

    // Penalize long paragraphs
    const paragraphs = content.split('\n\n').filter(Boolean)
    const avgWordsPerParagraph = words.length / paragraphs.length
    if (avgWordsPerParagraph > 100) score -= 10

    return Math.max(0, Math.min(100, score))
  }

  private calculateKeywordDensity(content: string, keywords: string[]): { [keyword: string]: number } {
    const contentLower = content.toLowerCase()
    const wordCount = content.split(' ').length
    const density: { [keyword: string]: number } = {}

    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase()
      const count = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length
      density[keyword] = Number((count / wordCount * 100).toFixed(2))
    })

    return density
  }

  async optimize(options: OptimizationOptions): Promise<OptimizationResult> {
    try {
      // Initialize Groq client
      const Groq = require('groq-sdk')
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

      // Call Groq API for content optimization
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: this.buildPrompt(options)
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1000,
      })

      const optimizedContent = completion.choices[0]?.message?.content?.trim() || options.content

      // Calculate optimization metrics
      const seoScore = this.calculateSEOScore(optimizedContent, options.targetKeywords)
      const readabilityScore = this.calculateReadabilityScore(optimizedContent)
      const keywordDensity = this.calculateKeywordDensity(optimizedContent, options.targetKeywords)

      // Generate suggestions based on scores
      const suggestions: string[] = []
      if (seoScore < 80) {
        suggestions.push('Consider adding more target keywords naturally')
      }
      if (readabilityScore < 80) {
        suggestions.push('Try breaking down long sentences and paragraphs')
      }
      Object.entries(keywordDensity).forEach(([keyword, density]) => {
        if (density < 0.5) {
          suggestions.push(`Increase usage of keyword "${keyword}"`)
        } else if (density > 3) {
          suggestions.push(`Reduce usage of keyword "${keyword}" to avoid keyword stuffing`)
        }
      })

      return {
        optimizedContent,
        suggestions,
        seoScore,
        readabilityScore,
        keywordDensity,
      }
    } catch (error) {
      console.error('Error optimizing content:', error)
      throw error
    }
  }
} 