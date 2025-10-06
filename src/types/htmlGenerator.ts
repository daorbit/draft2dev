export interface GeneratedHTML {
  id: string;
  name: string;
  html: string;
  reactCode?: string; // React component code with styled-components
  rawResponse?: string;
  description: string;
  features: string[];
  createdAt: Date;
  metadata?: {
    inputType: 'figma' | 'image' | 'text';
    originalInput: any;
    aiModel: string;
    generationTime: number;
  };
}

export interface HTMLInput {
  type: 'figma' | 'image' | 'text';
  description: string;
  url?: string;
  file?: File;
  requirements?: string[];
}

export interface HTMLRequirements {
  name: string;
  framework: 'vanilla' | 'bootstrap' | 'tailwind';
  reactFramework: 'styled-components' | 'mui' | 'antd' | 'tailwind';
  responsive: boolean;
  animations: boolean;
  interactive: boolean;
}

export interface HTMLGeneratorConfig {
  provider: 'google' | 'perplexity';
  model: string;
  temperature: number;
  maxTokens: number;
  framework: 'vanilla' | 'bootstrap' | 'tailwind';
  onProgress?: (phase: string, message: string, progress: number) => void;
}

export interface AIProvider {
  id: 'google' | 'perplexity';
  name: string;
  models: AIModel[];
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
}

export interface GenerationProgress {
  phase?: any;
  stage?: 'analyzing' | 'generating' | 'validating' | 'complete' | 'error';
  message: string;
  progress: number;
}