# Deploy Recon Engine to Render.com (Free)

## Prerequisites

1. Push your code to GitHub/GitLab
2. Create a free account at https://render.com

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
cd c:\SecureVault
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/SecureVault.git
git push -u origin main
```

### 2. Deploy to Render.com

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** (if not already connected)
4. Select your **SecureVault** repository
5. Configure the service:

   - **Name:** `securevault-recon-engine`
   - **Branch:** `main`
   - **Root Directory:** `recon-engine`
   - **Runtime:** Docker
   - **Dockerfile Path:** `Dockerfile`
   - **Instance Type:** Free
   - **Region:** Oregon (US West)

6. Click **"Create Web Service"**

### 3. Wait for Build

Render will:
- Build the Docker image
- Deploy the container
- Provide a URL like: `https://securevault-recon-engine.onrender.com`

### 4. Get Your Endpoint

After deployment, Render will show:
```
Web Service URL: https://securevault-recon-engine.onrender.com
```

### 5. Update Backend

Add to backend `.env` file:
```env
RECON_CLOUD_ENDPOINT=https://securevault-recon-engine.onrender.com
```

### 6. Restart Backend

```bash
# Stop current backend (Ctrl+C)
# Start again
cd backend
node server.js
```

### 7. Test Cloud Recon

```bash
# Test health
curl https://securevault-recon-engine.onrender.com/health

# Test recon
curl -X POST https://securevault-recon-engine.onrender.com/api/recon \
  -H "Content-Type: application/json" \
  -d '{"target":"example.com","phase":"subdomains"}'
```

## Free Tier Limits

- 512MB RAM
- 0.1 CPU
- 750 hours/month
- Auto-sleeps after 15 minutes of inactivity
- Takes ~30 seconds to wake up

## Troubleshooting

**Build fails:**
- Check Dockerfile syntax
- Verify all dependencies in requirements.txt
- Check Render build logs

**Container crashes:**
- Check Render logs
- Verify memory usage (512MB limit)
- Check for missing environment variables

**Timeout errors:**
- Recon tools can take time to run
- Consider upgrading to paid tier for faster performance
- Limit phases to run (e.g., just subdomains)
