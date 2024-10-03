import 'dart:developer';

import 'package:Tieup/core/app_export.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/data/apiClient/api_service.dart';
import 'package:Tieup/data/models/offer/offer.dart';
import 'package:Tieup/data/models/service/service.dart';
import 'package:Tieup/presentation/home_container_screen/controller/home_container_controller.dart';
import 'package:Tieup/presentation/home_page/controller/home_controller.dart';

/// A controller class for the ChatScreen.
///
/// This class manages the state of the ChatScreen, including the
/// current chatModelObj
class CategoriesController extends GetxController {
  TextEditingController searchController = TextEditingController();
  final homeController = Get.find<HomeController>();
  final homeContainerController = Get.find<HomeContainerController>();

  Rx<Service?> selectedService = Rx<Service?>(null);
  Rx<Service?> selectedSubService = Rx<Service?>(null);
  RxList<Service> services = <Service>[].obs;
  RxList<Service> subServices = <Service>[].obs;
  RxList<Offer> offers = <Offer>[].obs;
  RxBool isLoading = false.obs;

  fetchOffers(String serviceId) async {
    isLoading.value = true;
    var res = await ApiClient().getOffersByServiceId(serviceId);
    offers.assignAll(res);
    isLoading.value = false;
  }

  onCategoryClicked(Service service) {
    selectedService.value = service;
    subServices.assignAll(homeController.services.where(
        (s) => s.isRoot == false && s.parentServiceId == service.documentRef));
    homeContainerController.isOpenSidebarCat.value = true;
  }

  initServices() async {
    await homeController.fetchServices();
    services.assignAll(
        homeController.services.where((service) => service.isRoot!).toList());
  }

  @override
  void onInit() {
    super.onInit();

    if (homeController.services.isNotEmpty) {
      services.assignAll(
          homeController.services.where((service) => service.isRoot!).toList());
    } else {
      initServices();
    }
  }

  @override
  void onClose() {
    super.onClose();
    searchController.dispose();
  }
}
