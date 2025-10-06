import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeneratedHTML, HTMLInput, HTMLRequirements, HTMLGeneratorConfig } from '../types/htmlGenerator';
import PerplexityService from './perplexityService';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || '');

class HTMLGenerator {
  private config: HTMLGeneratorConfig;
  private lastRawResponse?: string;

  constructor(config?: Partial<HTMLGeneratorConfig>) {
    this.config = {
      provider: 'google',
      model: 'gemini-2.0-flash-exp',
      temperature: 0.7,
      maxTokens: 4000,
      framework: 'vanilla',
      ...config,
    };
  }

  private updateProgress(phase: string, message: string, progress: number): void {
    this.config.onProgress?.(phase, message, progress);
  }

  private isConfigured(): boolean {
    if (this.config.provider === 'google') {
      return Boolean(import.meta.env.VITE_GOOGLE_API_KEY);
    } else if (this.config.provider === 'perplexity') {
      return Boolean(import.meta.env.VITE_PERPLEXITY_API_KEY);
    }
    return false;
  }

  async generateHTML(
    input: HTMLInput,
    requirements: HTMLRequirements
  ): Promise<GeneratedHTML> {
    if (!this.isConfigured()) {
      throw new Error('AI service is not configured. Please set your Google AI API key.');
    }

    const startTime = Date.now();

    try {
      this.updateProgress('analyzing', 'Analyzing input...', 10);
      
      // Analyze the input and create context
      const context = await this.analyzeInput(input);
      
      this.updateProgress('generating', 'Generating HTML code...', 40);
      
      // Generate the HTML code
      const generatedHTML = await this.generateCode(context, requirements);
      
      this.updateProgress('generating', 'Generating React component...', 70);
      
      // Generate the React code
      const reactCode = await this.generateReactCode(context, requirements);
      
      this.updateProgress('complete', 'HTML and React code generated successfully!', 100);
      
      const generationTime = Date.now() - startTime;
      
      return {
        id: this.generateId(),
        name: requirements.name,
        html: generatedHTML,
        reactCode: reactCode,
        rawResponse: this.lastRawResponse,
        description: input.description,
        features: this.extractFeatures(generatedHTML, requirements),
        createdAt: new Date(),
        metadata: {
          inputType: input.type,
          originalInput: input,
          aiModel: this.config.model,
          generationTime,
        }
      };
      
    } catch (error) {
      this.updateProgress('error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 0);
      throw error;
    }
  }

  private async analyzeInput(input: HTMLInput): Promise<string> {
    switch (input.type) {
      case 'figma':
        return this.analyzeFigmaInput(input as HTMLInput & { type: 'figma' });
      case 'image':
        return this.analyzeImageInput(input as HTMLInput & { type: 'image' });
      case 'text':
        return this.analyzeTextInput(input as HTMLInput & { type: 'text' });
      default:
        throw new Error(`Unsupported input type: ${(input as any).type}`);
    }
  }

  private async analyzeFigmaInput(input: HTMLInput & { type: 'figma' }): Promise<string> {
    const figmaId = this.extractFigmaId(input.url || '');
    return `Figma design with ID: ${figmaId}. Create an HTML page based on this Figma design. ${input.description}`;
  }

  private async analyzeImageInput(input: HTMLInput & { type: 'image' }): Promise<string> {
    const model = genAI.getGenerativeModel({ model: this.config.model });
    
    // Convert file to base64
    const base64Data = await this.fileToBase64(input.file!);
    
    const prompt = `Analyze this UI/design image and describe the layout, components, and visual elements in detail for HTML/CSS recreation. Focus on:
    1. Overall layout structure and sections
    2. Visual styling (colors, typography, spacing, shadows)
    3. Interactive elements (buttons, forms, navigation)
    4. Images and media elements
    5. Any animations or hover effects visible
    
    Additional context: ${input.description || 'No additional description provided'}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: input.file!.type,
          data: base64Data,
        },
      },
    ]);

    return result.response.text();
  }

  private async analyzeTextInput(input: HTMLInput & { type: 'text' }): Promise<string> {
    const requirements = input.requirements?.join('\n- ') || '';
    return `${input.description}\n\nAdditional requirements:\n- ${requirements}`;
  }

  private async generateCode(context: string, requirements: HTMLRequirements): Promise<string> {
    if (this.config.provider === 'perplexity') {
      return this.generateWithPerplexity(context, requirements);
    } else {
      return this.generateWithGoogle(context, requirements);
    }
  }

  private async generateWithGoogle(context: string, requirements: HTMLRequirements): Promise<string> {
    const model = genAI.getGenerativeModel({ 
      model: this.config.model,
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      }
    });

    const frameworkInstructions = this.getFrameworkInstructions(requirements.framework);

    const prompt = `You are an expert web developer. Create a complete, standalone HTML file based on the following requirements:

CONTEXT:
${context}

REQUIREMENTS:
- Page/Component name: ${requirements.name}
- Framework: ${requirements.framework}
- Responsive design: ${requirements.responsive}
- Include animations: ${requirements.animations}
- Interactive elements: ${requirements.interactive}

TECHNICAL REQUIREMENTS:
- Create ONE complete HTML file with everything inline
- Include ALL CSS in <style> tags in the <head>
- Include ALL JavaScript in <script> tags (if needed)
- Use semantic HTML5 elements
- Ensure the page is fully functional and self-contained
- Add proper meta tags for responsive design
${requirements.responsive ? '- Implement responsive design with CSS media queries' : ''}
${requirements.animations ? '- Include smooth CSS animations and transitions' : ''}
${requirements.interactive ? '- Add JavaScript for interactive functionality' : ''}

FRAMEWORK INSTRUCTIONS:
${frameworkInstructions}

IMPORTANT: 
- Return ONLY the complete HTML code, no explanations
- Everything must be in ONE file (no external dependencies except CDN links if absolutely necessary)
- Use modern HTML5, CSS3, and vanilla JavaScript
- Ensure the code is clean, well-commented, and production-ready
- Add proper doctype, lang attribute, and meta tags

Generate the complete HTML file:`;

    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();
    let htmlCode = rawResponse;
    
    // Store raw response for debugging
    this.lastRawResponse = rawResponse;
    
    // Clean up the response
    htmlCode = htmlCode.replace(/```html\n?/g, '').replace(/```/g, '').trim();
    
    // Ensure it starts with <!DOCTYPE html>
    if (!htmlCode.toLowerCase().startsWith('<!doctype html>')) {
      if (htmlCode.toLowerCase().startsWith('<html')) {
        htmlCode = '<!DOCTYPE html>\n' + htmlCode;
      }
    }
    
    return htmlCode;
  }

  private async generateWithPerplexity(context: string, requirements: HTMLRequirements): Promise<string> {
    const perplexityService = new PerplexityService();
    const frameworkInstructions = this.getFrameworkInstructions(requirements.framework);

    const prompt = `You are an expert web developer. Create a complete, standalone HTML file based on the following requirements:

CONTEXT:
${context}

REQUIREMENTS:
- Page/Component name: ${requirements.name}
- Framework: ${requirements.framework}
- Responsive design: ${requirements.responsive}
- Include animations: ${requirements.animations}
- Interactive elements: ${requirements.interactive}

TECHNICAL REQUIREMENTS:
- Create ONE complete HTML file with everything inline
- Include ALL CSS in <style> tags in the <head>
- Include ALL JavaScript in <script> tags (if needed)
- Use semantic HTML5 elements
- Ensure the page is fully functional and self-contained
- Add proper meta tags for responsive design
${requirements.responsive ? '- Implement responsive design with CSS media queries' : ''}
${requirements.animations ? '- Include smooth CSS animations and transitions' : ''}
${requirements.interactive ? '- Add JavaScript for interactive functionality' : ''}

FRAMEWORK INSTRUCTIONS:
${frameworkInstructions}

IMPORTANT: 
- Return ONLY the complete HTML code, no explanations
- Everything must be in ONE file (no external dependencies except CDN links if absolutely necessary)  
- Use modern HTML5, CSS3, and vanilla JavaScript
- Ensure the code is clean, well-commented, and production-ready
- Add proper doctype, lang attribute, and meta tags

Generate the complete HTML file:`;

    const result = await perplexityService.generateHTML(prompt, this.config.model, {
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
    });
    
    // Store the raw response (for Perplexity, this is already cleaned)
    this.lastRawResponse = result;
    
    return result;
  }

  private getFrameworkInstructions(framework: HTMLRequirements['framework']): string {
    switch (framework) {
      case 'bootstrap':
        return `- Use Bootstrap 5 CSS framework via CDN
- Include Bootstrap CSS: <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
- Include Bootstrap JS if needed: <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
- Use Bootstrap classes for layout, components, and utilities
- Follow Bootstrap design system and component patterns`;
      
      case 'tailwind':
        return `- Use Tailwind CSS via CDN
- Include Tailwind CSS: <script src="https://cdn.tailwindcss.com"></script>
- Use Tailwind utility classes for all styling
- Follow Tailwind design principles and responsive patterns
- Use Tailwind's color palette and spacing system`;
      
      case 'vanilla':
      default:
        return `- Use pure HTML, CSS, and JavaScript (no external frameworks)
- Write custom CSS with modern features (Grid, Flexbox, CSS Variables)
- Use CSS custom properties for theming
- Implement responsive design with CSS media queries
- Keep all code self-contained and framework-free`;
    }
  }

