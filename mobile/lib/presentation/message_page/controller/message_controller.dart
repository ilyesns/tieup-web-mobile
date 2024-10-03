import 'dart:async';

import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/data/models/chat/chat_model.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

/// A controller class for the MessagePage.
///
/// This class manages the state of the MessagePage, including the
/// current messageModelObj
class MessageController extends GetxController {
  TextEditingController searchController = TextEditingController();
  RxList<Chat> chats = RxList<Chat>([]);
  RxBool isSearching = false.obs;
  RxBool isLoading = false.obs;

  final FocusNode textFieldFocus = FocusNode();

  markUserReader(String chatId) async {
    try {
      final chatData = {'userId': currentUid.value, 'chatId': chatId};
      await ApiClient().markMessageRead(chatData, currentJwtToken.value!);
    } catch (e) {
      print("mark user reader error: $e");
    }
  }

  searchChat() async {
    try {
      isLoading.value = true;
      isSearching.value = true;
      final result = await ApiClient().searchChat(
          searchController.text, currentUid.value!, currentJwtToken.value!);

      chats.assignAll(result);
      isLoading.value = false;
    } catch (e) {
      isLoading.value = false;

      print("failed to get searching chats: $e");
    }
  }

  @override
  void onClose() {
    super.onClose();
    searchController.dispose();
    isSearching.value = false;
  }
}
