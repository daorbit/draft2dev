import { AIProvider } from '../types/htmlGenerator';

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'google',
    name: 'Google Gemini',
    models: [
      {
        id: 'gemini-2.0-flash-exp',
        name: 'Gemini 2.0 Flash (Experimental)',
        description: 'Latest experimental model with fast responses'
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Most capable model for complex tasks'
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'Fast and efficient for most tasks'
      }
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    models: [
      {
        id: 'sonar',
        name: 'Llama 3.1 Sonar Small (Online)',
        description: 'Fast online model with web access'
      },
      {
        id: 'llama-3.1-sonar-large-128k-online',
        name: 'Llama 3.1 Sonar Large (Online)', 
        description: 'More capable online model with web access'
      },
      {
        id: 'llama-3.1-sonar-huge-128k-online',
        name: 'Llama 3.1 Sonar Huge (Online)',
        description: 'Most capable online model with web access'
      },
      {
        id: 'llama-3.1-8b-instruct',
        name: 'Llama 3.1 8B Instruct',
        description: 'Fast offline instruct model'
      },
      {
        id: 'llama-3.1-70b-instruct',
        name: 'Llama 3.1 70B Instruct', 
        description: 'Powerful offline instruct model'
      }
    ]
  }
];

export const getProviderById = (id: string): AIProvider | undefined => {
  return AI_PROVIDERS.find(provider => provider.id === id);
};

export const getModelsByProvider = (providerId: string) => {
  const provider = getProviderById(providerId);
  return provider?.models || [];
};

export const getDefaultModel = (providerId: string): string => {
  const provider = getProviderById(providerId);
  if (provider && provider.models.length > 0) {
    return provider.models[0].id;
  }
  return '';
};

export const isProviderConfigured = (providerId: string): boolean => {
  switch (providerId) {
    case 'google':
      return Boolean(import.meta.env.VITE_GOOGLE_API_KEY);
    case 'perplexity':
      return Boolean(import.meta.env.VITE_PERPLEXITY_API_KEY);
    default:
      return false;
  }
};