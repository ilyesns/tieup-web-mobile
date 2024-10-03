import 'dart:async';
import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/file_picker.dart';
import 'package:Tieup/core/utils/progress_dialog_utils.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/data/models/chat/chat_model.dart';
import 'package:Tieup/data/models/message/message.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/presentation/logout_popup_dialog/models/logout_popup_model.dart';

/// A controller class for the LogoutPopupDialog.
///
/// This class manages the state of the LogoutPopupDialog, including the
/// current logoutPopupModelObj
class ChatPopupController extends GetxController {
  TextEditingController messageController = TextEditingController();
  FocusNode messageFocus = FocusNode();
  Rx<File?> file = Rx<File?>(null);
  RxBool isSending = false.obs;
  RxBool isLoading = false.obs;
  RxBool isError = false.obs;
  Rx<String?> chatId = Rx<String?>(null);
  RxList<Message> messages = RxList<Message>([]);

  late ScrollController scrollController;

  FirebaseFirestore _firestore = FirebaseFirestore.instance;
  late StreamController<List<Message>> _messagesController;

  Stream<List<Message>> get messagesStream => _messagesController.stream;

  void initMessagesStream() {
    final Query q = _firestore.collection('messages');
    final Stream<QuerySnapshot> snapshots = q.snapshots();

    _messagesController = StreamController<List<Message>>.broadcast();

    snapshots.listen((querySnapshot) async {
      await fetchMessages();
      SchedulerBinding.instance.addPostFrameCallback((_) {
        if (scrollController.hasClients) {
          scrollController.animateTo(scrollController.position.maxScrollExtent,
              duration: const Duration(milliseconds: 150),
              curve: Curves.easeOut);
        }
      });
      _messagesController.add(messages.value);
    });
  }

  pickFile() async {
    try {
      file.value = await FilePickerService.pickFile();
    } catch (e) {
      print('Failed to picke a file :$e');
    }
  }

  sendMessage(String chatId) async {
    try {
      final data = {
        'text': messageController.text,
        'userSent': currentUser.value!.userId,
      };
      final res = await ApiClient()
          .sendMessage(chatId, data, currentJwtToken.value!, file.value);
      messageController.text = '';
      file.value = null;
    } catch (e) {
      print('failed to send message $e');
    }
  }

  createChatAndSendMessage(String recipientId) async {
    try {
      final chatData = {
        'recipientId': recipientId,
        'senderId': currentUid.value,
      };
      final chatRef =
          await ApiClient().getOrCreatChat(chatData, currentJwtToken.value!);
      chatId.value = chatRef;
      await sendMessage(chatRef!);
    } catch (e) {
      print('failed on create Chat And Send Message $e');
    }
  }

  fetchMessages() async {
    try {
      isLoading.value = true;
      List<Message> newMessages = await ApiClient()
          .getMessagesByChat(chatId.value!, currentJwtToken.value!);
      messages.assignAll(newMessages);
      isLoading.value = false;
    } catch (e) {
      isLoading.value = false;

      isError.value = true;
      print(e);
    }
  }
}
