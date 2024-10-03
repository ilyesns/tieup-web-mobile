import 'dart:convert';
import 'dart:io';

import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/enum.dart';
import 'package:Tieup/core/utils/progress_dialog_utils.dart';
import 'package:Tieup/data/models/chat/chat_model.dart';
import 'package:Tieup/data/models/message/message.dart';
import 'package:Tieup/data/models/offer/offer.dart';
import 'package:Tieup/data/models/registerDeviceAuth/post_register_device_auth_resp.dart';
import 'package:Tieup/data/models/service/service.dart';
import 'package:Tieup/data/models/user/user.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/presentation/dashboard_page/model/freelancer_profile.dart';
import 'package:Tieup/presentation/dashboard_page/model/wallet.dart';
import 'package:Tieup/presentation/order_page/models/order_model.dart';

class ApiClient extends GetConnect {
  var url = "";
  @override
  void onInit() {
    super.onInit();
    httpClient.timeout = const Duration(seconds: 60);
  }

  ///method can be used for checking internet connection
  ///returns [bool] based on availability of internet
  Future isNetworkConnected() async {
    if (!await Get.find<NetworkInfo>().isConnected()) {
      throw NoInternetException('No Internet Found!');
    }
  }

  /// is `true` when the response status code is between 200 and 299
  ///
  /// user can modify this method with custom logics based on their API response
  bool _isSuccessCall(Response response) {
    return response.isOk;
  }

  Future<Map<String, dynamic>> createUser(data) async {
    ProgressDialogUtils.showProgressDialog();

    try {
      // Make a POST request to the server with the user data
      await isNetworkConnected();
      final response = await httpClient.post(
        '${url}user/create',
        body: jsonEncode(
            data), // Assuming toJson() method is defined in UserData class
      );
      ProgressDialogUtils.hideProgressDialog();

      if (response.statusCode == 200) {
        return response.body; // Return the response data
      } else {
        throw Exception('Failed to create user: ${response.statusCode}');
      }
    } catch (error) {
      ProgressDialogUtils.hideProgressDialog();

      // Handle errors
      print("Error creating user: $error");
      throw error; // Rethrow the error to handle it in the calling code
    }
  }

  Future<Map<String, dynamic>> mayBeCreateUser(data) async {
    ProgressDialogUtils.showProgressDialog();

    try {
      // Make a POST request to the server with the user data
      await isNetworkConnected();
      final response = await httpClient.post(
        '${url}user/may-be-create',
        body: jsonEncode(
            data), // Assuming toJson() method is defined in UserData class
      );
      ProgressDialogUtils.hideProgressDialog();

      if (response.statusCode == 200) {
        return response.body; // Return the response data
      } else {
        throw Exception('Failed to create user: ${response.statusCode}');
      }
    } catch (error) {
      ProgressDialogUtils.hideProgressDialog();

      // Handle errors
      print("Error creating user: $error");
      throw error; // Rethrow the error to handle it in the calling code
    }
  }

