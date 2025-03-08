import { jsPDF } from 'jspdf'
import { Parser } from 'json2csv'
import { JSDOM } from 'jsdom'
import TurndownService from 'turndown'

export type ExportFormat = 'pdf' | 'markdown' | 'html' | 'csv' | 'json'

export interface ExportOptions {
  title?: string
  author?: string
  date?: Date
  metadata?: Record<string, any>
}

export class ExportService {
  private turndownService: TurndownService

  constructor() {
    this.turndownService = new TurndownService()
  }

  async exportToPDF(content: string, options: ExportOptions = {}) {
    const doc = new jsPDF()
    
    if (options.title) {
      doc.setFontSize(18)
      doc.text(options.title, 20, 20)
      doc.setFontSize(12)
    }

    if (options.author || options.date) {
      const metadata = [
        options.author && `Author: ${options.author}`,
        options.date && `Date: ${options.date.toLocaleDateString()}`,
      ].filter(Boolean).join(' | ')
      
      doc.text(metadata, 20, 30)
    }

    doc.setFontSize(12)
    const splitText = doc.splitTextToSize(content, 180)
    doc.text(splitText, 20, 40)

    return doc.output('arraybuffer')
  }

  async exportToMarkdown(content: string, options: ExportOptions = {}) {
    let markdown = ''

    if (options.title) {
      markdown += `# ${options.title}\n\n`
    }

    if (options.author || options.date) {
      const metadata = [
        options.author && `Author: ${options.author}`,
        options.date && `Date: ${options.date.toLocaleDateString()}`,
      ].filter(Boolean).join(' | ')
      
      markdown += `${metadata}\n\n---\n\n`
    }

    // Convert HTML to Markdown if content is HTML
    if (content.includes('<')) {
      markdown += this.turndownService.turndown(content)
    } else {
      markdown += content
    }

    return markdown
  }

  async exportToHTML(content: string, options: ExportOptions = {}) {
    const dom = new JSDOM()
    const document = dom.window.document

    const html = document.createElement('html')
    const head = document.createElement('head')
    const body = document.createElement('body')

    // Add metadata
    if (options.title) {
      const title = document.createElement('title')
      title.textContent = options.title
      head.appendChild(title)
    }

    if (options.author || options.date) {
      const metadata = document.createElement('div')
      metadata.className = 'metadata'
      metadata.innerHTML = [
        options.author && `<p>Author: ${options.author}</p>`,
        options.date && `<p>Date: ${options.date.toLocaleDateString()}</p>`,
      ].filter(Boolean).join('')
      body.appendChild(metadata)
    }

    const contentDiv = document.createElement('div')
    contentDiv.className = 'content'
    contentDiv.innerHTML = content

    body.appendChild(contentDiv)
    html.appendChild(head)
    html.appendChild(body)

    return '<!DOCTYPE html>' + html.outerHTML
  }

  async exportToCSV(data: any[], options: ExportOptions = {}) {
    const parser = new Parser({
      fields: Object.keys(data[0]),
    })

    return parser.parse(data)
  }

  async exportToJSON(data: any, options: ExportOptions = {}) {
    return JSON.stringify({
      metadata: {
        title: options.title,
        author: options.author,
        date: options.date,
        ...options.metadata,
      },
      data,
    }, null, 2)
  }
} 