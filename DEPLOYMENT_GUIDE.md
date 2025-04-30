# Deploying to Vercel

This guide will walk you through deploying your Anti-Ragging and Human Rights Support System to Vercel.

## Prerequisites

1. A GitHub account to host your repository
2. A Vercel account (you can sign up at [vercel.com](https://vercel.com) using your GitHub account)
3. Firebase project (as set up during development)

## Step 1: Push Your Code to GitHub

1. Create a new GitHub repository
2. Initialize Git in your project folder (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Add your GitHub repo as a remote and push your code:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

## Step 2: Set Up Environment Variables

Before deploying, make sure you have the following Firebase configuration values ready:
- Firebase API Key
- Firebase Project ID
- Firebase App ID

These were configured as environment variables in your development environment.

## Step 3: Deploy to Vercel

1. Log in to your Vercel account
2. Click on "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. In the "Environment Variables" section, add the following:
   - `VITE_FIREBASE_API_KEY`: Your Firebase API key
   - `VITE_FIREBASE_PROJECT_ID`: Your Firebase Project ID
   - `VITE_FIREBASE_APP_ID`: Your Firebase App ID
6. Click "Deploy"

Vercel will automatically build and deploy your application.

## Step 4: Configure Firebase for Production

1. After deployment, get your Vercel domain (usually `your-project-name.vercel.app`)
2. Go to the Firebase console → Authentication → Settings → Authorized domains
3. Add your Vercel domain to the list of authorized domains
4. If you've set up Firebase Security Rules, make sure they're configured properly for production use

## Step 5: Add Admin Users

Follow the instructions in the `ADMIN_SETUP_GUIDE.md` file to set up admin access for your deployed application.

## Step 6: Testing Your Deployment

1. Visit your Vercel deployment URL
2. Test all major functionality:
   - Home page loads correctly
   - Anonymous report submission works
   - Authentication works for admins
   - Incidents page displays reports from Firebase
   - Statistics are generated from real data

## Ongoing Maintenance

- Any changes pushed to your GitHub repository's main branch will automatically trigger a new deployment
- Monitor your Firebase console for any issues with authentication or database operations
- Periodically check for security vulnerabilities in your dependencies and update as needed

## Custom Domain (Optional)

If you want to use a custom domain:

1. In Vercel, go to your project settings → Domains
2. Add your custom domain
3. Follow the instructions to configure DNS settings
4. Don't forget to add your custom domain to Firebase authorized domains list

## Support

If you encounter any issues with your deployment, check:
- Vercel deployment logs
- Firebase console for authentication or Firestore errors
- Application error logs in your browser's developer console