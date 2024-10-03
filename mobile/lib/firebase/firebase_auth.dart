import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get_core/src/get_main.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter/foundation.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:Tieup/core/app_export.dart';

final _googleSignIn = GoogleSignIn();

class AuthManager {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  Future<UserCredential?> signInWithCredentials(
          String email, String password) =>
      _auth.signInWithEmailAndPassword(email: email.trim(), password: password);

  static Future<UserCredential?> emailCreateAccountFunc(
    String email,
    String password,
  ) =>
      FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );
  Future signOut() async {
    await _auth.signOut();
  }

  Future<UserCredential?> googleSignInFunc() async {
    if (kIsWeb) {
      // Once signed in, return the UserCredential
      return await _auth.signInWithPopup(GoogleAuthProvider());
    }

    await signOutWithGoogle().catchError((_) => null);
    final auth = await (await _googleSignIn.signIn())?.authentication;
    if (auth == null) {
      return null;
    }
    final credential = GoogleAuthProvider.credential(
        idToken: auth.idToken, accessToken: auth.accessToken);
    return _auth.signInWithCredential(credential);
  }

  Future signOutWithGoogle() => _googleSignIn.signOut();

  Future<void> forgetPassword(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
    } on FirebaseAuthException catch (e) {
      if (e.code == 'user-not-found') {
        throw 'No user found for the provided email.';
      } else {
        print(e.message);
      }
      rethrow;
    } catch (e) {
      print(e.toString());
      rethrow;
    }
  }

  Future<void> changePassword(String newPassword) async {
    try {
      // Get the current user
      User? user = _auth.currentUser;

      if (user != null) {
        // Update the user's password
        await user.updatePassword(newPassword);
      } else {
        throw 'User not found. Please sign in again.';
      }
    } on FirebaseAuthException catch (e) {
      throw e.message ?? 'An error occurred while processing your request.';
    } catch (e) {
      print('Error: $e');
      throw 'Error: $e';
    }
  }
}
