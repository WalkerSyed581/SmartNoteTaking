import Anthropic from '@anthropic-ai/sdk';

// Conditionally initialize Anthropic client only when API key is available
const anthropic = process.env.CLAUDE_API_KEY ? new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
}) : new Anthropic({
  apiKey: '',
});

export class AIService {
  static async generateSummary(content: string, title?: string, tags?: string[]): Promise<string> {
    // If no Claude API key or client, fall back to mock service
    if (!process.env.CLAUDE_API_KEY || !anthropic) {
      console.warn('No Claude API key found, using mock AI service');
      return this.generateMockSummary(content, title, tags);
    }

    try {
      // Create comprehensive prompt with title, tags, and content
      const promptParts: string[] = [];
      if (title) promptParts.push(`Title: ${title}`);
      if (tags && tags.length > 0) promptParts.push(`Tags: ${tags.join(', ')}`);
      promptParts.push(`Content: ${content}`);
      
      const fullContent = promptParts.join('\n\n');

      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `Please create a comprehensive but concise summary of the following note for spaced repetition learning. The summary should be informative and capture all key concepts, important details, and essential information that would be valuable for review and study.

${fullContent}

Requirements:
- Be comprehensive yet concise (aim for 300-500 characters)
- Include all important concepts and key ideas
- Make it suitable for effective review and study
- Focus on actionable insights and core knowledge
- Ensure clarity and readability`
        }]
      });

      const summary = response.content[0]?.type === 'text' ? response.content[0].text : '';
      
      // Allow longer summaries but cap at reasonable length for display
      const trimmedSummary = summary.length > 800 ? summary.substring(0, 797) + '...' : summary;
      
      return trimmedSummary || this.generateMockSummary(content, title, tags);
    } catch (error) {
      console.error('Claude API error:', error);
      return this.generateMockSummary(content, title, tags);
    }
  }

  private static generateMockSummary(content: string, title?: string, tags?: string[]): string {
    // Enhanced fallback summary generation with longer limit
    const cleanContent = content.trim();
    const titlePart = title ? title.substring(0, 100) : '';
    const tagsPart = tags && tags.length > 0 ? tags.slice(0, 5).join(', ') : '';
    
    let summary = '';
    
    if (titlePart) {
      summary += titlePart;
    }
    
    if (tagsPart && summary.length < 300) {
      summary += (summary ? ' | Tags: ' : 'Tags: ') + tagsPart;
    }
    
    const remainingChars = 500 - summary.length;
    if (remainingChars > 50 && cleanContent.length > 0) {
      const contentPreview = cleanContent.substring(0, remainingChars - 10);
      summary += (summary ? '. Summary: ' : '') + contentPreview;
      if (cleanContent.length > remainingChars - 10) {
        summary += '...';
      }
    }
    
    // Fallback if still empty
    if (!summary) {
      summary = cleanContent.length < 100 
        ? "Brief note containing key information for review and study." 
        : cleanContent.substring(0, 497) + '...';
    }
    
    // Ensure reasonable length for display
    return summary.length > 800 ? summary.substring(0, 797) + '...' : summary;
  }
  

  
  private static extractKeywordsSync(content: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
      'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'do', 'does', 'did', 'done'
    ]);
    
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && 
        word.length < 15 && 
        !stopWords.has(word) &&
        !/^\d+$/.test(word)
      );
    
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
  }
  
  static async extractKeywords(content: string): Promise<string[]> {
    return this.extractKeywordsSync(content);
  }
}