  private getReactFrameworkInstructions(reactFramework: HTMLRequirements['reactFramework']): string {
    switch (reactFramework) {
      case 'mui':
        return `MATERIAL-UI (MUI) REQUIREMENTS:
- Import necessary components from '@mui/material'
- Import icons from '@mui/icons-material' if needed
- Use MUI's sx prop for styling and customization
- Use MUI's theme system with proper colors and spacing
- Import and use MUI components like Box, Typography, Button, Card, etc.
- Use MUI's breakpoints for responsive design: theme.breakpoints.down('md')
- Follow Material Design principles

EXAMPLE STRUCTURE:
\`\`\`tsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent 
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const ${'{ComponentName}'}: React.FC = () => {
  return (
    <StyledContainer>
      <Typography variant="h4" component="h1">
        Content
      </Typography>
    </StyledContainer>
  );
};
\`\`\``;

      case 'antd':
        return `ANT DESIGN REQUIREMENTS:
- Import necessary components from 'antd'
- Import icons from '@ant-design/icons' if needed
- Use Ant Design's built-in styling system
- Use antd components like Layout, Typography, Button, Card, etc.
- Use antd's responsive utilities and breakpoints
- Follow Ant Design system principles
- Use antd's theme customization if needed

EXAMPLE STRUCTURE:
\`\`\`tsx
import React, { useState } from 'react';
import { 
  Layout, 
  Typography, 
  Button, 
  Card, 
  Space 
} from 'antd';
import type { FC } from 'react';

const { Content } = Layout;
const { Title, Text } = Typography;

const ${'{ComponentName}'}: FC = () => {
  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Title level={1}>Content</Title>
      </Content>
    </Layout>
  );
};
\`\`\``;

      case 'tailwind':
        return `TAILWIND CSS REQUIREMENTS:
- Use Tailwind utility classes for ALL styling
- No custom CSS or styled-components
- Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
- Use Tailwind's color palette and spacing system
- Use Tailwind's flexbox and grid utilities
- Apply hover, focus, and other state variants
- Use Tailwind's animation utilities

EXAMPLE STRUCTURE:
\`\`\`tsx
import React, { useState } from 'react';

const ${'{ComponentName}'}: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Content
      </h1>
    </div>
  );
};
\`\`\``;

      case 'styled-components':
      default:
        return `STYLED-COMPONENTS REQUIREMENTS:
- Use styled-components for ALL styling (no CSS files)
- Import React and styled from 'styled-components'
- Define all styled components at the top after imports
- Use descriptive names for styled components (Container, Header, Button, etc.)
- Use template literals with CSS for styling
- Include hover states, transitions, and media queries as needed

EXAMPLE STRUCTURE:
\`\`\`tsx
import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div\`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
\`;

const Header = styled.h1\`
  font-size: 2rem;
  color: #333;
\`;

const ${'{ComponentName}'}: React.FC = () => {
  return (
    <Container>
      <Header>Content</Header>
    </Container>
  );
};
\`\`\``;
    }
  }

