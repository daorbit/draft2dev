interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
    delta: {
      role: string;
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class PerplexityService {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai';

  constructor() {
    this.apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
    if (!this.apiKey) {
      console.warn('VITE_PERPLEXITY_API_KEY is not set');
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async generateContent(
    prompt: string,
    model: string = 'llama-3.1-sonar-small-128k-online',
    options: {
      temperature?: number;
      max_tokens?: number;
    } = {}
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Perplexity API key is not configured. Please set VITE_PERPLEXITY_API_KEY environment variable.');
    }

    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant specialized in generating clean, modern HTML, CSS, and JavaScript code. Always return complete, functional code that works in modern browsers.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 4000,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Perplexity API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data: PerplexityResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response generated from Perplexity API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Perplexity API error:', error);
      throw error;
    }
  }

  async generateHTML(
    prompt: string,
    model: string = 'llama-3.1-sonar-small-128k-online',
    options: {
      temperature?: number;
      max_tokens?: number;
    } = {}
  ): Promise<string> {
    const htmlPrompt = `${prompt}

IMPORTANT: Return ONLY the complete HTML code, no explanations or markdown formatting. The HTML should be a complete, self-contained file with:
- DOCTYPE declaration
- All CSS in <style> tags in the <head>
- All JavaScript in <script> tags
- Modern, responsive design
- Clean, semantic HTML5 structure`;

    const response = await this.generateContent(htmlPrompt, model, options);
    
    // Clean up the response
    let htmlCode = response.replace(/```html\n?/g, '').replace(/```/g, '').trim();
    
    // Ensure it starts with DOCTYPE
    if (!htmlCode.toLowerCase().startsWith('<!doctype html>')) {
      if (htmlCode.toLowerCase().startsWith('<html')) {
        htmlCode = '<!DOCTYPE html>\n' + htmlCode;
      }
    }
    
    return htmlCode;
  }
}

export default PerplexityService;