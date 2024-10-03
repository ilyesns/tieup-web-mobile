import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/data/models/offer/offer.dart';
import 'package:flutter/material.dart';

/// A controller class for the SearchScreen.
///
/// This class manages the state of the SearchScreen, including the
/// current searchModelObj
class SearchController extends GetxController {
  TextEditingController searchController = TextEditingController();
  RxList<Offer> offers = RxList<Offer>([]);
  RxBool isLoading = false.obs;
  RxBool isSearching = false.obs;
  FocusNode searchFocusNode = FocusNode();

  fetchSearchingOffers() async {
    try {
      if (searchController.text != '') {
        isSearching.value = true;
        isLoading.value = true;
        List<Offer> res = await ApiClient().searchOffers(searchController.text);
        offers.assignAll(res);
        isLoading.value = false;
      }
    } catch (e) {
      isLoading.value = false;

      print(e);
    }
  }

  @override
  void onClose() {
    super.onClose();
    searchController.dispose();
    searchFocusNode.dispose();
  }
}
