import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { X as Close, LayoutDashboard as Dashboard, FileText as Form, MousePointer as ButtonIcon, Image, List, Navigation, Layout, Home } from 'lucide-react';

interface QuickTipsModalProps {
  open: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

interface PromptCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  prompts: {
    title: string;
    description: string;
    prompt: string;
  }[];
}

const promptCategories: PromptCategory[] = [
  {
    title: 'Website Layout',
    icon: <Layout size={20} />,
    color: '#4f46e5',
    prompts: [
      {
        title: 'Header Component',
        description: 'Modern website header with navigation',
        prompt: 'Create a modern website header with logo, navigation menu, search bar, user account dropdown, and mobile hamburger menu. Include sticky positioning and smooth animations.',
      },
      {
        title: 'Footer Component',
        description: 'Comprehensive website footer',
        prompt: 'Create a website footer with company info, quick links, social media icons, newsletter signup, contact information, and copyright notice. Include responsive grid layout.',
      },
      {
        title: 'Landing Page Hero',
        description: 'Hero section for landing page',
        prompt: 'Create a hero section for a landing page with compelling headline, subtext, call-to-action buttons, background image/video, and animated elements.',
      },
    ],
  },
  {
    title: 'Page Sections',
    icon: <Home size={20} />,
    color: '#059669',
    prompts: [
      {
        title: 'Features Section',
        description: 'Product features showcase',
        prompt: 'Create a features section with icon grid, feature cards, descriptions, and benefits. Include hover effects and responsive layout.',
      },
      {
        title: 'Pricing Section',
        description: 'Pricing plans and packages',
        prompt: 'Create a pricing section with different plan tiers, feature comparisons, popular plan highlights, and call-to-action buttons.',
      },
      {
        title: 'About Us Section',
        description: 'Company or team information',
        prompt: 'Create an about us section with company story, team member cards, mission statement, and achievements or statistics.',
      },
    ],
  },
  {
    title: 'Buttons & Actions',
    icon: <ButtonIcon size={20} />,
    color: '#667eea',
    prompts: [
      {
        title: 'Primary Button',
        description: 'Modern styled primary button',
        prompt: 'Create a modern primary button with hover effects, rounded corners, and gradient background. Include states for normal, hover, active, and disabled.',
      },
      {
        title: 'Button Group',
        description: 'Set of related action buttons',
        prompt: 'Create a button group component with multiple action buttons (Save, Cancel, Delete). Include proper spacing, consistent styling, and different button variants.',
      },
      {
        title: 'Call-to-Action Button',
        description: 'Attention-grabbing CTA button',
        prompt: 'Create a compelling call-to-action button with eye-catching design, animation effects, and persuasive styling to drive conversions.',
      },
    ],
  },
  {
    title: 'Cards & Layouts',
    icon: <Dashboard size={20} />,
    color: '#10b981',
    prompts: [
      {
        title: 'Product Card',
        description: 'E-commerce style product card',
        prompt: 'Create a product card component with image, title, price, rating, and add to cart button. Include hover effects and responsive design.',
      },
      {
        title: 'Profile Card',
        description: 'User profile information card',
        prompt: 'Create a user profile card with avatar, name, title, contact information, and social media links. Include modern styling and animations.',
      },
      {
        title: 'Dashboard Grid',
        description: 'Responsive dashboard layout',
        prompt: 'Create a responsive dashboard grid layout with multiple cards showing statistics, charts placeholders, and different card sizes.',
      },
    ],
  },
  {
    title: 'Forms & Input',
    icon: <Form size={20} />,
    color: '#f59e0b',
    prompts: [
      {
        title: 'Login Form',
        description: 'User authentication form',
        prompt: 'Create a modern login form with email/username and password fields, remember me checkbox, forgot password link, and submit button. Include form validation styling.',
      },
      {
        title: 'Contact Form',
        description: 'Multi-field contact form',
        prompt: 'Create a contact form with name, email, subject, and message fields. Include form validation, success/error states, and a submit button.',
      },
      {
        title: 'Search Bar',
        description: 'Search input with suggestions',
        prompt: 'Create a search bar component with search icon, placeholder text, and dropdown suggestions. Include autocomplete styling and keyboard navigation.',
      },
    ],
  },
  {
    title: 'Navigation',
    icon: <Navigation size={20} />,
    color: '#8b5cf6',
    prompts: [
      {
        title: 'Top Navigation',
        description: 'Header navigation bar',
        prompt: 'Create a top navigation bar with logo, menu items, user profile dropdown, and mobile hamburger menu. Include responsive design and smooth transitions.',
      },
      {
        title: 'Sidebar Menu',
        description: 'Vertical navigation sidebar',
        prompt: 'Create a sidebar navigation menu with icons, menu items, collapsible sections, and active state indicators. Include smooth animations.',
      },
      {
        title: 'Breadcrumb',
        description: 'Navigation breadcrumb trail',
        prompt: 'Create a breadcrumb navigation component showing the current page path with clickable links and separators.',
      },
    ],
  },
  {
    title: 'Data Display',
    icon: <List size={20} />,
    color: '#ef4444',
    prompts: [
      {
        title: 'Data Table',
        description: 'Sortable data table',
        prompt: 'Create a data table with sortable columns, search functionality, pagination, and row selection. Include modern styling and responsive design.',
      },
      {
        title: 'Timeline',
        description: 'Vertical timeline component',
        prompt: 'Create a vertical timeline component showing events with dates, titles, descriptions, and icons. Include alternating layout and animations.',
      },
      {
        title: 'Statistics Cards',
        description: 'KPI and metrics display',
        prompt: 'Create a set of statistics cards showing key metrics with numbers, percentages, trend indicators, and icons. Include different color themes.',
      },
    ],
  },
  {
    title: 'Media & Content',
    icon: <Image size={20} />,
    color: '#06b6d4',
    prompts: [
      {
        title: 'Image Gallery',
        description: 'Responsive image grid',
        prompt: 'Create a responsive image gallery with grid layout, hover effects, lightbox modal, and image captions. Include loading states.',
      },
      {
        title: 'Video Player',
        description: 'Custom video player',
        prompt: 'Create a custom video player with play/pause controls, progress bar, volume control, and fullscreen option. Include modern styling.',
      },
      {
        title: 'Testimonial Section',
        description: 'Customer testimonials',
        prompt: 'Create a testimonial section with customer quotes, avatars, names, ratings, and carousel navigation. Include smooth transitions.',
      },
    ],
  },
];

