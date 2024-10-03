import 'package:flutter/scheduler.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/progress_dialog_utils.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/data/apiClient/api_service.dart';
import 'package:Tieup/data/models/offer/offer.dart';
import 'package:Tieup/data/models/service/service.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/presentation/home_page/models/home_model.dart';
import 'package:flutter/material.dart';

/// A controller class for the HomePage.
///
/// This class manages the state of the HomePage, including the
/// current homeModelObj
class HomeController extends GetxController {
  final ApiService apiService = Get.find();
  final RxList<Service> services = <Service>[].obs;
  final RxList<Offer> offers = <Offer>[].obs;
  Rx<bool> loading = false.obs;
  Rx<bool> loading2 = false.obs;
  TextEditingController searchController = TextEditingController();
  AppStateNotifier appState = AppStateNotifier.instance;

  Future<void> fetchServices() async {
    try {
      loading.value = true;
      final List<Service> fetchedServices = await apiService.getAllServices();
      services.assignAll(fetchedServices);
      loading.value = false;
    } catch (e) {
      loading.value = false;

      // Handle error
      print(e.toString());
    }
  }

  Future<void> fetchOffers() async {
    try {
      loading2.value = true;
      final List<Offer> fetchedServices = await apiService.getAllOffers();
      offers.assignAll(fetchedServices);
      loading2.value = false;
    } catch (e) {
      loading2.value = false;

      // Handle error
      print(e.toString());
    }
  }

  @override
  void onInit() {
    // TODO: implement onInit
    super.onInit();
  }

  @override
  void onReady() {
    super.onReady();

    fetchServices();
    fetchOffers();
  }

  @override
  void onClose() {
    super.onClose();
    searchController.dispose();
  }
}
