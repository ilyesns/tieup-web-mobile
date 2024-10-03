import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';

Future initFirebase() async {
  if (kIsWeb) {
    await Firebase.initializeApp(
        options: FirebaseOptions(
            apiKey: "AIzaSyAYzhBgwn6oG628mOWtI3Bz1JazumOPNBk",
            authDomain: "tieup-6eea9.firebaseapp.com",
            projectId: "tieup-6eea9",
            storageBucket: "tieup-6eea9.appspot.com",
            messagingSenderId: "405169450149",
            appId: "1:405169450149:web:a6452eb862b225e90cb14c",
            measurementId: "G-MXRPVZ4KW5"));
  } else {
    await Firebase.initializeApp();
  }
}
