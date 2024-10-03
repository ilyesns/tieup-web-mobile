var admin = require("firebase-admin");

var serviceAccount = require("../../tieup-6eea9-firebase-adminsdk-imm2y-57c9393a6c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://tieup-6eea9-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "gs://tieup-6eea9.appspot.com",
});

module.exports = admin;
