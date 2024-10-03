import 'dart:async';
import 'dart:developer';

import 'package:Tieup/data/models/service/service.dart';
import 'package:Tieup/widgets/custom_bottom_bar.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/data/apiClient/api_service.dart';
import 'package:Tieup/data/models/chat/chat_model.dart';
import 'package:Tieup/data/models/user/user.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/firebase/firebase_user_provider.dart';
import 'package:Tieup/presentation/home_container_screen/models/home_container_model.dart';

/// A controller class for the HomeContainerScreen.
///
/// This class manages the state of the HomeContainerScreen, including the
/// current homeContainerModelObj
class HomeContainerController extends GetxController {
  Rx<HomeContainerModel> homeContainerModelObj = HomeContainerModel().obs;
  AppStateNotifier appState = AppStateNotifier.instance;
  Rx<bool> isFetchingUser = false.obs;
  Rx<bool> isFetchingChat = false.obs;
  Rx<bool> isError = false.obs;

  Rx<bool> isErrorChat = false.obs;
  RxList<Chat> chats = RxList<Chat>([]);
  RxInt unreadMessages = 0.obs;
  Rx<bool> isOpenSidebarCat = false.obs;
  Rx<bool> isOpenSidebarOffers = false.obs;
  Rx<bool> canPop = false.obs;
  FirebaseFirestore _firestore = FirebaseFirestore.instance;
  late StreamController<List<Chat>> _chatsController;
  Rx<Service?> selectedService = Rx<Service?>(null);
  Stream<List<Chat>> get chatsStream => _chatsController.stream;

  void initChatsStream() {
    if (appState.loggedIn) {
      final Query q = _firestore.collection('chats');
      final Stream<QuerySnapshot> snapshots = q.snapshots();

      _chatsController = StreamController<List<Chat>>.broadcast();

      snapshots.listen((querySnapshot) async {
        await fetchChats();
        _chatsController.add(chats.value);
      });
    }
  }

  Rx<BottomBarEnum?> selectedPageIndex = Rx<BottomBarEnum?>(null);

  navigateToCategories(Service service) {
    selectedService.value = service;
    Get.toNamed(AppRoutes.categoriesScreen, id: 1);
  }

  Future<void> fetchUser() async {
    isError.value = false;

    try {
      if (appState.loggedIn) {
        isFetchingUser.value = true;
        await ApiClient().isNetworkConnected();

        await fetchUserData(currentJwtToken.value!, currentUid.value!);
        isFetchingUser.value = false;
      }
    } catch (e) {
      isError.value = true;
      isFetchingUser.value = false;

      // Handle error
      print(e.toString());
    }
  }

  Future<void> fetchChats() async {
    isErrorChat.value = false;

    try {
      if (appState.loggedIn) {
        isFetchingChat.value = true;
        chats.assignAll((await ApiClient()
            .getChats(currentUid.value!, currentJwtToken.value!)));

        unreadMessages.value = chats
            .where((c) => !c.lastMessageSeenBy!.contains(currentUid.value))
            .length;

        isFetchingChat.value = false;
      }
    } catch (e) {
      isErrorChat.value = true;
      isFetchingChat.value = false;

      // Handle error
      print(e.toString());
    }
  }

  @override
  void onInit() {
    super.onInit();
    fetchUser();
    initChatsStream();
  }
}
