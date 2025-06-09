import Anthropic from '@anthropic-ai/sdk';

// Conditionally initialize Anthropic client only when API key is available
const anthropic = process.env.CLAUDE_API_KEY ? new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
}) : new Anthropic({
  apiKey: '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',
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
        max_tokens: 250,
        messages: [{
          role: 'user',
          content: `Please create a concise summary of the following note for spaced repetition learning. The summary must be EXACTLY 200 characters or less (including spaces and punctuation). Focus on the most important concepts, key ideas, and essential details that would be valuable for quick review. Make it clear, actionable, and perfect for study purposes.

${fullContent}

Requirements:
- Maximum 200 characters (count carefully)
- Include the most critical information
- Make it suitable for quick review
- Focus on key concepts and main ideas`
        }]
      });

      const summary = response.content[0]?.type === 'text' ? response.content[0].text : '';
      
      // Ensure the summary is within 200 characters
      const trimmedSummary = summary.length > 200 ? summary.substring(0, 197) + '...' : summary;
      
      return trimmedSummary || this.generateMockSummary(content, title, tags);
    } catch (error) {
      console.error('Claude API error:', error);
      return this.generateMockSummary(content, title, tags);
    }
  }

  private static generateMockSummary(content: string, title?: string, tags?: string[]): string {
    // Enhanced fallback summary generation with 200 character limit
    const cleanContent = content.trim();
    const titlePart = title ? title.substring(0, 50) : '';
    const tagsPart = tags && tags.length > 0 ? tags.slice(0, 3).join(', ') : '';
    
    let summary = '';
    
    if (titlePart) {
      summary += titlePart;
    }
    
    if (tagsPart && summary.length < 150) {
      summary += (summary ? ' | ' : '') + tagsPart;
    }
    
    const remainingChars = 200 - summary.length;
    if (remainingChars > 20 && cleanContent.length > 0) {
      const contentPreview = cleanContent.substring(0, remainingChars - 5);
      summary += (summary ? ' - ' : '') + contentPreview;
      if (cleanContent.length > remainingChars - 5) {
        summary += '...';
      }
    }
    
    // Fallback if still empty
    if (!summary) {
      summary = cleanContent.length < 50 
        ? "Brief note - key info for review." 
        : cleanContent.substring(0, 197) + '...';
    }
    
    // Ensure exactly 200 characters or less
    return summary.length > 200 ? summary.substring(0, 197) + '...' : summary;
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