import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/progress_dialog_utils.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/data/models/offer/offer.dart';
import 'package:Tieup/firebase/auth_util.dart';

class OfferController extends GetxController
    with GetSingleTickerProviderStateMixin {
  RxList<GalleryItem?> galleryItems = <GalleryItem?>[].obs;
  var offer = Get.arguments as Offer;
  RxList<Offer> recommendedOffers = <Offer>[].obs;
  RxBool isLoading = false.obs;
  RxBool loadingContinueButton = false.obs;
  late TabController tabController;
  Rx<String?> chatId = Rx<String?>(null);
  Rx<String> recipientId = Rx<String>('');

  @override
  void onInit() {
    super.onInit();
    tabController = new TabController(length: 2, vsync: this);
  }

  fetchOffers(String serviceId) async {
    isLoading.value = true;
    var res = await ApiClient().getOffersByServiceId(serviceId);
    recommendedOffers.assignAll(res);
    isLoading.value = false;
  }

  @override
  void onReady() {
    super.onReady();
    fetchOffers(offer.subServiceId!);
    final items = offer.gallery!.images;
    if (offer.gallery!.video != null) {
      items.add(offer.gallery!.video!);
    }
    galleryItems.assignAll(items);
  }

  checkExistChat(String recipientId) async {
    try {
      ProgressDialogUtils.showProgressDialog();
      final chatData = {
        'recipientId': recipientId,
        'senderId': currentUid.value,
      };
      var result =
          await ApiClient().checkChat(chatData, currentJwtToken.value!);
      ProgressDialogUtils.hideProgressDialog();
      if (result != null) {
        chatId.value = result;
      }
      ProgressDialogUtils.hideProgressDialog();
    } catch (e) {
      ProgressDialogUtils.hideProgressDialog();

      print("Error in checking exist chat : $e");
    }
  }
}
