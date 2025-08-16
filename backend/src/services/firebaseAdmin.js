const admin = require('firebase-admin');

let app;

try {
  // Initialize Firebase Admin SDK
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Option A: Using service account key file
    app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    console.log('✅ Firebase Admin initialized with service account key file');
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    // Option B: Using raw JSON from environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
    console.log('✅ Firebase Admin initialized with raw JSON credentials');
  } else {
    console.warn('⚠️ Firebase Admin credentials not found. Firebase features will be disabled.');
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
}

// Verify Firebase ID Token
const verifyFirebaseToken = async (idToken) => {
  try {
    if (!app) {
      throw new Error('Firebase Admin is not initialized');
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('❌ Firebase token verification failed:', error.message);
    throw new Error('Invalid Firebase token');
  }
};

// Get Firebase user by UID
const getFirebaseUser = async (uid) => {
  try {
    if (!app) {
      throw new Error('Firebase Admin is not initialized');
    }
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('❌ Failed to get Firebase user:', error.message);
    throw new Error('User not found');
  }
};

// Create custom token for a user
const createCustomToken = async (uid, additionalClaims = {}) => {
  try {
    if (!app) {
      throw new Error('Firebase Admin is not initialized');
    }
    const customToken = await admin.auth().createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('❌ Failed to create custom token:', error.message);
    throw new Error('Failed to create custom token');
  }
};

module.exports = {
  admin,
  app,
  verifyFirebaseToken,
  getFirebaseUser,
  createCustomToken
};