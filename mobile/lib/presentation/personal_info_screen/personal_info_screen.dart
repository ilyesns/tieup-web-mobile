import 'package:Tieup/firebase/auth_util.dart';

import 'controller/personal_info_controller.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/validation_functions.dart';
import 'package:Tieup/widgets/app_bar/appbar_image.dart';
import 'package:Tieup/widgets/app_bar/appbar_image_1.dart';
import 'package:Tieup/widgets/app_bar/appbar_title.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:Tieup/widgets/custom_text_form_field.dart';

// ignore_for_file: must_be_immutable
class PersonalInfoScreen extends GetWidget<PersonalInfoController> {
  PersonalInfoScreen({Key? key}) : super(key: key);

  GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SafeArea(
        child: Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: appTheme.whiteA70001,
      appBar: CustomAppBar(
        leadingWidth: getHorizontalSize(48),
        leading: AppbarImage(
            svgPath: ImageConstant.imgGroup162799,
            margin: getMargin(left: 24, top: 13, bottom: 13),
            onTap: () {
              onTapArrowbackone();
            }),
        centerTitle: true,
        title: AppbarTitle(text: "lbl_personal_info".tr),
      ),
      body: Form(
          key: _formKey,
          child: SingleChildScrollView(
              padding: getPadding(top: 32),
              child: Padding(
                  padding: getPadding(left: 24, right: 24, bottom: 5),
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Text("lbl_first_name".tr,
                            style: CustomTextStyles.titleSmallPrimary),
                        InkWell(
                          onTap: () {
                            onTextFieldTap();
                          },
                          child: Container(
                            height: 50,
                            width: mediaQueryData.size.width,
                            decoration: AppDecoration.fillGray.copyWith(
                                borderRadius: BorderRadiusStyle.roundedBorder8),
                            child: Padding(
                              padding: getPadding(left: 16),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                      "${currentUser.value!.firstName != null ? currentUser.value!.firstName.toString().capitalizeFirstLetter() : ''}"),
                                ],
                              ),
                            ),
                          ),
                        ),
                        Padding(
                            padding: getPadding(top: 18),
                            child: Text("lbl_last_name".tr,
                                style: CustomTextStyles.titleSmallPrimary)),
                        InkWell(
                          onTap: () {
                            onTextFieldTap();
                          },
                          child: Container(
                            height: 50,
                            width: mediaQueryData.size.width,
                            decoration: AppDecoration.fillGray.copyWith(
                                borderRadius: BorderRadiusStyle.roundedBorder8),
                            child: Padding(
                              padding: getPadding(left: 16),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                      "${currentUser.value!.lastName != null ? currentUser.value!.lastName.toString().capitalizeFirstLetter() : ''}"),
                                ],
                              ),
                            ),
                          ),
                        ),
                        Padding(
                            padding: getPadding(top: 18),
                            child: Text("lbl_email".tr,
                                style: CustomTextStyles.titleSmallPrimary)),
                        InkWell(
                          onTap: () {
                            onTextFieldTap();
                          },
                          child: Container(
                            height: 50,
                            width: mediaQueryData.size.width,
                            decoration: AppDecoration.fillGray.copyWith(
                                borderRadius: BorderRadiusStyle.roundedBorder8),
                            child: Padding(
                              padding: getPadding(left: 16),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                      "${currentUser.value!.email != null ? currentUser.value!.email.toString().capitalizeFirstLetter() : ''}"),
                                ],
                              ),
                            ),
                          ),
                        ),
                        Padding(
                            padding: getPadding(top: 18),
                            child: Text("lbl_phone".tr,
                                style: CustomTextStyles.titleSmallPrimary)),
                        InkWell(
                          onTap: () {
                            onTextFieldTap();
                          },
                          child: Container(
                            height: 50,
                            width: mediaQueryData.size.width,
                            decoration: AppDecoration.fillGray.copyWith(
                                borderRadius: BorderRadiusStyle.roundedBorder8),
                            child: Padding(
                              padding: getPadding(left: 16),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                      "${currentUser.value!.phoneNumber ?? ''}"),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ])))),
    ));
  }

  /// Navigates to the previous screen.
  ///
  /// When the action is triggered, this function uses the [Get] package to
  /// navigate to the previous screen in the navigation stack.
  onTapArrowbackone() {
    Get.back();
  }

  /// Navigates to the previous screen.
  ///
  /// When the action is triggered, this function uses the [Get] package to
  /// navigate to the previous screen in the navigation stack.
  onTextFieldTap() {
    Get.rawSnackbar(message: "You can edit your personal info at Tieup.net");
  }
}
