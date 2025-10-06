import React, { useState, useRef } from "react";
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Container,
  Paper,
  CardMedia,
  CardActions,
  Box,
  Chip,
  Avatar,
  List,
  ListItemText,
  ListItemButton,
  Tabs,
  Tab,
} from "@mui/material";
import { Upload, Image as ImageIcon, Download } from "lucide-react";
import { generateImage } from "../services";

const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [usage, setUsage] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestedPrompts = {
    "Artistic Styles": [
      "Transform this photo into a vintage Polaroid with soft, faded colors and a grainy texture.",
      "Give this image a cinematic, high-contrast look with a teal-and-orange color grade.",
      "Turn this photo into a Studio Ghibli-style watercolor illustration with a cozy, soft palette.",
      "Convert this selfie into a 3D Pixar-style cartoon with clean lines and soft lighting.",
      "Apply an oil painting effect to this image with visible brush strokes and a textured canvas feel.",
    ],
    "Functional Edits": [
      "Remove the person on the left from the background and keep the natural scenery intact.",
      "Brighten this image, enhance the contrast, and make the colors more vibrant.",
      "Add a golden sunset to the background and apply a warm, ethereal glow to the entire scene.",
      "Change the background of this photo to a cyberpunk city street with neon signs and glowing rain puddles.",
      "Insert a group of soaring birds into the sky and make them look realistic.",
    ],
    "Thematic Moods": [
      "Create a romantic, rainy day scene with wet streets and a couple sharing an umbrella.",
      "Transform this portrait into a magical, fairy-tale setting with glowing fireflies and mystical lighting.",
      "Give this photo a dark, moody feel with deep shadows and muted, cinematic tones.",
      "Generate a festive Holi celebration scene with people throwing bright colored powders and joyful expressions.",
    ],
    "Photo Enhancements": [
      "Add a bokeh effect to the background, softly blurring it while keeping the subject in sharp focus.",
      "Make this a high-resolution, photorealistic image with crisp details and natural lighting.",
      "Apply a vintage VHS effect with grainy textures and a subtle color bleed.",
      "Convert this photo into a classic black-and-white image with a timeless, high-contrast aesthetic.",
    ],
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setUploadedImageUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }
    setLoading(true);
    try {
      const result = await generateImage({
        prompt,
        referenceImage: imageFile || undefined,
      });
      setGeneratedImage(result.image);
      setUsage(result.usage);
      setPrompt("");
      setImageFile(null);
      setUploadedImageUrl(null);
    } catch (error) {
      console.error("Error generating image:", error);
      alert(
        `Error generating image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "generated-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Container sx={{ py: { xs: 2, md: 5 }, px: { xs: 0, md: 5 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        <Box sx={{ flex: { xs: 1, md: "2 1 0%" } }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 3,
              mb: 4,
              backgroundColor: "#fff",
              boxShadow: "none",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Describe the modification
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g., Make the background sunset-themed"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />

            {uploadedImageUrl && (
              <Chip
                avatar={<Avatar src={uploadedImageUrl} />}
                label="Uploaded Image"
                onDelete={() => {
                  setImageFile(null);
                  setUploadedImageUrl(null);
                }}
                sx={{ mb: 3 }}
              />
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                mb: 3,
                alignItems: { xs: "stretch", md: "center" },
              }}
            >
              <Button
                variant="outlined"
                size="large"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<Upload />}
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Button
                variant="contained"
                size="large"
                onClick={handleGenerate}
                disabled={loading}
                startIcon={<ImageIcon />}
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                {loading ? <CircularProgress size={24} /> : "Generate Image"}
              </Button>
            </Box>
          </Paper>

          {generatedImage && (
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 3,
                backgroundColor: "#fff",
                boxShadow: "none",
                border: "1px solid #e0e0e0",
              }}
            >
              <CardMedia
                component="img"
                image={generatedImage}
                alt="Generated"
                sx={{
                  height: { xs: 300, md: 500 },
                  objectFit: "contain",
                  width: "100%",
                }}
              />
              <CardActions>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleDownload}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                >
                  Download
                </Button>
              </CardActions>
              {usage && (
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  Tokens used: {usage.totalTokenCount}
                </Typography>
              )}
            </Paper>
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 3,
              backgroundColor: "#fff",
              boxShadow: "none",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Suggested Prompts
            </Typography>
            <Tabs
              value={activeTab}
              onChange={(_e, v) => setActiveTab(v)}
              sx={{ mb: 2 }}
            >
              {Object.keys(suggestedPrompts).map((category, index) => (
                <Tab key={index} label={category} />
              ))}
            </Tabs>
            <List>
              {suggestedPrompts[
                Object.keys(suggestedPrompts)[
                  activeTab
                ] as keyof typeof suggestedPrompts
              ].map((p: string, index: number) => (
                <ListItemButton key={index} onClick={() => setPrompt(p)}>
                  <ListItemText primary={p} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default ImageEditor;
