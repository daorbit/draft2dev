import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import Lottie from 'lottie-react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import {
  Code,
  Eye,
  Download,
  Copy,
  ExternalLink,
  RefreshCw,
  Save,
  Edit3,
} from 'lucide-react';
import { GeneratedHTML } from '../types/htmlGenerator';
import generatingAnimation from './animations/generating.json';

interface CodeEditorPreviewProps {
  html: GeneratedHTML;
  reactFramework?: 'styled-components' | 'mui' | 'antd' | 'tailwind';
  onDownload?: (html: GeneratedHTML) => void;
  onCopyCode?: (code: string) => void;
  onHtmlChange?: (newHtml: string) => void;
  isGenerating?: boolean;
}

const CodeEditorPreview: React.FC<CodeEditorPreviewProps> = ({
  html,
  reactFramework = 'styled-components',
  onDownload,
  onCopyCode,
  onHtmlChange,
  isGenerating = false,
}) => {
  const theme = useTheme();
  const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');
  const [codeTab, setCodeTab] = useState<'html' | 'react' | 'raw'>('html');
  const [copySuccess, setCopySuccess] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [editedHtml, setEditedHtml] = useState(html.html);
  const [hasChanges, setHasChanges] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);

  // Separate concerns: preview always uses HTML, editor content depends on active tab
  const previewHtml = hasChanges ? editedHtml : html.html;
  const currentEditorContent = (() => {
    switch (codeTab) {
      case 'html':
        return hasChanges ? editedHtml : html.html;
      case 'react':
        return html.reactCode || 'No React code available';
      case 'raw':
        return html.rawResponse || 'No raw response available';
      default:
        return html.html;
    }
  })();

  // Update editedHtml when html prop changes (new generation)
  React.useEffect(() => {
    setEditedHtml(html.html);
    setHasChanges(false);
  }, [html.html]);

  const updatePreview = React.useCallback(() => {
    if (iframeRef.current && activeView === 'preview') {
      const iframe = iframeRef.current;
      try {
        // Always use HTML content for preview, never React code
        const updateContent = () => {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            doc.open();
            doc.write(previewHtml);
            doc.close();
          }
        };

        // If iframe is already loaded, update immediately
        if (iframe.contentDocument?.readyState === 'complete') {
          updateContent();
        } else {
          // Wait for iframe to load
          iframe.onload = updateContent;
        }
      } catch (error) {
        console.error('Error updating preview:', error);
      }
    }
  }, [previewHtml, activeView]);

  React.useEffect(() => {
    if (activeView === 'preview') {
      // Small delay to ensure iframe is ready
      const timer = setTimeout(updatePreview, 100);
      return () => clearTimeout(timer);
    }
  }, [previewHtml, activeView, updatePreview]);

  const handleCopyCode = async () => {
    try {
      let textToCopy = '';
      if (codeTab === 'html') {
        textToCopy = hasChanges ? editedHtml : html.html;
      } else if (codeTab === 'react') {
        textToCopy = html.reactCode || 'No React code available';
      } else {
        textToCopy = html.rawResponse || 'No raw response available';
      }
      
      await navigator.clipboard.writeText(textToCopy);
      onCopyCode?.(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    // Always download HTML content
    const htmlToDownload = hasChanges ? editedHtml : html.html;
    const blob = new Blob([htmlToDownload], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${html.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (hasChanges) {
      const updatedHtml = { ...html, html: editedHtml };
      onDownload?.(updatedHtml);
    } else {
      onDownload?.(html);
    }
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      // Always use HTML content for new tab
      const htmlToOpen = hasChanges ? editedHtml : html.html;
      newWindow.document.write(htmlToOpen);
      newWindow.document.close();
    }
  };

  const handleSaveChanges = () => {
    onHtmlChange?.(editedHtml);
    setHasChanges(false);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditedHtml(value);
      setHasChanges(value !== html.html);
    }
  };

  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1);
    updatePreview();
  };

  const onEditorMount = (editor: any) => {
    editorRef.current = editor;
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 20,
      wordWrap: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      readOnly: false, // Ensure editor is editable
    });
    
    // Focus the editor when it mounts for better UX
    setTimeout(() => {
      editor.focus();
    }, 100);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {html.name}
            </Typography>
            {hasChanges && (
              <Chip 
                label="Modified" 
                size="small" 
                color="warning" 
                variant="outlined"
                icon={<Edit3 size={12} />}
              />
            )}
          </Box>
          
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* View Toggle Buttons */}
          <Box sx={{ display: 'flex', gap: 0.5, mr: 2 }}>
            <Tooltip title="Preview">
              <IconButton 
                size="small" 
                onClick={() => setActiveView('preview')}
                sx={{ 
                  backgroundColor: activeView === 'preview' ? theme.palette.action.selected : 'transparent',
                  '&:hover': { backgroundColor: theme.palette.action.hover }
                }}
              >
                <Eye size={16} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Code Editor">
              <IconButton 
                size="small" 
                onClick={() => {
                  setActiveView('code');
                  // Focus editor after switching to code view
                  setTimeout(() => {
                    if (editorRef.current && codeTab === 'html') {
                      editorRef.current.focus();
                    }
                  }, 200);
                }}
                sx={{ 
                  backgroundColor: activeView === 'code' ? theme.palette.action.selected : 'transparent',
                  '&:hover': { backgroundColor: theme.palette.action.hover }
                }}
              >
                <Code size={16} />
              </IconButton>
            </Tooltip>
          </Box>

          {hasChanges && (
            <Tooltip title="Save Changes">
              <Button
                variant="contained"
                size="small"
                startIcon={<Save size={14} />}
                onClick={handleSaveChanges}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
            </Tooltip>
          )}
          
          <Tooltip title="Refresh Preview">
            <IconButton size="small" onClick={refreshPreview}>
              <RefreshCw size={16} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Open in New Tab">
            <IconButton size="small" onClick={handleOpenInNewTab}>
              <ExternalLink size={16} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={copySuccess ? "Copied!" : "Copy HTML Code"}>
            <IconButton size="small" onClick={handleCopyCode}>
              {copySuccess ? <span style={{ color: 'green' }}>✓</span> : <Copy size={16} />}
            </IconButton>
          </Tooltip>
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download size={14} />}
            onClick={handleDownload}
            sx={{ ml: 1 ,boxShadow: 'none', textTransform: 'none'}}
          >
            Download Code
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {activeView === 'code' ? (
          // Code Editor View with Tabs
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Code Editor Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: theme.palette.background.paper }}>
              <Tabs 
                value={codeTab} 
                onChange={(_, newValue) => {
                  setCodeTab(newValue);
                  // Focus editor when switching to HTML tab
                  if (newValue === 'html') {
                    setTimeout(() => {
                      if (editorRef.current) {
                        editorRef.current.focus();
                      }
                    }, 100);
                  }
                }}
                variant="fullWidth"
                sx={{
                  minHeight: 36,
                  '& .MuiTab-root': {
                    minHeight: 36,
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    fontWeight: 500,
                  }
                }}
              >
                <Tab label="HTML Code" value="html" />
                <Tab 
                  label={
                    html.reactCode 
                      ? `React (${reactFramework === 'styled-components' ? 'Styled' : 
                          reactFramework === 'mui' ? 'MUI' :
                          reactFramework === 'antd' ? 'Antd' : 'Tailwind'})`
                      : 'React (N/A)'
                  } 
                  value="react" 
                  disabled={!html.reactCode}
                />
                <Tab 
                  label={`Raw API Response ${html.rawResponse ? '' : '(N/A)'}`} 
                  value="raw" 
                  disabled={!html.rawResponse}
                />
              </Tabs>
            </Box>
            
            {/* Editor Content */}
            <Box sx={{ flex: 1, position: 'relative' }}>
              <Editor
                key={`editor-${codeTab}`} // Force re-render when switching tabs
                height="100%"
                language={
                  codeTab === 'html' ? 'html' : 
                  codeTab === 'react' ? 'typescript' : 
                  'text'
                }
                value={currentEditorContent}
                onChange={codeTab === 'html' ? handleEditorChange : undefined}
                onMount={codeTab === 'html' ? onEditorMount : undefined}
                theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'vs'}
                options={{
                  fontSize: 14,
                  lineHeight: 20,
                  wordWrap: 'on',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  tabSize: 2,
                  insertSpaces: true,
                  detectIndentation: true,
                  folding: true,
                  lineNumbers: 'on',
                  renderLineHighlight: 'line',
                  cursorBlinking: 'blink',
                  cursorStyle: 'line',
                  renderWhitespace: 'selection',
                  bracketPairColorization: { enabled: true },
                  readOnly: codeTab !== 'html', // Only HTML is editable, React and Raw are read-only
                }}
              />
              
              {/* Loading Overlay for Code Editor */}
              {isGenerating && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(2px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Lottie
                      animationData={generatingAnimation}
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 2,
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      textAlign: 'center'
                    }}
                  >
                    Generating Code...
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: theme.palette.text.secondary,
                      textAlign: 'center'
                    }}
                  >
                    Please wait while we create your component
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          // Live Preview View
          <Box sx={{ 
            height: '100%', 
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.default
          }}>
            <Box sx={{ 
              p: 1, 
              backgroundColor: theme.palette.background.paper, 
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Eye size={14} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                Live Preview
              </Typography>
              {hasChanges && (
                <Typography variant="caption" sx={{ color: '#ed6c02', fontStyle: 'italic' }}>
                  (showing your edits)
                </Typography>
              )}
            </Box>
            
            <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <iframe
                key={previewKey}
                ref={iframeRef}
                title={`${html.name} Preview`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: theme.palette.background.default,
                  filter: isGenerating ? 'blur(4px)' : 'none',
                  transition: 'filter 0.3s ease-in-out'
                }}
                sandbox="allow-scripts allow-same-origin allow-forms"
                onLoad={() => {
                  // Ensure content is updated when iframe loads
                  if (activeView === 'preview') {
                    updatePreview();
                  }
                }}
              />
              
              {/* Loading Overlay */}
              {isGenerating && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(2px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Lottie
                      animationData={generatingAnimation}
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 2,
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      textAlign: 'center'
                    }}
                  >
                    Generating Code...
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: theme.palette.text.secondary,
                      textAlign: 'center'
                    }}
                  >
                    Please wait while we create your component
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Footer Info */}
      <Box sx={{ 
        p: 1, 
        backgroundColor: theme.palette.background.paper, 
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          {html.description}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {activeView === 'code' ? (
            codeTab === 'raw' ? (
              html.rawResponse ? 
                `${html.rawResponse.length} characters • ${html.rawResponse.split('\n').length} lines • Raw API Response` :
                'No raw response available'
            ) : codeTab === 'react' ? (
              html.reactCode ?
                `${html.reactCode.length} characters • ${html.reactCode.split('\n').length} lines • React (${reactFramework.toUpperCase()}) • Read-only` :
                'No React code available'
            ) : (
              `${(hasChanges ? editedHtml : html.html).length} characters • ${(hasChanges ? editedHtml : html.html).split('\n').length} lines${hasChanges ? ' • Modified' : ''}`
            )
          ) : (
            `${previewHtml.length} characters • ${previewHtml.split('\n').length} lines${hasChanges ? ' • Modified' : ''} • Preview`
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default CodeEditorPreview;