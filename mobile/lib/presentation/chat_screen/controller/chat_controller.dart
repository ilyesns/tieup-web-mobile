import 'dart:async';
import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:get/get.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/file_picker.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/data/models/chat/chat_model.dart';
import 'package:Tieup/data/models/message/message.dart';
import 'package:Tieup/firebase/auth_util.dart';

class ChatController extends GetxController {
  TextEditingController messageController = TextEditingController();
  Rx<File?> file = Rx<File?>(null);
  FocusNode messageFocus = FocusNode();

  late ScrollController scrollController;

  RxList<Message> messages = RxList<Message>([]);
  RxBool isLoading = false.obs;
  RxBool isSending = false.obs;
  RxBool isError = false.obs;
  Chat? chat = Get.arguments;

  FirebaseFirestore _firestore = FirebaseFirestore.instance;
  late StreamController<List<Message>> _messagesController;

  Stream<List<Message>> get messagesStream => _messagesController.stream;

  @override
  void onInit() {
    super.onInit();
    scrollController = ScrollController();
    SchedulerBinding.instance.addPostFrameCallback((_) {
      if (scrollController.hasClients) {
        scrollController.animateTo(scrollController.position.maxScrollExtent,
            duration: const Duration(milliseconds: 150), curve: Curves.easeOut);
      }
    });
    initMessagesStream();
  }

  @override
  void onClose() {
    super.onClose();
    messageController.dispose();
    scrollController.dispose(); // Dispose ScrollController
  }

  void initMessagesStream() {
    final doc = _firestore.collection('chats').doc(chat!.chatId!);
    final Query q =
        _firestore.collection('messages').where('chatId', isEqualTo: doc);
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

  sendMessage() async {
    try {
      isSending.value = true;
      final data = {
        'text': messageController.text,
        'userSent': currentUser.value!.userId,
      };
      final res = await ApiClient()
          .sendMessage(chat!.chatId!, data, currentJwtToken.value!, file.value);
      messageController.text = '';
      file.value = null;
      isSending.value = false;
    } catch (e) {
      isSending.value = false;

      print('failed to send message $e');
    }
  }

  pickFile() async {
    try {
      file.value = await FilePickerService.pickFile();
    } catch (e) {
      print('Failed to picke a file :$e');
    }
  }

  fetchMessages() async {
    try {
      isLoading.value = true;
      List<Message> newMessages = await ApiClient()
          .getMessagesByChat(chat!.chatId!, currentJwtToken.value!);
      messages.assignAll(newMessages);
      isLoading.value = false;
    } catch (e) {
      isLoading.value = false;

      isError.value = true;
      print(e);
    }
  }
}
