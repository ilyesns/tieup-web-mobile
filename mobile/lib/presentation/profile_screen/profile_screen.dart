import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:Tieup/core/utils/enum.dart';
import 'package:Tieup/core/utils/image_picker.dart';
import 'package:Tieup/core/utils/progress_dialog_utils.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/presentation/home_container_screen/controller/home_container_controller.dart';
import 'package:Tieup/presentation/order_page/controller/order_controller.dart';
import 'package:Tieup/widgets/custom_checkbox_button.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:url_launcher/url_launcher.dart';

import 'controller/profile_controller.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/presentation/home_page/home_page.dart';
import 'package:Tieup/presentation/message_page/message_page.dart';
import 'package:Tieup/presentation/profile_page/profile_page.dart';
import 'package:Tieup/presentation/order_page/order_page.dart';
import 'package:Tieup/widgets/app_bar/appbar_image.dart';
import 'package:Tieup/widgets/app_bar/appbar_title.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';
import 'package:Tieup/widgets/custom_bottom_bar.dart';
import 'package:Tieup/presentation/logout_popup_dialog/logout_popup_dialog.dart';
import 'package:Tieup/presentation/logout_popup_dialog/controller/logout_popup_controller.dart';

class ProfileScreen extends GetWidget<ProfileController> {
  ProfileScreen({Key? key}) : super(key: key);
  final appState = AppStateNotifier.instance;

