# EdPsych Connect Deployment Guide

This guide provides step-by-step instructions for deploying the EdPsych Connect platform, including both the frontend and backend components.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Firebase project
- OpenAI API key
- Vercel account

## Frontend Deployment

The frontend is already configured for deployment with Vercel. Follow these steps:

1. Install Vercel CLI if you haven't already:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel --prod
   ```

## Backend Deployment

### Setting Up MongoDB Atlas

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address or set it to allow access from anywhere (0.0.0.0/0)
5. Get your MongoDB connection string

### Setting Up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Set up Authentication with Email/Password provider
4. Generate a new private key for your service account:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

### Setting Up OpenAI API

1. Create an account at [OpenAI](https://platform.openai.com/)
2. Generate an API key
3. Set up billing information

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d
JWT_COOKIE_EXPIRES_IN=30

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

### Deploying to Vercel

1. Add the environment variables to your Vercel project:
   - Go to your project on the Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add all the variables from your `.env` file

2. Update the `vercel.json` file to include the backend configuration:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       },
       {
         "src": "public/**/*",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "server.js"
       },
       {
         "src": "/(.*\\.(js|css|png|jpg|jpeg|svg|ico|json))",
         "dest": "public/$1"
       },
       {
         "src": "/(.*)",
         "dest": "public/index.html"
       }
     ]
   }
   ```

3. Deploy with Vercel CLI:
   ```bash
   vercel --prod
   ```

## GitHub Deployment

To deploy the code to GitHub:

1. Create a new repository on GitHub
2. Add the remote repository:
   ```bash
   git remote add origin https://github.com/yourusername/edpsych-connect.git
   ```
3. Push the code to GitHub:
   ```bash
   git push -u origin master
   ```

## Continuous Deployment

To set up continuous deployment with Vercel and GitHub:

1. Connect your GitHub repository to Vercel
2. Configure automatic deployments for the master branch
3. Add environment variables to the Vercel project

## Testing the Deployment

After deployment, test the following:

1. User registration and login
2. AI content generation
3. Assessment creation and taking
4. Curriculum planning features

## Troubleshooting

If you encounter issues:

1. Check the Vercel deployment logs
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas connection is working
4. Check Firebase authentication configuration
5. Verify OpenAI API key is valid and has sufficient credits
