# Setting Up Admin Access for Your Anti-Ragging Application

This guide will walk you through setting up admin access for your application when deploying to Vercel using Firebase Authentication and Firestore.

## Step 1: Create Admin User in Firebase Authentication

1. Go to the [Firebase Console](https://console.firebase.google.com/) and select your project.
2. In the left sidebar, click on **Authentication** → **Users**.
3. Click the **Add User** button.
4. Enter the email and password for your admin account (e.g., admin@example.com).
5. Click **Add User** to create the account.

## Step 2: Set up Admin Claims in Firestore

There are two ways to designate an admin user:

### Option 1: Create an "admins" collection in Firestore (Recommended for this project)

1. In the Firebase Console, go to **Firestore Database** → **Data**.
2. Create a new collection called `admins`.
3. Add a new document with the ID matching the admin user's UID (found in Authentication → Users).
4. Add a field: `role` with the value `admin`.

```
Collection: admins
  Document ID: [Admin User's UID]
    Fields:
      - role: "admin"
```

### Option 2: Use Firebase Admin SDK to set custom claims (More advanced)

For production applications with more complex authorization needs, you can use the Firebase Admin SDK to add custom claims to user profiles. This requires server-side code (such as a Firebase Cloud Function):

```javascript
const admin = require('firebase-admin');
admin.initializeApp();

async function setAdminRole(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log('Successfully set admin role');
  } catch (error) {
    console.error('Error setting admin role:', error);
  }
}

// Call with the user's UID
setAdminRole('paste-user-uid-here');
```

## Step 3: Configure Vercel Environment Variables

When deploying to Vercel, you'll need to set up the following environment variables:

1. Go to your project on Vercel.
2. Navigate to **Settings** → **Environment Variables**.
3. Add the following variables (same as the ones you have in your Replit):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`

Get these values from your Firebase project settings.

## Step 4: Update Firebase Security Rules

For proper security, update your Firestore security rules to limit admin access:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Anyone can create a report, but only admins can read/update
    match /reports/{reportId} {
      allow create: if request.auth != null || request.auth == null; // Allow anonymous reports
      allow read, update, delete: if isAdmin();
    }
    
    // Only admins can access admin data
    match /admins/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // No writing to admin documents via client
    }
    
    // Other collections as needed
  }
}
```

## Step 5: Implement Admin Check in Your Application

Your application already has code to check admin status. When a user logs in through the Admin page, validate their admin status by querying the admins collection:

```javascript
const checkAdminStatus = async (uid) => {
  try {
    const db = getFirebaseFirestore();
    const adminDoc = await getDoc(doc(db, "admins", uid));
    return adminDoc.exists() && adminDoc.data().role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
```

## Step 6: Deploying to Vercel

1. Connect your GitHub repository to Vercel.
2. Configure the build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add the environment variables mentioned above.
4. Deploy your application.

After deployment, your admin can log in through the `/homelander` route using the credentials you created in Firebase Authentication.

## Troubleshooting

- If admin login doesn't work, check the browser console for errors.
- Verify that the admin user exists in Firebase Authentication.
- Confirm the admin document exists in Firestore with the correct UID.
- Make sure environment variables are properly set in Vercel.
- Check Firebase security rules to ensure they're correctly configured.