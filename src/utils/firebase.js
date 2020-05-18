const admin = require('firebase-admin');
const dotenv = require("dotenv");
dotenv.config();

// admin.initializeApp({
//     credential: admin.credential.cert({
//         "type": process.env.FIREBASE_TYPE,
//         "project_id": process.env.FIREBASE_PROJECT_ID,
//         "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
//         "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//         "client_email": process.env.FIREBASE_CLIENT_EMAIL,
//         "client_id": process.env.FIREBASE_CLIENT_ID,
//         "auth_uri": process.env.FIREBASE_AUTH_URI,
//         "token_uri": process.env.FIREBASE_TOKEN_URI,
//         "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//         "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
//     }),
//     databaseURL: process.env.DATABASE_URL,
// });
const serviceAccount = require('../../ieee-palette-firebase-adminsdk-8fgvs-2b7c1188e7.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
  });

const database = admin.firestore()
module.exports = {admin,database}