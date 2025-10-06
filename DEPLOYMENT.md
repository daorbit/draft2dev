# Frontend Deployment Guide

## 🚀 Deploying to Production

### Environment Configuration

The frontend is configured to work with different environments:

#### Development (Local)
- **API URL:** `http://localhost:5000`
- **Environment File:** `.env`

#### Production
- **API URL:** `https://test-backend-qzj6.onrender.com`
- **Environment File:** `.env.production`

### API Configuration

The frontend uses a centralized API configuration in `src/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  SIGNIN: `${API_BASE_URL}/api/signin`,
  SIGNUP: `${API_BASE_URL}/api/signup`,
};
```

### Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting platform** (Vercel, Netlify, etc.)

3. **Environment Variables:**
   - For production deployment, set: `VITE_API_URL=https://test-backend-qzj6.onrender.com`
   - For local development, the `.env` file handles the localhost URL

### Supported Hosting Platforms

#### Vercel
- Automatically detects Vite projects
- Set environment variable: `VITE_API_URL=https://test-backend-qzj6.onrender.com`

#### Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://test-backend-qzj6.onrender.com`

#### Other Platforms
- Ensure the `VITE_API_URL` environment variable is set to your production backend URL
- Build command: `npm run build`
- Serve the `dist` directory

### Testing

- **Local Development:** API calls go to `http://localhost:5000`
- **Production:** API calls go to `https://test-backend-qzj6.onrender.com`

The frontend will automatically use the correct API URL based on the environment!