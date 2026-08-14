# MongoDB Atlas Setup Guide

This document describes how to configure MongoDB Atlas and link it to the **KrishiSeva** backend application.

## Step 1: Create a MongoDB Atlas Account
1. Visit [MongoDB Atlas website](https://www.mongodb.com/cloud/atlas) and register for a free account.
2. Complete the onboarding questionnaire.

## Step 2: Create a Free Tier Cluster
1. Click **Create** to deploy a new database.
2. Select the **M0 (Free)** Shared Cluster option.
3. Choose your preferred Cloud Provider (e.g., AWS) and Region (e.g., Mumbai, Singapore).
4. Click **Create Cluster** (takes ~1-3 minutes to deploy).

## Step 3: Create a Database User
1. Navigate to **Security** -> **Database Access** on the left menu.
2. Click **+ Add New Database User**.
3. Select **Password** as the authentication method.
4. Set a username (e.g., `krishiseva_user`) and a secure password.
5. Under **Database User Privileges**, select **Read and write to any database**.
6. Click **Add User**.

## Step 4: Configure Network Access
1. Navigate to **Security** -> **Network Access** on the left menu.
2. Click **+ Add IP Address**.
3. To allow connections from anywhere during development, click **Allow Access From Anywhere** (IP: `0.0.0.0/0`).
4. Set an optional entry name and click **Confirm**.

## Step 5: Retrieve Connection String
1. Navigate to **Deployment** -> **Database** (or clusters dashboard).
2. Click **Connect** on your cluster box.
3. Select **Drivers** (under "Connect your application").
4. Choose **Node.js** as your driver.
5. Copy the provided connection string. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

## Step 6: Configure Environment Variables
1. Open or create the local environment file: [backend/.env](file:///e:/krishiseva/backend/.env).
2. Set the `MONGODB_URI` key, replacing `<username>`, `<password>`, and appending the dedicated database name `krishiseva` before the query parameters:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://krishiseva_user:YOUR_SECRET_PASSWORD@cluster0.xxxx.mongodb.net/krishiseva?retryWrites=true&w=majority&appName=Cluster0
   JWT_ACCESS_SECRET=krishiseva_access_token_secret_string_123!
   JWT_REFRESH_SECRET=krishiseva_refresh_token_secret_string_456!
   FRONTEND_URL=http://localhost:5173
   WEATHER_API_URL=https://api.open-meteo.com
   ```
   > [!IMPORTANT]
   > Do NOT leave `<password>` placeholders in the string; replace it with the password you configured in Step 3. Do not commit `.env` files to git.

## Step 7: Verify Database Health Check
1. Start the backend development server:
   ```bash
   cd backend
   npm run dev
   ```
2. Open a browser or run a GET request to verify the database state:
   `http://localhost:5000/api/health`
3. You should receive a healthy response confirming connectivity:
   ```json
   {
     "success": true,
     "data": {
       "application": "healthy",
       "database": "connected"
     }
   }
   ```

## Step 8: Run the Seeding Script
Populate your database with Gujarat geography, APMC prices, crop profiles, and demo accounts:
```bash
cd backend
npm run seed
```
To drop existing database collections and rebuild the seeds clean, run:
```bash
npm run db:reset
```