  private async generateReactCode(context: string, requirements: HTMLRequirements): Promise<string> {
    if (this.config.provider === 'perplexity') {
      return this.generateReactWithPerplexity(context, requirements);
    } else {
      return this.generateReactWithGoogle(context, requirements);
    }
  }

  private async generateReactWithGoogle(context: string, requirements: HTMLRequirements): Promise<string> {
    const model = genAI.getGenerativeModel({ 
      model: this.config.model,
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      }
    });

    const frameworkInstructions = this.getReactFrameworkInstructions(requirements.reactFramework);
    const prompt = `You are an expert React developer. Create a React component using ${requirements.reactFramework} based on the following requirements:

CONTEXT:
${context}

REQUIREMENTS:
- Component name: ${requirements.name}
- React Framework: ${requirements.reactFramework}
- Responsive design: ${requirements.responsive}
- Include animations: ${requirements.animations}  
- Interactive elements: ${requirements.interactive}

${frameworkInstructions}

GENERAL REQUIREMENTS:
- Create a complete React functional component using TypeScript
- Export the component as default
- Use modern React hooks (useState, useEffect, etc.) if needed
- Make the component fully self-contained
- Include proper TypeScript types for props if needed
${requirements.responsive ? '- Implement responsive design' : ''}
${requirements.animations ? '- Include smooth animations and transitions' : ''}
${requirements.interactive ? '- Add proper event handlers and state management' : ''}

IMPORTANT: 
- Return ONLY the complete React component code, no explanations
- Use TypeScript syntax (.tsx)
- Follow the framework-specific patterns and best practices
- Ensure the component is production-ready and well-structured
- Include proper error handling if needed

Generate the React component:`;

    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();
    let reactCode = rawResponse;
    