const QuickTipsModal: React.FC<QuickTipsModalProps> = ({
  open,
  onClose,
  onSelectPrompt,
}) => {
  const theme = useTheme();
  const handlePromptSelect = (prompt: string) => {
    onSelectPrompt(prompt);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '90%',
          maxWidth: 1000,
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: '16px',
          outline: 'none',
          boxShadow: 'none',
          backgroundColor: theme.palette.background.paper,
           // Hide scrollbar but keep functionality
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            borderRadius: '16px 16px 0 0',
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.3 }}>
              Component Library
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, fontSize: '0.85rem' }}>
              Choose a template to get started
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
              borderRadius: '8px',
            }}
          >
            <Close size={18} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
              gap: 2.5,
            }}
          >
            {promptCategories.map((category, categoryIndex) => (
              <Box key={categoryIndex}>
                  {/* Category Header */}
                  <Card
                    sx={{
                      mb: 1.5,
                      background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`,
                      color: 'white',
                      borderRadius: '12px',
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                          }}
                        >
                          {category.icon}
                        </Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, fontSize: '0.95rem' }}
                        >
                          {category.title}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Prompts */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {category.prompts.map((prompt, promptIndex) => (
                      <Card
                        key={promptIndex}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          border: `1px solid ${category.color}`,
                          borderRadius: '10px',
                          boxShadow: 'none',
                          '&:hover': {
                            borderColor: category.color,
                            backgroundColor: `${category.color}08`,
                          },
                        }}
                        onClick={() => handlePromptSelect(prompt.prompt)}
                      >
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: category.color,
                              }}
                            />
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                fontSize: '0.85rem',
                              }}
                            >
                              {prompt.title}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: '0.75rem',
                              lineHeight: 1.3,
                              pl: 1.5,
                            }}
                          >
                            {prompt.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
      </Card>
    </Modal>
  );
};

export default QuickTipsModal;