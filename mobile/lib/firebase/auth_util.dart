import 'package:firebase_auth/firebase_auth.dart';
import 'package:get/get_rx/src/rx_types/rx_types.dart';
import 'package:stream_transform/stream_transform.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'dart:async';
import 'package:Tieup/data/models/user/user.dart' as UserModel;
import 'package:http/http.dart' as http;
import 'dart:convert';

Rx<String?> currentJwtToken = ''.obs;
Rx<String?> currentUid = ''.obs;

final jwtTokenStream = FirebaseAuth.instance.idTokenChanges().map((user) async {
  final token = await user?.getIdToken(true);
  if (token != null) {
    currentJwtToken.value = token;
  }
}).asBroadcastStream();
Rx<UserModel.User?> currentUser = Rx<UserModel.User?>(null);

final authenticatedUserStream =
    FirebaseAuth.instance.authStateChanges().map<String>((user) {
  return user?.uid ?? '';
}).switchMap((uid) {
  final controller = StreamController<UserModel.User?>();
  if (uid.isEmpty) {
    controller.add(null);
    controller.close();
  } else {
    currentUid.value = uid;
  }
  return controller.stream;
}).asBroadcastStream();

Future<UserModel.User?> fetchUserData(String token, String userId) async {
  // Define the URL for fetching user data
  final String apiUrl = '${ApiClient().url}user/read/$userId';
  try {
    // Make a GET request to fetch user data
    final response = await http.get(
      Uri.parse(apiUrl),
      headers: {'Authorization': 'Bearer $token'},
    );

    // Check if the request was successful (status code 200)
    if (response.statusCode == 200) {
      // Parse the JSON response and create a UserModel.User instance
      final userData = json.decode(response.body);
      final user = UserModel.User.fromJson(userData);
      currentUser.value = user;
      return user;
    } else {
      // If the request failed, throw an exception with the error message
      throw 'Failed to fetch user data: ${response.statusCode}';
    }
  } catch (e) {
    // If an error occurs during the request, throw an exception
    throw 'Error fetching user data: $e';
  }
}