  Future<User?> getUser({
    required String token,
    required String userId,
  }) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.get(
        '${url}user/read/$userId',
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (_isSuccessCall(response)) {
        return User.fromJson(response.body);
      } else {
        throw response.body != null
            ? User.fromJson(response.body)
            : 'Something Went Wrong!';
      }
    } on NetworkException catch (e) {
      Get.rawSnackbar(message: e.toString());
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future<List<Service>> getAllServices() async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.get(
        '${url}service/read-services',
      );

      if (_isSuccessCall(response)) {
        final List<dynamic> data = response.body;
        List<Service> services = data.map((e) => Service.fromJson(e)).toList();
        return services;
      } else {
        throw 'Something Went Wrong!';
      }
    } on NetworkException {
      Get.rawSnackbar(message: 'No Internet Connection');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future<List<Offer>> getAllOffers() async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.get(
        '${url}offer/read-all',
      );

      if (_isSuccessCall(response)) {
        final List<dynamic> data = response.body;

        List<Offer> offers = data.map((e) => Offer.fromJson(e)).toList();

        return offers;
      } else {
        throw 'Something Went Wrong!';
      }
    } on NetworkException {
      Get.rawSnackbar(message: 'No Internet Connection');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future<List<Offer>> getOffersByServiceId(String id) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.get(
        '${url}service/offer/read-offers/$id',
      );

      if (_isSuccessCall(response)) {
        final List<dynamic> data = response.body;

        List<Offer> offers = data.map((e) => Offer.fromJson(e)).toList();

        return offers;
      } else {
        throw 'Something Went Wrong!';
      }
    } on NetworkException {
      Get.rawSnackbar(message: 'No Internet Connection');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future calculOrderTotal(double basePrice, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient
          .post('${url}order/client/calcul-total-return-details', body: {
        "basePrice": basePrice,
      }, headers: {
        'Authorization': 'Bearer $token'
      });

      if (_isSuccessCall(response)) {
        final data = response.body;

        return data;
      } else {
        throw 'Something Went Wrong!';
      }
    } on NetworkException {
      Get.rawSnackbar(message: 'No Internet Connection');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future placeOrder(orderData, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.post('${url}order/client/place',
          body: orderData, headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final data = response.body;

        return data;
      } else {
        Get.rawSnackbar(message: response.statusCode.toString());
        throw 'failed to place order';
      }
    } on NetworkException {
      Get.rawSnackbar(message: 'No Internet Connection');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future<List<Chat>> getChats(String userId, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.get(
          '${url}chat/read-chats/${userId}',
          headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final List<dynamic> data = response.body;

        List<Chat> chats = data.map((e) => Chat.fromMap(e)).toList();
        return chats;
      } else {
        Get.rawSnackbar(message: response.statusCode.toString());
        throw 'failed to get chats';
      }
    } on NetworkException catch (e) {
      Get.rawSnackbar(message: 'No Internet Connection $e');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future<List<Message>> getMessagesByChat(String chatId, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.get(
          '${url}chat/read-messages-chat/$chatId',
          headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final List<dynamic> data = response.body;
        final List<Message> messages =
            data.map((m) => Message.fromJson(m)).toList();

        return messages;
      } else {
        Get.rawSnackbar(message: response.statusCode.toString());
        throw 'failed to get messages by chatId $chatId';
      }
    } on NetworkException catch (e) {
      Get.rawSnackbar(message: 'No Internet Connection $e');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future sendMessage(
    String chatId,
    data,
    token,
    File? file,
  ) async {
    try {
      await isNetworkConnected();
      Response response;
      // Prepare headers
      Map<String, String> headers = {
        'Authorization': 'Bearer $token',
      };
      if (file == null) {
        response = await httpClient
            .post('${url}chat/send-message/$chatId', body: data, headers: {
          'Authorization': 'Bearer $token',
        });

        if (_isSuccessCall(response!)) {
          print('Message sent successfully!');
        } else {
          Get.rawSnackbar(message: response.statusCode.toString());
          throw 'failed to send a message';
        }
      } else {
        String mimetype;
        if (file.path.toLowerCase().endsWith('.jpg') ||
            file.path.toLowerCase().endsWith('.jpeg') ||
            file.path.toLowerCase().endsWith('.png') ||
            file.path.toLowerCase().endsWith('.gif')) {
          mimetype =
              'image/jpeg'; // You can set appropriate mimetype for each image type
        } else {
          mimetype =
              'application/octet-stream'; // Default mimetype for other file types
        }

        Map<String, String> requestData = data.cast<String, String>();

        var request = http.MultipartRequest(
            'POST', Uri.parse('${url}chat/send-message/$chatId'));
        request.fields.addAll(requestData);
        // Add file

        var stream = http.ByteStream(file.openRead());
        var length = await file.length();
        var multipartFile = http.MultipartFile(
          'file',
          stream,
          length,
          filename: file.path.split('/').last,
          contentType: MediaType.parse(mimetype),
        );
        request.files.add(multipartFile);

        // Add headers to the request
        request.headers.addAll(headers);

        // Send request
        var response = (await http.Response.fromStream(await request.send()));

        if (response.statusCode == 200) {
          print('Me!');
          print('Message sent successfully!');
        } else {
          Get.rawSnackbar(message: response.statusCode.toString());
          throw 'failed to send a message';
        }
      }
    } on NetworkException catch (e) {
      Get.rawSnackbar(message: 'No Internet Connection $e');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future markMessageRead(chatData, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.post(
          '${url}chat/mark-message-read/${chatData['chatId']}',
          body: chatData,
          headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final data = response.body;

        return data;
      } else {
        throw 'failed to mark user as reader';
      }
    } on NetworkException {
      Get.rawSnackbar(message: 'No Internet Connection');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future deleteMessage(messageId, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.delete(
          '${url}chat/delete-message/$messageId',
          headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final data = response.body;

        return data;
      } else {
        throw 'failed to delete a message';
      }
    } on NetworkException {
      Get.rawSnackbar(message: 'No Internet Connection');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future<List<Chat>> searchChat(
      String term, String userId, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.post('${url}chat/search/$userId',
          body: {"term": term}, headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final List<dynamic> data = response.body;
        final chats = data.map((chat) => Chat.fromMap(chat)).toList();
        return chats;
      } else {
        throw 'failed to delete a message';
      }
    } on NetworkException {
      Get.rawSnackbar(message: 'No Internet Connection');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future<List<Order>> getOrders(String userId, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.get(
          '${url}order/client/read-all/${userId}',
          headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final List<dynamic> data = response.body;

        List<Order> orders = data.map((e) => Order.fromJson(e)).toList();
        return orders;
      } else {
        Get.rawSnackbar(message: response.statusCode.toString());
        throw 'failed to get orders';
      }
    } on NetworkException catch (e) {
      Get.rawSnackbar(message: 'No Internet Connection $e');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future<List<Order>> getOrdersFreelancer(String userId, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.get(
          '${url}order/freelancer/read-all/${userId}',
          headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final List<dynamic> data = response.body;

        List<Order> orders = data.map((e) => Order.fromJson(e)).toList();
        return orders;
      } else {
        Get.rawSnackbar(message: response.statusCode.toString());
        throw 'failed to get orders';
      }
    } on NetworkException catch (e) {
      Get.rawSnackbar(message: 'No Internet Connection $e');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future<String?> getOrCreatChat(chat, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.post('${url}chat/read-create/',
          body: chat, headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final data = response.body;
        return data;
      } else {
        Get.rawSnackbar(message: response.statusCode.toString());
        throw 'failed to get Or Create Chat  ';
      }
    } on NetworkException catch (e) {
      Get.rawSnackbar(message: 'No Internet Connection $e');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future<String?> checkChat(chat, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.post('${url}chat/check-chat/',
          body: chat, headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final data = response.body;
        if (data != null) {
          return data;
        } else {
          return null;
        }
      } else {
        Get.rawSnackbar(message: response.statusCode.toString());
        throw 'failed to get Or Create Chat  ';
      }
    } on NetworkException catch (e) {
      Get.rawSnackbar(message: 'No Internet Connection $e');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future<Map<String, dynamic>> deleteChat(String chatId, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.delete(
          '${url}chat/delete-chat/$chatId',
          headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final data = response.body;
        return data;
      } else {
        Get.rawSnackbar(message: response.statusCode.toString());
        throw 'failed to delete Chat  ';
      }
    } on NetworkException catch (e) {
      Get.rawSnackbar(message: 'No Internet Connection $e');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future uploadPhoto(
    String userId,
    token,
    File? file,
  ) async {
    try {
      await isNetworkConnected();
      // Prepare headers
      Map<String, String> headers = {
        'Authorization': 'Bearer $token',
      };
      String mimetype;
      if (file!.path.toLowerCase().endsWith('.jpg') ||
          file.path.toLowerCase().endsWith('.jpeg') ||
          file.path.toLowerCase().endsWith('.png') ||
          file.path.toLowerCase().endsWith('.gif')) {
        mimetype =
            'image/jpeg'; // You can set appropriate mimetype for each image type
      } else {
        mimetype =
            'application/octet-stream'; // Default mimetype for other file types
      }

      var request = http.MultipartRequest(
          'POST', Uri.parse('${url}user/upload-photo/$userId'));
      // Add file

      var stream = http.ByteStream(file.openRead());
      var length = await file.length();
      var multipartFile = http.MultipartFile(
        'file',
        stream,
        length,
        filename: file.path.split('/').last,
        contentType: MediaType.parse(mimetype),
      );
      request.files.add(multipartFile);

      request.headers.addAll(headers);

      // Send request
      var response = (await http.Response.fromStream(await request.send()));

      if (response.statusCode == 200) {
        print('uploading photo successfully!');
        Get.rawSnackbar(message: 'Uploading photo successfully');
      } else {
        Get.rawSnackbar(message: 'Error uploading photo');
      }
    } on NetworkException catch (e) {
      Get.rawSnackbar(message: 'No Internet Connection $e');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future switchRole(String userId, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.post(
          '${url}user/switch-role/$userId',
          headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final data = response.body;

        Get.rawSnackbar(
            message:
                'Switched to ${currentUser.value!.role == Role.client ? 'freelancer' : 'client'} mode');
      } else {
        throw 'failed to mark user as reader';
      }
    } on NetworkException {
      Get.rawSnackbar(message: 'No Internet Connection');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future getFreelancerProfileStatistic(String userId, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.get(
          '${url}freelancer/read-statistic/$userId',
          headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final data = response.body;
        return FreelancerProfileStatistics.fromJson(data);
      } else {
        throw 'failed to get freelancer profile statistic user ';
      }
    } on NetworkException {
      Get.rawSnackbar(message: 'No Internet Connection');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future getWallet(String userId, String token) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.get(
          '${url}wallet/freelancer/read/$userId',
          headers: {'Authorization': 'Bearer $token'});

      if (_isSuccessCall(response)) {
        final data = response.body;
        return Wallet.fromJson(data);
      } else {
        throw 'failed to get freelancer profile statistic user ';
      }
    } on NetworkException {
      Get.rawSnackbar(message: 'No Internet Connection');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }

  Future<List<Offer>> searchOffers(
    String term,
  ) async {
    try {
      await isNetworkConnected();
      Response response = await httpClient.get(
        '${url}service/offer/read-searched-offers?term=${term}',
      );

      if (_isSuccessCall(response)) {
        final List<dynamic> data = response.body;
        final offers = data.map((offer) => Offer.fromJson(offer)).toList();
        return offers;
      } else {
        throw 'failed on searching offers';
      }
    } on NetworkException {
      Get.rawSnackbar(message: 'No Internet Connection');
      rethrow;
    } catch (error, stackTrace) {
      Logger.log(
        error,
        stackTrace: stackTrace,
      );
      rethrow;
    }
  }
}
