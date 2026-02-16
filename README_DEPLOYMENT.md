# Deployment Guide for Render

This guide will help you deploy your Blog website to Render.

## Prerequisites

1. A GitHub account
2. A Render account (sign up at https://render.com)
3. MongoDB Atlas account (or your MongoDB connection string)

## Step 1: Push Your Code to GitHub

1. Initialize git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub and push your code:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Backend Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the backend service:
   - **Name**: `blog-backend` (or any name you prefer)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or set to `backend` if you want to deploy only backend)

5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `PORT`: `10000` (Render automatically sets this, but you can specify)
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Leave empty for now, we'll update it after deploying frontend

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy the backend URL (e.g., `https://blog-backend.onrender.com`)

## Step 3: Deploy Frontend Service

1. In Render Dashboard, click "New +" → "Static Site"
2. Connect the same GitHub repository
3. Configure the frontend service:
   - **Name**: `blog-frontend` (or any name you prefer)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

4. Add Environment Variable:
   - `VITE_API_URL`: Your backend URL from Step 2 (e.g., `https://blog-backend.onrender.com`)

5. Click "Create Static Site"
6. Wait for deployment to complete
7. Copy the frontend URL (e.g., `https://blog-frontend.onrender.com`)

## Step 4: Update Environment Variables

1. Go back to your **Backend Service** in Render
2. Update the `FRONTEND_URL` environment variable to your frontend URL
3. Save changes (this will trigger a redeployment)

## Step 5: Verify Deployment

1. Visit your frontend URL
2. Test the application:
   - Sign up/Login
   - Create a blog post
   - View blogs
   - Test other features

## Important Notes

- **Free Tier Limitations**: Render's free tier spins down services after 15 minutes of inactivity. The first request after spin-down may take 30-60 seconds.
- **MongoDB Atlas**: Make sure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` to allow connections from Render.
- **CORS**: The backend is configured to accept requests from your frontend URL.
- **Environment Variables**: Never commit `.env` files to GitHub. Use Render's environment variables instead.

## Troubleshooting

### Backend won't start
- Check the logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is correct

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set correctly in frontend environment variables
- Check that `FRONTEND_URL` in backend matches your frontend URL
- Verify CORS settings in backend

### Build fails
- Check that all dependencies are listed in `package.json`
- Verify Node.js version compatibility
- Check build logs for specific errors

## Alternative: Using render.yaml

You can also use the `render.yaml` file included in this project:

1. In Render Dashboard, go to "New +" → "Blueprint"
2. Connect your GitHub repository
3. Render will automatically detect and use `render.yaml`
4. You'll still need to set the environment variables manually in the dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` (after frontend is deployed)
   - `VITE_API_URL` (after backend is deployed)

## Support

If you encounter issues, check:
- Render documentation: https://render.com/docs
- Render community: https://community.render.com
