import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/enum.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/presentation/home_container_screen/controller/home_container_controller.dart';
import 'package:badges/badges.dart' as badge;

class CustomBottomBar extends StatelessWidget {
  HomeContainerController homeController = Get.put(HomeContainerController());
  CustomBottomBar({
    Key? key,
    this.onChanged,
  }) : super(
          key: key,
        );

  RxInt selectedIndex = 0.obs;

  List<BottomMenuModel> bottomMenuList = AppStateNotifier.instance.loggedIn &&
          currentUser.value!.role != null &&
          currentUser.value!.role == Role.freelancer
      ? [
          BottomMenuModel(
            icon: ImageConstant.imgDashboardNav,
            activeIcon: ImageConstant.imgDashboardNav,
            title: "Dashboard",
            type: BottomBarEnum.Dahboard,
          ),
          BottomMenuModel(
            icon: ImageConstant.imgNavmessage,
            activeIcon: ImageConstant.imgNavmessage,
            title: "lbl_message".tr,
            type: BottomBarEnum.Message,
          ),
          BottomMenuModel(
            icon: ImageConstant.imgNavsaved,
            activeIcon: ImageConstant.imgNavsaved,
            title: 'Order',
            type: BottomBarEnum.Order,
          ),
          BottomMenuModel(
            icon: ImageConstant.imgNavprofile,
            activeIcon: ImageConstant.imgNavprofile,
            title: "lbl_profile".tr,
            type: BottomBarEnum.Profile,
          )
        ]
      : [
          BottomMenuModel(
            icon: ImageConstant.imgNavhome,
            activeIcon: ImageConstant.imgNavhome,
            title: "lbl_home".tr,
            type: BottomBarEnum.Home,
          ),
          BottomMenuModel(
            icon: ImageConstant.imgSearch,
            activeIcon: ImageConstant.imgSearch,
            title: "Categories".tr,
            type: BottomBarEnum.Categories,
          ),
          BottomMenuModel(
            icon: ImageConstant.imgNavmessage,
            activeIcon: ImageConstant.imgNavmessage,
            title: "lbl_message".tr,
            type: BottomBarEnum.Message,
          ),
          BottomMenuModel(
            icon: ImageConstant.imgNavsaved,
            activeIcon: ImageConstant.imgNavsaved,
            title: 'Order',
            type: BottomBarEnum.Order,
          ),
          BottomMenuModel(
            icon: ImageConstant.imgNavprofile,
            activeIcon: ImageConstant.imgNavprofile,
            title: "lbl_profile".tr,
            type: BottomBarEnum.Profile,
          )
        ];

  Function(BottomBarEnum)? onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: getVerticalSize(88),
      decoration: BoxDecoration(
        color: theme.colorScheme.onPrimaryContainer.withOpacity(1),
        boxShadow: [
          BoxShadow(
            color: theme.colorScheme.primary.withOpacity(0.08),
            spreadRadius: getHorizontalSize(2),
            blurRadius: getHorizontalSize(2),
            offset: Offset(
              0,
              -4,
            ),
          ),
        ],
      ),
      child: Obx(
        () => BottomNavigationBar(
          backgroundColor: Colors.transparent,
          showSelectedLabels: false,
          showUnselectedLabels: false,
          selectedFontSize: 0,
          elevation: 0,
          currentIndex: selectedIndex.value,
          type: BottomNavigationBarType.fixed,
          items: List.generate(bottomMenuList.length, (index) {
            return BottomNavigationBarItem(
              icon: AppStateNotifier.instance.loggedIn &&
                      currentUser.value!.role != null &&
                      currentUser.value!.role == Role.freelancer &&
                      index == 1
                  ? badge.Badge(
                      badgeContent: Text(
                        "${homeController.unreadMessages.value}",
                        style: TextStyle(color: Colors.white, fontSize: 12),
                      ),
                      position: badge.BadgePosition.topEnd(top: -10, end: -4),
                      badgeStyle: badge.BadgeStyle(
                          badgeColor: theme.colorScheme.secondary),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          CustomImageView(
                            svgPath: bottomMenuList[index].icon,
                            height: getSize(24),
                            width: getSize(24),
                            color: appTheme.blueGray300,
                          ),
                          Padding(
                            padding: getPadding(
                              top: 3,
                            ),
                            child: Text(
                              bottomMenuList[index].title ?? "",
                              style: CustomTextStyles.labelLargeInterBluegray300
                                  .copyWith(
                                color: appTheme.blueGray300,
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  : AppStateNotifier.instance.loggedIn &&
                          currentUser.value!.role != null &&
                          currentUser.value!.role == Role.client &&
                          index == 2
                      ? badge.Badge(
                          badgeContent: Text(
                            "${homeController.unreadMessages.value}",
                            style: TextStyle(color: Colors.white, fontSize: 12),
                          ),
                          position:
                              badge.BadgePosition.topEnd(top: -10, end: -4),
                          badgeStyle: badge.BadgeStyle(
                              badgeColor: theme.colorScheme.secondary),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              CustomImageView(
                                svgPath: bottomMenuList[index].icon,
                                height: getSize(24),
                                width: getSize(24),
                                color: appTheme.blueGray300,
                              ),
                              Padding(
                                padding: getPadding(
                                  top: 3,
                                ),
                                child: Text(
                                  bottomMenuList[index].title ?? "",
                                  style: CustomTextStyles
                                      .labelLargeInterBluegray300
                                      .copyWith(
                                    color: appTheme.blueGray300,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        )
                      : Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            CustomImageView(
                              svgPath: bottomMenuList[index].icon,
                              height: getSize(24),
                              width: getSize(24),
                              color: appTheme.blueGray300,
                            ),
                            Padding(
                              padding: getPadding(
                                top: 3,
                              ),
                              child: Text(
                                bottomMenuList[index].title ?? "",
                                style: CustomTextStyles
                                    .labelLargeInterBluegray300
                                    .copyWith(
                                  color: appTheme.blueGray300,
                                ),
                              ),
                            ),
                          ],
                        ),
              activeIcon: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  CustomImageView(
                    svgPath: bottomMenuList[index].activeIcon,
                    height: getSize(24),
                    width: getSize(24),
                    color: theme.colorScheme.primary,
                  ),
                  Padding(
                    padding: getPadding(
                      top: 2,
                    ),
                    child: Text(
                      bottomMenuList[index].title ?? "",
                      style: CustomTextStyles.labelLargeInterPrimary.copyWith(
                        color: theme.colorScheme.primary,
                      ),
                    ),
                  ),
                ],
              ),
              label: '',
            );
          }),
          onTap: (index) {
            selectedIndex.value = index;
            onChanged?.call(bottomMenuList[index].type);
          },
        ),
      ),
    );
  }
}

enum BottomBarEnum {
  Home,
  Categories,
  Message,
  Order,
  Profile,
  Dahboard,
}

class BottomMenuModel {
  BottomMenuModel({
    required this.icon,
    required this.activeIcon,
    this.title,
    required this.type,
  });

  String icon;

  String activeIcon;

  String? title;

  BottomBarEnum type;
}

class DefaultWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: EdgeInsets.all(10),
      child: Center(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Please replace the respective Widget here',
              style: TextStyle(
                fontSize: 18,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
