import 'dart:ffi';

import 'package:Tieup/core/utils/enum.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/presentation/categories_screen/categories_screen.dart';
import 'package:Tieup/presentation/categories_screen/controller/categories_controller.dart';
import 'package:Tieup/presentation/dashboard_page/dashboard_page.dart';
import 'package:Tieup/presentation/profile_screen/profile_screen.dart';
import 'package:Tieup/widgets/custom_outlined_button.dart';
import 'package:Tieup/widgets/loading_widget.dart';

import 'controller/home_container_controller.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/presentation/home_page/home_page.dart';
import 'package:Tieup/presentation/message_page/message_page.dart';
import 'package:Tieup/presentation/profile_page/profile_page.dart';
import 'package:Tieup/presentation/order_page/order_page.dart';
import 'package:Tieup/widgets/custom_bottom_bar.dart';

class HomeContainerScreen extends GetWidget<HomeContainerController> {
  HomeContainerScreen({Key? key}) : super(key: key);
  final appStateNotifer = AppStateNotifier.instance;

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SafeArea(
        child: Obx(() => controller.isError.isTrue
            ? Scaffold(
                backgroundColor: Colors.grey[200],
                body: Center(
                  child: Material(
                    elevation: 5, // Adjust the elevation as needed
                    borderRadius: BorderRadius.circular(24.0),
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24.0),
                      ),
                      width: 300,
                      height: 200,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Something went wrong!',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 20),
                          CustomOutlinedButton(
                            width: 100,
                            text: "Refresh",
                            onTap: () => {
                              controller.fetchUser(),
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              )
            : controller.isFetchingUser.isTrue
                ? Scaffold(
                    body: Container(
                        width: mediaQueryData.size.width,
                        height: mediaQueryData.size.height,
                        color: appTheme.whiteA70001,
                        child: LoadingWidget()),
                  )
                : PopScope(
                    canPop: controller.canPop.value,
                    onPopInvoked: ((didPop) {
                      if (controller.isOpenSidebarOffers.isTrue) {
                        controller.isOpenSidebarOffers.value = false;
                      } else if (controller.isOpenSidebarCat.isTrue) {
                        controller.isOpenSidebarCat.value = false;
                      } else {
                        controller.canPop.value = true;
                      }

                      // Allow navigation if neither sidebar is open
                    }),
                    child: Scaffold(
                        backgroundColor: appTheme.whiteA70001,
                        body: Navigator(
                            key: Get.nestedKey(1),
                            initialRoute: appStateNotifer.loggedIn &&
                                    currentUser.value!.role == Role.freelancer
                                ? AppRoutes.dashboardPage
                                : AppRoutes.homePage,
                            onGenerateRoute: (routeSetting) => GetPageRoute(
                                page: () {
                                  if (controller.selectedPageIndex.value ==
                                      BottomBarEnum.Categories) {
                                    return CategoriesScreen();
                                  }

                                  return appStateNotifer.loggedIn &&
                                          currentUser.value!.role ==
                                              Role.freelancer
                                      ? getCurrentPageFreelancer(
                                          routeSetting.name!)
                                      : getCurrentPage(routeSetting.name!);
                                },
                                transition: Transition.noTransition)),
                        bottomNavigationBar:
                            CustomBottomBar(onChanged: (BottomBarEnum type) {
                          controller.selectedPageIndex.value = type;
                          Get.toNamed(
                              appStateNotifer.loggedIn &&
                                      currentUser.value!.role == Role.freelancer
                                  ? getCurrentRouteFreelancer(type)
                                  : getCurrentRoute(type),
                              id: 1);
                        })),
                  )));
  }

  ///Handling route based on bottom click actions
  String getCurrentRoute(BottomBarEnum type) {
    switch (type) {
      case BottomBarEnum.Home:
        return AppRoutes.homePage;
      case BottomBarEnum.Categories:
        return AppRoutes.categoriesScreen;
      case BottomBarEnum.Message:
        return AppRoutes.messagePage;
      case BottomBarEnum.Order:
        return AppRoutes.orderPage;
      case BottomBarEnum.Profile:
        return AppRoutes.profilePage;
      default:
        return "/";
    }
  }

  ///Handling page based on route
  Widget getCurrentPage(String currentRoute) {
    switch (currentRoute) {
      case AppRoutes.homePage:
        return HomePage();
      case AppRoutes.categoriesScreen:
        return CategoriesScreen();
      case AppRoutes.messagePage:
        return MessagePage();
      case AppRoutes.orderPage:
        return OrderPage();
      case AppRoutes.profilePage:
        return ProfileScreen();
      default:
        return DefaultWidget();
    }
  }

  String getCurrentRouteFreelancer(BottomBarEnum type) {
    switch (type) {
      case BottomBarEnum.Dahboard:
        return AppRoutes.dashboardPage;
      case BottomBarEnum.Message:
        return AppRoutes.messagePage;
      case BottomBarEnum.Order:
        return AppRoutes.orderPage;
      case BottomBarEnum.Profile:
        return AppRoutes.profilePage;
      default:
        return "/";
    }
  }

  ///Handling page based on route
  Widget getCurrentPageFreelancer(String currentRoute) {
    switch (currentRoute) {
      case AppRoutes.dashboardPage:
        return DashboardPage();
      case AppRoutes.messagePage:
        return MessagePage();
      case AppRoutes.orderPage:
        return OrderPage();
      case AppRoutes.profilePage:
        return ProfileScreen();
      default:
        return DefaultWidget();
    }
  }
}
/**
 * 
 */
