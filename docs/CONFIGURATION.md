# Configuration Guide

## CLI Configuration

When you run `npx create-fullstack-crud`, the CLI prompts for the following options:

### Project Name
- **Type:** String (lowercase, hyphens, underscores)
- **Default:** `my-crud-app`
- Used as the project directory name and in `package.json`

### Application Title
- **Type:** String
- **Default:** `My App`
- Appears in: login page, sidebar, page `<title>`, and server logs

### Brand Colors

| Color | Description | Default | Used In |
|-------|-------------|---------|---------|
| Brand Color | Primary color | `#00ABE6` | Table headers, buttons, links, sidebar active state |
| Brand Color Dark | Hover/active | `#0095c8` | Button hover, sortable column hover |
| Brand Color Light | Highlight | `#d4f1f9` | Selected row, DataTable highlight |
| Background Color | Page background | `#EDF1EF` | Body, alternating table rows |

### Feature Toggles

| Feature | Description | Files Affected |
|---------|-------------|---------------|
| **Email notifications** | Nodemailer integration for order events | Backend: `nodemailer` dependency |
| **PDF processing** | Upload, parse, and serve PDF files | Backend: `parsePDF.js`, `multer` |
| **Excel export** | Client-side XLSX generation | Frontend: `xlsx`, `file-saver` |

---

## Environment Variables

### Backend (`.env`)

```bash
# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/my-app

# Auth
JWT_SECRET=change-this-to-a-random-string

# Email (optional)
EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Environment
NODE_ENV=development
```

### Frontend (`.env`)

```bash
# API URL — only needed for production
# In development, Vite proxy handles routing
VITE_API_URL=https://api.yourdomain.com
```

---

## Deployment

### Frontend → Vercel

1. Push your frontend to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add a `vercel.json` to proxy API calls:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.yourdomain.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Backend → Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### Backend → Railway / Render

1. Push your backend to GitHub
2. Import in [Railway](https://railway.app) or [Render](https://render.com)
3. Set environment variables in the dashboard
4. Deploy!