  final HomeContainerController _homeContainerController =
      Get.find<HomeContainerController>();
  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SafeArea(
        child: Scaffold(
      backgroundColor: appTheme.whiteA70001,
      appBar: CustomAppBar(
          height: getVerticalSize(51),
          leadingWidth: getHorizontalSize(48),
          centerTitle: true,
          title: AppbarTitle(text: "lbl_profile".tr)),
      body: SizedBox(
        width: mediaQueryData.size.width,
        child: SingleChildScrollView(
          padding: getPadding(top: 28),
          child: Padding(
            padding: getPadding(left: 24, right: 24, bottom: 5),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                SizedBox(
                    height: getVerticalSize(225),
                    width: getHorizontalSize(327),
                    child: Stack(alignment: Alignment.bottomCenter, children: [
                      CustomImageView(
                          imagePath: ImageConstant.imgBg,
                          height: getVerticalSize(120),
                          width: getHorizontalSize(327),
                          radius: BorderRadius.circular(getHorizontalSize(8)),
                          alignment: Alignment.topCenter),
                      Align(
                          alignment: Alignment.bottomCenter,
                          child: Padding(
                              padding: getPadding(left: 87, right: 87),
                              child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  children: [
                                    appState.loggedIn
                                        ? GestureDetector(
                                            onTap: () async {
                                              onProfilePhotoClick(context);
                                            },
                                            child: Obx(() => Container(
                                                  child: Stack(
                                                    alignment: Alignment.center,
                                                    children: [
                                                      currentUser.value!
                                                                  .photoURL !=
                                                              null
                                                          ? CustomImageView(
                                                              fit: BoxFit.cover,
                                                              url: currentUser
                                                                      .value!
                                                                      .photoURL ??
                                                                  '',
                                                              height:
                                                                  getSize(89),
                                                              width:
                                                                  getSize(89),
                                                              radius:
                                                                  BorderRadius
                                                                      .circular(
                                                                getHorizontalSize(
                                                                    44),
                                                              ),
                                                            )
                                                          : CustomImageView(
                                                              imagePath:
                                                                  ImageConstant
                                                                      .imgAvatar,
                                                              height:
                                                                  getSize(89),
                                                              width:
                                                                  getSize(89),
                                                              radius:
                                                                  BorderRadius
                                                                      .circular(
                                                                getHorizontalSize(
                                                                    44),
                                                              ),
                                                            ),
                                                      if (controller
                                                          .isLoading.isTrue)
                                                        Center(
                                                          child: Container(
                                                              width: 25,
                                                              height: 25,
                                                              child:
                                                                  CircularProgressIndicator(
                                                                color: theme
                                                                    .colorScheme
                                                                    .primary,
                                                              )),
                                                        )
                                                    ],
                                                  ),
                                                )),
                                          )
                                        : CustomImageView(
                                            imagePath: ImageConstant.imgAvatar,
                                            height: getSize(89),
                                            width: getSize(89),
                                            radius: BorderRadius.circular(
                                              getHorizontalSize(44),
                                            ),
                                          ),
                                    if (appState.loggedIn)
                                      Obx(() => Padding(
                                          padding: getPadding(top: 9),
                                          child: Text(
                                              "${currentUser.value!.firstName ?? ''} ${currentUser.value!.lastName ?? ''}",
                                              style: CustomTextStyles
                                                  .titleMediumErrorContainer))),
                                  ])))
                    ])),
                if (appState.loggedIn &&
                    currentUser.value!.isBeenFreelancer != null &&
                    currentUser.value!.isBeenFreelancer!)
                  Container(
                    padding:
                        getPadding(top: 13, bottom: 13, left: 16, right: 16),
                    decoration: AppDecoration.fillGray.copyWith(
                        borderRadius: BorderRadiusStyle.roundedBorder8),
                    child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "Seller mode",
                            style: CustomTextStyles.labelLargeBluegray300,
                          ),
                          Obx(
                            () => Container(
                              child: CupertinoSwitch(
                                value: currentUser.value!.role != null &&
                                    currentUser.value!.role == Role.freelancer,
                                activeColor:
                                    ColorSchemes.primaryColorScheme.primary,
                                onChanged: (value) async {
                                  await controller.switchMode();
                                  Get.delete<OrderController>();
                                },
                              ),
                            ),
                          )
                        ]),
                  ),
                if (appState.loggedIn)
                  Align(
                      alignment: Alignment.centerLeft,
                      child: Padding(
                          padding: getPadding(top: 32),
                          child: Text("lbl_account".tr,
                              style: CustomTextStyles.labelLargeSemiBold))),
                if (appState.loggedIn)
                  GestureDetector(
                      onTap: () {
                        onTapAccount();
                      },
                      child: Padding(
                          padding: getPadding(top: 15),
                          child: Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                CustomImageView(
                                    svgPath: ImageConstant.imgPerson,
                                    height: getSize(24),
                                    width: getSize(24),
                                    margin: getMargin(top: 3)),
                                Padding(
                                    padding: getPadding(left: 12, top: 5),
                                    child: Text("lbl_personal_info".tr,
                                        style: theme.textTheme.titleMedium)),
                                Spacer(),
                                CustomImageView(
                                    svgPath: ImageConstant.imgArrowrightPrimary,
                                    height: getSize(24),
                                    width: getSize(24),
                                    margin: getMargin(bottom: 3))
                              ]))),
                if (appState.loggedIn)
                  GestureDetector(
                    onTap: () {
                      Get.toNamed(AppRoutes.changePasswordScreen);
                    },
                    child: Padding(
                        padding: getPadding(top: 15),
                        child: Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              CustomImageView(
                                  svgPath: ImageConstant.imgShielddone,
                                  height: getSize(24),
                                  width: getSize(24)),
                              Padding(
                                  padding: getPadding(left: 12, top: 4),
                                  child: Text("Change password".tr,
                                      style: theme.textTheme.titleMedium)),
                              Spacer(),
                              CustomImageView(
                                  svgPath: ImageConstant.imgArrowrightPrimary,
                                  height: getSize(24),
                                  width: getSize(24))
                            ])),
                  ),
                Padding(
                    padding: getPadding(top: 14),
                    child: Divider(indent: getHorizontalSize(36))),
                Align(
                    alignment: Alignment.centerLeft,
                    child: Padding(
                        padding: getPadding(top: 26),
                        child: Text("lbl_about".tr,
                            style: CustomTextStyles.labelLargeSemiBold))),
                GestureDetector(
                    onTap: onTapLegalandpolicie,
                    child: Padding(
                        padding: getPadding(top: 16),
                        child: Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              CustomImageView(
                                  svgPath: ImageConstant.imgShield,
                                  height: getSize(24),
                                  width: getSize(24)),
                              Padding(
                                  padding: getPadding(left: 12, top: 4),
                                  child: Text("msg_legal_and_policies".tr,
                                      style: theme.textTheme.titleMedium)),
                              Spacer(),
                              CustomImageView(
                                  svgPath: ImageConstant.imgArrowrightPrimary,
                                  height: getSize(24),
                                  width: getSize(24))
                            ]))),
                Padding(
                    padding: getPadding(top: 15),
                    child: Divider(indent: getHorizontalSize(36))),
                GestureDetector(
                  onTap: onTapHelpFeedback,
                  child: Padding(
                      padding: getPadding(top: 16),
                      child: Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            CustomImageView(
                                svgPath: ImageConstant.imgQuestionPrimary,
                                height: getSize(24),
                                width: getSize(24)),
                            Padding(
                                padding: getPadding(left: 12, top: 4),
                                child: Text("lbl_help_feedback".tr,
                                    style: theme.textTheme.titleMedium)),
                            Spacer(),
                            CustomImageView(
                                svgPath: ImageConstant.imgArrowrightPrimary,
                                height: getSize(24),
                                width: getSize(24))
                          ])),
                ),
                Padding(
                    padding: getPadding(top: 17),
                    child: Divider(indent: getHorizontalSize(36))),
                GestureDetector(
                  onTap: onTapAbout,
                  child: Padding(
                      padding: getPadding(top: 16),
                      child: Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            CustomImageView(
                                svgPath: ImageConstant.imgAlert,
                                height: getSize(24),
                                width: getSize(24)),
                            Padding(
                                padding: getPadding(left: 12, top: 2),
                                child: Text("lbl_about_us".tr,
                                    style: theme.textTheme.titleMedium)),
                            Spacer(),
                            CustomImageView(
                                svgPath: ImageConstant.imgArrowrightPrimary,
                                height: getSize(24),
                                width: getSize(24))
                          ])),
                ),
                if (!appState.loggedIn)
                  Column(
                    children: [
                      Padding(
                          padding: getPadding(top: 17),
                          child: Divider(indent: getHorizontalSize(36))),
                      GestureDetector(
                        onTap: () {
                          Get.offAllNamed(
                            AppRoutes.loginScreen,
                          );
                        },
                        child: Padding(
                            padding: getPadding(top: 16),
                            child: Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  Padding(
                                      padding: getPadding(left: 12, top: 2),
                                      child: Text('Sign in',
                                          style: theme.textTheme.titleMedium)),
                                  Spacer(),
                                  CustomImageView(
                                      svgPath:
                                          ImageConstant.imgArrowrightPrimary,
                                      height: getSize(24),
                                      width: getSize(24))
                                ])),
                      ),
                    ],
                  ),
                if (appState.loggedIn)
                  Align(
                    alignment: Alignment.center,
                    child: GestureDetector(
                      onTap: () {
                        onTapTxtLargelabelmediu();
                      },
                      child: Padding(
                        padding: getPadding(top: 28),
                        child: Text("lbl_logout".tr,
                            style: CustomTextStyles.titleMediumRedA200),
                      ),
                    ),
                  ),
                SizedBox(
                  height: getVerticalSize(20),
                )
              ],
            ),
          ),
        ),
      ),
    ));
  }

  onProfilePhotoClick(context) async {
    Get.bottomSheet(
            ClipRect(
              child: BackdropFilter(
                filter: ImageFilter.blur(
                  sigmaX: 0,
                  sigmaY: 0,
                ),
                child: Container(
                  width: double.infinity,
                  height: double.infinity,
                  child: Column(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Container(
                          decoration: AppDecoration.fillWhiteA700.copyWith(
                              borderRadius: BorderRadius.only(
                                  topLeft: Radius.circular(20),
                                  topRight: Radius.circular(20))),
                          width: mediaQueryData.size.width,
                          height: 200,
                          padding: getPadding(
                              top: 10, left: 10, right: 10, bottom: 10),
                          child: Column(
                              mainAxisSize: MainAxisSize.max,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text("Choose Source",
                                      style: CustomTextStyles.titleMedium15),
                                ),
                                Divider(),
                                GestureDetector(
                                  onTap: () async {
                                    controller.image.value =
                                        await ImagePickerUtils
                                            .pickImageFromGallery(context);
                                    Get.back();
                                  },
                                  child: Padding(
                                    padding: getPadding(top: 20, bottom: 10),
                                    child: Text("Gallery",
                                        style:
                                            CustomTextStyles.titleMediumBold_1),
                                  ),
                                ),
                                GestureDetector(
                                  onTap: () async {
                                    controller.image.value =
                                        await ImagePickerUtils
                                            .pickImageFromCamera(context);
                                    Get.back();
                                  },
                                  child: Padding(
                                    padding: getPadding(top: 10, bottom: 10),
                                    child: Text("Camera",
                                        style:
                                            CustomTextStyles.titleMediumBold_1),
                                  ),
                                ),
                              ]),
                        )
                      ]),
                ),
              ),
            ),
            isScrollControlled: true)
        .then((value) async => {
              if (controller.image.value != null)
                {await controller.uploadUserPhoto()}
            });
  }

  onTapAccount() {
    Get.toNamed(
      AppRoutes.personalInfoScreen,
    );
  }

  onTapPrivacy() {
    Get.toNamed(
      AppRoutes.experienceSettingScreen,
    );
  }

  onTapLegalandpolicie() async {
    if (await canLaunch('https://tieup.net/privacy')) {
      await launch('https://tieup.net/privacy');
    } else {
      throw 'Could not launch https://tieup.net/privacy';
    }
  }

  onTapHelpFeedback() async {
    if (await canLaunch('https://tieup.net')) {
      await launch('https://tieup.net');
    } else {
      throw 'Could not launch https://tieup.net';
    }
  }

  onTapAbout() async {
    if (await canLaunch('https://tieup.net')) {
      await launch('https://tieup.net');
    } else {
      throw 'Could not launch https://tieup.net';
    }
  }

  onTapTxtLargelabelmediu() {
    Get.dialog(AlertDialog(
      backgroundColor: Colors.transparent,
      contentPadding: EdgeInsets.zero,
      insetPadding: const EdgeInsets.only(left: 0),
      content: LogoutPopupDialog(
        Get.put(
          LogoutPopupController(),
        ),
      ),
    ));
  }
}