    // Clean up the response
    reactCode = reactCode.replace(/```tsx\n?/g, '').replace(/```typescript\n?/g, '').replace(/```/g, '').trim();
    
    return reactCode;
  }

  private async generateReactWithPerplexity(context: string, requirements: HTMLRequirements): Promise<string> {
    const perplexityService = new PerplexityService();
    const frameworkInstructions = this.getReactFrameworkInstructions(requirements.reactFramework);

    const prompt = `You are an expert React developer. Create a React component using ${requirements.reactFramework} based on the following requirements:

CONTEXT:
${context}

REQUIREMENTS:
- Component name: ${requirements.name}
- React Framework: ${requirements.reactFramework}
- Responsive design: ${requirements.responsive}
- Include animations: ${requirements.animations}
- Interactive elements: ${requirements.interactive}

${frameworkInstructions}

GENERAL REQUIREMENTS:
- Create a complete React functional component using TypeScript
- Export the component as default  
- Use modern React hooks (useState, useEffect, etc.) if needed
- Make the component fully self-contained
- Include proper TypeScript types for props if needed
${requirements.responsive ? '- Implement responsive design' : ''}
${requirements.animations ? '- Include smooth animations and transitions' : ''}
${requirements.interactive ? '- Add proper event handlers and state management' : ''}

IMPORTANT: 
- Return ONLY the complete React component code, no explanations
- Use TypeScript syntax (.tsx)
- Follow the framework-specific patterns and best practices
- Ensure the component is production-ready and well-structured

Generate the React component:`;

    const result = await perplexityService.generateHTML(prompt, this.config.model, {
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
    });
    
    let reactCode = result;
    
    // Clean up the response
    reactCode = reactCode.replace(/```tsx\n?/g, '').replace(/```typescript\n?/g, '').replace(/```/g, '').trim();
    
    return reactCode;
  }

  private extractFeatures(html: string, requirements: HTMLRequirements): string[] {
    const features: string[] = [];
    
    // Analyze the HTML to extract features
    if (html.includes('<nav') || html.includes('navigation')) features.push('Navigation');
    if (html.includes('<form') || html.includes('input')) features.push('Forms');
    if (html.includes('<button') || html.includes('onclick')) features.push('Interactive Elements');
    if (html.includes('@media') || html.includes('responsive')) features.push('Responsive Design');
    if (html.includes('animation') || html.includes('transition')) features.push('Animations');
    if (html.includes('<img') || html.includes('background-image')) features.push('Images');
    if (html.includes('grid') || html.includes('flexbox') || html.includes('flex')) features.push('Modern Layout');
    if (html.includes('addEventListener') || html.includes('function')) features.push('JavaScript Functionality');
    
    // Add requirement-based features
    if (requirements.responsive) features.push('Mobile Responsive');
    if (requirements.animations) features.push('CSS Animations');
    if (requirements.interactive) features.push('User Interactions');
    
    return [...new Set(features)]; // Remove duplicates
  }

  private extractFigmaId(url: string): string {
    const match = url.match(/figma\.com\/file\/([a-zA-Z0-9]+)/);
    return match ? match[1] : 'unknown';
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export default HTMLGenerator;